'use client'
import Navbar from "../../../components/navbar";
import Globe from "../../../components/globe";
import {useState, useEffect, useRef} from "react";
import {gsap} from 'gsap';
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {useRouter} from "next/navigation";

gsap.registerPlugin(ScrollToPlugin);

export default function LeaksPage() {
    const router = useRouter();
    const [breachData, setBreachData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        total: 0
    });
    const resultsRef = useRef(null);
    const rowsRef = useRef([]);
    const tableRef = useRef(null);
    const [authState, setAuthState] = useState('loading'); // Add auth state
    const [showEmptyAlert, setShowEmptyAlert] = useState(false);

    const handleSearch = async () => {
        if (authState !== 'authenticated') {
            router.push('/login');
            return;
        }

        setIsLoading(true);

        if (breachData.length > 0) {
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

            const response = await fetch(`/api/leaks?q=${searchQuery}&type=breach&page=${pagination.page}&size=${pagination.size}`);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.current_page_data || data.current_page_data.length === 0) {
                setBreachData([]);
                setShowEmptyAlert(true); // Trigger alert kosong
                return;
            } else {
                setShowEmptyAlert(false);
            }

            // Transform API data for LinkedIn scraped data
            const transformedData = data.current_page_data.flatMap(item => {
                return item._source.Data.map(profile => ({
                    email: profile.Email || 'N/A',
                    name: `${profile.FirstName || ''} ${profile.LastName || ''}`.trim() || 'N/A',
                    location: profile.Region || profile.Location || 'N/A',
                    position: profile.Title || profile.JobTitle || 'N/A',
                    company: profile.CompanyName || profile.JobCompanyName || 'N/A',
                    summary: profile.Summary || 'No summary available',
                    source: item._source.Source || 'Unknown',
                    breachDate: "2021 (Scraped)",
                    records: "400M+ records",
                    severity: "Medium" // Since this is scraped public data
                }));
            });


            setBreachData(transformedData);
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
        if (breachData.length > 0 && !isLoading) {

            // Hover effects for rows
            rowsRef.current.forEach(row => {
                row.addEventListener('mouseenter', () => {
                    gsap.to(row, {
                        scale: 1.02,
                        boxShadow: "0 10px 25px -5px rgba(10, 175, 255, 0.3)",
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });

            });
        }
    }, [breachData, isLoading]);

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


    return (
        <div className="relative">
            <Navbar/>

            {/* Hero Section */}
            <div className="relative h-screen w-full">
                <LeaksParticles/>

                <section
                    className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-4">Global Breach Intelligence</h2>
                        <p className="text-xl mb-8 text-gray-300">
                            Search through billions of compromised credentials <br/> from historical data breaches.
                        </p>

                        <div
                            className="flex flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by email, domain, or breach name..."
                                className="input-glass bg-black text-white placeholder-gray-500 border border-gray-700 flex-1 px-4 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#0aafff] focus:border-transparent"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}

                                className={`${isLoading ? 'bg-gray-600 cursor-not-allowed' :
                                    authState !== 'authenticated' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                        'bg-[#0aafff] hover:bg-[#0088cc]'} 
                        text-white px-6 py-2 rounded-lg transition-all duration-300 font-semibold whitespace-nowrap flex items-center justify-center min-w-[120px]`}
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
                                        Querying
                                    </>
                                ) : 'Search Breaches'}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {(breachData.length > 0 || showEmptyAlert) && (
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0f0f15]" ref={resultsRef}>
                    <div className="max-w-7xl mx-auto">
                        <p className="text-sm uppercase text-cyan-500 mb-2 tracking-widest text-center">🔍 Professional
                            Data Exposure</p>
                        <h2 className="text-4xl font-light text-white mb-8 text-center">Scraped Professional
                            Profiles</h2>

                        <div className="overflow-x-auto" ref={tableRef}>
                            <table
                                className="min-w-full bg-gradient-to-br from-[#111215]/90 via-[#1a1b20]/90 to-[#111215]/90 backdrop-blur-lg text-white rounded-xl shadow-2xl font-mono border border-[#2e2e2e] overflow-hidden">
                                <thead>
                                <tr className="text-left border-b border-gray-700 text-gray-400 bg-gradient-to-r from-[#1e1e24] to-[#2a2a32]">
                                    <th className="py-4 px-6">Profile Information</th>
                                    <th className="py-4 px-6">Professional Details</th>
                                    <th className="py-4 px-6">Data Source</th>
                                    <th className="py-4 px-6 text-center">Risk Analysis</th>
                                </tr>
                                </thead>
                                <tbody>
                                {breachData.length > 0 ? (
                                        breachData.map((entry, index) => (
                                            <tr
                                                key={index}
                                                ref={el => rowsRef.current[index] = el}
                                                className="border-b border-gray-800 hover:bg-gradient-to-r from-[#1a1a20] to-[#25252d] transition-all duration-300 group"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center">
                                                    <span
                                                        className="text-xs bg-gradient-to-r from-blue-600 to-blue-800 px-2 py-1 rounded mr-2">👤 Name</span>
                                                            <span
                                                                className="font-medium group-hover:text-blue-300 transition-colors">{entry.name}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                    <span
                                                        className="text-xs bg-gradient-to-r from-purple-600 to-purple-800 px-2 py-1 rounded mr-2">📧 Email</span>
                                                            <span
                                                                className="group-hover:text-purple-300 transition-colors">{entry.email}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                    <span
                                                        className="text-xs bg-gradient-to-r from-green-600 to-green-800 px-2 py-1 rounded mr-2">📍 Location</span>
                                                            <span
                                                                className="group-hover:text-green-300 transition-colors">{entry.location}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">{entry.position}</span>
                                                        </div>
                                                        <div className="text-sm text-gray-300">
                                                            at {entry.company}
                                                        </div>
                                                        <div className="text-xs text-gray-400 line-clamp-2">
                                                            {entry.summary}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="space-y-2">
                                                <span
                                                    className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 text-sm">
                                                    {entry.source}
                                                </span>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Collected: {entry.breachDate}
                                                        </div>
                                                        <span
                                                            className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 text-sm mt-1">
                                                    {entry.records}
                                                </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                        entry.severity === 'Critical' ? 'bg-gradient-to-r from-red-600 to-red-800 text-red-100' :
                                                            entry.severity === 'High' ? 'bg-gradient-to-r from-orange-600 to-orange-800 text-orange-100' :
                                                                'bg-gradient-to-r from-yellow-600 to-yellow-800 text-yellow-100'
                                                    }`}>
                                                    {entry.severity} Risk
                                                </span>
                                                        <button
                                                            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
                                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      strokeWidth={2}
                                                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                            </svg>
                                                            Profile Details
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) :
                                    <tr className="border-b border-gray-800">
                                        <td colSpan="4" className="py-12 px-6 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-16 h-16 mb-4 text-gray-600" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                <h3 className="text-xl font-medium text-gray-300 mb-2">No profiles
                                                    matched your search</h3>
                                                <p className="text-gray-500 max-w-md">
                                                    Try different search terms or check if you have the correct
                                                    permissions to view this data.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                }
                                </tbody>
                            </table>
                            <div className="mt-6 flex justify-between items-center">
                                <p className="text-gray-500 text-sm">
                                    Showing {breachData.length} of {pagination.total} entries (Page {pagination.page})
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
                                        className={`px-4 py-2 text-sm ${pagination.page * pagination.size >= pagination.total ? 'bg-[#0aafff]/50 cursor-not-allowed' : 'bg-[#0aafff] hover:bg-[#0088cc]'} rounded-lg transition-colors`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/*{*/}
            {/*    showEmptyAlert && (*/}
            {/*        <div className="fixed inset-x-0 top-28 z-50">*/}
            {/*            <div*/}
            {/*                className="max-w-md mx-auto bg-[#2a0a1a] border-l-4 border-red-500 text-red-100 p-4 shadow-lg rounded-r-lg animate-fade-in"*/}
            {/*                onAnimationEnd={() => {*/}
            {/*                    const timer = setTimeout(() => setShowEmptyAlert(false), 3000);*/}
            {/*                    return () => clearTimeout(timer);*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <div className="flex items-center">*/}
            {/*                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
            {/*                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>*/}
            {/*                    </svg>*/}
            {/*                    <div>*/}
            {/*                        <p className="font-medium">No results found</p>*/}
            {/*                        <p className="text-sm text-red-300 mt-1">Try different keywords or check your*/}
            {/*                            spelling</p>*/}
            {/*                    </div>*/}
            {/*                    <button*/}
            {/*                        onClick={() => setShowEmptyAlert(false)}*/}
            {/*                        className="ml-auto text-red-300 hover:text-white"*/}
            {/*                    >*/}
            {/*                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
            {/*                                  d="M6 18L18 6M6 6l12 12"/>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    )*/}
            {/*}*/}

        </div>
    );
}

function LeaksParticles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // 1. Setup Canvas Properly
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth * devicePixelRatio;
        let height = canvas.height = window.innerHeight * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);

        // 2. Enhanced Configuration
        const config = {
            particleCount: 100,
            connectionDistance: 150,
            colors: {
                primary: '#ff2a6d',
                secondary: '#05d9e8',
                tertiary: '#d300c5',
                background: 'rgba(10, 10, 20, 0.15)'
            },
            particleTypes: ['email', 'password', 'hash', 'ip']
        };

        // 3. Improved Particle System
        class DataParticle {
            constructor() {
                this.type = config.particleTypes[Math.floor(Math.random() * config.particleTypes.length)];
                this.reset();
                this.velocity = 0.5 + Math.random() * 3;
                this.size = 2 + Math.random() * 4;
                this.char = this.getCharacter();
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            }

            getCharacter() {
                switch (this.type) {
                    case 'email':
                        return '@';
                    case 'password':
                        return '•';
                    case 'ip':
                        return Math.floor(Math.random() * 10);
                    default:
                        return String.fromCharCode(
                            Math.random() > 0.5
                                ? 48 + Math.floor(Math.random() * 10)
                                : 97 + Math.floor(Math.random() * 26)
                        );
                }
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 100;
                this.alpha = 0.1 + Math.random() * 0.9;
                this.targetX = this.x + (Math.random() - 0.5) * 50;
            }

            update() {
                // Smooth movement
                this.x += (this.targetX - this.x) * 0.05;
                this.y -= this.velocity;
                this.rotation += this.rotationSpeed;

                if (this.y < -20) this.reset();
                if (Math.random() < 0.01) this.char = this.getCharacter();
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                ctx.font = `${this.size}px 'Fira Code', monospace`;
                ctx.fillStyle = this.type === 'email'
                    ? `rgba(255, 42, 109, ${this.alpha})`
                    : `rgba(5, 217, 232, ${this.alpha})`;

                ctx.fillText(this.char, 0, 0);
                ctx.restore();
            }
        }

        // 4. Enhanced Network Nodes
        class NetworkNode {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseSize = 3 + Math.random() * 5;
                this.pulseSpeed = 0.01 + Math.random() * 0.05;
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.connections = [];
            }

            update() {
                this.pulsePhase += this.pulseSpeed;
                this.connections = [];
            }

            draw() {
                const pulseSize = this.baseSize * (1 + Math.sin(this.pulsePhase) * 0.7);

                // Glow effect
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, pulseSize * 4
                );
                gradient.addColorStop(0, config.colors.secondary);
                gradient.addColorStop(1, 'rgba(5, 217, 232, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 4, 0, Math.PI * 2);
                ctx.fill();

                // Core dot
                ctx.fillStyle = config.colors.primary;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 5. Initialize Particles with Better Distribution
        const particles = {
            data: Array.from({length: config.particleCount}, () => new DataParticle()),
            nodes: Array.from({length: 15}, (_, i) => {
                const node = new NetworkNode();
                // Distribute nodes more evenly
                node.x = width * (0.1 + 0.8 * (i % 5) / 4);
                node.y = height * (0.1 + 0.8 * Math.floor(i / 5) / 2);
                return node;
            })
        };

        // 6. Improved Connection Drawing
        function drawConnections() {
            particles.nodes.forEach(node => {
                particles.data.forEach(particle => {
                    const dx = node.x - particle.x;
                    const dy = node.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionDistance) {
                        const opacity = 0.3 * (1 - distance / config.connectionDistance);
                        ctx.strokeStyle = `rgba(210, 0, 197, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(particle.x, particle.y);
                        ctx.stroke();
                    }
                });
            });
        }

        // 7. Robust Animation Loop
        let animationFrame;
        let lastTime = 0;
        const fps = 60;
        const interval = 1000 / fps;

        function animate(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const delta = timestamp - lastTime;

            if (delta > interval) {
                ctx.fillStyle = config.colors.background;
                ctx.fillRect(0, 0, width, height);

                drawConnections();

                particles.data.forEach(p => p.update());
                particles.nodes.forEach(n => n.update());

                particles.nodes.forEach(n => n.draw());
                particles.data.forEach(p => p.draw());

                lastTime = timestamp - (delta % interval);
            }

            animationFrame = requestAnimationFrame(animate);
        }

        animationFrame = requestAnimationFrame(animate);

        // 8. Proper Cleanup
        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
            style={{
                transform: 'translateZ(0)',
                willChange: 'transform'
            }}
        />
    );
}



