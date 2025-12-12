import React from 'react';

const GlassCard = ({ children, className = "", hoverEffect = true }) => {
  return (
    <div 
      className={`
        backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6
        ${hoverEffect ? 'transition-all duration-300 hover:shadow-2xl hover:bg-white/15 hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
