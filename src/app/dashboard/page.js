'use client';
import React, { useEffect, useState } from 'react';
import { FaSpider, FaHome, FaServer, FaCrosshairs } from 'react-icons/fa';
import SearchBoxWithShadow from "@/components/search_box";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const Dashboard = () => {
  const [showSplash, setShowSplash] = useState(true);

    const data = [
        {
            password: "example123",
            origin: "login.example.com",
            email: "user@example.com",
            source: "Stealer Logs",
            breach: "N/A",
        },
        {
            password: "securepass",
            origin: "mail.example.com",
            email: "admin@example.com",
            source: "Stealer Logs",
            breach: "N/A",
        },
        {
            password: "pass456",
            origin: "portal.example.com",
            email: "contact@example.com",
            source: "Stealer Logs",
            breach: "N/A",
        },
    ];

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center animate-pulse">
          <FaSpider className="text-purple-500 text-6xl mb-4 animate-spin" />
          <h1 className="text-4xl font-bold text-green-400 tracking-widest glitch">DARK SPYDER</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white relative">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <SearchBoxWithShadow />
        <div className="p-3 md:p-6 w-full  md:mx-auto md:w-11/12 bg-gray-900 rounded-2xl border border-gray-700 my-6">
            {data.map((item, index) => (
                <div
                    key={index}
                    className={`p-4 ${
                        index !== data.length - 1 ? "border-b border-gray-700" : ""
                    }`}
                >
                    <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded bg-purple-800 text-purple-300">
                  {item.source}
                </span>
                            <span className="text-xl font-mono text-white">
                  {item.origin}
                </span>
                        </div>
                        <div className="flex-1">
                            <span className="text-gray-400 text-sm">{item.email}</span>
                            <h3 className="text-lg font-semibold text-white mt-1">
                                Password: {item.password}
                            </h3>
                            <p className="text-gray-300 text-sm mt-2">
                                Breach: {item.breach}
                            </p>
                        </div>
                        <div className="text-gray-500 text-sm self-center">
                            Added <span className="text-blue-400">Just Now</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <Footer />
    </div>
  );
};

export default Dashboard;
