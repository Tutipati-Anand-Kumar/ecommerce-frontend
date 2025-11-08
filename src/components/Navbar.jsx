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
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg max-[445px]:h-[55px] max-[650px]:h-[55px]
          ${darkMode
            ? "bg-[rgba(10,20,35,0.9)] text-gray-200 shadow-[0_2px_25px_rgba(0,255,255,0.15)]"
            : "bg-[rgba(255,255,255,0.9)] text-gray-900 shadow-md"}
          flex justify-between items-center py-2.5 px-3 sm:px-6 md:px-8 transition-all duration-500 ease-in-out`}
      >
        {/* ✅ Logo + Text */}
        <Link to="/" className="flex items-center shrink-0 mr-3 max-[445px]:mr-0">
          <img
            src="/image.png"
            alt="FamilyKart Logo"
            className={`h-9 sm:h-10 md:h-12 w-auto object-contain transition duration-300 max-[445px]:w-20
              ${darkMode ? "brightness-200 contrast-150 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" : ""}`}
          />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative flex grow items-center max-w-2xl mx-3 max-[445px]:mx-1.5 max-[445px]:h-[45px]"
        >
          <button
            type="submit"
            className={`absolute right-3 text-lg transition
              ${darkMode ? "text-cyan-300 hover:text-yellow-300" : "text-gray-500 hover:text-blue-600"}`}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <input
            type="text"
            placeholder="Search products..."
            className={`w-full py-2.5 pr-9 pl-3 rounded-full border focus:outline-none focus:ring-2 max-[445px]:h-[42px] max-[650px]:h-[39px]
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
            <p className={`${darkMode?"text-white":"text-black"}`}>{darkMode ? "Dark" : "Light"}</p>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-3">
           <button
            onClick={toggleTheme}
            className="flex justify-center items-center flex-col text-gray-700 dark:text-cyan-200 hover:text-yellow-400 transition max-[445px]:text-[12px]"
            title="Toggle Theme"
          >
            {darkMode ? <FaSun className='text-xl text-yellow-400'/> : <FaRegMoon className='text-xl'/>}
            <p className={`${darkMode?"text-white":"text-black"}`}>{darkMode ? "Dark" : "Light"}</p>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(!isMobileMenuOpen)
            }}
            className="text-2xl text-gray-700 dark:text-cyan-200 max-[445px]:text-[22px]"
          >
            <FontAwesomeIcon icon={faBars} className={`${darkMode?"text-white":""}`}/>
          </button>
        </div>
      </header>

      {/* ✅ Mobile Dropdown Menu */}
{isMobileMenuOpen && (
  <div
    className={`lg:hidden flex flex-col items-center bg-black absolute top-17.5 right-0.5 z-50 transition-all duration-500 ease-in-out w-[130px] opacity-90 rounded-b-xl
      ${darkMode
        ? "bg-slate-900 text-gray-200 shadow-[0_5px_20px_rgba(0,255,255,0.15)]"
        : "bg-white text-gray-800 shadow-md"
      }`}
  >
    <Link to="/" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClasses}>
      <FontAwesomeIcon icon={faHouse} className="text-lg text-red-400" />
      <span>Home</span>
    </Link>

    {!user && (
      <>
        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClasses}>
          <FontAwesomeIcon icon={faRightToBracket} className="text-lg text-blue-400" />
          <span>Login</span>
        </Link>
        <Link to="/register" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClasses}>
          <FontAwesomeIcon icon={faAddressCard} className="text-lg text-yellow-400" />
          <span>Register</span>
        </Link>
      </>
    )}

    {user && (
      <>
        <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className={`${mobileLinkClasses} relative`}>
          <FontAwesomeIcon icon={faCartShopping} className="text-lg text-pink-400" />
          {cartItemCount > 0 && (
            <div className="absolute -top-2 -right-3 bg-black dark:bg-white text-white dark:text-black rounded-full w-5 h-5 flex justify-center items-center text-xs font-bold">
              {cartItemCount}
            </div>
          )}
          <span>Cart</span>
        </Link>

        <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClasses}>
          <FontAwesomeIcon icon={faBagShopping} className="text-lg text-blue-400" />
          <span>Orders</span>
        </Link>

        <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClasses}>
          <FontAwesomeIcon icon={faUser} className="text-lg text-indigo-400" />
          <span>Profile</span>
        </Link>

        {user.isAdmin && (
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClasses}>
            <FontAwesomeIcon icon={faPlus} className="text-lg text-green-400" />
            <span>Admin</span>
          </Link>
        )}

        <button
          onClick={() => {
            setShowLogoutPopup(true);
            setMobileMenuOpen(false);
          }}
          className={`${mobileLinkClasses} text-red-500 dark:text-red-400`}
        >
          <FontAwesomeIcon icon={faRightToBracket} className="text-lg" />
          <span>Logout</span>
        </button>
      </>
    )}
  </div>
)}

      {/* Logout Popup */}
      {showLogoutPopup && (
        <Logout
          handleClose={() => setShowLogoutPopup(false)}
          handleConfirm={handleLogoutConfirm}
        />
      )}

      {/* Spacer */}
      <div className={`${darkMode ? "bg-[#0a192f]" : "bg-white"}`}></div>
    </>
  );
};

export default Navbar;