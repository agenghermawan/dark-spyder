'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCrosshairs, FaHome, FaServer, FaSpider, FaBars, FaTimes, FaQuestionCircle, FaFileAlt } from "react-icons/fa";
import React, { useState } from "react";

const Navbar = () => {
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        console.log("Logged out!");
        window.location.href = "/login";
    };

    return (
        <nav className="bg-[#141414] border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Logo dan Title */}
                <div className="flex items-center space-x-3">
                    <FaSpider className="text-purple-500 text-2xl"/>
                    <span className="font-bold text-xl text-white">amandaluwis103</span>
                    <span className="bg-gray-800 text-xs px-2 py-1 rounded text-white">FREE</span>
                </div>

                {/* Menu Icon untuk Mobile */}
                <button
                    className="md:hidden text-white text-2xl"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Menu Navigasi (Desktop) */}
                <div className="hidden md:flex items-center space-x-6 px-4 py-3 border border-gray-700 rounded-xl bg-[#1a1a1a] w-fit">
                    {[
                        { href: '/dashboard', label: 'Dashboard', icon: <FaHome className="text-purple-500" /> },
                        { href: '/stealer', label: 'Stealer', icon: <FaServer /> },
                        { href: '/leaks', label: 'Leaks', icon: <FaCrosshairs /> }
                    ].map(({ href, label, icon }) => (
                        <Link key={href} href={href}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                                  pathname === href
                                      ? 'bg-gray-900 border-gray-700 text-white'
                                      : 'hover:bg-gray-800 border-transparent text-gray-300'
                              }`}
                        >
                            {icon}
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>

                {/* Bagian Kanan */}
                <div className="hidden md:flex items-center space-x-4 text-gray-300">
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

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden flex flex-col items-start space-y-4 mt-4  bg-[#1a1a1a] p-4 rounded-lg border border-gray-700">
                    {[
                        { href: '/dashboard', label: 'Dashboard', icon: <FaHome className="text-purple-500" /> },
                        { href: '/stealer', label: 'Stealer', icon: <FaServer /> },
                        { href: '/leaks', label: 'Leaks', icon: <FaCrosshairs /> },
                        { href: '/how_to', label: 'How To', icon: <FaQuestionCircle /> },
                        { href: '/setting', label: 'Settings', icon: <FaFileAlt /> }
                    ].map(({ href, label, icon }) => (
                        <Link key={href} href={href}
                              className={`flex items-center justify-start space-x-2 px-4 py-2 rounded-lg border w-full transition-colors ${
                                  pathname === href
                                      ? 'bg-gray-900 border-gray-700 text-white'
                                      : 'hover:bg-gray-800 border-transparent text-gray-300'
                              }`}
                        >
                            {icon}
                            <span>{label}</span>
                        </Link>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
