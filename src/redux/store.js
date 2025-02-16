import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";
import studentReducer from "./studentSlice";
import enrolmentsReducer from "./enrolmentsSlice";
import paymentsReducer from "./paymentsSlice";
import likesReducer from "./likesSlice";

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    student: studentReducer,
    enrolments: enrolmentsReducer,
    payments: paymentsReducer,
    likes: likesReducer,
  },
});

export default store;
