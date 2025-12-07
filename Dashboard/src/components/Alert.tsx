import React from 'react';

interface AlertProps {
  type: 'success' | 'warning' | 'danger';
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const styles: Record<string, string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800', // orange for warning
    danger: 'bg-red-50 border-red-200 text-red-800' // red for dangerous
  };

  return (
    <div className={`fixed top-24 right-8 ${styles[type]} border-2 rounded-xl p-4 shadow-lg z-50 max-w-sm animate-slide-in`}>
      <div className="flex items-start justify-between gap-4">
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
    </div>
  );
};

export default Alert;
