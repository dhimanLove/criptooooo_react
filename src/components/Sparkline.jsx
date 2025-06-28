import React from 'react';

export const Sparkline = ({ 
  data, 
  width = 120, 
  height = 40, 
  color = '#10B981' 
}) => {
  if (!data || data.length === 0) {
    return <div className="w-full h-10 bg-gray-700 rounded" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  const trendColor = lastValue > firstValue ? '#10B981' : '#EF4444';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color || trendColor}
        strokeWidth="2"
        points={points}
        className="transition-all duration-300"
      />
    </svg>
  );
};
