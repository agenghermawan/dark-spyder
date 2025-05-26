'use client';
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import {useState, useRef, useEffect} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {
    FingerPrintIcon,
    GlobeAltIcon,
    CodeBracketIcon,
    CloudArrowUpIcon,
    ServerIcon,
    ArrowPathIcon,
    ChartBarIcon,
    BoltIcon
} from '@heroicons/react/24/outline';
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Vulnerabilities() {
    const [activeTab, setActiveTab] = useState('web');
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const statsRef = useRef(null);
    const ctaRef = useRef(null);


    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar/>

            {/* Hero Section */}
            <section
                ref={heroRef}
                className="relative h-screen w-full bg-gradient-to-b from-black to-gray-900 overflow-hidden"
            >
                <div className="absolute inset-0 flex items-center justify-center px-6 z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-[#f03262] font-mono text-sm tracking-widest mb-4 inline-block">
                            VULNERABILITY INTELLIGENCE
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f03262]">
                            Zero-Day Protection
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                            Proactively discover and remediate security flaws before attackers can exploit them
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                className="bg-[#f03262] hover:bg-[#d82a56] text-white px-8 py-4 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[#f03262]/30">
                                Request Demo
                            </button>
                            <button
                                className="border border-[#f03262] text-[#f03262] hover:bg-[#f03262]/10 px-8 py-4 rounded-lg font-medium transition-all">
                                View Vulnerability Database
                            </button>
                        </div>
                    </div>
                </div>

                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-[#f03262]"
                            style={{
                                width: Math.random() * 10 + 5 + 'px',
                                height: Math.random() * 10 + 5 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                                animationDelay: Math.random() * 5 + 's'
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* Vulnerability Types Section */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[#f03262] font-mono text-sm tracking-widest">THREAT COVERAGE</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
                            Comprehensive Vulnerability Detection
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#f03262] to-[#d82a56] mx-auto mt-6"></div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-12">
                        <div
                            className="inline-flex bg-gray-900 rounded-full p-1 border border-gray-800 shadow-lg shadow-[#f03262]/10">
                            {['web', 'api', 'cloud', 'network'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                                        activeTab === tab
                                            ? 'bg-gradient-to-r from-[#f03262] to-[#d82a56] text-white shadow-lg'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {tab === 'web' && 'Web Apps'}
                                    {tab === 'api' && 'APIs'}
                                    {tab === 'cloud' && 'Cloud'}
                                    {tab === 'network' && 'Network'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                id: 'web',
                                icon: <CodeBracketIcon className="w-10 h-10 text-[#f03262]"/>,
                                title: 'Web Application',
                                description: 'Detect OWASP Top 10 vulnerabilities including XSS, SQLi, CSRF, and more',
                                stats: ['10,000+ web templates', '95% detection rate', '<5% false positives']
                            },
                            {
                                id: 'api',
                                icon: <ServerIcon className="w-10 h-10 text-[#f03262]"/>,
                                title: 'API Security',
                                description: 'Identify broken authentication, excessive data exposure, and misconfigurations',
                                stats: ['REST & GraphQL support', 'Automated fuzzing', 'Business logic flaws']
                            },
                            {
                                id: 'cloud',
                                icon: <CloudArrowUpIcon className="w-10 h-10 text-[#f03262]"/>,
                                title: 'Cloud Infrastructure',
                                description: 'Find IAM misconfigurations, exposed storage, and vulnerable containers',
                                stats: ['AWS/Azure/GCP coverage', 'CIS benchmark checks', 'Infra-as-code scanning']
                            },
                            {
                                id: 'network',
                                icon: <GlobeAltIcon className="w-10 h-10 text-[#f03262]"/>,
                                title: 'Network Services',
                                description: 'Uncover vulnerable services, open ports, and protocol weaknesses',
                                stats: ['2000+ CVEs covered', 'Zero-day detection', 'Live attack simulation']
                            }
                        ].map((item) => (
                            <div
                                key={item.id}
                                className={`border rounded-xl p-8 transition-all ${
                                    activeTab === item.id
                                        ? 'border-[#f03262] bg-gray-800/50 shadow-lg shadow-[#f03262]/20'
                                        : 'border-gray-800 hover:border-[#f03262] hover:bg-gray-800/30'
                                }`}
                            >
                                <div className="flex items-center mb-6">
                                    <div className="p-3 rounded-lg bg-gray-800 mr-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                </div>
                                <p className="text-gray-300 mb-6">{item.description}</p>
                                <ul className="space-y-3">
                                    {item.stats.map((stat, i) => (
                                        <li key={i} className="flex items-center text-gray-400">
                                            <BoltIcon className="w-4 h-4 text-[#f03262] mr-2"/>
                                            {stat}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                ref={featuresRef}
                className="py-20 bg-black px-6 border-t border-gray-800"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[#f03262] font-mono text-sm tracking-widest">OUR TECHNOLOGY</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
                            Advanced Vulnerability Scanning
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FingerPrintIcon className="w-10 h-10 text-[#f03262]"/>,
                                title: "Signature-less Detection",
                                description: "Our behavioral analysis engine identifies zero-day vulnerabilities without relying on known signatures",
                                highlight: "Reduces false negatives by 40%"
                            },
                            {
                                icon: <ArrowPathIcon className="w-10 h-10 text-[#f03262]"/>,
                                title: "Continuous Monitoring",
                                description: "Automatically rescans your assets when new vulnerabilities are discovered",
                                highlight: "Real-time alerting"
                            },
                            {
                                icon: <ChartBarIcon className="w-10 h-10 text-[#f03262]"/>,
                                title: "Risk Prioritization",
                                description: "AI-powered scoring system helps focus on the most critical vulnerabilities first",
                                highlight: "EPSS + CVSS integration"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-[#f03262] transition-all hover:shadow-lg hover:shadow-[#f03262]/10"
                            >
                                <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-300 mb-5">{feature.description}</p>
                                <div
                                    className="text-sm px-3 py-2 bg-[#f03262]/10 text-[#f03262] rounded-md inline-block">
                                    {feature.highlight}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section
                ref={statsRef}
                className="py-20 bg-gradient-to-b from-black to-gray-900 px-6"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            {value: "10M+", label: "Vulnerabilities Detected"},
                            {value: "99.7%", label: "Scan Accuracy"},
                            {value: "24/7", label: "Monitoring"},
                            {value: "200+", label: "Integrations"}
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="stat-item text-center p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-[#f03262] transition-all"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-[#f03262] mb-3">
                                    {stat.value}
                                </div>
                                <div className="text-gray-300 text-sm uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                ref={ctaRef}
                className="py-32 px-6 bg-gradient-to-r from-gray-900 to-black"
            >
                <div className="max-w-4xl mx-auto text-center bg-gray-900 border border-gray-800 rounded-2xl p-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to uncover your hidden vulnerabilities?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Our security experts will demonstrate how our platform can help protect your digital assets
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            className="bg-[#f03262] hover:bg-[#d82a56] text-white px-8 py-4 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[#f03262]/30">
                            Request Demo
                        </button>
                        <button
                            className="border border-[#f03262] text-[#f03262] hover:bg-[#f03262]/10 px-8 py-4 rounded-lg font-medium transition-all">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            <footer className="bg-[#0D0D10] border-t border-gray-800">
                {/* Main Container */}
                <div className="max-w-7xl mx-auto px-6 py-16">

                    {/* Content Grid - New Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {/* Brand Column */}
                        <div className="md:col-span-3">
                            <div className="flex items-center mb-6">
                                <Image
                                    src="/image/logo.png"
                                    alt="Clandestine"
                                    width={120}
                                    height={48}
                                    className="invert"
                                />
                            </div>
                            <p className="text-gray-400 text-sm">
                                AI-powered dark web intelligence platform protecting your digital assets
                            </p>
                        </div>

                        {/* Navigation - Same Categories */}
                        <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-8">
                            {/* Company - Same wording */}
                            <div>
                                <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Company</h3>
                                <ul className="space-y-3">
                                    {['About', 'Contact us'].map((item) => (
                                        <li key={item}>
                                            <a href="#"
                                               className="text-gray-400 hover:text-[#f33d74] text-sm transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Products - Same wording */}
                            <div>
                                <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Products</h3>
                                <ul className="space-y-3">
                                    {['Database Stealer', 'Database Leaks'].map((item) => (
                                        <li key={item}>
                                            <a href="#"
                                               className="text-gray-400 hover:text-[#f33d74] text-sm transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sectors - Same wording */}
                            <div>
                                <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Sectors</h3>
                                <ul className="space-y-3">
                                    {['Law Enforcement Agencies', 'Governments', 'Enterprises'].map((item) => (
                                        <li key={item}>
                                            <a href="#"
                                               className="text-gray-400 hover:text-[#f33d74] text-sm transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar - Same wording */}
                    <div
                        className="border-t border-gray-800 mt-16 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center">
          <span className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 Clandestine Project. All rights reserved
          </span>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-500 hover:text-[#f33d74] text-sm transition-colors">
                                Terms & Conditions
                            </a>
                            <a href="#" className="text-gray-500 hover:text-[#f33d74] text-sm transition-colors">
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
