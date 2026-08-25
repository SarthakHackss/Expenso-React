import React, { useEffect, useState } from 'react';

export const Splash = () => {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="splash-screen" aria-hidden="true">
      <div className="splash-wordmark">
        athanni<span className="splash-dot">.</span>
      </div>
      <div className="splash-tagline">aamdani aathanni magar ab kharcha rupaiyya nahi...</div>
      <div className="splash-bar" />
    </div>
  );
};
