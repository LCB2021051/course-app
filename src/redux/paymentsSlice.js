import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firestore

// Async thunk for processing payment
export const processPayment = createAsyncThunk(
  "payment/process",
  async ({ userId, courseId, amount }, { rejectWithValue }) => {
    try {
      // Create a new 'payments' doc in Firestore
      const docRef = await addDoc(collection(db, "payments"), {
        userId,
        courseId,
        amount,
        timestamp: serverTimestamp(), // server-side timestamp
        status: "success",
      });
      return {
        id: docRef.id,
        userId,
        courseId,
        amount,
        status: "success",
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentStatus: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
