import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MdDriveFileRenameOutline, MdEmail } from "react-icons/md";
import { FaPhone, FaMapMarkerAlt, FaUser, FaEye, FaEyeSlash, FaLock, FaLockOpen } from "react-icons/fa";
import { validatePassword } from 'val-pass';
import { toast } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const ADMIN_SECRET = "anand@1";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
    phone: "",
    address: "",
    role: "",
  });

  const [adminCode, setAdminCode] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showAdminCode, setShowAdminCode] = useState(true);
  const [passerror, setPassError] = useState([]);
  const [passMatchError, setPassMatchError] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [secretVisible, setSecretVisible] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'password') {
         if (value.trim() === "") {
           setPassError([]);
         } else {
           const result = validatePassword(value, 8).getAllValidationErrorMessage();
           setPassError(result);
         }
       }

    if (name === "repassword") {
      setPassMatchError(value !== formData.password);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passerror.length > 0 && passerror !== "No Error Detected") {
         toast.error("Please fix password errors");
         return;
   }

    if (formData.password !== formData.repassword) {
      setPassMatchError(true);
      toast.error("Passwords don't match");
      return;
    }

    if (formData.role === "admin" && adminCode !== ADMIN_SECRET) {
      toast.error("Admin secret key is not matching");
      return;
    }

    const submissionData = { ...formData };
    if (formData.role === "admin") submissionData.adminCode = adminCode;
    delete submissionData.repassword;

    const result = await register(submissionData);

    if (result.success) {
      toast.success("User registered successfully");
      navigate("/");
    } else {
      toast.error(result.message || "Registration failed");
    }
  };

  const inputClasses = darkMode
    ? "bg-[#101828] text-white placeholder-white/60"
    : "bg-white text-black placeholder-gray-400";

  const borderClasses = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`min-h-screen w-full flex items-center justify-center pt-20 pb-20 ${
      darkMode ? "bg-black" : "bg-white"
    }`}>
      <form
        className={`flex flex-col w-11/12 max-w-md sm:max-w-3xl ${
          darkMode ? "bg-[#0B1220] text-white" 
                   : "bg-white text-black shadow-xl shadow-gray-300/60"
        } backdrop-blur-sm p-6 sm:p-10 rounded-3xl gap-y-6 transition-all`}
        onSubmit={handleSubmit}
      >
        <div className="flex justify-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-pink-500">Register</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-5">

            {/* Name */}
            <div className={`border-2 ${borderClasses} rounded-full h-[50px] px-3 flex items-center ${inputClasses}`}>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name*"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent outline-none px-3"
                required
              />
              <MdDriveFileRenameOutline className="text-blue-400 text-xl" />
            </div>

            {/* Email */}
            <div className={`border-2 ${borderClasses} rounded-full h-[50px] px-3 flex items-center ${inputClasses}`}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email*"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none px-3"
                required
              />
              <MdEmail className="text-green-400 text-xl" />
            </div>

            {/* Password + Validation */}
            <div className="flex flex-col gap-1">

              <div className={`border-2 ${borderClasses} rounded-full h-[50px] px-3 flex items-center ${inputClasses}`}>
                <input
                  type={showPassword ? "password" : "text"}
                  name="password"
                  placeholder="Enter your password*"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none px-3"
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                  {showPassword ? (
                    <FaEyeSlash className="text-yellow-400 text-xl" />
                  ) : (
                    <FaEye className="text-yellow-400 text-xl" />
                  )}
                </span>
              </div>

              {/* Password validation messages */}
              {passerror.length > 0 && passerror !== "No Error Detected" && (
                <div className='flex flex-col gap-1 text-red-600 text-xs sm:text-sm px-2'>
                  {Array.isArray(passerror)
                    ? passerror.map((err, i) => <p key={i}>• {err}</p>)
                    : <p>{passerror}</p>}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className={`border-2 ${
                passMatchError ? "border-red-500" : borderClasses
              } rounded-full h-[50px] px-3 flex items-center ${inputClasses}`}>
              <input
                type="password"
                name="repassword"
                placeholder="Confirm your password*"
                value={formData.repassword}
                onChange={handleChange}
                className="w-full bg-transparent outline-none px-3"
                required
              />

              {passMatchError ? (
                <FaLock className="text-red-500 text-xl" />
              ) : (
                formData.repassword && formData.password && (
                  <FaLockOpen className="text-green-500 text-xl" />
                )
              )}
            </div>

            {passMatchError && (
              <p className="text-red-500 text-xs text-center">Passwords do not match ❌</p>
            )}

          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            {/* Custom Role Dropdown */}
            <div className="relative w-full">
              <div
                className={`border-2 ${borderClasses} rounded-full h-[50px] px-5 flex items-center justify-between cursor-pointer ${inputClasses}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{formData.role || "Select role *"}</span>
                <FaUser className="text-purple-400 text-xl" />
              </div>

              {dropdownOpen && (
                <div
                  className={`absolute left-0 mt-2 w-full rounded-xl border shadow-lg ${
                    darkMode ? "bg-[#1b2334] border-gray-700 text-white" : "bg-white border-gray-300"
                  }`}
                >
                  <p
                    className="px-4 py-2 cursor-pointer hover:bg-blue-200/30"
                    onClick={() => {
                      setFormData({ ...formData, role: "user" });
                      setDropdownOpen(false);
                    }}
                  >
                    User
                  </p>
                  <p
                    className="px-4 py-2 cursor-pointer hover:bg-blue-200/30"
                    onClick={() => {
                      setFormData({ ...formData, role: "admin" });
                      setDropdownOpen(false);
                    }}
                  >
                    Admin
                  </p>
                </div>
              )}
            </div>

            {/* Admin Secret Code */}
            {formData.role === "admin" && (
              <div className={`border-2 ${borderClasses} rounded-full h-[50px] px-3 flex items-center ${inputClasses}`}>
                <input
                  type={showAdminCode ? "password" : "text"}
                  placeholder="Enter secret code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full bg-transparent outline-none px-3"
                />

                <span onClick={() => setShowAdminCode(!showAdminCode)} className="cursor-pointer">
                  {showAdminCode ? (
                    <FaEyeSlash className="text-red-400 text-xl" />
                  ) : (
                    <FaEye className="text-red-400 text-xl" />
                  )}
                </span>
              </div>
            )}

            {/* Phone Number */}
            <div className={`border-2 ${borderClasses} rounded-full h-[50px] px-3 flex items-center ${inputClasses}`}>
              <input
                type="number"
                placeholder="Enter your phone"
                name="phone"
                value={formData.phone}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    setFormData({ ...formData, phone: e.target.value });
                  }
                }}
                className="w-full bg-transparent outline-none px-3"
              />
              <FaPhone className="text-blue-400 text-xl" />
            </div>

            {/* Address */}
            <div className={`border-2 ${borderClasses} rounded-xl p-3 relative ${inputClasses}`}>
              <textarea
                placeholder="Enter your address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-transparent outline-none resize-none"
              ></textarea>
              <FaMapMarkerAlt className="absolute top-3 right-3 text-green-400 text-xl" />
            </div>

          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="rounded-full h-[50px] text-white font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:brightness-110 shadow-lg"
        >
          Register
        </button>

        {/* Bottom */}
        <div className="flex justify-between px-3 text-sm">
          <div className="flex items-center gap-2">
            {formData.role === "admin" && (
              <button
                type="button"
                onClick={() => setSecretVisible(!secretVisible)}
                className={`h-7 w-7 rounded-full flex items-center justify-center cursor-pointer ${
                  darkMode ? "bg-white/10 text-white" : "bg-gray-200 text-black"
                }`}
              >
                🔒
              </button>
            )}

            {secretVisible && formData.role === "admin" && (
              <span className={darkMode ? "text-white/80" : "text-gray-700"}>
                {ADMIN_SECRET}
              </span>
            )}
          </div>

          <div>
            <span className="font-bold">Have an account?</span>{" "}
            <Link className="text-cyan-500 font-semibold" to="/login">
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
