"use client";

import {useEffect, useRef, useState} from "react";
import Navbar from "../../../components/navbar";
import Globe from "../../../components/globe";
import Image from "next/image";
import Footer from "../../../components/footer";

function DigitalFootprint() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // High DPI handling
        const dpr = window.devicePixelRatio || 1;
        let width = canvas.width = window.innerWidth * dpr;
        let height = canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        // Configuration
        const config = {
            particleCount: 120,
            types: ['email', 'ip', 'hash', 'credential'],
            colors: {
                email: '#FF2A6D',
                ip: '#05D9E8',
                hash: '#D300C5',
                credential: '#00FFEA'
            }
        };

        class DataParticle {
            constructor() {
                this.type = config.types[Math.floor(Math.random() * config.types.length)];
                this.reset();
                this.size = 2 + Math.random() * 3;
                this.speed = 0.5 + Math.random() * 2;
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 100;
                this.alpha = 0.1 + Math.random() * 0.5;
            }

            update() {
                this.y -= this.speed;
                if (this.y < -10) this.reset();
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${config.colors[this.type]}${Math.floor(this.alpha * 255).toString(16).padStart(2, '0')}`;
                ctx.fill();
            }
        }

        const particles = Array.from({length: config.particleCount}, () => new DataParticle());

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(13, 13, 16, 0.8)');
            gradient.addColorStop(1, 'rgba(13, 13, 16, 0.2)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth * dpr;
            height = canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10"/>;
}


export default function Page() {
    const [activeTab, setActiveTab] = useState("law");

    return (
        <div>
            <Navbar/>

            {/* Globe background */}
            <div className="relative h-screen w-full">
                <DigitalFootprint/>

                {/* Floating text on top of Globe */}
                <section
                    className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
                    <div className="w-10/12 mx-auto">
                        <h2 className="text-6xl font-light  text-white mb-8 left">
                            Governments
                        </h2>
                        <h3 className="text-2xl font-light text-white mb-4 left">
                            Enhance the state’s cyber defenses
                        </h3>
                        <h5 className="text-xl font-light text-white mb-4 left">
                            StealthMole supports governments in their duty to strengthen
                            national security. With our suite of intelligence products,
                            governments are far more empowered to detect and respond to
                            threats that put the nation’s assets and safety at risk.
                        </h5>
                        <button
                            className={`px-6 py-4 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeTab === "law" ? "bg-[#F33D74] text-white" : "text-white"
                            }`}
                            onClick={() => setActiveTab("law")}
                        >
                            Governments
                        </button>
                    </div>
                </section>
            </div>

            <section className="bg-black text-white py-10 px-6">
                <div className="w-10/12 grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
                    <h2 className="text-heading">
                        Understanding the challenges of Law Enforcement Governments
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p>
                                {" "}
                                State-Sponsored Attacks: Governments face the constant threat of
                                sophisticated cyberattacks orchestrated by state-sponsored
                                actors seeking to compromise sensitive information, disrupt
                                services, or undermine national security.
                            </p>
                        </div>
                        <div>
                            <p>
                                Data Breaches and Information Leaks: The government sector
                                handles vast amounts of sensitive data, making it a prime target
                                for data breaches and information leaks, potentially leading to
                                identity theft, espionage, or compromising the privacy of
                                citizens.
                            </p>
                        </div>
                        <div>
                            <p>
                                Targeted Threats and Cyber Espionage: Government agencies often
                                face targeted threats aimed at accessing classified information,
                                disrupting critical infrastructure, or conducting cyber
                                espionage activities, which require advanced defense mechanisms
                                and intelligence capabilities to detect and mitigate.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="py-16 px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundColor: "#0D0D10", // warna dasar hitam gelap
                    backgroundImage:
                        "radial-gradient(circle at top left, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-light text-white mb-12 text-center">
                        Use Cases
                    </h2>

                    <div className="flex justify-center mb-8">
                        <div className="flex bg-[#0D0D10] rounded-full p-2 gap-2">
                            <button
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeTab === "law" ? "bg-[#F33D74] text-white" : "text-white"
                                }`}
                                onClick={() => setActiveTab("law")}
                            >
                                Threat Monitoring
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeTab === "gov" ? "bg-[#F33D74] text-white" : "text-white"
                                }`}
                                onClick={() => setActiveTab("gov")}
                            >
                                Data Breach Detection
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeTab === "enterprise"
                                        ? "bg-[#F33D74] text-white"
                                        : "text-white"
                                }`}
                                onClick={() => setActiveTab("enterprise")}
                            >
                                Risk Assessment
                            </button>
                        </div>
                    </div>

                    {/* Content based on active tab */}
                    <div className="flex flex-col items-center text-center">
                        {activeTab === "law" && (
                            <>
                                <Image
                                    src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6485ee54cdba2a48dbe7edce_matt-popovich-7mqsZsE6FaU-unsplash.jpg"
                                    alt="Law Enforcement"
                                    width={900}
                                    height={500}
                                    className="rounded-2xl mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-white mb-4">
                                    Threat Monitoring
                                </h3>
                                <p className="text-gray-400 max-w-3xl leading-relaxed">
                                    With real-time monitoring capabilities, governments can use
                                    StealthMole to expand and strengthen their capacity to surveil
                                    threats targeting government systems, infrastructure, and
                                    sensitive data.
                                </p>
                            </>
                        )}

                        {activeTab === "gov" && (
                            <>
                                <Image
                                    src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6485ee66ad4a2634dfaa52f7_sebastian-pichler-bAQH53VquTc-unsplash.jpg"
                                    alt="Law Enforcement"
                                    width={900}
                                    height={500}
                                    className="rounded-2xl mb-4"
                                />

                                <h3 className="text-2xl font-semibold text-white mb-4">
                                    Data Breach Detection
                                </h3>
                                <p className="text-gray-400 max-w-3xl leading-relaxed">
                                    StealthMole enables governments to protect critical data and
                                    infrastructure by alerting them to the first signs that a data
                                    breach has occurred.
                                </p>
                            </>
                        )}

                        {activeTab === "enterprise" && (
                            <>
                                <Image
                                    src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6485ee7025afd798f170a8d9_sean-pollock-PhYq704ffdA-unsplash-p-1080.jpg"
                                    alt="Law Enforcement"
                                    width={900}
                                    height={500}
                                    className="rounded-2xl mb-4"
                                />

                                <h3 className="text-2xl font-semibold text-white mb-4">
                                    Risk Assessment
                                </h3>
                                <p className="text-gray-400 max-w-3xl leading-relaxed">
                                    Governments can use StealthMole to conduct comprehensive risk
                                    assessments to identify vulnerabilities, strengthen security
                                    measures, and safeguard government operations and assets.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <Footer/>
        </div>
    );
}
