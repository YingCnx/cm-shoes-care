import React from 'react';

const Button = ({ children, onClick, type = 'button', className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
