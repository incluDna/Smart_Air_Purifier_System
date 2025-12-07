import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, isSelected = false, className = '' }) => {
  const baseClasses = 'transition-all font-semibold rounded-xl';
  const sizeClasses = 'px-4 py-2';
  const stateClasses = isSelected
    ? 'bg-blue-200 text-blue-700 hover:bg-blue-300'
    : 'text-gray-600 hover:bg-gray-300';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${stateClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
