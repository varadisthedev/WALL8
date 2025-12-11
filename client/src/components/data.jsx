import React from 'react';

// NAV LINKS
export const NAV_LINKS = ['Features', 'Pricing', 'Company', 'Blog'];

// FEATURES
export const FEATURES_DATA = [
  { icon: '💰', title: 'Smart Budgeting', description: 'Track your spending and optimize your savings automatically with AI-driven insights.' },
  { icon: '🔒', title: 'Top-Tier Security', description: 'We use 256-bit encryption and multi-factor authentication to protect your assets.' },
  { icon: '⚡', title: 'Instant Transfers', description: 'Send and receive money globally, instantly, with zero hidden transfer fees.' },
];

// TESTIMONIALS
export const TESTIMONIALS_DATA = [
  { quote: "Switching to this platform was the best financial decision I've made. The interface is beautiful and the insights are incredibly valuable!", name: 'Sarah K.', title: 'Freelance Designer', avatar: 'https://i.pravatar.cc/150?img=4' },
  { quote: "Managing my business finances has never been so easy and fast. The real-time data is a game-changer for quick decisions.", name: 'Mark T.', title: 'Small Business Owner', avatar: 'https://i.pravatar.cc/150?img=5' },
];

// CTA Button
export const CTAButton = ({ children, primary = true, className = '', ...props }) => {
  const base = 'px-6 py-3 font-semibold rounded-full transition duration-300 transform hover:scale-105';
  const primaryC = 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/50';
  const secondaryC = 'bg-transparent text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white';
  return (
    <button className={`${base} ${primary ? primaryC : secondaryC} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Icons
export const MenuIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
export const XMarkIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
