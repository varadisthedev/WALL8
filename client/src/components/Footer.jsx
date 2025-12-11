import React from 'react';

export const Footer = () => (
  <footer className="bg-gray-900 py-10">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-gray-400">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <div className="text-2xl font-bold text-gray-100 mb-2">Fin<span className="text-teal-500">Tech</span></div>
          <p className="text-sm">&copy; {new Date().getFullYear()} FinTech Inc. All rights reserved.</p>
        </div>

        <div className="flex space-x-6">
          {['Facebook','Twitter','LinkedIn'].map(n => <a key={n} href="#" aria-label={n} className="text-gray-400 hover:text-teal-500 transition duration-200"><span className="text-2xl">{n[0]}</span></a>)}
        </div>

        <div className="flex space-x-6 text-sm">
          <a href="#" className="hover:text-teal-500 transition">Privacy Policy</a>
          <a href="#" className="hover:text-teal-500 transition">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
