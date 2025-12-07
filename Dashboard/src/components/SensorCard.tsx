import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  status: 'good' | 'warning' | 'danger' | 'neutral';
  size?: 'normal' | 'large';
}

const SensorCard: React.FC<SensorCardProps> = ({ title, value, unit, icon: Icon, status, size = 'normal' }) => {
  const statusColors = {
    good: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
    neutral: 'bg-gray-50 border-gray-200'
  };

  const valueColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    neutral: 'text-gray-700'
  };

  return (
    <div className={`${statusColors[status]} border-2 rounded-2xl p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            status === 'good' ? 'bg-green-100' : status === 'warning' ? 'bg-yellow-100' : status === 'danger' ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <Icon className={`w-5 h-5 ${valueColors[status]}`} />
          </div>
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`${size === 'large' ? 'text-5xl' : 'text-3xl'} font-bold ${valueColors[status]}`}>
          {value}
        </span>
        <span className="text-lg text-gray-500">{unit}</span>
      </div>
      {status !== 'neutral' && (
        <div className="mt-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            status === 'good' ? 'bg-green-200 text-green-800' : 
            status === 'warning' ? 'bg-yellow-200 text-yellow-800' : 
            'bg-red-200 text-red-800'
          }`}>
            {status === 'good' ? 'GOOD' : status === 'warning' ? 'MODERATE' : 'UNHEALTHY'}
          </span>
        </div>
      )}
    </div>
  );
};

export default SensorCard;
