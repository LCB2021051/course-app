import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import app from "../firebaseConfig";

// 1. Create async thunk for signing in with Google
export const loginWithGoogle = createAsyncThunk(
  "student/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      // a) Sign user in with Google popup
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // b) Check if user exists in Firestore
      const docRef = doc(db, "students", user.uid);
      const docSnap = await getDoc(docRef);

      // c) If user is new, create a "students" record
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          name: user.displayName || "No Name",
          email: user.email || "No Email",
          photoURL: user.photoURL || "",
          enrolledCourses: [],
          createdAt: new Date().toISOString(),
        });
      }

      // d) Return user data to Redux store
      return {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Create the student slice
const studentSlice = createSlice({
  name: "student",
  initialState: {
    currentStudent: null,
    loading: false,
    error: null,
  },
  reducers: {
    // optional: to manually reset or sign out
    resetStudent(state) {
      state.currentStudent = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // handle pending, fulfilled, rejected from loginWithGoogle
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudent = action.payload; // user info
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google Sign-In failed.";
      });
  },
});

// Export the slice reducer & actions
export const { resetStudent } = studentSlice.actions;
export default studentSlice.reducer;
