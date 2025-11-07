import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // icons for hamburger menu
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left side - Logo/Title */}
        <h1 className="text-2xl font-semibold cursor-pointer text-blue-700 tracking-wide">
          <span className="text-blue-500" onClick={()=>navigate('/')} >Pharmacy</span>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li onClick={()=>navigate('/admin/dashboard')} className="hover:text-blue-600 transition-colors duration-200 cursor-pointer">
             Admin
          </li>
          <li>
            <button onClick={()=>{
              navigate('/login')
            }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer">
              Login
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <ul className="flex flex-col items-center gap-4 py-4 text-gray-700 font-medium">
            <li 
              className="hover:text-blue-600 transition-colors duration-200 cursor-pointer"
              onClick={() => {
                setIsOpen(false)
                navigate('/admin/dashboard')
              }}
            >
              Admin
            </li>
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
