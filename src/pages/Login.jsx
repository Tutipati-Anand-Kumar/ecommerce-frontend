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

    if (name === 'password') {
      if (value.trim() === "") {
        setPassError([]);
      } else {
        const result = validatePassword(value, 8).getAllValidationErrorMessage();
        setPassError(result);
      }
    }

    if (name === 'email') {
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
      toast.error("Please fix password errors ❌");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      toast.success("User login successful");
      navigate('/');
    } else {
      toast.error("Check your login credentials" || result.message);
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center pt-20 sm:pt-10  ${darkMode ? "bg-black" : "bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400"}`}>
      <form
        className="flex flex-col w-11/12 max-w-sm sm:max-w-md bg-white/90 backdrop-blur-sm p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl gap-5 sm:gap-6 transition-all duration-300"
        onSubmit={handleSubmit}
      >
        <div className='flex justify-center items-center'>
          <h1 className='font-bold text-3xl sm:text-4xl text-pink-500'>Login</h1>
        </div>

        <div className='border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-200/50 flex items-center justify-center transition-all duration-300 bg-white'>
          <input
            type="email"
            className='border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base'
            placeholder='Enter your email*'
            name='email'
            onChange={handleChange}
            value={email}
            required
          />
          <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] text-green-500'><MdEmail /></span>
        </div>

        <div className='border-2 border-gray-200 rounded-full h-[45px] sm:h-[50px] focus-within:border-yellow-500 focus-within:shadow-lg focus-within:shadow-yellow-200/50 flex items-center justify-center transition-all duration-300 bg-white'>
          <input
            type={`${showPassword ? "password" : "text"}`}
            className='border-0 outline-0 h-full w-full px-5 rounded-full bg-transparent text-sm sm:text-base'
            placeholder='Enter your password*'
            name='password'
            onChange={handleChange}
            value={password}
            required
          />
          <span className='text-xl sm:text-2xl flex items-center justify-center w-[45px] sm:w-[50px] cursor-pointer text-yellow-500' onClick={handleShowPassword}>
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

        <div className='rounded-full h-[45px] sm:h-[50px] flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer'>
          <button type="submit" className='text-white font-bold text-lg sm:text-xl w-full h-full'>Submit</button>
        </div>

        <div className='flex justify-around text-sm sm:text-base'>
          <h1 className='font-bold'>Don't have an account?</h1>
          <Link className='text-cyan-500 hover:cursor-pointer font-semibold' to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;