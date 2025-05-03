"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import Globe from "@/components/globe";
import Image from "next/image";

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
      <Navbar />

      {/* Globe background */}
      <div className="relative h-screen w-full">
        <DataConnections />

        {/* Floating text on top of Globe */}
        <section className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
          <div className="w-10/12 mx-auto">
            <h2 className="text-6xl font-light  text-white mb-8 left">
              StealthMole for Law Enforcement <br /> Agencies
            </h2>
            <h3 className="text-2xl font-light text-white mb-4 left">
              Crack down on criminal activity and conduct web investigations
              with ease
            </h3>
            <h5 className="text-xl font-light text-white mb-4 left">
              StealthMole offers a comprehensive suite of solutions to address
              the challenges faced by Law Enforcement Agencies, empowering them
              to effectively carry out their duty to protect and save lives
            </h5>
            <button
              className={`px-6 py-4 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "law" ? "bg-[#F33D74] text-white" : "text-white"
              }`}
              onClick={() => setActiveTab("law")}
            >
              Law Enforcement Agencies
            </button>
          </div>
        </section>
      </div>

      <section className="bg-black text-white py-10 px-6">
        <div className="w-10/12 grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
          <h2 className="text-heading">
            Understanding the challenges of Law Enforcement Agencies
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Digital Footprint Expansion
              </h3>
              <p>
                Criminal activities have migrated to the digital realm,
                requiring LEAs to adapt and effectively investigate crimes
                conducted through online platforms, communication channels, and
                the dark web.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Anonymity and Encryption
              </h3>
              <p>
                Perpetrators often leverage anonymization tools and encrypted
                communication methods, making it challenging for LEAs to
                identify and track criminals involved in illicit activities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Data Overload and Analysis
              </h3>
              <p>
                The vast amount of digital data available poses a significant
                challenge for LEAs to efficiently process, analyze, and extract
                actionable intelligence from various sources, hindering
                effective investigations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Threat Detection and Mitigation
              </h3>
              <p>
                LEAs need proactive tools to identify and respond to emerging
                threats, cybercrimes, and criminal networks, enhancing their
                ability to prevent and mitigate potential harm.
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
                Digital Investigation
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "gov" ? "bg-[#F33D74] text-white" : "text-white"
                }`}
                onClick={() => setActiveTab("gov")}
              >
                Suspect Hunting
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "enterprise"
                    ? "bg-[#F33D74] text-white"
                    : "text-white"
                }`}
                onClick={() => setActiveTab("enterprise")}
              >
                Threat Detection and Response
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
                  Digital Investigation
                </h3>
                <p className="text-gray-400 max-w-3xl leading-relaxed">
                  StealthMole provides LEAs with the investigation tools they
                  need to effectively collect, analyze, and draw insights from
                  the vast amount of data in the dark web
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
                  Suspect Hunting
                </h3>
                <p className="text-gray-400 max-w-3xl leading-relaxed">
                  StealthMole enables LEAs to efficiently cover more ground and
                  gather more leads to track down criminals.
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
                  Threat Detection and Response
                </h3>
                <p className="text-gray-400 max-w-3xl leading-relaxed">
                  StealthMole enables LEAs to detect potential threats as soon
                  as they emerge. Equipped with the right intelligence, LEAs can
                  then swiftly take action.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section
        className="relative bg-[#0D0D10] overflow-hidden"
        style={{
          backgroundColor: "#0D0D10", // warna dasar hitam gelap
          backgroundImage:
            "radial-gradient(circle at bottom right, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#8a004f]/30" />

        {/* Footer Card */}
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="bg-[#1A1B1E] rounded-2xl px-10 py-16 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">
                Uncover hidden threats with StealthMole
              </h2>
              <p className="text-gray-400 mb-6">
                Talk to us to learn how you can build a solid cyber defense
                strategy today
              </p>
              <button className="bg-[#f33d74] hover:bg-[#e63368] text-white px-6 py-3 rounded-md text-sm font-medium">
                Request demo
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-sm text-gray-400">
              <div>
                <h3 className="text-white font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:underline">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Contact us
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:underline">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Webinars
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Products</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:underline">
                      Darkweb Tracker
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Credential Protection
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Incident Monitoring
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Telegram Tracker
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Sectors</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:underline">
                      Law Enforcement Agencies
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Governments
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Enterprises
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-span-2">
                <h3 className="text-white font-medium mb-4">Get in Touch</h3>
                <p>2 Venture Drive, #09-01 Vision Exchange, Singapore 608526</p>
                <p className="mt-2">sales@stealthmole.com</p>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Image
                  src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6495604fb7188b7b3e3edd45_Logotype.svg"
                  alt="StealthMole"
                  width={80}
                  height={80}
                />

                <span>2025. All rights reserved</span>
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DataConnections() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    let width = canvas.width = window.innerWidth * dpr;
    let height = canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = 3 + Math.random() * 5;
        this.type = Math.random() > 0.5 ? 'source' : 'target';
        this.color = this.type === 'source' ? '#FF2A6D' : '#05D9E8';
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const nodes = Array.from({ length: 30 }, () => new Node());
    const connections = [];

    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type === 'source') {
        for (let j = 0; j < 2; j++) {
          const target = nodes.find(n => n.type === 'target' && !connections.some(c => c.to === n));
          if (target) {
            connections.push({ from: nodes[i], to: target });
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      connections.forEach(conn => {
        const dx = conn.to.x - conn.from.x;
        const dy = conn.to.y - conn.from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Animate connection
        const progress = (Date.now() % 2000) / 2000; // 2 second cycle
        const animX = conn.from.x + dx * progress;
        const animY = conn.from.y + dy * progress;

        // Connection line
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = 'rgba(5, 217, 232, 0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Animated dot
        ctx.beginPath();
        ctx.arc(animX, animY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00FFEA';
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach(node => node.draw());

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

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
}


