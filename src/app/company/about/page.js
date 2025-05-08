"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function SubtleNetworkMesh() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Minimalist configuration
    const nodeCount = Math.min(Math.floor(width / 20), 60); // Fewer nodes
    const maxDistance = Math.min(width / 4, 180); // Shorter connections
    const nodes = [];

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4; // Slower movement
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1 + 1; // Smaller nodes
        this.baseColor = [80, 80, 80]; // Dark gray color
      }

      move() {
        this.x += this.vx;
        this.y += this.vy;

        // Simple boundary check
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.baseColor.join(",")}, 0.6)`;
        ctx.fill();
      }
    }

    // Initialize nodes
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
            const opacity = (1 - distance / maxDistance) * 0.3; // More subtle
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 100, 100, ${opacity})`; // Gray connections
            ctx.lineWidth = opacity * 1;
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      // Clear with solid dark background
      ctx.fillStyle = "rgba(15, 15, 20, 1)";
      ctx.fillRect(0, 0, width, height);

      drawLines();
      nodes.forEach((node) => {
        node.move();
        node.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10"
    />
  );
}

export default function AboutPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0f0f14]">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen w-full">
        <SubtleNetworkMesh />

        {/* Foreground Content */}
        <AnimatePresence>
          {loaded && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 z-10 text-white"
            >
              <div className="max-w-4xl mx-auto space-y-8">
                <Image
                  src="/image/logo.png"
                  alt="Logo"
                  width={400}
                  height={200}
                  className="mx-auto mb-4 rounded-lg invert"
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="space-y-6"
                >
                  <h3 className="text-[16px] font-normal leading-8 text-center">
                    Clandestine is a deep and dark web threat intelligence
                    company that delivers a cloud-based, unified platform for
                    digital investigation, risk assessment, and threat
                    monitoring. Using AI, we provide governments, law
                    enforcement agencies, and enterprises with powerful tools
                    and threat intelligence critical to identifying and
                    eliminating digital risk and criminal activity.
                  </h3>
                  <h3 className="text-[16px] font-normal leading-8 text-center">
                    Our team consists of white hackers, cyber threat analysts,
                    digital forensic experts, and OSINT specialists who have a
                    deep understanding of and extensive experience with cyber
                    crimes.
                  </h3>
                  <h3 className="text-[16px] font-normal leading-8 text-center">
                    Dig deeper into hidden data sources with Clandestine.
                  </h3>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
