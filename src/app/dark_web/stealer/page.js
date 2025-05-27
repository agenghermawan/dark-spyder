'use client'
import {Suspense, useState, useEffect, useRef} from "react";
import {gsap} from 'gsap';
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import Navbar from "../../../components/navbar";
import Globe from "../../../components/globe";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import {useSearchParams} from "next/navigation"; // Create this component
import {useRouter} from 'next/navigation'; // ✅ Benar untuk App Router


gsap.registerPlugin(ScrollToPlugin, MotionPathPlugin);

// Wrap the main component with Suspense
export default function Page() {

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <StealerPageContent/>
        </Suspense>
    );
}

function StealerPageContent() {
    const router = useRouter();
    const [stealerData, setStealerData] = useState([]);
    const [domain, setDomain] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        total: 0
    });
    const resultsRef = useRef(null);
    const rowsRef = useRef([]);
    const tableRef = useRef(null);
    const [authState, setAuthState] = useState('loading');
    const [showEmptyAlert, setShowEmptyAlert] = useState(false);

    const handleSearch = async () => {
        if (authState === 'loading') {
            console.log("Waiting for auth state...");
            return;
        }

        if (authState !== 'authenticated') {
            router.push('/login');
            return;
        }

        setIsLoading(true);

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
            await loadNewData();
        }
    };

    const loadNewData = async () => {
        try {
            setIsLoading(true);
            setStealerData([]);
            const response = await fetch(`/api/proxy?q=${domain}&type=stealer&page=${pagination.page}&size=${pagination.size}`);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.current_page_data || data.current_page_data.length === 0) {
                setStealerData([]);
                setShowEmptyAlert(true);
                return;
            } else {
                setShowEmptyAlert(false);
            }

            const transformedData = data.current_page_data.map(item => ({
                password: item._source?.password || 'N/A',
                origin: item._source?.domain || 'N/A',
                email: item._source?.username || 'N/A',
                source: item._source?.threatintel || 'Unknown',
                lastBreach: "N/A",
                checksum: item._source?.Checksum || 'N/A'
            }));

            setStealerData(transformedData);
            setPagination(prev => ({
                ...prev,
                total: data.total || 0
            }));

        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setIsLoading(false);

            setTimeout(() => {
                if (resultsRef.current) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {y: resultsRef.current, offsetY: 50},
                        ease: "power3.out"
                    });
                }
            }, 100);
        }
    };

    const handlePagination = (direction) => {
        if (direction === 'prev' && pagination.page > 1) {
            setPagination(prev => ({...prev, page: prev.page - 1}));
        } else if (direction === 'next' && pagination.page * pagination.size < pagination.total) {
            setPagination(prev => ({...prev, page: prev.page + 1}));
        }
    };

    useEffect(() => {
        if (pagination.page !== 1) {
            loadNewData();
        }
    }, [pagination.page]);

    useEffect(() => {
        const handleMouseEnter = (row) => {
            gsap.to(row, {
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(240, 50, 98, 0.3)",
                duration: 0.3,
                ease: "power2.out"
            });
        };

        if (stealerData.length > 0 && !isLoading) {
            rowsRef.current.forEach(row => {
                if (row) {
                    row.addEventListener('mouseenter', () => handleMouseEnter(row));
                }
            });
        }

        return () => {
            rowsRef.current.forEach(row => {
                if (row) {
                    row.replaceWith(row.cloneNode(true));
                }
            });
        };
    }, [stealerData, isLoading]);

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

    const searchParams = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setDomain(query);
            setPagination(prev => ({...prev, page: 1}));

            if (authState === 'authenticated') {
                setTimeout(() => handleSearch(), 100);
            }
        }
    }, [searchParams, authState]);


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

                        <div
                            className="flex flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden w-full">
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
                                className={`${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#f03262] hover:bg-[#c91d4e]'} text-white px-6 py-2 rounded-lg transition-all duration-300 font-semibold whitespace-nowrap flex items-center justify-center min-w-[120px] hover:cursor-pointer`}
                            >
                                {authState !== 'authenticated' ? (
                                    'Login to Search'
                                ) : isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Scanning
                                    </>
                                ) : 'Initiate Recon'}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {stealerData.length > 0 && (
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0f0f10]" ref={resultsRef}>
                    <div className="max-w-7xl mx-auto">
                        <p className="text-sm uppercase text-green-500 mb-2 tracking-widest text-center">🧠 Threat Intel
                            Extract</p>
                        <h2 className="text-4xl font-light text-white mb-8 text-center">Compromised Credentials</h2>

                        <div className="overflow-x-auto" ref={tableRef}>
                            <table
                                className="min-w-full bg-gradient-to-br from-[#111215]/90 via-[#1a1b20]/90 to-[#111215]/90 backdrop-blur-lg text-white rounded-xl shadow-2xl font-mono border border-[#2e2e2e] overflow-hidden">
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
                                                    <span
                                                        className="text-xs bg-gradient-to-r from-purple-600 to-purple-800 px-2 py-1 rounded mr-2">🧬 pass</span>
                                                    <span
                                                        className="font-medium group-hover:text-purple-300 transition-colors">{entry.password}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span
                                                        className="text-xs bg-gradient-to-r from-blue-600 to-blue-800 px-2 py-1 rounded mr-2">🌐 origin</span>
                                                    <span
                                                        className="group-hover:text-blue-300 transition-colors">{entry.origin}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span
                                                        className="text-xs bg-gradient-to-r from-green-600 to-green-800 px-2 py-1 rounded mr-2">📧 identity</span>
                                                    <span
                                                        className="group-hover:text-green-300 transition-colors">{entry.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 text-sm">
                                                {entry.source}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${entry.lastBreach === "N/A" ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400' : 'bg-gradient-to-r from-red-700 to-red-800 text-red-100'}`}>
                                                {entry.lastBreach}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                                                <button
                                                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
                                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                    </svg>
                                                    Extract Logs
                                                </button>
                                                <button
                                                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
                                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
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
                                <p className="text-gray-500 text-sm">
                                    Showing {stealerData.length} of {pagination.total} entries (Page {pagination.page})
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePagination('prev')}
                                        disabled={pagination.page === 1}
                                        className={`px-4 py-2 text-sm ${pagination.page === 1 ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'} rounded-lg transition-colors`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePagination('next')}
                                        disabled={pagination.page * pagination.size >= pagination.total}
                                        className={`px-4 py-2 text-sm ${pagination.page * pagination.size >= pagination.total ? 'bg-[#f03262]/50 cursor-not-allowed' : 'bg-[#f03262] hover:bg-[#c91d4e]'} rounded-lg transition-colors`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}


            {
                showEmptyAlert && (
                    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0f0f10]" ref={resultsRef}>
                        <div className="max-w-7xl mx-auto">
                            <p className="text-sm uppercase text-green-500 mb-2 tracking-widest text-center">🧠 Threat Intel
                                Extract</p>
                            <h2 className="text-4xl font-light text-white mb-8 text-center">Compromised Credentials</h2>

                            <div className="overflow-x-auto" ref={tableRef}>
                                <table
                                    className="min-w-full bg-gradient-to-br from-[#111215]/90 via-[#1a1b20]/90 to-[#111215]/90 backdrop-blur-lg text-white rounded-xl shadow-2xl font-mono border border-[#2e2e2e] overflow-hidden">
                                    <thead>
                                    <tr className="text-left border-b border-gray-700 text-gray-400 bg-gradient-to-r from-[#1e1e24] to-[#2a2a32]">
                                        <th className="py-4 px-6">Exposed Data</th>
                                        <th className="py-4 px-6">Intel Source</th>
                                        <th className="py-4 px-6">Last Seen in Dump</th>
                                        <th className="py-4 px-6 text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="border-b border-gray-800">
                                        <td colSpan="4" className="py-8 px-6 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-12 h-12 mb-4 text-gray-600" fill="none"
                                                     stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                <p className="text-lg font-medium">No compromised credentials found</p>
                                                <p className="text-sm mt-1">Try searching with different keyword</p>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>


                )
            }
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
            data: Array.from({length: config.particleCount / 2}, () => new DataParticle()),
            nodes: Array.from({length: config.particleCount / 4}, () => new NetworkNode())
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