import React, { useEffect, useState } from 'react';
import { FaSpider } from 'react-icons/fa';

const SplashScreen = () => {
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMain(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!showMain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center animate-pulse">
          <FaSpider className="text-purple-500 text-6xl mb-4 animate-spin" />
          <h1 className="text-4xl font-bold text-white tracking-widest">DARK SPYDER</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Selamat datang di Dashboard Dark Spyder!</h1>
    </div>
  );
};

export default SplashScreen;
