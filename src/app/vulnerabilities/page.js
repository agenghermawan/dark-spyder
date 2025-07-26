'use client';

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import AssetDetailModal from "../../components/va/va_detail_modal";
import { FaServer } from "react-icons/fa"; // Make sure to install react-icons if not yet: npm install react-icons
import { useRouter } from "next/navigation";


// Utility
const API_KEY = "cf9452c4-7a79-4352-a1d3-9de3ba517347";
const severityColor = {
    critical: "bg-red-900 text-red-200",
    high: "bg-orange-900 text-orange-200",
    medium: "bg-yellow-900 text-yellow-200",
    low: "bg-green-900 text-green-200",
    info: "bg-gray-900 text-gray-200",
    unknown: "bg-gray-800 text-gray-300"
};
function formatAgo(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    if (isNaN(diffMs)) return "-";
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    const diffMo = Math.floor(diffDay / 30);
    return `${diffMo}mo ago`;
}
const tableHeadClasses = "py-3 px-5 text-xs font-semibold uppercase tracking-wide border-b border-gray-700 bg-gradient-to-r from-[#17171b] to-[#22222a] text-gray-400";
const tableBodyClasses = "py-4 px-6 border-b border-gray-800 group hover:bg-gradient-to-r from-[#15151b] to-[#23232b] transition";

// ReadMore component for URL
function ReadMoreUrl({ url }) {
    const [showFull, setShowFull] = useState(false);
    if (!url) return null;
    const isLong = url.length > 60;
    if (!isLong) return <span>{url}</span>;
    return (
        <span>
            {showFull ? url : url.slice(0, 60) + "..."}
            <button
                onClick={e => {
                    e.preventDefault();
                    setShowFull(!showFull);
                }}
                className="ml-2 text-blue-400 underline cursor-pointer text-xs"
            >{showFull ? "Show less" : "Show more"}</button>
        </span>
    );
}

const Vulnerabilities = () => {
    const router = useRouter();

    // Table/filter state
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState(""); // for dropdown
    const [registeredDomains, setRegisteredDomains] = useState([]);
    const [domainLimit, setDomainLimit] = useState(0);
    const [showDomainDropdown, setShowDomainDropdown] = useState(false);
    const [searchReady, setSearchReady] = useState(false);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalTemplate, setModalTemplate] = useState("");
    const [rowAssets, setRowAssets] = useState([]);
    const [rowLoading, setRowLoading] = useState(false);

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailItem, setDetailItem] = useState(null);

    // Login validation state
    const [needLogin, setNeedLogin] = useState(false);

    // Get plan info for dropdown
    useEffect(() => {
        fetch("/api/my-plan", { credentials: "include" })
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to fetch plan");
                return res.json();
            })
            .then((data) => {
                if (data && data.data) {
                    const plan = data.data;
                    const domains = Array.isArray(plan.registered_domain) ? plan.registered_domain : [];
                    setRegisteredDomains(domains);
                    setDomainLimit(Number(plan.domain) || 0);
                    if ((Number(plan.domain) || 0) > 0 && domains.length > 0) {
                        setShowDomainDropdown(true);
                        setSelectedDomain(domains[0]);
                    } else {
                        setShowDomainDropdown(false);
                        setSelectedDomain("");
                        setSearchInput("");
                    }
                    setSearchReady(true);
                } else {
                    setRegisteredDomains([]);
                    setDomainLimit(0);
                    setShowDomainDropdown(false);
                    setSearchReady(true);
                }
            })
            .catch(() => {
                setRegisteredDomains([]);
                setDomainLimit(0);
                setShowDomainDropdown(false);
                setSearchReady(true);
            });
    }, []);

    // --- Fetch vulnerabilities summary (filters) ---
    const fetchData = async (search = false) => {
        setIsLoading(true);
        setModalOpen(false);
        try {
            const params = new URLSearchParams();
            params.append("type", "template");
            params.append("limit", size);
            params.append("offset", (page - 1) * size);
            params.append("vuln_status", "open,triaged,fix_in_progress");
            params.append("severity", "critical,high,medium,low,unknown");

            if (search) {
                if (showDomainDropdown && selectedDomain) {
                    params.append("search", selectedDomain);
                } else if (searchQuery.trim()) {
                    params.append("search", searchQuery.trim());
                }
            }

            const options = {
                method: "GET",
                headers: {"X-API-Key": API_KEY},
            };

            const url = `https://api.projectdiscovery.io/v1/scans/results/filters?${params.toString()}`;
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const result = await res.json();

            setData(Array.isArray(result.data) ? result.data : []);
            setTotal(result.total_results || result.result_count || 0);
            setTotalPages(result.total_pages || 1);
        } catch {
            setData([]);
            setTotal(0);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {}, []);

    useEffect(() => {
        if (showDomainDropdown && selectedDomain) {
            fetchData(true);
        } else if (searchQuery.trim() !== "") {
            fetchData(true);
        }
    }, [page, size]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setNeedLogin(false);

        // Validate login before search
        try {
            const res = await fetch('/api/me', { credentials: "include" });
            if (res.status === 401 || res.status === 403) {
                setNeedLogin(true);
                return;
            }
        } catch (err) {
            setNeedLogin(true);
            return;
        }

        setPage(1);
        if (showDomainDropdown) {
            if (selectedDomain) fetchData(true);
        } else if (searchInput.trim() !== "") {
            setSearchQuery(searchInput);
            fetchData(true);
        }
    };

    const fetchRowAssets = async (template, title) => {
        setModalOpen(true);
        setModalTitle(title);
        setModalTemplate(template);
        setRowLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("limit", 30);
            params.append("offset", 0);
            params.append("asset_metadata", "true");
            params.append("vuln_status", "open,triaged,fix_in_progress");
            params.append("severity", "critical,high,medium,low,unknown");
            params.append("templates", template);

            if (showDomainDropdown && selectedDomain) {
                params.append("search", selectedDomain);
            } else if (searchQuery.trim()) {
                params.append("search", searchQuery.trim());
            }

            const options = {
                method: "GET",
                headers: {"X-API-Key": API_KEY},
            };

            const url = `https://api.projectdiscovery.io/v1/scans/results?${params.toString()}`;
            const res = await fetch(url, options);
            if (!res.ok) throw new Error("Failed to fetch assets");
            const result = await res.json();

            setRowAssets(
                (result.data || []).map((item) => {
                    const asset = item.asset_metadata || {};
                    const event = Array.isArray(item.event) ? item.event[0] : {};
                    return {
                        asset: asset.host || asset.domain_name || asset.name || "-",
                        foundAt: event["matched-at"] || asset.name || "-",
                        firstSeen: asset.created_at || item.created_at || "-",
                        lastSeen: asset.updated_at || item.updated_at || "-",
                        fullItem: item,
                    };
                })
            );
        } catch {
            setRowAssets([]);
        } finally {
            setRowLoading(false);
        }
    };

    const handleRowClick = (template, title) => {
        fetchRowAssets(template, title);
    };

    const AssetModal = () => (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="relative bg-[#19191d] rounded-xl shadow-2xl max-w-5xl w-full mx-4 overflow-auto max-h-[90vh] p-0">
                <button
                    className="absolute top-5 right-7 text-gray-300 hover:text-white text-2xl font-bold z-10"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close"
                >×</button>
                <div className="px-8 pt-8 pb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <span className={`px-4 py-1 rounded-full font-semibold ${severityColor['critical']}`}>Critical</span>
                            <span className="ml-4 text-xl font-bold text-white">{modalTitle}</span>
                        </div>
                        <div>
                            <span className="bg-[#18181c] px-3 py-1 rounded text-xs font-mono text-gray-200 mr-1">TEMPLATE</span>
                            <span className="bg-[#23232b] px-2 py-1 rounded text-xs text-gray-300">{modalTemplate}</span>
                        </div>
                    </div>
                    <div className="w-full overflow-auto rounded-lg border border-gray-800 bg-[#19191d] mt-4">
                        <table className="min-w-full font-mono text-xs">
                            <thead>
                            <tr className="bg-gradient-to-r from-[#17171b] to-[#22222a] text-gray-400 border-b border-gray-700">
                                <th className="py-3 px-4 font-semibold text-left w-2"></th>
                                <th className="py-3 px-4 font-semibold text-left">Asset</th>
                                <th className="py-3 px-4 font-semibold text-left">Found at</th>
                                <th className="py-3 px-4 font-semibold text-left">First seen</th>
                                <th className="py-3 px-4 font-semibold text-left">Last seen</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rowLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-pink-400 font-semibold">Loading assets...</td>
                                </tr>
                            ) : rowAssets.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-gray-400 font-semibold">
                                        No assets found for template <span className="font-mono">{modalTemplate}</span>.
                                    </td>
                                </tr>
                            ) : (
                                rowAssets.map((asset, aidx) => (
                                    <tr key={asset.asset + aidx}
                                        className="border-b border-gray-800 hover:bg-[#22222b]/80 transition hover:cursor-pointer"
                                        onClick={() => {
                                            setDetailItem(asset.fullItem);
                                            setDetailOpen(true);
                                        }}
                                    >
                                        <td className="py-2 px-4">
                                            <input type="checkbox" disabled className="form-checkbox h-4 w-4" />
                                        </td>
                                        <td className="py-2 px-4 font-mono text-base text-gray-100">{asset.asset}</td>
                                        <td className="py-2 px-4">
                                            <a className="bg-black/10 px-2 py-1 rounded text-blue-300 flex items-center gap-1 hover:underline"
                                               href={asset.foundAt} target="_blank" rel="noopener">
                                                <svg width="14" height="14" fill="none" stroke="currentColor"
                                                     strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M13.828 10.172a4 4 0 1 1-5.656 5.656" />
                                                    <path d="M12 8v4h4" />
                                                </svg>
                                                <ReadMoreUrl url={asset.foundAt} />
                                            </a>
                                        </td>
                                        <td className="py-2 px-4 text-gray-400 min-w-[70px]">{formatAgo(asset.firstSeen)}</td>
                                        <td className="py-2 px-4 text-gray-400 min-w-[70px]">{formatAgo(asset.lastSeen)}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    // Modern Search Bar
    const renderSearchBar = () => (
        <form onSubmit={handleSearch} className="flex flex-col items-center gap-4 mb-10 w-full max-w-3xl mx-auto">
            <div className="w-full flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-100 mb-1">
                    {showDomainDropdown
                        ? "Select your registered domain to view vulnerability assessment"
                        : "Search vulnerabilities by domain"}
                </label>
                {showDomainDropdown ? (
                    <div className="relative w-full">
                        <select
                            className="px-5 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white w-full focus:outline-none focus:border-pink-500 text-base appearance-none transition"
                            value={selectedDomain}
                            onChange={e => setSelectedDomain(e.target.value)}
                            disabled={isLoading}
                        >
                            {registeredDomains.map((domain, idx) =>
                                <option key={domain + idx} value={domain}>{domain}</option>
                            )}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </div>
                ) : (
                    <input
                        type="text"
                        placeholder="Type domain here (e.g. mandayahospitalgroup.com)"
                        className="px-5 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white w-full focus:outline-none focus:border-pink-500 text-base transition"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        disabled={isLoading}
                    />
                )}
            </div>
            <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold text-lg shadow transition disabled:opacity-60"
                disabled={isLoading}
            >
                <span className="flex items-center justify-center gap-2">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {isLoading
                        ? "Searching..."
                        : showDomainDropdown
                            ? `Show VA for "${selectedDomain}"`
                            : "Search"}
                </span>
            </button>
            {showDomainDropdown && (
                <div className="w-full text-xs text-gray-400 text-right mt-1">
                    <span>Registered domains: <span className="text-pink-400">{registeredDomains.length}</span> / <span className="text-yellow-400">{domainLimit}</span></span>
                </div>
            )}
        </form>
    );

    // Login required UI
    const renderLoginRequired = () => (
        <div className="max-w-xl mx-auto bg-[#23232b] rounded-xl p-8 mt-12 text-center shadow-lg border border-pink-800">
            <svg className="mx-auto mb-4" width="48" height="48" fill="none" stroke="#f33d74" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 15v2m0 4v-4m0-4V9m0-4V5m0 0a9 9 0 1 1 0 18 9 9 0 0 1 0-18z"/>
            </svg>
            <h2 className="text-2xl font-bold text-pink-500 mb-2">Login Required</h2>
            <p className="text-gray-300 mb-4">You must be logged in to search vulnerabilities and view your plan domains.</p>
            <a href="/login" className="inline-block px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold transition">Go to Login</a>
        </div>
    );

    const renderExtractLogsButton = () => (
        <div className="flex justify-end items-center mb-6">
            <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 hover:from-pink-700 hover:to-pink-600 text-white font-semibold shadow transition"
                onClick={() => {
                    if (!needLogin) {
                        router.push('/vulnerabilities/assets');
                    }
                }}
                disabled={needLogin}
            >
                <FaServer className="text-base" />
                <span>Assets Group</span>
            </button>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-[#161622] to-[#232339] text-white min-h-screen">
            <Navbar />
            <section className="px-6 py-10 max-w-7xl mx-auto">
                {needLogin ? renderLoginRequired() : searchReady && renderSearchBar()}
            </section>
            {!needLogin && (
                <section className="max-w-7xl mx-auto px-6 pb-10">
                    {renderExtractLogsButton()}

                    <div className="rounded-2xl shadow-2xl overflow-x-auto border border-[#22222b]" style={{ background: "rgba(20,20,25,0.98)" }}>
                        <table className="min-w-full text-white font-mono rounded-2xl overflow-hidden">
                            <thead>
                            <tr>
                                <th className={tableHeadClasses}></th>
                                <th className={tableHeadClasses + " w-36"}>Severity</th>
                                <th className={tableHeadClasses}>Title</th>
                                <th className={tableHeadClasses + " w-16"}>Count</th>
                                <th className={tableHeadClasses + " w-56"}>Template</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="py-12 px-6 text-center text-pink-400 font-bold">Loading...</td>
                                </tr>
                            )}
                            {!isLoading && data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 px-6 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                      d="M9.172 16.172a4 4 0 0 1 5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                                            </svg>
                                            <p className="text-xl font-bold">No vulnerability data found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && data.map((item, idx) => {
                                const severity = item.severity || "critical";
                                const template = item.value || "-";
                                return (
                                    <tr
                                        key={template + idx}
                                        className={tableBodyClasses + " cursor-pointer"}
                                        onClick={() => handleRowClick(template, item.name)}
                                        style={{
                                            borderTopLeftRadius: idx === 0 ? '16px' : undefined,
                                            borderTopRightRadius: idx === 0 ? '16px' : undefined
                                        }}
                                    >
                                        <td className="py-4 px-6"><input type="checkbox" disabled className="form-checkbox h-4 w-4"/></td>
                                        <td className="py-4 px-6">
                                            <span className={`px-4 py-1 rounded-full font-semibold ${severityColor[severity.toLowerCase()] || severityColor["critical"]}`}>{severity.charAt(0).toUpperCase() + severity.slice(1)}</span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-white">{item.name}</td>
                                        <td className="py-4 px-6">
                                            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 text-xs font-mono">{item.count}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="bg-[#18181c] px-3 py-1 rounded text-xs font-mono text-gray-200 mr-1">TEMPLATE</span>
                                            <span className="bg-[#23232b] px-2 py-1 rounded text-xs text-gray-300">{template}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-4 py-4 text-gray-400 text-xs gap-2">
                            <div>
                                <span>Showing {(page - 1) * size + 1} - {Math.min(page * size, total)} of {total || "many"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1 rounded bg-[#19191d] border border-gray-700 hover:bg-[#23232b] font-semibold"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >Previous</button>
                                <button
                                    className="px-3 py-1 rounded bg-[#19191d] border border-gray-700 hover:bg-[#23232b] font-semibold"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(page + 1)}
                                >Next</button>
                                <select
                                    className="ml-2 px-2 py-1 rounded border border-gray-700 bg-[#19191d] text-gray-200"
                                    value={size}
                                    onChange={e => {
                                        setSize(Number(e.target.value));
                                        setPage(1);
                                    }}
                                >
                                    {[10, 20, 50, 100].map(s => <option key={s} value={s}>{s} per page</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {modalOpen && <AssetModal />}
            {detailOpen && <AssetDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} item={detailItem} />}
        </div>
    );
};

export default Vulnerabilities;