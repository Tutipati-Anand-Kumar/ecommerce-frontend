// pages/Logout.jsx
import React from "react";
import { createPortal } from "react-dom";
import { GiCrossedBones } from "react-icons/gi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = ({ handleClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleYesLogout = () => {
    logout();
    toast.success("Logout Successful!");
    handleClose();
    navigate("/login"); 
  };

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100">
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-all duration-300 hover:rotate-90"
        >
          <GiCrossedBones size={24} />
        </button>

        {/* Icon Circle */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Logout
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to logout?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleYesLogout}
            className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 rounded-lg hover:from-green-500 hover:to-green-700 transition-transform hover:scale-105"
          >
            Yes
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold py-2 rounded-lg hover:from-red-500 hover:to-red-700 transition-transform hover:scale-105"
          >
            No
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Logout;
