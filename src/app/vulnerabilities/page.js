'use client';

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Navbar from "../../components/navbar";

// Utility: Format date to "x days/hours/mins ago"
const formatTimeAgo = (dateString) => {
    if (!dateString) return "-";
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdDate;
    if (isNaN(diffMs)) return "-";
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return `${diffMins} min ago`;
        }
        return `${diffHours} hour ago`;
    }
    return `${diffDays} days ago`;
};

const API_KEY = "cf9452c4-7a79-4352-a1d3-9de3ba517347"; // TODO: Move to env variable if possible!

const VulnerabilityPage = () => {
    const [authState, setAuthState] = useState("loading"); // 'loading' | 'authenticated' | 'unauthenticated'
    const [scanInput, setScanInput] = useState("");
    const [scanResult, setScanResult] = useState(null);
    const [loadingScan, setLoadingScan] = useState(false);
    const [scanError, setScanError] = useState(null);

    const router = useRouter();

    // Check login status on mount
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch("/api/me", {credentials: "include"});
                setAuthState(res.ok ? "authenticated" : "unauthenticated");
            } catch {
                setAuthState("unauthenticated");
            }
        };
        checkLoginStatus();
    }, []);

    // Scan handler
    const handleScan = async () => {
        if (authState !== "authenticated") {
            router.push("/login");
            return;
        }
        setLoadingScan(true);
        setScanError(null);
        setScanResult(null);

        try {
            const params = new URLSearchParams();
            if (scanInput.trim()) params.append("search", scanInput.trim());
            params.append("offset", 0);
            params.append("limit", 100);

            const options = {
                method: "GET",
                headers: {"X-API-Key": API_KEY},
            };

            const url = `https://api.projectdiscovery.io/v1/asset/enumerate/contents?${params.toString()}`;
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            setScanResult(data);
        } catch (err) {
            setScanError(err.message || "Scanning failed.");
        } finally {
            setLoadingScan(false);
        }
    };

    // Render scan result table
    const renderScanTable = () => {
        if (!scanResult?.data || Object.keys(scanResult.data).length === 0) {
            return (
                <table className="min-w-full text-white font-mono border border-[#2e2e2e]">
                    <thead>
                    <tr className="text-left border-b border-gray-700 text-gray-400 bg-gradient-to-r from-[#1e1e24] to-[#2a2a32]">
                        <th className="py-4 px-6 text-center">Asset</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        <th className="py-4 px-6 text-center">IP(s)</th>
                        <th className="py-4 px-6 text-center">ASN</th>
                        <th className="py-4 px-6 text-center">Tech</th>
                        <th className="py-4 px-6 text-center">Server</th>
                        <th className="py-4 px-6 text-center">Redirect</th>
                        <th className="py-4 px-6 text-center">Last Update</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-b border-gray-800">
                        <td colSpan="8" className="py-8 px-6 text-center text-gray-400">
                            <div className="flex flex-col items-center justify-center">
                                <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <p className="text-lg font-medium">No vulnerability data found</p>
                                <p className="text-sm mt-1">
                                    {scanInput
                                        ? <>Try searching with different keyword.<br/><span
                                            className="text-gray-500">Keyword: <span
                                            className="font-mono">{scanInput}</span></span></>
                                        : "Try scanning a specific asset or with a different filter."
                                    }
                                </p>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            );
        }

        return (
            <div className="overflow-x-auto rounded-xl shadow-xl" style={{background: "rgba(20,20,25,0.95)"}}>
                <table className="min-w-full text-white font-mono border border-[#2e2e2e]">
                    <thead>
                    <tr className="text-left border-b border-gray-700 text-gray-400 bg-gradient-to-r from-[#1e1e24] to-[#2a2a32]">
                        <th className="py-4 px-6">Asset</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">IP(s)</th>
                        <th className="py-4 px-6">ASN</th>
                        <th className="py-4 px-6">Tech</th>
                        <th className="py-4 px-6">Server</th>
                        <th className="py-4 px-6">Redirect</th>
                        <th className="py-4 px-6">Last Update</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.values(scanResult.data).map((item, idx) => {
                        const techName = item.technologies?.[0];
                        const techDetail = techName && item.technology_details && item.technology_details[techName];
                        const techIcon = techDetail?.icon;
                        return (
                            <tr key={item.id || idx}
                                className="border-b border-gray-800 transition-all group hover:bg-gradient-to-r from-[#1a1a20] to-[#25252d]">
                                <td className="py-4 px-6">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-white">{item.host || item.domain_name}</span>
                                        <span className="text-xs text-gray-400">{item.name}</span>
                                        <span
                                            className="inline-flex items-center text-xs bg-blue-950 px-2 py-0.5 rounded mt-1 text-indigo-300 font-semibold">
                        {item.status_code} {item.title && <span className="ml-1 text-gray-500">{item.title}</span>}
                      </span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    {item.body && item.body.toLowerCase().includes("moved permanently") ? (
                                        <span
                                            className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-yellow-100 px-3 py-1 rounded text-xs">
                        Redirected
                      </span>
                                    ) : (
                                        <span
                                            className="bg-gradient-to-r from-green-700 to-green-800 text-green-100 px-3 py-1 rounded text-xs">
                        OK
                      </span>
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col gap-1">
                                        {item.ip?.map(ip =>
                                            <span key={ip}
                                                  className="bg-[#222] px-2 py-0.5 rounded text-xs mb-0.5 font-mono text-gray-100 border border-gray-700">{ip}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    {item.asn ? (
                                        <span className="bg-[#23232b] rounded px-2 py-0.5 text-xs text-gray-300">
                        <strong>{item.asn.as_number}</strong>
                        <span className="text-gray-400"> | </span>
                                            {item.asn.as_name?.toLowerCase()}
                                            <span className="text-gray-400"> | </span>
                                            {item.asn.as_country}
                      </span>
                                    ) : "-"}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-1">
                                        {techIcon && (
                                            <Image src={techIcon} alt={techName} width={18} height={18}
                                                   className="inline rounded bg-white p-0.5"/>
                                        )}
                                        <span
                                            className="bg-[#23232b] rounded px-2 py-0.5 text-xs text-orange-300">{techName}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    {item.webserver && (
                                        <span
                                            className="bg-[#23232b] rounded px-2 py-0.5 text-xs text-cyan-300">{item.webserver}</span>
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    {item.redirect_location ? (
                                        <a href={item.redirect_location} target="_blank" rel="noopener noreferrer"
                                           className="text-xs text-yellow-300 underline break-all">{item.redirect_location}</a>
                                    ) : "-"}
                                </td>
                                <td className="py-4 px-6">
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300">
                      {formatTimeAgo(item.updated_at || item.created_at)}
                    </span>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar/>
            {/* Hero Section */}
            <section className="relative min-h-screen w-full bg-gradient-to-b from-black to-gray-900 overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
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
                        {/* Scan Input */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <input
                                type="text"
                                placeholder="Enter your target (domain, IP, etc)"
                                className="px-6 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white w-full sm:w-96 mb-2 sm:mb-0"
                                value={scanInput}
                                onChange={e => setScanInput(e.target.value)}
                                disabled={loadingScan || authState !== "authenticated"}
                            />
                            <button
                                onClick={() => {
                                    if (authState !== "authenticated") {
                                        router.push("/login");
                                        return;
                                    }
                                    handleScan();
                                }}
                                className="bg-[#f03262] hover:bg-[#d82a56] text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[#f03262]/30"
                            >
                                {authState === "loading"
                                    ? "Checking..."
                                    : authState !== "authenticated"
                                        ? "Login to Scan"
                                        : loadingScan
                                            ? "Scanning..."
                                            : "Start Scanning"}
                            </button>
                        </div>

                        {scanError && (
                            <div className="mt-4 text-red-400 text-center">{scanError}</div>
                        )}
                    </div>
                </div>
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none select-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-[#f03262]"
                            style={{
                                width: 18 + 'px',
                                height: 18 + 'px',
                                top: (i * 5 % 100) + '%',
                                left: ((i * 13) % 100) + '%',
                                opacity: 0.2 + (i % 4) * 0.2,
                                filter: 'blur(2px)'
                            }}
                        />
                    ))}
                </div>
            </section>
            {/* Scan Result Section */}
            {scanResult && (
                <section className="pt-8 pb-20 bg-black px-6">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-sm uppercase text-blue-400 mb-2 tracking-widest text-center">
                            🔎 Security Flaw Findings
                        </p>
                        <h2 className="text-4xl font-light text-white mb-8 text-center">
                            Vulnerability Exposure Report
                        </h2>
                        {renderScanTable()}
                    </div>
                </section>
            )}
        </div>
    );
};

export default VulnerabilityPage;