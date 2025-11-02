import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await userAPI.updateProfile(formData);

      if (data.success) {
        toast.success("Profile updated successfully 🎉");
        navigate("/");
      } else {
        setError(data.message || "Something went wrong");
        toast.error(data.message || "Profile update failed ❌");
      }
    } catch (err) {
      setError("Update failed, please try again later");
      toast.error("Update failed ❌");
    }
    setLoading(false);
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center pt-20 sm:pt-10 ${
        darkMode
          ? "bg-black"
          : "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-11/12 max-w-sm sm:max-w-md bg-white/90 backdrop-blur-sm p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl gap-5 sm:gap-6 transition-all duration-300"
      >
        <div className="flex justify-center items-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-blue-600">Profile</h1>
        </div>

        {/* Name Input */}
        <div className="border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-200/50 flex items-center justify-center transition-all duration-300 bg-white">
          <input
            type="text"
            name="name"
            placeholder="Enter your name*"
            className="border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Phone Input */}
        <div className="border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-200/50 flex items-center justify-center transition-all duration-300 bg-white">
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            className="border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        {/* Address Textarea */}
        <div className="border-2 border-gray-200 rounded-2xl focus-within:border-yellow-500 focus-within:shadow-lg focus-within:shadow-yellow-200/50 flex items-center justify-center transition-all duration-300 bg-white">
          <textarea
            name="address"
            placeholder="Enter your address"
            rows="3"
            className="border-0 outline-0 w-full px-5 py-3 rounded-2xl bg-transparent resize-none text-sm sm:text-base"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-red-600 text-sm sm:text-base bg-red-100 border border-red-300 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="rounded-full h-[45px] sm:h-[50px] flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
          <button
            type="submit"
            disabled={loading}
            className="text-white font-bold text-lg sm:text-xl w-full h-full"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;