"use client";

import {useEffect, useRef, useState} from "react";
import Navbar from "../../../components/navbar";
import Globe from "../../../components/globe";
import Image from "next/image";
import Footer from "../../../components/footer";

function NetworkMesh() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const nodes = [];
        const nodeCount = 80;
        const maxDistance = 150;

        class Node {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = 2;
            }

            move() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#ff7a9c"; // Neon Cyan
                ctx.fill();
            }
        }

        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }

        function drawLines() {
            for (let a = 0; a < nodes.length; a++) {
                for (let b = a + 1; b < nodes.length; b++) {
                    const dx = nodes[a].x - nodes[b].x;
                    const dy = nodes[a].y - nodes[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 234, ${
                            1 - distance / maxDistance
                        })`; // Fade based on distance
                        ctx.moveTo(nodes[a].x, nodes[a].y);
                        ctx.lineTo(nodes[b].x, nodes[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            nodes.forEach((node) => {
                node.move();
                node.draw();
            });
            drawLines();
            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full -z-10"
        />
    );
}

export default function Page() {
    const [activeTab, setActiveTab] = useState("law");

    return (
        <div>
            <Navbar/>

            {/* Globe background */}
            <div className="relative h-screen w-full">
                <RadarScan/>

                {/* Floating text on top of Globe */}
                <section
                    className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
                    <div className="w-10/12 mx-auto">
                        <h2 className="text-6xl font-light  text-white mb-8 left">
                            Enterprises
                        </h2>
                        <h3 className="text-2xl font-light text-white mb-4 left">
                            Mitigate risk and secure corporate assets
                        </h3>
                        <h5 className="text-xl font-light text-white mb-4 left">
                            StealthMole equips enterprises with the threat intelligence
                            necessary to detect and mitigate cyber threats.
                        </h5>
                        <button
                            className={`px-6 py-4 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeTab === "law" ? "bg-[#F33D74] text-white" : "text-white"
                            }`}
                            onClick={() => setActiveTab("law")}
                        >
                            Enterprises
                        </button>
                    </div>
                </section>
            </div>

            <section className="bg-black text-white py-10 px-6">
                <div className="w-10/12 grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
                    <h2 className="text-heading">
                        Understanding the challenges of Law Enforcement Enteprises
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p>
                                Evolving Cyber Threat Landscape: Enterprises operate in a
                                constantly evolving cybersecurity landscape, where threats such
                                as ransomware attacks, phishing campaigns, and insider threats
                                pose significant risks to business continuity, customer trust,
                                and data security.
                            </p>
                        </div>
                        <div>
                            <p>
                                Data Loss Prevention: Organizations face the challenge of
                                mitigating insider threats, whether intentional or
                                unintentional, to prevent data breaches, intellectual property
                                theft, or unauthorized disclosure of sensitive information,
                                necessitating proactive monitoring and protection mechanisms.
                            </p>
                        </div>
                        <div>
                            <p>
                                Compliance and Regulatory Requirements: Enterprises must
                                navigate a complex web of regulatory requirements and industry
                                standards to ensure compliance and protect sensitive customer
                                data, requiring robust security measures, incident response
                                capabilities, and continuous monitoring.
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
                                End User Protection
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeTab === "gov" ? "bg-[#F33D74] text-white" : "text-white"
                                }`}
                                onClick={() => setActiveTab("gov")}
                            >
                                Compliance and Reporting
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
                                    End User Protection
                                </h3>
                                <p className="text-gray-400 max-w-3xl leading-relaxed">
                                    StealthMole helps enterprises safeguard their end users'
                                    sensitive information with advanced credential leak detection
                                    capabilities.
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
                                    Compliance and Reporting
                                </h3>
                                <p className="text-gray-400 max-w-3xl leading-relaxed">
                                    StealthMole provides enterprises with the tools they need to
                                    adhere to data protection policies, as well as generate timely
                                    and accurate reports regarding data security.
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
                                    StealthMole provides enterprises with extensive visibility
                                    into the dark web, allowing a more comprehensive assessment of
                                    risks and vulnerabilities.
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


function RadarScan() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const dpr = window.devicePixelRatio || 1;
        let width = canvas.width = window.innerWidth * dpr;
        let height = canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        let scanAngle = 0;
        const center = {x: width / 2, y: height / 2};
        const radius = Math.min(width, height) * 0.4;

        // Threat dots
        const threats = Array.from({length: 15}, () => ({
            angle: Math.random() * Math.PI * 2,
            distance: Math.random() * radius * 0.8,
            size: 2 + Math.random() * 4
        }));

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Radar base
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(5, 217, 232, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Radar circles
            for (let i = 1; i <= 3; i++) {
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius * i / 3, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(5, 217, 232, ${0.1 + i * 0.1})`;
                ctx.stroke();
            }

            // Radar scan line
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(
                center.x + Math.cos(scanAngle) * radius,
                center.y + Math.sin(scanAngle) * radius
            );
            ctx.strokeStyle = 'rgba(255, 42, 109, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Threats
            threats.forEach(t => {
                const x = center.x + Math.cos(t.angle) * t.distance;
                const y = center.y + Math.sin(t.angle) * t.distance;

                // Only show threats in front of scan line
                if (Math.abs(scanAngle - t.angle) < 0.2 ||
                    Math.abs(scanAngle - t.angle + Math.PI * 2) < 0.2) {
                    ctx.beginPath();
                    ctx.arc(x, y, t.size, 0, Math.PI * 2);
                    ctx.fillStyle = '#FF2A6D';
                    ctx.fill();
                }
            });

            scanAngle = (scanAngle + 0.01) % (Math.PI * 2);
            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth * dpr;
            height = canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            center.x = width / 2;
            center.y = height / 2;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10 opacity-70"/>;
}
