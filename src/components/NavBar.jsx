import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { HiMenu, HiX } from "react-icons/hi"; // Hamburger & Close icons

const NavBar = () => {
  const [user] = useAuthState(auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // ✅ Clear local storage and session storage
      localStorage.removeItem("firebaseAuth");
      localStorage.removeItem("userToken");
      sessionStorage.removeItem("firebaseAuth");

      setDropdownOpen(false);
      setMenuOpen(false);

      // ✅ Ensure navigation happens only after auth state update
      setTimeout(() => {
        navigate("/login");
        window.location.reload(); // Full reload to ensure clean auth state
      }, 300);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="sticky top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-md z-50">
      <div className="mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left Section - Brand Name / Links */}
        <div className="flex items-center">
          <Link to="/" className="text-white font-bold text-xl">
            Course-App
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-white font-semibold text-lg hover:text-yellow-300 transition"
          >
            Home
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="text-white font-semibold text-lg hover:text-yellow-300 transition"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Section - Profile & Login/Logout */}
        <div className="relative hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              {/* Profile Image */}
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${user.displayName}&background=random`
                }
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:scale-105 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg py-2">
                  <p className="px-4 py-2 font-semibold text-gray-700">
                    {user.displayName || "User"}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white font-semibold text-lg hover:text-yellow-300 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu - Links */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-lg absolute left-0 right-0 top-[60px] px-6 py-4">
          <Link
            to="/"
            className="block text-gray-800 text-lg font-semibold py-2 hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="block text-gray-800 text-lg font-semibold py-2 hover:text-blue-500"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {/* Mobile Profile & Logout */}
          {user ? (
            <div className="mt-4 border-t pt-3">
              <p className="text-gray-700 font-semibold">
                {user.displayName || "User"}
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 font-semibold py-2 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="block text-gray-800 text-lg font-semibold py-2 hover:text-blue-500"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
