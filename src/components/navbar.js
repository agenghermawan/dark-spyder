'use client'

import Image from "next/image";
import Link from "next/link";
import {useState, useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import gsap from "gsap";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [authState, setAuthState] = useState('loading');
    const router = useRouter();
    const logoRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        // Logo animation on mount
        gsap.from(logoRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
            delay: 0.3
        });

        // Mobile menu animation
        if (isMobileMenuOpen) {
            gsap.from(mobileMenuRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: "power3.out"
            });
        }

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
    }, [isMobileMenuOpen]);

    const handleLogoHover = () => {
        gsap.to(logoRef.current, {
            scale: 1.05,
            duration: 0.3,
            ease: "back.out(2)",
            yoyo: true,
            repeat: 1
        });
    };

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (!isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

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
        return <></>;
    }

    const isLoggedIn = authState === 'authenticated';


    return (
        <div className="z-50 bg-[#14141f] w-full p-4 shadow-lg rounded-[12px] sticky top-0">
            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center p-4">
                <Link href="/" ref={logoRef} onMouseEnter={handleLogoHover}>
                    <Image
                        src="/image/logo.png"
                        alt="logo"
                        width={200}
                        height={50}
                        className="invert hover:cursor-pointer transition-transform"
                        priority
                    />
                </Link>
                <button
                    className="text-white hover:text-[#f53d6b] transition-colors duration-300"
                    onClick={handleMobileMenuToggle}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="md:hidden mt-4 text-white bg-[#14141f] rounded-lg p-4 shadow-xl"
                >
                    <div className="space-y-4">
                        <NavDropdownMobile title="Products">
                            <Link
                                href="/dark_web/stealer"
                                className="px-4 py-2 hover:bg-gray-800 rounded block hover:translate-x-2 transition-transform duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Database Stealer
                            </Link>
                            <Link
                                href="/dark_web/leaks"
                                className="px-4 py-2 hover:bg-gray-800 rounded block hover:translate-x-2 transition-transform duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Database Leaks
                            </Link>
                            <Link
                                href="/vulnerabilities"
                                className="px-4 py-2 hover:bg-gray-800 rounded block hover:translate-x-2 transition-transform duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Vulnerabilities
                            </Link>
                        </NavDropdownMobile>

                        <NavDropdownMobile title="Sectors">
                            <Link
                                href="/sectors/law_enforcement_agencies"
                                className="px-4 py-2 hover:bg-gray-800 rounded block hover:translate-x-2 transition-transform duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Law Enforcement
                            </Link>
                            <Link
                                href="/sectors/enterprises"
                                className="px-4 py-2 hover:bg-gray-800 rounded block hover:translate-x-2 transition-transform duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Enterprises
                            </Link>
                            <Link
                                href="/sectors/governments"
                                className="px-4 py-2 hover:bg-gray-800 rounded block hover:translate-x-2 transition-transform duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Governments
                            </Link>
                        </NavDropdownMobile>

                        <NavDropdownMobile title="Company">
                            <Link
                                href="/company/about"
                                className="px-4 py-2 hover:bg-gray-800 rounded block hover:translate-x-2 transition-transform duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About Us
                            </Link>
                            <Link
                                href="/company/contact"
                                className="px-4 py-2 hover:bg-gray-800 rounded block hover:translate-x-2 transition-transform duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </NavDropdownMobile>

                        <div className="flex space-x-4 pt-4">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:bg-[#f53d6b] px-4 py-2 rounded-lg transition-all duration-300 border border-[#1c1f26] w-full hover:scale-105"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-white px-6 py-2 rounded-lg transition-all duration-300 font-semibold whitespace-nowrap flex items-center justify-center min-w-[120px] bg-gradient-to-r from-red-500 to-pink-500"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Navbar */}
            <div className="hidden md:grid md:grid-cols-3 gap-4 w-full md:w-10/12 mx-auto items-center justify-between">
                <Link
                    href="/"
                    ref={logoRef}
                    onMouseEnter={handleLogoHover}
                    className="hover:scale-105 transition-transform duration-300"
                >
                    <Image
                        src="/image/logo.png"
                        alt="logo"
                        width={200}
                        height={50}
                        className="invert hover:cursor-pointer"
                        priority
                    />
                </Link>

                <div className="flex flex-row justify-center items-center pt-4 space-x-6 text-white">
                    <NavDropdownDesktop title="Products">
                        <div className="relative group/darkweb">
                            <div
                                className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-between">
                                Dark Web
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.75"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div
                                className="absolute left-full top-0 ml-1 hidden group-hover/darkweb:block w-72 bg-[#070a11] border rounded-md border-gray-700 z-50 pt-1">
                                <Link href="/dark_web/stealer"
                                      className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                                    Database Stealer
                                </Link>
                                <Link href="/dark_web/leaks"
                                      className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                                    Database Leaks
                                </Link>
                            </div>
                        </div>
                        <Link href="/vulnerabilities"
                              className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Vulnerabilities
                        </Link>
                    </NavDropdownDesktop>

                    <NavDropdownDesktop title="Sectors">
                        <Link href="/sectors/law_enforcement_agencies"
                              className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Law Enforcement
                        </Link>
                        <Link href="/sectors/enterprises"
                              className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Enterprises
                        </Link>
                        <Link href="/sectors/governments"
                              className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Governments
                        </Link>
                    </NavDropdownDesktop>

                    <NavDropdownDesktop title="Company">
                        <Link href="/company/about"
                              className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            About Us
                        </Link>
                        <Link href="/company/contact"
                              className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out block">
                            Contact
                        </Link>
                    </NavDropdownDesktop>

                    <div className="group relative cursor-pointer pb-4">
                        <Link href={'/pricing'}
                            className="font-medium flex items-center hover:text-[#f53d6b] transition-colors duration-300">
                            Pricing
                        </Link>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-4">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-white hover:bg-[#f53d6b] px-4 py-2 rounded-lg transition-all duration-300 border border-[#1c1f26] hover:scale-105"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/login">
                            <button
                                className="text-white px-6 py-2 rounded-lg transition-all duration-300 font-semibold whitespace-nowrap flex items-center justify-center min-w-[120px] bg-gradient-to-r from-red-500 to-pink-500">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

function NavDropdownMobile({title, children}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!dropdownRef.current) return;

        if (isOpen) {
            // Open animation
            gsap.to(dropdownRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            // Close animation
            gsap.to(dropdownRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.2,
                ease: "power2.in"
            });
        }
    }, [isOpen]);

    return (
        <div className="group">
            <button
                className="font-bold flex items-center justify-between py-2 border-b border-gray-700 w-full hover:text-[#f53d6b] transition-colors duration-300"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={`dropdown-${title.replace(/\s+/g, '-').toLowerCase()}`}
            >
                {title}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#f53d6b]' : ''}`}
                >
                    <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </button>
            <div
                ref={dropdownRef}
                id={`dropdown-${title.replace(/\s+/g, '-').toLowerCase()}`}
                className="overflow-hidden h-0 opacity-0"
            >
                <div ref={contentRef} className="pl-4 py-2 space-y-2">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Reusable Desktop Dropdown Component
function NavDropdownDesktop({title, children}) {
    const dropdownRef = useRef(null);

    const handleMouseEnter = () => {
        gsap.fromTo(dropdownRef.current,
            {opacity: 0, y: -10},
            {opacity: 1, y: 0, duration: 0.3, ease: "power2.out"}
        );
    };

    return (
        <div className="group relative cursor-pointer pb-4" onMouseEnter={handleMouseEnter}>
            <div className="font-medium flex items-center hover:text-[#f53d6b] transition-colors duration-300">
                {title}
                <svg className="mt-1 group-hover:rotate-180 transition-transform duration-300" width="24" height="24"
                     viewBox="0 0 24 24" fill="none">
                    <path d="M9 11L12 14L14.9998 11.0002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </div>
            <div
                ref={dropdownRef}
                className="absolute left-0 top-full mt-0 hidden group-hover:block w-72 bg-[#070a11] border rounded-md border-gray-700 z-50 pt-1 shadow-xl"
            >
                <div className="py-2 flex flex-col space-y-2 px-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
