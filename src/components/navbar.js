'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [authState, setAuthState] = useState('loading') ;
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch("/api/me", {
                    credentials: "include",
                });
                setAuthState(res.ok ? 'authenticated' : 'unauthenticated');
            } catch {
                setAuthState('unauthenticated');
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
                credentials: "include"
            });

            if (res.ok) {
                router.push("/login");
                router.refresh();
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (authState === 'loading') {
        return (
            <div className="z-50 bg-[#14141f] w-full p-4 shadow-lg rounded-[12px]">
                <div className="flex justify-between items-center">
                    <div className="h-[40px] w-[150px] bg-gray-700 rounded animate-pulse" />
                    <div className="h-6 w-6 bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    const isLoggedIn = authState === 'authenticated';

    return (
        <div className="z-50 bg-[#14141f] w-full p-4 shadow-lg rounded-[12px]">
            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center p-4">
                <Link href="/">
                    <Image
                        src="/image/logo.png"
                        alt="logo"
                        width={150}
                        height={40}
                        priority
                    />
                </Link>
                <button
                    className="text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 text-white">
                    <div className="space-y-4">
                        <NavDropdownMobile title="Products">
                            <Link href="/dark_web/stealer" className="px-4 py-2 hover:bg-gray-800 rounded block">
                                Database Stealer
                            </Link>
                            <Link href="/dark_web/leaks" className="px-4 py-2 hover:bg-gray-800 rounded block">
                                Database Leaks
                            </Link>
                            <Link href="/vulnerabilities" className="px-4 py-2 hover:bg-gray-800 rounded block">
                                Vulnerabilities
                            </Link>
                        </NavDropdownMobile>

                        <NavDropdownMobile title="Sectors">
                            <Link href="/sectors/law_enforcement_agencies" className="px-4 py-2 hover:bg-gray-800 rounded block">
                                Law Enforcement
                            </Link>
                            <Link href="/sectors/enterprises" className="px-4 py-2 hover:bg-gray-800 rounded block">
                                Enterprises
                            </Link>
                            <Link href="/sectors/governments" className="px-4 py-2 hover:bg-gray-800 rounded block">
                                Governments
                            </Link>
                        </NavDropdownMobile>

                        <NavDropdownMobile title="Company">
                            <Link href="/company/about" className="px-4 py-2 hover:bg-gray-800 rounded block">
                                About Us
                            </Link>
                            <Link href="/company/contact" className="px-4 py-2 hover:bg-gray-800 rounded block">
                                Contact
                            </Link>
                        </NavDropdownMobile>

                        <div className="flex space-x-4 pt-4">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:text-gray-300 px-4 py-2 rounded-lg transition duration-300 border border-[#1c1f26] w-full"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link href="/login" className="text-white hover:text-gray-300 px-4 py-2 rounded-lg transition duration-300 border border-[#1c1f26] w-full text-center">
                                        Login
                                    </Link>
                                    <Link href="/signup" className="bg-[#f03262] hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 w-full text-center">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Navbar */}
            <div className="hidden md:grid md:grid-cols-3 gap-4 w-full md:w-8/12 mx-auto items-center justify-between">
                <Link href="/">
                    <Image
                        src="/image/logo.png"
                        alt="logo"
                        width={120}
                        height={50}
                        priority
                    />
                </Link>

                <div className="flex flex-row justify-center items-center pt-4 space-x-6 text-white">
                    <NavDropdownDesktop title="Products">
                        <div className="relative group/darkweb">
                            <div className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-between">
                                Dark Web
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="absolute left-full top-0 ml-1 hidden group-hover/darkweb:block w-72 bg-[#070a11] border rounded-md border-gray-700 z-50 pt-1">
                                <Link href="/dark_web/stealer" className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                                    Database Stealer
                                </Link>
                                <Link href="/dark_web/leaks" className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                                    Database Leaks
                                </Link>
                            </div>
                        </div>
                        <Link href="/vulnerabilities" className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Vulnerabilities
                        </Link>
                    </NavDropdownDesktop>

                    <NavDropdownDesktop title="Sectors">
                        <Link href="/sectors/law_enforcement_agencies" className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Law Enforcement
                        </Link>
                        <Link href="/sectors/enterprises" className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Enterprises
                        </Link>
                        <Link href="/sectors/governments" className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Governments
                        </Link>
                    </NavDropdownDesktop>

                    <NavDropdownDesktop title="Company">
                        <Link href="/company/about" className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            About Us
                        </Link>
                        <Link href="/company/contact" className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Contact
                        </Link>
                    </NavDropdownDesktop>
                </div>

                <div className="flex items-center justify-end space-x-4">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-white hover:text-gray-300 px-4 py-2 rounded-lg transition duration-300 border border-[#1c1f26]"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="text-white hover:text-gray-300 px-4 py-2 rounded-lg transition duration-300 border border-[#1c1f26]">
                                    Login
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="bg-[#f03262] hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300">
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Reusable Mobile Dropdown Component
function NavDropdownMobile({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="group">
            <button
                className="font-bold flex items-center justify-between py-2 border-b border-gray-700 w-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            {isOpen && (
                <div className="pl-4 py-2 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
}

// Reusable Desktop Dropdown Component
function NavDropdownDesktop({ title, children }) {
    return (
        <div className="group relative cursor-pointer pb-4">
            <div className="font-medium flex items-center">
                {title}
                <svg className="mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="absolute left-0 top-full mt-0 hidden group-hover:block w-72 bg-[#070a11] border rounded-md border-gray-700 z-50 pt-1">
                <div className="py-2 flex flex-col space-y-2 px-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
