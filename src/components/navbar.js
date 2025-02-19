'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { FaCrosshairs, FaHome, FaServer, FaSpider } from "react-icons/fa";
import React, { useState } from "react";

const Navbar = () => {
    const pathname = usePathname(); // Ambil pathname saat ini
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State untuk mengelola dropdown

    const handleLogout = () => {
        // Logika logout di sini (misalnya, hapus token atau session)
        console.log("Logged out!");
        // Redirect ke halaman login setelah logout
        window.location.href = "/login";
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 relative">
            {/* Bagian Kiri */}
            <div className="flex items-center space-x-3">
                <FaSpider className="text-purple-500 text-2xl"/>
                <span className="font-bold text-xl">amandaluwis103</span>
                <span className="bg-gray-800 text-xs px-2 py-1 rounded">FREE</span>
            </div>

            {/* Bagian Tengah (Menu Navigasi) */}
            <div className="flex items-center space-x-6 px-4 py-3 border border-gray-700 rounded-xl bg-[#141414] w-fit mx-auto">
                <Link
                    href={'/dashboard'}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                        pathname === '/dashboard'
                            ? 'bg-gray-900 border-gray-700 text-white' // Active state
                            : 'hover:bg-gray-800 border-transparent' // Default state
                    }`}
                >
                    <FaHome className="text-purple-500"/>
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                    href={'/stealer'}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                        pathname === '/stealer'
                            ? 'bg-gray-900 border-gray-700 text-white' // Active state
                            : 'hover:bg-gray-800 border-transparent' // Default state
                    }`}
                >
                    <FaServer/>
                    <span>Stealer</span>
                </Link>
                <Link
                    href={'/leaks'}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                        pathname === '/leaks'
                            ? 'bg-gray-900 border-gray-700 text-white' // Active state
                            : 'hover:bg-gray-800 border-transparent' // Default state
                    }`}
                >
                    <FaCrosshairs/>
                    <span>Leaks</span>
                </Link>
            </div>

            {/* Bagian Kanan */}
            <div className="flex items-center space-x-4">
                <Link href={'/how_to'} className="hover:text-purple-400">How To</Link>
                <button className="hover:text-purple-400">Logs</button>
                <Link href={'/setting'} className="hover:text-purple-400">Setting</Link>

                {/* Dropdown untuk Logout */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                    >
                        A
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
