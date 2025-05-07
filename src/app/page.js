'use client';
import Navbar from "@/components/navbar";
import Globe from "@/components/globe";
import Image from "next/image";
import {useState, useRef, useEffect} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useRouter} from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('law');
    const heroRef = useRef(null);
    const productCardsRef = useRef([]);
    const useCasesRef = useRef(null);
    const footerRef = useRef(null);
    const imageTextRef = useRef(null);

    // Initialize animations
    useEffect(() => {
        // Hero section animation
        gsap.from(heroRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
            delay: 0.5
        });

        // Product cards animation
        productCardsRef.current.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                ease: "back.out(1.2)",
                delay: index * 0.15
            });
        });

        // Use cases section animation
        gsap.from(useCasesRef.current, {
            scrollTrigger: {
                trigger: useCasesRef.current,
                start: "top 75%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 80,
            duration: 0.8,
            ease: "power3.out"
        });

        // Footer animation
        gsap.from(footerRef.current, {
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top 75%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out"
        });

        // Image + text section animation
        gsap.from(imageTextRef.current, {
            scrollTrigger: {
                trigger: imageTextRef.current,
                start: "top 75%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 80,
            duration: 0.8,
            ease: "power3.out"
        });

        // Clean up ScrollTrigger instances
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    // Tab change animation
    useEffect(() => {
        gsap.from(".tab-content", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        });
    }, [activeTab]);

    const handleDiscover = () => {
        router.push(`/dark_web/stealer?q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className="relative overflow-x-hidden">
            <Navbar/>

            {/* Hero Section with Globe */}
            <div className="relative h-screen w-full" ref={heroRef}>
                <Globe/>

                <section
                    className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                            Detect real vulnerabilities
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 animate-fade-in">
                            Harness the power of Nuclei for fast and accurate <br className="hidden md:block"/> findings
                            without false
                            positives.
                        </p>

                        <div
                            className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden animate-fade-in">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter your domain to get started"
                                className="input-glass flex-grow px-4 py-3 bg-black/20 backdrop-blur-md border border-white/10 focus:border-[#f03262]/50 focus:outline-none transition-all duration-300 text-white placeholder-white/70"
                                onKeyDown={(e) => e.key === 'Enter' && handleDiscover()}
                            />
                            <button
                                onClick={handleDiscover}
                                className="bg-[#f03262] hover:bg-[#d82a56] text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 transform">
                                Discover
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Products Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-light text-white mb-12 text-center">Products</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/648428d13422cd6b71b2aae4_Verified.svg",
                                title: "Darkweb Tracker",
                                description: "A deep and dark web intelligence platform for investigators to look up threat information, trace relations between data, and visualize investigations.",
                                ref: el => productCardsRef.current[0] = el
                            },
                            {
                                icon: "https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/64822037a880b5a21319bdd0_Locker%20%E2%80%94%20Closed.svg",
                                title: "Credential Protection",
                                description: "Detect and identify account credentials leaked into the dark web from breach incidents to swiftly address vulnerabilities within your organization.",
                                ref: el => productCardsRef.current[1] = el
                            },
                            {
                                icon: "https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/648220373743a62ee771eb5d_Search.svg",
                                title: "Dark Web Monitoring",
                                description: "Track organizations whose data has been breached and leaked onto the deep and dark web with 24/7 surveillance for efficient response.",
                                ref: el => productCardsRef.current[2] = el
                            }
                        ].map((product, index) => (
                            <div
                                key={index}
                                ref={product.ref}
                                className="bg-[#1b1e25] p-6 rounded-lg shadow-lg text-white flex flex-col hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 border border-transparent hover:border-[#f03262]/30"
                            >
                                <div className="flex flex-row items-center mb-4 gap-2">
                                    <Image
                                        src={product.icon}
                                        alt={`icon ${index + 1}`}
                                        width={24}
                                        height={24}
                                        className="filter brightness-0 invert"
                                    />
                                    <br/>
                                    <h3 className="text-xl font-semibold">{product.title}</h3>
                                </div>
                                <p className="mb-4 text-gray-300">{product.description}</p>
                                <div className="mt-auto">
                                    <a href="#"
                                       className="font-medium inline-flex items-center bg-[#373940] px-4 py-2 rounded-lg hover:bg-[#f03262] hover:text-white transition-all duration-300">
                                        Learn more <span className="ml-1">→</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image + Text Section */}
            <div
                ref={imageTextRef}
                className="flex flex-col md:flex-row p-4 text-center md:p-0 justify-center items-center min-h-screen mt-[-120px] relative"
            >
                <div className="w-full md:w-1/2">
                    <Image
                        src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/660476aebba28791e873d4fe_Stealthmole%20Intelligence%20(compressed)-p-2000.webp"
                        alt="logo"
                        width={1000}
                        height={1000}
                        className="rounded-xl shadow-2xl"
                    />
                </div>
                <div className="w-full md:w-1/2 px-8 mt-8 md:mt-0">
                    <h3 className="text-white text-3xl md:text-4xl font-bold mb-6">
                        Monitor and protect with Asia's leading AI powered dark web threat intelligence
                    </h3>
                    <p className="text-gray-300 text-lg mb-8">
                        Our advanced AI algorithms scan millions of dark web sources to provide actionable intelligence
                        for your security needs.
                    </p>
                    <button
                        className="bg-[#f03262] hover:bg-[#d82a56] text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 transform">
                        Explore Our Technology
                    </button>
                </div>
            </div>

            {/* Use Cases Section */}
            <section
                ref={useCasesRef}
                className="py-16 px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundColor: '#0D0D10',
                    backgroundImage: 'radial-gradient(circle at top left, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)',
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-light text-white mb-12 text-center">Use Cases</h2>

                    <div className="flex justify-center mb-8">
                        <div className="flex bg-[#0D0D10] rounded-full p-2 gap-2 border border-white/10">
                            {['law', 'gov', 'enterprise'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                        activeTab === tab ? 'bg-[#F33D74] text-white' : 'text-white hover:bg-white/10'
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'law' && 'Law Enforcement Agencies'}
                                    {tab === 'gov' && 'Governments'}
                                    {tab === 'enterprise' && 'Enterprises'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content flex flex-col items-center text-center">
                        {activeTab === 'law' && (
                            <>
                                <Image
                                    src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6485ee54cdba2a48dbe7edce_matt-popovich-7mqsZsE6FaU-unsplash.jpg"
                                    alt="Law Enforcement"
                                    width={900}
                                    height={500}
                                    className="rounded-2xl mb-8 shadow-xl"
                                />
                                <h3 className="text-2xl font-semibold text-white mb-4">Law Enforcement Agencies</h3>
                                <p className="text-gray-400 max-w-3xl leading-relaxed">
                                    StealthMole provides Law Enforcement Agencies with powerful tools necessary to
                                    efficiently gather insights on criminal activities, investigate cybercrimes, and
                                    identify potential
                                    threats. Automate investigations to save time and enhance capacity to protect lives.
                                </p>
                            </>
                        )}

                        {activeTab === 'gov' && (
                            <>
                                <Image
                                    src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6485ee66ad4a2634dfaa52f7_sebastian-pichler-bAQH53VquTc-unsplash.jpg"
                                    alt="Governments"
                                    width={900}
                                    height={500}
                                    className="rounded-2xl mb-8 shadow-xl"
                                />
                                <h3 className="text-2xl font-semibold text-white mb-4">Governments</h3>
                                <p className="text-gray-400 max-w-3xl leading-relaxed">
                                    Empower government agencies with threat intelligence, risk management, and critical
                                    infrastructure protection solutions. Proactively respond to emerging digital threats
                                    and ensure
                                    national security with our comprehensive platform.
                                </p>
                            </>
                        )}

                        {activeTab === 'enterprise' && (
                            <>
                                <Image
                                    src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6485ee7025afd798f170a8d9_sean-pollock-PhYq704ffdA-unsplash-p-1080.jpg"
                                    alt="Enterprises"
                                    width={900}
                                    height={500}
                                    className="rounded-2xl mb-8 shadow-xl"
                                />
                                <h3 className="text-2xl font-semibold text-white mb-4">Enterprises</h3>
                                <p className="text-gray-400 max-w-3xl leading-relaxed">
                                    Enterprises leverage StealthMole to monitor data breaches, safeguard brand
                                    reputation,
                                    and mitigate cyber risks. Our platform delivers real-time insights to protect
                                    business
                                    assets from sophisticated online threats with 24/7 monitoring.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <section
                ref={footerRef}
                className="relative bg-[#0D0D10] overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(circle at bottom right, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)',
                }}
            >
                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="bg-[#1A1B1E] rounded-2xl px-10 py-16 text-white shadow-2xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-semibold mb-4">Uncover hidden threats with StealthMole</h2>
                            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                Talk to our experts to learn how you can build a solid cyber defense strategy tailored
                                to your organization's needs
                            </p>
                            <button
                                className="bg-[#f33d74] hover:bg-[#e63368] text-white px-8 py-3 rounded-md text-sm font-medium hover:scale-105 transition-transform duration-300">
                                Request demo
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-sm text-gray-400">
                            {/* Footer links sections */}
                            {[
                                {
                                    title: "Company",
                                    links: ["About", "Contact us"]
                                },
                                {
                                    title: "Resources",
                                    links: ["Blog", "Webinars", "Case Studies"]
                                },
                                {
                                    title: "Products",
                                    links: ["Darkweb Tracker", "Credential Protection", "Incident Monitoring", "Telegram Tracker"]
                                },
                                {
                                    title: "Sectors",
                                    links: ["Law Enforcement Agencies", "Governments", "Enterprises", "Financial Services"]
                                },
                                {
                                    title: "Legal",
                                    links: ["Terms & Conditions", "Privacy Policy", "GDPR Compliance"]
                                }
                            ].map((section, index) => (
                                <div key={index}>
                                    <h3 className="text-white font-medium mb-4">{section.title}</h3>
                                    <ul className="space-y-2">
                                        {section.links.map((link, linkIndex) => (
                                            <li key={linkIndex}>
                                                <a href="#"
                                                   className="hover:underline hover:text-[#f33d74] transition-colors duration-300">
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div>
                                <h3 className="text-white font-medium mb-4">Get in Touch</h3>
                                <p className="mb-2">2 Venture Drive, #09-01</p>
                                <p className="mb-2">Vision Exchange, Singapore 608526</p>
                                <p className="mb-4">sales@stealthmole.com</p>
                                <div className="flex space-x-4">
                                    <a href="#" className="hover:text-[#f33d74] transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-[#f33d74] transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-[#f33d74] transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Footer */}
                        <div
                            className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                                <Image
                                    src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6495604fb7188b7b3e3edd45_Logotype.svg"
                                    alt="StealthMole"
                                    width={100}
                                    height={40}
                                />
                                <span>© 2025 StealthMole. All rights reserved</span>
                            </div>
                            <div className="flex space-x-4 mt-4 md:mt-0">
                                <a href="#"
                                   className="hover:underline hover:text-[#f33d74] transition-colors duration-300">Terms
                                    & Conditions</a>
                                <a href="#"
                                   className="hover:underline hover:text-[#f33d74] transition-colors duration-300">Privacy
                                    Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
