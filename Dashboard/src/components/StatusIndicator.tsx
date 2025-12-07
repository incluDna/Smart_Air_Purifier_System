import React from 'react';

interface StatusIndicatorProps {
  status: 'ON' | 'OFF';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const colors = {
    ON: 'bg-green-500',
    OFF: 'bg-gray-400'
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border-2 border-gray-100">
      <div className={`w-3 h-3 rounded-full ${colors[status]} animate-pulse`}></div>
      <span className="font-semibold text-gray-700">Status: {status}</span>
    </div>
  );
};

export default StatusIndicator;
