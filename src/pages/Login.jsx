import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validatePassword } from 'val-pass';
import { toast } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [passerror, setPassError] = useState([]);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      if (value.trim() === "") {
        setPassError([]);
      } else {
        const result = validatePassword(value, 8).getAllValidationErrorMessage();
        setPassError(result);
      }
    }

    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passerror.length > 0 && passerror !== "No Error Detected") {
            toast.error("Please fix password errors");
            return;
      }

    const result = await login(email, password);

    if (result.success) {
      toast.success("User login successful");
      navigate('/');
    } else {
      toast.error("Check your login credentials");
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center pt-20 sm:pt-10 transition-all duration-300
      ${darkMode ? "bg-black" : "bg-white"}`}
    >
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col w-11/12 max-w-sm sm:max-w-md 
        ${darkMode ? "bg-[#0B1220] text-white" : "bg-white text-black"}
        backdrop-blur-sm p-6 sm:p-10 rounded-3xl shadow-2xl 
        gap-5 sm:gap-6 transition-all duration-300`}
      >
        {/* Title */}
        <div className="flex justify-center items-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-pink-500">Login</h1>
        </div>

        {/* EMAIL */}
        <div
          className={`border-2 rounded-full h-[45px] sm:h-[50px] bg-transparent 
          flex items-center px-3 transition-all duration-300
          ${darkMode ? "border-gray-700" : "border-gray-200"}
          focus-within:border-green-500 focus-within:shadow-lg 
          focus-within:shadow-green-200/40`}
        >
          <input
            type="email"
            placeholder="Enter your email*"
            name="email"
            value={email}
            onChange={handleChange}
            required
            className={`border-0 outline-none h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base
              ${darkMode ? "placeholder-white/60 text-white" : "placeholder-gray-500 text-black"}`}
          />
          <span className="text-xl sm:text-2xl text-green-500">
            <MdEmail />
          </span>
        </div>

        {/* PASSWORD */}
        <div
          className={`border-2 rounded-full h-[45px] sm:h-[50px] bg-transparent 
          flex items-center px-3 transition-all duration-300
          ${darkMode ? "border-gray-700" : "border-gray-200"}
          focus-within:border-yellow-500 focus-within:shadow-lg 
          focus-within:shadow-yellow-200/40`}
        >
          <input
            type={showPassword ? "password" : "text"}
            placeholder="Enter your password*"
            name="password"
            value={password}
            onChange={handleChange}
            required
            className={`border-0 outline-none h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base
            ${darkMode ? "placeholder-white/60 text-white" : "placeholder-gray-500 text-black"}`}
          />
          <span
            className="text-xl sm:text-2xl cursor-pointer text-yellow-500"
            onClick={handleShowPassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* PASSWORD ERRORS */}
         {passerror.length > 0 && passerror !== "No Error Detected" && (
                <div className='flex flex-col gap-1 text-red-600 text-xs sm:text-sm px-2'>
                  {Array.isArray(passerror)
                    ? passerror.map((err, i) => <p key={i}>• {err}</p>)
                    : <p>{passerror}</p>}
                </div>
              )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="rounded-full h-[45px] sm:h-[50px] text-white font-bold text-lg sm:text-xl 
          bg-gradient-to-r from-orange-500 to-red-500 hover:brightness-110 
          shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Submit
        </button>

        {/* Bottom */}
        <div className="flex justify-around text-sm sm:text-base">
          <span className="font-bold">Don't have an account?</span>
          <Link to="/register" className="text-cyan-500 font-semibold">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;