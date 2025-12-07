import React from 'react';
import Button from './Button';

interface TimeRangeSelectorProps {
  selected: string;
  onChange: (range: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ selected, onChange }) => {
  const ranges = ['1h', '24h'];

  return (
    <div className="flex gap-2 p-1 rounded-xl bg-gray-100">
      {ranges.map(range => (
        <Button
          key={range}
          onClick={() => onChange(range)}
          isSelected={selected === range}
        >
          {range}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
