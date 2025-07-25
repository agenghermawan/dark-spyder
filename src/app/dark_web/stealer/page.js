"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Navbar from "../../../components/navbar";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import ExposedData from "../../../components/stealer/exposed_data";
import CyberParticles from "../../../components/stealer/stealer_particles";

gsap.registerPlugin(ScrollToPlugin, MotionPathPlugin);

// Modal alert component
function ErrorModal({ show, message, onClose }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-[#232339] rounded-2xl shadow-xl p-6 max-w-md w-full relative">
                <button
                    className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >×</button>
                <h2 className="text-lg font-bold text-red-400 mb-4 text-center">Domain not allowed</h2>
                <div className="text-white text-center whitespace-pre-line">{message}</div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <StealerPageContent />
        </Suspense>
    );
}

function StealerPageContent() {
    const router = useRouter();

    const [stealerData, setStealerData] = useState([]);
    const [domain, setDomain] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
    const [pageInput, setPageInput] = useState(1);
    const [sizeInput, setSizeInput] = useState(10);
    const [hasSubscription, setHasSubscription] = useState(true);
    const [authState, setAuthState] = useState("loading");
    const [showEmptyAlert, setShowEmptyAlert] = useState(false);

    const [userDomains, setUserDomains] = useState([]);
    const [domainLoaded, setDomainLoaded] = useState(false);

    const [markingId, setMarkingId] = useState(null);
    const [updatedIds, setUpdatedIds] = useState({});

    // For error modal
    const [errorModal, setErrorModal] = useState({ show: false, message: "" });

    const resultsRef = useRef(null);
    const rowsRef = useRef([]);
    const tableRef = useRef(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch("/api/me", { credentials: "include" });
                setAuthState(res.ok ? "authenticated" : "unauthenticated");
                if (res.ok) {
                    const planRes = await fetch("/api/my-plan", { credentials: "include" });
                    if (planRes.ok) {
                        const planData = await planRes.json();
                        setUserDomains(Array.isArray(planData.data?.registered_domain) ? planData.data.registered_domain : []);
                    }
                }
            } catch {
                setAuthState("unauthenticated");
            } finally {
                setDomainLoaded(true);
            }
        };
        checkLoginStatus();
    }, []);

    // Hanya param domain
    const fetchStealerData = async ({ domain: domainParam, page = 1, size = 10 }) => {
        setIsLoading(true);
        setShowEmptyAlert(false);

        let searchDomain = domainParam && domainParam.trim();
        if (!searchDomain && userDomains.length > 0) {
            searchDomain = userDomains[0];
            setDomain(searchDomain);
        }

        if (!searchDomain) {
            setShowEmptyAlert(true);
            setStealerData([]);
            setIsLoading(false);
            return;
        }

        const query = `domain=${encodeURIComponent(searchDomain)}&type=stealer&page=${page}&size=${size}`;
        let errorHappened = false;
        try {
            const res = await fetch(`/api/proxy?${query}`);
            if (res.status === 403) {
                // Show modal error
                const data = await res.json();
                setErrorModal({
                    show: true,
                    message: data.error || "Domain is not allowed for search.",
                });
                setStealerData([]);
                setShowEmptyAlert(true);
                setIsLoading(false);
                errorHappened = true;
                return;
            }
            if (!res.ok) throw new Error("API not OK");
            const data = await res.json();

            if (!data.current_page_data || data.current_page_data.length === 0) {
                setStealerData([]);
                setShowEmptyAlert(true);
            } else {
                setStealerData(
                    data.current_page_data.map((item) => ({
                        id: item._id,
                        password: item._source?.password || "N/A",
                        origin: item._source?.domain || "N/A",
                        email: item._source?.username || "N/A",
                        source: item._source?.threatintel || "Unknown",
                        lastBreach: "N/A",
                        checksum: item._source?.Checksum || "N/A",
                        valid: item._source?.valid ?? null,
                    }))
                );
                setShowEmptyAlert(false);
            }
            setPagination((prev) => ({
                ...prev,
                page,
                size,
                total: data.total || 0,
            }));
            setPageInput(page);
            setSizeInput(size);
        } catch (err) {
            setShowEmptyAlert(true);
            setStealerData([]);
            setErrorModal({
                show: true,
                message: err.message || "Failed to fetch data.",
            });
            errorHappened = true;
        } finally {
            setIsLoading(false);
            // scroll hanya jika tidak error/modal
            if (!errorHappened) {
                setTimeout(() => {
                    if (resultsRef.current) {
                        resultsRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                }, 100);
            }
        }
    };

    const handleSearch = async () => {
        if (authState === "loading") return;
        if (authState !== "authenticated") {
            router.push("/login");
            return;
        }
        setPagination((prev) => ({ ...prev, page: 1 }));
        await fetchStealerData({ domain: domain, page: 1, size: pagination.size });
    };

    const handlePagination = async (direction) => {
        let newPage = pagination.page;
        if (direction === "prev" && newPage > 1) newPage--;
        else if (direction === "next" && newPage * pagination.size < pagination.total) newPage++;
        setPagination((prev) => ({ ...prev, page: newPage }));
        await fetchStealerData({
            domain: domain,
            page: newPage,
            size: pagination.size,
        });
    };

    const handlePageInputChange = (e) => {
        const value = e.target.value;
        setPageInput(value);
    };
    const handlePageInputBlur = async () => {
        let value = parseInt(pageInput, 10);
        if (isNaN(value) || value < 1) value = 1;
        const maxPage = Math.ceil(pagination.total / pagination.size) || 1;
        if (value > maxPage) value = maxPage;
        setPageInput(value);
        setPagination((prev) => ({ ...prev, page: value }));
        await fetchStealerData({
            domain: domain,
            page: value,
            size: pagination.size,
        });
    };

    const handleSizeInputChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 10;
        if (value > 1000) value = 1000;
        setSizeInput(value);
    };
    const handleSizeInputBlur = async () => {
        let value = parseInt(sizeInput, 10);
        if (isNaN(value) || value < 1) value = 10;
        if (value > 1000) value = 1000;
        setSizeInput(value);
        setPagination((prev) => ({ ...prev, size: value, page: 1 }));
        await fetchStealerData({
            domain: domain,
            page: 1,
            size: value,
        });
    };


    // --- MARK VALID/NOT VALID ---
    const markAsValid = async (id, isValid = true) => {
        setMarkingId(id);
        try {
            const res = await fetch(`/api/mark-as-valid/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ valid: isValid }),
            });
            if (res.ok) {
                setUpdatedIds((prev) => ({ ...prev, [id]: isValid }));
            }
        } finally {
            setMarkingId(null);
        }
    };

    return (
        <div>
            <Navbar />
            <ErrorModal
                show={errorModal.show}
                message={errorModal.message}
                onClose={() => setErrorModal({ show: false, message: "" })}
            />
            <div className="relative h-screen w-full">
                <CyberParticles />
                <section className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-4">Uncover Hidden Credentials</h2>
                        <p className="text-xl mb-8 text-gray-300">
                            {hasSubscription
                                ? "Full access to all compromised credentials"
                                : "Subscribe to unlock full access to breach data"}
                        </p>
                        <div className="flex flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden w-full">
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onBlur={() => {
                                    if (!domain && userDomains.length > 0) setDomain(userDomains[0]);
                                }}
                                placeholder={`Search by Domain (${userDomains[0] || "your domain"})`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && authState === "authenticated") {
                                        handleSearch();
                                    }
                                }}
                                className="input-glass bg-black text-white placeholder-gray-500 border border-gray-700 flex-1 px-4 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className={`${
                                    isLoading
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-[#f03262] hover:bg-[#c91d4e]"
                                } text-white px-6 py-2 rounded-lg transition-all duration-300 font-semibold whitespace-nowrap flex items-center justify-center min-w-[120px] hover:cursor-pointer`}
                            >
                                {authState !== "authenticated" ? (
                                    "Login to Search"
                                ) : isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Scanning
                                    </>
                                ) : (
                                    "Search"
                                )}
                            </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                            {userDomains.length > 0 ? `Allowed domains: ${userDomains.join(", ")}` : "No registered domain. Please add domain in your plan."}
                        </div>
                    </div>
                </section>
            </div>
            {(stealerData.length > 0 || showEmptyAlert) && (
                <section className="py-16 px-4 sm:px-6 lg:px-8 " ref={resultsRef}>
                    <div className="w-10/12 mx-auto">
                        <p className="text-sm uppercase text-green-500 mb-2 tracking-widest text-center">
                            🧠 Threat Intel Extract
                        </p>
                        <h2 className="text-4xl font-light text-white mb-8 text-center">
                            {hasSubscription
                                ? "Compromised Credentials"
                                : "🔒 Subscription Required"}
                        </h2>
                        <div className="overflow-x-auto" ref={tableRef}>
                            <div className="mb-4 flex items-center gap-3 flex-wrap">
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={e => setDomain(e.target.value)}
                                    placeholder={`Search by Domain (${userDomains[0] || "your domain"})`}
                                    className="px-4 py-2 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                                    style={{ minWidth: 170 }}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#f03262] hover:bg-[#c91d4e] text-white px-5 py-2 rounded-lg font-semibold transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Searching..." : "Search"}
                                </button>
                            </div>
                            {stealerData.length > 0 ? (
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
                                            ref={(el) => (rowsRef.current[index] = el)}
                                            className={`border-b border-gray-800 hover:bg-gradient-to-r from-[#1a1a20] to-[#25252d] transition-all duration-300 group`}
                                        >
                                            <ExposedData entry={entry} />
                                            <td className="py-4 px-6">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 text-sm">
                                                        {entry.source}
                                                    </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400">
                                                        {entry.lastBreach}
                                                    </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                                                    {updatedIds[entry.id] === true ? (
                                                        <button
                                                            onClick={() => markAsValid(entry.id, false)}
                                                            disabled={markingId === entry.id}
                                                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-1"
                                                        >
                                                            Mark as Not Valid
                                                        </button>
                                                    ) : updatedIds[entry.id] === false ? (
                                                        <button
                                                            onClick={() => markAsValid(entry.id, true)}
                                                            disabled={markingId === entry.id}
                                                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-1"
                                                        >
                                                            Mark as Valid
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => markAsValid(entry.id, true)}
                                                                disabled={markingId === entry.id}
                                                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-1"
                                                            >
                                                                Mark as Valid
                                                            </button>
                                                            <button
                                                                onClick={() => markAsValid(entry.id, false)}
                                                                disabled={markingId === entry.id}
                                                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-1"
                                                            >
                                                                Mark as Not Valid
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                showEmptyAlert && (
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
                                                    <svg
                                                        className="w-12 h-12 mb-4 text-gray-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.5"
                                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <p className="text-lg font-medium">
                                                        No compromised credentials found
                                                    </p>
                                                    <p className="text-sm mt-1">
                                                        Try searching with different domain
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                )
                            )}
                            {hasSubscription && (
                                <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-500 text-sm">
                                            Showing {stealerData.length} of {pagination.total} entries
                                            (Page {pagination.page})
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={() => handlePagination("prev")}
                                            disabled={pagination.page === 1}
                                            className={`px-4 py-2 text-sm ${
                                                pagination.page === 1
                                                    ? "bg-gray-800 cursor-not-allowed"
                                                    : "bg-gray-800 hover:bg-gray-700"
                                            } rounded-lg transition-colors`}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => handlePagination("next")}
                                            disabled={pagination.page * pagination.size >= pagination.total}
                                            className={`px-4 py-2 text-sm ${
                                                pagination.page * pagination.size >= pagination.total
                                                    ? "bg-[#f03262]/50 cursor-not-allowed"
                                                    : "bg-[#f03262] hover:bg-[#c91d4e]"
                                            } rounded-lg transition-colors`}
                                        >
                                            Next
                                        </button>
                                        <label className="ml-2 text-sm text-gray-300">Limit/Per Page:</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={1000}
                                            value={sizeInput}
                                            onChange={handleSizeInputChange}
                                            onBlur={handleSizeInputBlur}
                                            className="w-20 px-2 py-2 rounded-md border border-gray-700 bg-black/30 text-white text-center focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                                            title="Entries per page (max 1000)"
                                        />
                                        <label className="ml-2 text-sm text-gray-300">Page:</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={Math.max(1, Math.ceil(pagination.total / pagination.size))}
                                            value={pageInput}
                                            onChange={handlePageInputChange}
                                            onBlur={handlePageInputBlur}
                                            className="w-16 px-2 py-2 rounded-md border border-gray-700 bg-black/30 text-white text-center focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                                            title="Go to page"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}