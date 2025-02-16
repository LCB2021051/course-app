import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Async thunk to create a new enrollment with payment ID
export const enrolStudent = createAsyncThunk(
  "enrolments/enroll",
  async ({ userId, courseId, paymentId }, { rejectWithValue }) => {
    try {
      // Create a new 'enrolments' doc in Firestore
      const docRef = await addDoc(collection(db, "enrolments"), {
        studentId: userId,
        courseId,
        paymentId,
        timestamp: serverTimestamp(),
      });
      // Return consistent field: 'studentId' (not 'userId')
      return {
        id: docRef.id,
        studentId: userId,
        courseId,
        paymentId,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch enrollments
export const fetchEnrolments = createAsyncThunk(
  "enrolments/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "enrolments"));
      const enrolments = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp:
            typeof data.timestamp?.toMillis === "function"
              ? data.timestamp.toMillis()
              : null,
        };
      });
      return enrolments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// The actual slice
const enrolmentsSlice = createSlice({
  name: "enrolments",
  initialState: {
    items: [], // an array to store created enrollments
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetched Enrolments
      .addCase(fetchEnrolments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEnrolments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Enrolled Student
      .addCase(enrolStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrolStudent.fulfilled, (state, action) => {
        state.loading = false;
        // Push the newly created enrollment doc
        state.items.push(action.payload);
      })
      .addCase(enrolStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default enrolmentsSlice.reducer;
