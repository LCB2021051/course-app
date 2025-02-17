import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { processPayment } from "../redux/paymentsSlice";
import { enrolStudent, fetchEnrolments } from "../redux/enrolmentsSlice";

const GetEnrolled = ({ courseId, amount }) => {
  const dispatch = useDispatch();
  const auth = getAuth();

  const [userId, setUserId] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(0); // Store progress from enrolments

  // Fetch authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch enrollments on mount
  useEffect(() => {
    dispatch(fetchEnrolments());
  }, [dispatch]);

  // Get enrollments from Redux
  const { items: allEnrollments, loading } = useSelector(
    (state) => state.enrolments
  );

  // Check if user is already enrolled & fetch progress
  const enrolment = userId
    ? allEnrollments.find(
        (en) => en.studentId === userId && en.courseId === courseId
      )
    : null;

  useEffect(() => {
    if (enrolment) {
      setProgress(enrolment.progress || 0); // Set progress if available
    }
  }, [enrolment]);

  const handlePayment = async () => {
    if (!userId) {
      alert("You must be logged in to enroll in this course.");
      return;
    }

    setPaymentProcessing(true);
    try {
      // 1. Process Payment
      const paymentResponse = await dispatch(
        processPayment({ userId, courseId, amount })
      ).unwrap();

      // 2. Enroll Student if payment succeeds
      if (paymentResponse.id) {
        await dispatch(
          enrolStudent({ userId, courseId, paymentId: paymentResponse.id })
        ).unwrap();
        alert("Enrollment successful!");
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      alert("Error processing payment: " + error);
    }

    setPaymentProcessing(false);
    setShowPopup(false);
  };

  // 🔹 Show Progress Bar if Enrolled
  if (enrolment) {
    return (
      <div className="w-full">
        {progress === 100 ? (
          <p className="text-green-600 text-sm font-semibold mb-1">
            Completed 🎉
          </p>
        ) : (
          <p className="text-gray-700 text-sm mb-1">Progress: {progress}%</p>
        )}

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-full rounded-full transition-all ${
              progress === 100 ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  // 🔹 Show Payment Button if Not Enrolled
  return (
    <div>
      <button
        onClick={() => setShowPopup(true)}
        disabled={paymentProcessing}
        className="w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 transition rounded-lg shadow-lg"
      >
        {paymentProcessing ? "Processing..." : "Get Enrolled"}
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Confirm Payment
            </h3>
            <p className="text-gray-600 my-4">
              Amount:{" "}
              <span className="text-green-600 font-bold">${amount}</span>
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow"
              >
                Pay
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetEnrolled;
