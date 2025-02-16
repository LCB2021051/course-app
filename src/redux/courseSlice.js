import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  increment,
} from "firebase/firestore";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebaseConfig";

// 1. Fetch ALL courses (already existing)
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Fetch ONE course by ID
export const fetchCourse = createAsyncThunk(
  "courses/fetchCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);
      if (!courseSnap.exists()) {
        throw new Error("Course not found");
      }
      return { id: courseSnap.id, ...courseSnap.data() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Course Likes Count (+1 or -1)
export const updateCourseLikes = createAsyncThunk(
  "courses/updateCourseLikes",
  async ({ courseId, likeChange }, { rejectWithValue }) => {
    try {
      if (!courseId || ![1, -1].includes(likeChange)) {
        throw new Error("Invalid course ID or likeChange value.");
      }

      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        return rejectWithValue("Course not found.");
      }

      // 🔹 Firestore `increment` ensures atomic updates
      await updateDoc(courseRef, { likes: increment(likeChange) });

      return { courseId, likeChange };
    } catch (error) {
      console.error("❌ Firestore Update Course Likes Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [], // All courses
    currentCourse: null, // The single course currently loaded
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // ─────────────────────────────────────────
    // Fetch all courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // ─────────────────────────────────────────
    // Fetch a single course
    builder
      .addCase(fetchCourse.pending, (state) => {
        state.status = "loading";
        state.currentCourse = null; // Reset before fetching a new one
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentCourse = action.payload; // Store single course data
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.currentCourse = null;
      });

    // ─────────────────────────────────────────
    // Update likes on a course
    builder
      .addCase(updateCourseLikes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCourseLikes.fulfilled, (state, action) => {
        const { courseId, newLikes } = action.payload;

        // Update currentCourse likes if it's the one being viewed
        if (state.currentCourse && state.currentCourse.id === courseId) {
          state.currentCourse.likes = newLikes;
        }

        // Update the course in the courses list
        const courseIndex = state.courses.findIndex((c) => c.id === courseId);
        if (courseIndex !== -1) {
          state.courses[courseIndex].likes = newLikes;
        }

        state.status = "succeeded";
      })
      .addCase(updateCourseLikes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
