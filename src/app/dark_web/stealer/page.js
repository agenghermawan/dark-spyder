'use client'
import Navbar from "@/components/navbar";
import Globe from "@/components/globe";
import {useState, useEffect, useRef} from "react";
import {gsap} from 'gsap';
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollToPlugin, MotionPathPlugin);

export default function Page() {
    const [stealerData, setStealerData] = useState([]);
    const [domain, setDomain] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const resultsRef = useRef(null);
    const rowsRef = useRef([]);
    const tableRef = useRef(null);

    const handleSearch = () => {
        setIsLoading(true);

        // Clear previous data with fade out animation
        if (stealerData.length > 0) {
            gsap.to(rowsRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.4,
                stagger: 0.05,
                ease: "power2.in",
                onComplete: () => {
                    loadNewData();
                }
            });
        } else {
            loadNewData();
        }
    };

    const loadNewData = () => {
        // Simulate API call
        setTimeout(() => {
            setStealerData([
                {
                    password: "Xav08312",
                    origin: "login.microsoftonline.com",
                    email: "gilang.topani@bssn.go.id",
                    source: "Stealer Logs",
                    lastBreach: "N/A",
                },
                {
                    password: "sukabangetaessbox",
                    origin: "mail.bssn.go.id",
                    email: "novita.angraini@bssn.go.id",
                    source: "Stealer Logs",
                    lastBreach: "N/A",
                },
                {
                    password: "sispk",
                    origin: "akses-sispk.bsn.go.id",
                    email: "35-04_dedy.septono@bssn.go.id",
                    source: "Stealer Logs",
                    lastBreach: "N/A",
                },
            ]);
            setIsLoading(false);

            // Scroll to results
            setTimeout(() => {
                if (resultsRef.current) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {y: resultsRef.current, offsetY: 50},
                        ease: "power3.out"
                    });
                }
            }, 100);
        }, 800); // Simulated network delay
    };

    useEffect(() => {
        if (stealerData.length > 0 && !isLoading) {
            // Table entrance animation
            gsap.from(tableRef.current, {
                opacity: 0,
                scale: 0.98,
                duration: 0.8,
                ease: "power3.out"
            });

            // Row animations
            gsap.from(rowsRef.current, {
                opacity: 0,
                x: -30,
                duration: 0.6,
                stagger: {
                    amount: 0.4,
                    from: "random"
                },
                ease: "back.out(1.2)"
            });

            // Hover effects for rows
            rowsRef.current.forEach(row => {
                row.addEventListener('mouseenter', () => {
                    gsap.to(row, {
                        scale: 1.02,
                        boxShadow: "0 10px 25px -5px rgba(240, 50, 98, 0.3)",
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                row.addEventListener('mouseleave', () => {
                    gsap.to(row, {
                        scale: 1,
                        boxShadow: "none",
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });
        }
    }, [stealerData, isLoading]);

    return (
        <div>
            <Navbar/>

            {/* Globe background */}
            <div className="relative h-screen w-full">
                <CyberParticles/>

                {/* Floating text on top of Globe */}
                <section
                    className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-4">Uncover Hidden Threats</h2>
                        <p className="text-xl mb-8 text-gray-300">
                            Run recon on exposed credentials <br/> across the darknet using breach intelligence.
                        </p>

                        <div className="flex flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden w-full">
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="Target domain for recon..."
                                className="input-glass bg-black text-white placeholder-gray-500 border border-gray-700 flex-1 px-4 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className={`${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#f03262] hover:bg-[#c91d4e]'} text-white px-6 py-2 rounded-lg transition-all duration-300 font-semibold whitespace-nowrap flex items-center justify-center min-w-[120px]`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Scanning
                                    </>
                                ) : 'Initiate Recon'}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Results Section */}
            {stealerData.length > 0 && (
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0f0f10]" ref={resultsRef}>
                    <div className="max-w-7xl mx-auto">
                        <p className="text-sm uppercase text-green-500 mb-2 tracking-widest text-center">🧠 Threat Intel Extract</p>
                        <h2 className="text-4xl font-light text-white mb-8 text-center">Compromised Credentials</h2>

                        <div className="overflow-x-auto" ref={tableRef}>
                            <table className="min-w-full bg-gradient-to-br from-[#111215]/90 via-[#1a1b20]/90 to-[#111215]/90 backdrop-blur-lg text-white rounded-xl shadow-2xl font-mono border border-[#2e2e2e] overflow-hidden">
                                <thead>
                                <tr className="text-left border-b border-gray-700 text-gray-400 bg-gradient-to-r from-[#1e1e24] to-[#2a2a32]">
                                    <th className="py-4 px-6">Exposed Data</th>
                                    <th className="py-4 px-6">Intel Source</th>
                                    <th className="py-4 px-6">Last Seen in Dump</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stealerData.map((entry, index) => (
                                    <tr
                                        key={index}
                                        ref={el => rowsRef.current[index] = el}
                                        className="border-b border-gray-800 hover:bg-gradient-to-r from-[#1a1a20] to-[#25252d] transition-all duration-300 group"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <span className="text-xs bg-gradient-to-r from-purple-600 to-purple-800 px-2 py-1 rounded mr-2">🧬 pass</span>
                                                    <span className="font-medium group-hover:text-purple-300 transition-colors">{entry.password}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-xs bg-gradient-to-r from-blue-600 to-blue-800 px-2 py-1 rounded mr-2">🌐 origin</span>
                                                    <span className="group-hover:text-blue-300 transition-colors">{entry.origin}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-xs bg-gradient-to-r from-green-600 to-green-800 px-2 py-1 rounded mr-2">📧 identity</span>
                                                    <span className="group-hover:text-green-300 transition-colors">{entry.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 text-sm">
                                                {entry.source}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${entry.lastBreach === "N/A" ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400' : 'bg-gradient-to-r from-red-700 to-red-800 text-red-100'}`}>
                                                {entry.lastBreach}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                                                <button
                                                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Extract Logs
                                                </button>
                                                <button
                                                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Confirm Breach
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="mt-6 flex justify-between items-center">
                                <p className="text-gray-500 text-sm">Showing {stealerData.length} of 98 entries</p>
                                <div className="flex space-x-2">
                                    <button className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                        Previous
                                    </button>
                                    <button className="px-4 py-2 text-sm bg-[#f03262] hover:bg-[#c91d4e] rounded-lg transition-colors">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

function CyberParticles() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        // Initial setup
        let width = canvas.width = window.innerWidth
        let height = canvas.height = window.innerHeight

        // Configuration
        const config = {
            particleCount: 80,
            connectionDistance: 120,
            colors: {
                primary: '#ff2a6d',
                secondary: '#05d9e8',
                tertiary: '#d300c5'
            }
        }

        // Particle types
        class DataParticle {
            constructor() {
                this.reset()
                this.velocity = 0.5 + Math.random() * 2
                this.size = 2 + Math.random() * 3
                this.char = String.fromCharCode(
                    Math.random() > 0.3
                        ? 48 + Math.floor(Math.random() * 10) // Numbers
                        : 97 + Math.floor(Math.random() * 26) // Letters
                )
            }

            reset() {
                this.x = Math.random() * width
                this.y = height + 20
                this.alpha = 0.1 + Math.random() * 0.9
            }

            update() {
                this.y -= this.velocity
                if (this.y < -20) this.reset()
            }

            draw() {
                ctx.font = `${this.size}px 'Courier New', monospace`
                ctx.fillStyle = `rgba(${
                    Math.random() > 0.7 ? '255, 42, 109' : '5, 217, 232'
                }, ${this.alpha})`
                ctx.fillText(this.char, this.x, this.y)
            }
        }

        class NetworkNode {
            constructor() {
                this.x = Math.random() * width
                this.y = Math.random() * height
                this.baseSize = 2 + Math.random() * 4
                this.pulseSpeed = 0.01 + Math.random() * 0.03
                this.pulsePhase = Math.random() * Math.PI * 2
            }

            update() {
                this.pulsePhase += this.pulseSpeed
            }

            draw() {
                const pulseSize = this.baseSize * (1 + Math.sin(this.pulsePhase) * 0.5)

                // Glow effect
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, pulseSize * 3
                )
                gradient.addColorStop(0, config.colors.secondary)
                gradient.addColorStop(1, 'rgba(5, 217, 232, 0)')

                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(this.x, this.y, pulseSize * 3, 0, Math.PI * 2)
                ctx.fill()

                // Core dot
                ctx.fillStyle = config.colors.primary
                ctx.beginPath()
                ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        // Initialize particles
        const particles = {
            data: Array.from({ length: config.particleCount / 2 }, () => new DataParticle()),
            nodes: Array.from({ length: config.particleCount / 4 }, () => new NetworkNode())
        }

        // Connection logic
        function drawConnections() {
            for (let i = 0; i < particles.nodes.length; i++) {
                for (let j = i + 1; j < particles.nodes.length; j++) {
                    const nodeA = particles.nodes[i]
                    const nodeB = particles.nodes[j]

                    const dx = nodeA.x - nodeB.x
                    const dy = nodeA.y - nodeB.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < config.connectionDistance) {
                        const opacity = 1 - (distance / config.connectionDistance)
                        ctx.strokeStyle = `rgba(210, 0, 197, ${opacity * 0.2})`
                        ctx.lineWidth = 0.5
                        ctx.beginPath()
                        ctx.moveTo(nodeA.x, nodeA.y)
                        ctx.lineTo(nodeB.x, nodeB.y)
                        ctx.stroke()
                    }
                }
            }
        }

        // Animation loop
        let animationFrame
        function animate() {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.15)'
            ctx.fillRect(0, 0, width, height)

            // Update and draw particles
            particles.data.forEach(p => {
                p.update()
                p.draw()
            })

            particles.nodes.forEach(n => {
                n.update()
                n.draw()
            })

            drawConnections()

            animationFrame = requestAnimationFrame(animate)
        }

        // Start animation
        animate()

        // Handle resize
        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrame)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
        />
    )
}