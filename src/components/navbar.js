import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="z-50 bg-[#14141f] w-full p-4 shadow-lg rounded-[12px]">
            {/* Mobile Menu Button (Hidden on desktop) */}
            <div className="md:hidden flex justify-between items-center p-4">
                <div>
                    <Image
                        src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6495604fb7188b7b3e3edd45_Logotype.svg"
                        alt="logo" width="150" height="40"/>
                </div>
                <button
                    className="text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 text-white">
                    <div className="space-y-4">
                        <div className="group">
                            <div className="font-bold flex items-center justify-between py-2 border-b border-gray-700">
                                Products
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <ul className="pl-4 py-2 space-y-2">
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Financial Services</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Healthcare</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Technology</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Manufacturing</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Retail</li>
                            </ul>
                        </div>

                        <div className="group">
                            <div className="font-bold flex items-center justify-between py-2 border-b border-gray-700">
                                Sectors
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <ul className="pl-4 py-2 space-y-2">
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Enterprise</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Small Business</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Startups</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Government</li>
                            </ul>
                        </div>

                        <div className="group">
                            <div className="font-bold flex items-center justify-between py-2 border-b border-gray-700">
                                Resources
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <ul className="pl-4 py-2 space-y-2">
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Documentation</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Blog</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Case Studies</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Support</li>
                            </ul>
                        </div>

                        <div className="group">
                            <div className="font-bold flex items-center justify-between py-2 border-b border-gray-700">
                                Company
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <ul className="pl-4 py-2 space-y-2">
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">About Us</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Careers</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Contact</li>
                                <li className="px-4 py-2 hover:bg-gray-800 rounded">Partners</li>
                            </ul>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button className="text-white hover:text-gray-300 px-4 py-2 rounded-lg transition duration-300 border border-[#1c1f26] w-full">
                                Login
                            </button>
                            <button className="bg-[#f03262] hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 w-full">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Navbar (Hidden on mobile) */}
            <div className="hidden md:grid md:grid-cols-3 gap-4 w-full md:w-8/12 mx-auto items-center justify-between">
                <div>
                    <Image
                        src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6495604fb7188b7b3e3edd45_Logotype.svg"
                        alt="logo" width="200" height="200"/>
                </div>

                <div className="flex items-center space-x-6 text-white">
                    <div className="group relative cursor-pointer">
                        <div className="font-bold flex items-center">
                            Products
                            <svg className="mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="absolute hidden group-hover:block w-48 bg-[#070a11] border border-gray-700 mt-2">
                            <ul className="py-2">
                                <li className="px-4 py-2 hover:bg-gray-800">Financial Services</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Healthcare</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Technology</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Manufacturing</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Retail</li>
                            </ul>
                        </div>
                    </div>

                    <div className="group relative cursor-pointer">
                        <div className="font-bold flex items-center">
                            Sectors
                            <svg className="mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="absolute hidden group-hover:block w-48 bg-[#070a11] border border-gray-700 mt-2">
                            <ul className="py-2">
                                <li className="px-4 py-2 hover:bg-gray-800">Enterprise</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Small Business</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Startups</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Government</li>
                            </ul>
                        </div>
                    </div>

                    <div className="group relative cursor-pointer">
                        <div className="font-bold flex items-center">
                            Resources
                            <svg className="mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="absolute hidden group-hover:block w-48 bg-[#070a11] border border-gray-700 mt-2">
                            <ul className="py-2">
                                <li className="px-4 py-2 hover:bg-gray-800">Documentation</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Blog</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Case Studies</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Support</li>
                            </ul>
                        </div>
                    </div>

                    <div className="group relative cursor-pointer">
                        <div className="font-bold flex items-center">
                            Company
                            <svg className="mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="absolute hidden group-hover:block w-48 bg-[#070a11] border border-gray-700 mt-2">
                            <ul className="py-2">
                                <li className="px-4 py-2 hover:bg-gray-800">About Us</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Careers</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Contact</li>
                                <li className="px-4 py-2 hover:bg-gray-800">Partners</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-end space-x-4">
                        <button className="text-white hover:text-gray-300 px-4 py-2 rounded-lg transition duration-300 border border-[#1c1f26]">
                            Login
                        </button>
                        <button className="bg-[#f03262] hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
