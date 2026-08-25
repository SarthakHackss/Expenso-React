import React, { useEffect, useState } from 'react';

export const AnimatedBar = ({
  percent,
  background = 'linear-gradient(90deg, #a855f7, #ec4899)',
  height = 8,
  track = 'rgba(255, 255, 255, 0.07)',
  delay = 200,
  style
}) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(Math.max(percent, 0), 100)), delay);
    return () => clearTimeout(t);
  }, [percent, delay]);

  return (
    <div style={{ height, background: track, borderRadius: 9999, overflow: 'hidden', ...style }}>
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background,
          borderRadius: 9999,
          transition: 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      />
    </div>
  );
};
