'use client';
import Navbar from "@/components/navbar";
import Globe from "@/components/globe";
import Image from "next/image";
import {useState, useRef, useEffect} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useRouter} from 'next/navigation';
import Footer from "@/components/footer";

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
            <Footer ref={footerRef}/>
        </div>
    )
}
