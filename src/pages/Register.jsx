import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MdDriveFileRenameOutline, MdEmail } from "react-icons/md";
import { FaPhone, FaMapMarkerAlt, FaUser, FaEye, FaEyeSlash, FaLock, FaLockOpen } from "react-icons/fa"; // Note: FaPhone, FaMapMarkerAlt, FaUser from 'react-icons/fa'; Md* from 'react-icons/md'
import { validatePassword } from 'val-pass';
import { toast } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    repassword: '', // Added for confirmation
    phone: '', 
    address: '', 
    role: '' 
  });
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(true); // Toggle for main password
  const [showAdminCode, setShowAdminCode] = useState(true); // Toggle for admin code (if shown)
  const [passerror, setPassError] = useState([]); // Password validation errors
  const [passMatchError, setPassMatchError] = useState(false); // Password match error
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
      if (formData.password && value === formData.password) {
        setPassMatchError(false);
      } else {
        setPassMatchError(true);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowAdminCode = () => {
    setShowAdminCode(!showAdminCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repassword) {
      setPassMatchError(true);
      toast.error("Passwords don't match ❌");
      return;
    }

    if (passerror.length > 0 && passerror !== "No Error Detected") {
      toast.error("Please fix password errors ❌");
      return;
    }

    const submissionData = { ...formData };
    if (formData.role === 'admin') {
      submissionData.adminCode = adminCode;
    }
    delete submissionData.repassword; 

    const result = await register(submissionData);

    if (result.success) {
      toast.success("User registered successfully");
      navigate('/');
    } else {
      toast.error(result.message || "Registration failed");
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center pt-20 pb-20 ${darkMode?"bg-black":"bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400"}`}>
      <form
        className="flex flex-col w-11/12 max-w-md sm:max-w-3xl bg-white/90 backdrop-blur-sm p-6 sm:p-10 rounded-2xl sm:rounded-3xl gap-y-6 transition-all duration-300"
        onSubmit={handleSubmit}
      >
        <div className='flex justify-center items-center'>
          <h1 className='font-bold text-3xl sm:text-4xl text-pink-500'>Register</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="space-y-4 sm:space-y-5">
            {/* Name */}
            <div className='border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-200/50 flex items-center transition-all duration-300 bg-white'>
              <input
                type="text"
                className='border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base'
                placeholder='Enter your full name*'
                name='name'
                onChange={handleChange}
                value={formData.name}
                required
              />
              <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] text-blue-500 mr-2'><MdDriveFileRenameOutline /></span>
            </div>

            {/* Email */}
            <div className='border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-200/50 flex items-center transition-all duration-300 bg-white'>
              <input
                type="email"
                className='border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base'
                placeholder='Enter your email*'
                name='email'
                onChange={handleChange}
                value={formData.email}
                required
              />
              <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] text-green-500 mr-2'><MdEmail /></span>
            </div>

            {/* Password */}
            <div className='border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-yellow-500 focus-within:shadow-lg focus-within:shadow-yellow-200/50 flex items-center transition-all duration-300 bg-white'>
              <input
                type={`${showPassword ? "password" : "text"}`}
                className='border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base'
                placeholder='Enter your password*'
                name='password'
                onChange={handleChange}
                value={formData.password}
                required
              />
              <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] cursor-pointer text-yellow-500 mr-2' onClick={handleShowPassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passerror.length > 0 && passerror !== "No Error Detected" && (
              <div className='flex flex-col gap-1 text-red-600 text-xs sm:text-sm px-2'>
                {Array.isArray(passerror)
                  ? passerror.map((err, i) => <p key={i}>• {err}</p>)
                  : <p>{passerror}</p>}
              </div>
            )}

            {/* Confirm Password */}
            <div className={`border-2 rounded-full h-[45px] sm:h-[50px] flex items-center transition-all duration-300 bg-white
              ${passMatchError ? "border-red-500 shadow-lg shadow-red-200/50" : "border-gray-200"}
              focus-within:border-pink-500 focus-within:shadow-lg focus-within:shadow-pink-200/50`}>
              <input
                type="password"
                className='border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base'
                placeholder='Confirm your password*'
                name="repassword"
                onChange={handleChange}
                value={formData.repassword}
                required
              />
              <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] mr-2'>
                {formData.password && formData.repassword && !passMatchError ? (
                  <FaLockOpen className="text-green-600" />
                ) : (
                  <FaLock className={`${passMatchError ? "text-red-600" : "text-pink-500"}`} />
                )}
              </span>
            </div>
            {passMatchError && (
              <div className="text-red-600 text-xs sm:text-sm text-center font-medium">Passwords do not match ❌</div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* Role */}
            <div className='border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/50 flex items-center transition-all duration-300 bg-white'>
              <select
                name="role"
                className='border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base appearance-none'
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select role *</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] text-purple-500 mr-2'><FaUser /></span>
            </div>

            {/* Admin Code (Conditional) */}
            {formData.role === 'admin' && (
              <div className='border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-red-500 focus-within:shadow-lg focus-within:shadow-red-200/50 flex items-center transition-all duration-300 bg-white'>
                <input
                  type={`${showAdminCode ? "password" : "text"}`}
                  className='border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base'
                  placeholder='Enter secret code to register as admin*'
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                />
                <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] cursor-pointer text-red-500 mr-2' onClick={handleShowAdminCode}>
                  {showAdminCode ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            )}

            {/* Phone */}
            <div className='border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-200/50 flex items-center transition-all duration-300 bg-white'>
              <input
                type="tel"
                className='border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base'
                placeholder='Enter your phone'
                name='phone'
                onChange={handleChange}
                value={formData.phone}
              />
              <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] text-blue-500 mr-2'><FaPhone /></span>
            </div>

            {/* Address */}
            <div className='border-2 border-gray-200 rounded-lg focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-200/50 transition-all duration-300 bg-white relative'>
              <textarea
                className='border-0 outline-0 w-full px-5 py-3 rounded-lg bg-transparent text-sm sm:text-base resize-none'
                placeholder='Enter your address'
                name='address'
                onChange={handleChange}
                value={formData.address}
                rows="3"
              />
              <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] text-green-500 absolute top-2 right-0'><FaMapMarkerAlt /></span> 
            </div>
          </div>
        </div>

        <div className='rounded-full h-[45px] sm:h-[50px] flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer'>
          <button type="submit" className='text-white font-bold text-lg sm:text-xl w-full h-full'>Register</button>
        </div>

        <div className='flex justify-around text-sm sm:text-base'>
          <h1 className='font-bold'>Have an account?</h1>
          <Link className='text-cyan-500 hover:cursor-pointer font-semibold' to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;