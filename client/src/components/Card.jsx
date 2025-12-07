import React from "react";

export const Card = ({ title, children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-md border border-gray-100 p-6
        hover:shadow-xl
        ${className}
      `}
    >
      {/* if title exists , redner title */}
      {title && <h3 className="text-lg mb-4 font-semibold">{title}</h3>}
      {children}
    </div>
  );
};
