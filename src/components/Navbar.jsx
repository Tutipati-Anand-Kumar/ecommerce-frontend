import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faRightToBracket,
  faAddressCard,
  faCartShopping,
  faBagShopping,
  faMagnifyingGlass,
  faBars,
  faPlus,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { FaSun, FaRegMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import Logout from "../pages/Logout";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutPopup(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/?search=${searchTerm.trim()}`);
    else navigate('/');
  };

  const commonLinkClasses = `
    flex flex-col items-center justify-center 
    text-sm sm:text-base font-medium transition-all duration-300 
    ${darkMode
      ? "text-gray-200 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
      : "text-gray-800 hover:text-blue-600"}
  `;

  const mobileLinkClasses = `
    flex items-center gap-3 px-4 py-3 transition w-fit mx-auto font-medium
    ${darkMode ? "text-gray-200 hover:text-cyan-300" : "text-gray-800 hover:text-blue-600"}
  `;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg 
          ${darkMode
            ? "bg-[rgba(10,20,35,0.9)] text-gray-200 shadow-[0_2px_25px_rgba(0,255,255,0.15)]"
            : "bg-[rgba(255,255,255,0.9)] text-gray-900 shadow-md"}
          flex justify-between items-center py-2.5 px-3 sm:px-6 md:px-8 transition-all duration-500 ease-in-out`}
      >
        {/* ✅ Logo + Text */}
        <Link to="/" className="flex items-center flex-shrink-0 mr-3">
          <img
            src="/public/image.png"
            alt="FamilyKart Logo"
            className={`h-9 sm:h-10 md:h-12 w-auto object-contain transition duration-300
              ${darkMode ? "brightness-200 contrast-150 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" : ""}`}
          />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative flex flex-grow items-center max-w-2xl mx-3"
        >
          <button
            type="submit"
            className={`absolute left-3 text-lg transition
              ${darkMode ? "text-cyan-300 hover:text-yellow-300" : "text-gray-500 hover:text-blue-600"}`}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <input
            type="text"
            placeholder="Search products..."
            className={`w-full py-2.5 pl-9 pr-3 rounded-full border focus:outline-none focus:ring-2
              ${darkMode
                ? "border-gray-600 bg-[rgba(255,255,255,0.08)] text-gray-100 placeholder-gray-400 focus:ring-cyan-400"
                : "border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-blue-400"}
              transition-all duration-300`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link to="/" className={commonLinkClasses}>
              <FontAwesomeIcon icon={faHouse} className="text-xl text-red-400" />
              <p>Home</p>
            </Link>

            {!user ? (
              <>
                <Link to="/login" className={commonLinkClasses}>
                  <FontAwesomeIcon icon={faRightToBracket} className="text-xl text-blue-400" />
                  <p>Login</p>
                </Link>
                <Link to="/register" className={commonLinkClasses}>
                  <FontAwesomeIcon icon={faAddressCard} className="text-xl text-yellow-400" />
                  <p>Register</p>
                </Link>
              </>
            ) : null}
          </nav>

          {user && (
            <>
              <Link to="/cart" className={`${commonLinkClasses} relative`}>
                <FontAwesomeIcon icon={faCartShopping} className="text-xl text-pink-400" />
                {cartItemCount > 0 && (
                  <div className="absolute -top-2 -right-3 bg-black dark:bg-white text-white dark:text-black rounded-full w-5 h-5 flex justify-center items-center text-xs font-bold">
                    {cartItemCount}
                  </div>
                )}
                <p>Cart</p>
              </Link>

              <Link to="/orders" className={commonLinkClasses}>
                <FontAwesomeIcon icon={faBagShopping} className="text-xl text-blue-400" />
                <p>Orders</p>
              </Link>

              <Link to="/profile" className={commonLinkClasses}>
                <FontAwesomeIcon icon={faUser} className="text-xl text-indigo-400" />
                <p>Profile</p>
              </Link>

              {user.isAdmin && (
                <Link to="/admin" className={commonLinkClasses}>
                  <FontAwesomeIcon icon={faPlus} className="text-xl text-green-400" />
                  <p>Admin</p>
                </Link>
              )}

              <button
                onClick={() => setShowLogoutPopup(true)}
                className={`${commonLinkClasses} text-red-500 dark:text-red-400`}
              >
                <FontAwesomeIcon icon={faRightToBracket} className="text-xl" />
                <p>Logout</p>
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex justify-center items-center flex-col text-gray-700 dark:text-cyan-200 hover:text-yellow-400 transition"
            title="Toggle Theme"
          >
            {darkMode ? <FaSun className='text-xl text-yellow-400'/> : <FaRegMoon className='text-xl'/>}
            <p className='font-normal'>{darkMode ? "Dark" : "Light"}</p>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-2xl text-gray-700 dark:text-cyan-200"
          >
            {darkMode ? <FaSun /> : <FaRegMoon />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl text-gray-700 dark:text-cyan-200"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <Logout
          handleClose={() => setShowLogoutPopup(false)}
          handleConfirm={handleLogoutConfirm}
        />
      )}

      {/* Spacer */}
      <div className={`pt-15 ${darkMode ? "bg-[#0a192f]" : "bg-white"}`}></div>
    </>
  );
};

export default Navbar;