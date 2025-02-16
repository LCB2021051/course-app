import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { updateCourseLikes } from "./courseSlice";

// 1️⃣ Thunk: Create a Like (Only if the user hasn't liked before)
export const createLike = createAsyncThunk(
  "likes/createLike",
  async ({ userId, courseId }, { dispatch, rejectWithValue }) => {
    try {
      if (!userId || !courseId) {
        throw new Error("Missing user or course ID.");
      }

      // Construct doc reference: likes/{userId_courseId}
      const likeDocRef = doc(db, "likes", `${userId}_${courseId}`);

      // Check if the like doc already exists
      const docSnap = await getDoc(likeDocRef);
      if (docSnap.exists()) {
        return rejectWithValue("Like already exists.");
      }

      // ✅ Create a new like document
      await setDoc(likeDocRef, {
        userId,
        courseId,
        createdAt: serverTimestamp(),
      });

      // ✅ Dispatch action to increment course likes in Firestore
      dispatch(updateCourseLikes({ courseId, likeChange: 1 }));

      return { userId, courseId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2️⃣ Thunk: Remove a Like
export const removeLike = createAsyncThunk(
  "likes/removeLike",
  async ({ userId, courseId }, { dispatch, rejectWithValue }) => {
    try {
      if (!userId || !courseId) {
        throw new Error("Missing user or course ID.");
      }

      // Construct doc reference: likes/{userId_courseId}
      const likeDocRef = doc(db, "likes", `${userId}_${courseId}`);

      // Check if the like doc exists
      const docSnap = await getDoc(likeDocRef);
      if (!docSnap.exists()) {
        return rejectWithValue("Like does not exist.");
      }

      // ✅ Delete the like document
      await deleteDoc(likeDocRef);

      // ✅ Dispatch action to decrement course likes in Firestore
      dispatch(updateCourseLikes({ courseId, likeChange: -1 }));

      return { userId, courseId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3️⃣ Thunk: Fetch Likes in Real-Time
export const fetchLikes = createAsyncThunk(
  "likes/fetchLikes",
  async (_, { rejectWithValue }) => {
    try {
      return new Promise((resolve, reject) => {
        const likesRef = collection(db, "likes");

        // Real-time listener to the entire "likes" collection
        const unsubscribe = onSnapshot(
          likesRef,
          (snapshot) => {
            const likesArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            resolve(likesArray);
          },
          (error) => reject(error)
        );

        // Return unsubscribe function so user can clean up if needed
        return () => unsubscribe();
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const likesSlice = createSlice({
  name: "likes",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // 🔹 Create Like
    builder
      .addCase(createLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLike.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create like.";
      });

    // 🔹 Remove Like
    builder
      .addCase(removeLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeLike.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (like) =>
            like.courseId !== action.payload.courseId ||
            like.userId !== action.payload.userId
        );
      })
      .addCase(removeLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove like.";
      });

    // 🔹 Fetch Likes in Real-Time
    builder
      .addCase(fetchLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch likes.";
      });
  },
});

export default likesSlice.reducer;
