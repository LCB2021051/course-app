import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from "../redux/studentSlice";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // Google Icon

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access slice state
  const { currentStudent, loading, error } = useSelector(
    (state) => state.student
  );

  // Redirect if already logged in
  useEffect(() => {
    if (currentStudent) {
      navigate("/dashboard");
    }
  }, [currentStudent, navigate]);

  const handleGoogleSignIn = () => {
    dispatch(loginWithGoogle());
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg rounded-lg p-8 max-w-sm w-full text-center">
        <h1 className="text-3xl font-extrabold text-white mb-6">Sign In</h1>

        {error && <p className="text-red-400 font-semibold">{error}</p>}

        {/* Google Sign-In Button */}
        <button
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-3 bg-white text-gray-800 border border-gray-300 shadow-md px-4 py-2 rounded-lg font-semibold w-full hover:bg-gray-100 transition duration-300"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
