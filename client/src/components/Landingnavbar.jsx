import React, { useState } from 'react';
import { NAV_LINKS, CTAButton, MenuIcon, XMarkIcon } from './data';

export const Landingnavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="absolute top-0 left-0 w-full z-10 py-4 lg:py-8">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-100">
          <a href="#" className="hover:text-teal-400 transition">
            Fin<span className="text-teal-500">Tech</span>
          </a>
        </div>

        <ul className="hidden lg:flex space-x-8 items-center text-gray-300">
          {NAV_LINKS.map((link) => (
            <li key={link}><a href={`#${link.toLowerCase()}`} className="hover:text-teal-400 transition duration-200">{link}</a></li>
          ))}
          <li><CTAButton primary={false} className="ml-4">Sign In</CTAButton></li>
        </ul>

        <button className="lg:hidden text-gray-100 p-2 rounded-md hover:bg-gray-700 transition" aria-label="Toggle menu" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <XMarkIcon /> : <MenuIcon />}
        </button>
      </nav>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-gray-800 shadow-xl py-4 transition-all duration-300">
          <ul className="flex flex-col space-y-3 px-6 text-gray-300">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`} className="block py-2 hover:text-teal-400 transition" onClick={() => setIsOpen(false)}>{link}</a>
              </li>
            ))}
            <li className="pt-2"><CTAButton className="w-full">Sign In</CTAButton></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
