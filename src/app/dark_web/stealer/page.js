"use client";
import {Suspense, useState, useEffect, useRef} from "react";
import {gsap} from "gsap";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import Navbar from "../../../components/navbar";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import {useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";
import ExposedData from "../../../components/stealer/exposed_data";
import StealerAdvancedSearchModal from "../../../components/stealer/advance_search";
import CyberParticles from "../../../components/stealer/stealer_particles";

gsap.registerPlugin(ScrollToPlugin, MotionPathPlugin);

export default function Page() {
    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <StealerPageContent/>
        </Suspense>
    );
}

function StealerPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [stealerData, setStealerData] = useState([]);
    const [domain, setDomain] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({page: 1, size: 10, total: 0});
    const [pageInput, setPageInput] = useState(1); // for direct page jump
    const [sizeInput, setSizeInput] = useState(10); // for page size/limit
    const [hasSubscription, setHasSubscription] = useState(true);
    const [authState, setAuthState] = useState("loading");
    const [showEmptyAlert, setShowEmptyAlert] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [markingId, setMarkingId] = useState(null);
    const [updatedIds, setUpdatedIds] = useState({});

    const resultsRef = useRef(null);
    const rowsRef = useRef([]);
    const tableRef = useRef(null);
    const searchParamsRef = useRef({domain: ""});

    const [lastAdvancedParams, setLastAdvancedParams] = useState({
        q: "",
        domain: "",
        username: "",
        password: "",
    });

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

    const fetchStealerData = async ({ params = {}, page = 1, size = 10 }) => {
        setIsLoading(true);
        setShowEmptyAlert(false);
        searchParamsRef.current = params;

        const query =
            Object.entries(params)
                .filter(([k, v]) => v && v.trim())
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
                .join("&") +
            `&type=stealer&page=${page}&size=${size}`;

        try {
            const res = await fetch(`/api/proxy?${query}`);
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
        } catch {
            setShowEmptyAlert(true);
            setStealerData([]);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                if (resultsRef.current) {
                    resultsRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    };


    // --- BASIC SEARCH ---
    const handleSearch = async () => {
        if (authState === "loading") return;
        if (authState !== "authenticated") {
            router.push("/login");
            return;
        }
        setPagination((prev) => ({ ...prev, page: 1 }));
        await fetchStealerData({ params: { q: domain }, page: 1, size: pagination.size });

        setLastAdvancedParams((prev) => ({
            ...prev,
            q: domain,
            domain: "",
            username: "",
            password: "",
        }));
    };

    // --- ADVANCED SEARCH ---
    const handleAdvancedSearch = async (params) => {
        setLastAdvancedParams({
            q: params.q || "",
            domain: params.domain || "",
            username: params.username || "",
            password: params.password || "",
        });
        setIsLoading(true);
        setShowEmptyAlert(false);
        setStealerData([]);
        await fetchStealerData({ params, page: 1, size: pagination.size });
        setPagination((prev) => ({ ...prev, page: 1 }));
        setShowAdvanced(false);
    };

    // --- PAGINATION ---
    const handlePagination = async (direction) => {
        let newPage = pagination.page;
        if (direction === "prev" && newPage > 1) newPage--;
        else if (direction === "next" && newPage * pagination.size < pagination.total) newPage++;
        setPagination((prev) => ({...prev, page: newPage}));
        await fetchStealerData({
            params: searchParamsRef.current,
            page: newPage,
            size: pagination.size,
        });
    };

    // --- HANDLE PAGE JUMP ---
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
        setPagination((prev) => ({...prev, page: value}));
        await fetchStealerData({
            params: searchParamsRef.current,
            page: value,
            size: pagination.size,
        });
    };

    // --- HANDLE LIMIT (SIZE) ---
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
        setPagination((prev) => ({...prev, size: value, page: 1}));
        await fetchStealerData({
            params: searchParamsRef.current,
            page: 1,
            size: value,
        });
    };

    // --- PAGINATION EFFECT ---
    useEffect(() => {
        if (pagination.page !== 1) {
            fetchStealerData({
                params: searchParamsRef.current,
                page: pagination.page,
                size: pagination.size,
            });
        }
        // eslint-disable-next-line
    }, [pagination.page]);

    // --- SEARCH ON URL PARAM ---
    useEffect(() => {
        const query = searchParams.get("q");
        if (query) {
            setDomain(query);
            setPagination((prev) => ({ ...prev, page: 1 }));
            if (authState === "authenticated") {
                setTimeout(() => handleSearch(), 100);
            }
        }
        // eslint-disable-next-line
    }, [searchParams, authState]);

    // --- MARK VALID/NOT VALID ---
    const markAsValid = async (id, isValid = true) => {
        setMarkingId(id);
        try {
            const res = await fetch(`/api/mark-as-valid/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({valid: isValid}),
            });
            if (res.ok) {
                setUpdatedIds((prev) => ({...prev, [id]: isValid}));
            }
        } finally {
            setMarkingId(null);
        }
    };

    const handleSizeInputKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSizeInputBlur(e);
        }
    };

    const handlePageInputKeyDown = (e) => {
        if (e.key === "Enter") {
            handlePageInputBlur(e);
        }
    };

    // --- RENDER ---
    return (
        <div>
            <Navbar/>

            {/* Background */}
            <div className="relative h-screen w-full">
                <CyberParticles/>

                {/* Floating text on top of Globe */}
                <section
                    className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-4">Uncover Hidden Credentials</h2>
                        <p className="text-xl mb-8 text-gray-300">
                            {hasSubscription
                                ? "Full access to all compromised credentials"
                                : "Subscribe to unlock full access to breach data"}
                        </p>
                        <div
                            className="flex flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden w-full">
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="Uncover Credential Leaks"
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
                                    "Uncover"
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Table and Advanced Search */}
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
                            {/* Action Bar */}
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    className="bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all"
                                >
                                    Extract Logs
                                </button>
                                <button
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 rounded-lg text-white font-semibold shadow-lg transition-all hover:scale-105"
                                    onClick={() => setShowAdvanced(true)}
                                >
                                    Advanced Search
                                </button>
                            </div>
                            {/* Modal */}
                            <StealerAdvancedSearchModal
                                open={showAdvanced}
                                onClose={() => setShowAdvanced(false)}
                                onSearch={handleAdvancedSearch}
                                defaultQ={lastAdvancedParams.q}
                                defaultDomain={lastAdvancedParams.domain}
                                defaultUsername={lastAdvancedParams.username}
                                defaultPassword={lastAdvancedParams.password}
                                isLoading={isLoading}
                            />
                            {/* Domain search bar (optional, can be moved to modal if you prefer) */}
                            <div className="mb-4 flex items-center gap-3 flex-wrap">
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={e => setDomain(e.target.value)}
                                    placeholder="Search by Domain"
                                    className="px-4 py-2 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                                    style={{minWidth: 170}}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#f03262] hover:bg-[#c91d4e] text-white px-5 py-2 rounded-lg font-semibold transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Searching..." : "Search"}
                                </button>
                                {/* LIMIT/Size input */}

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
                                            className={`border-b border-gray-800 ${
                                                !entry.isTeaser
                                                    ? "hover:bg-gradient-to-r from-[#1a1a20] to-[#25252d]"
                                                    : "bg-gradient-to-r from-[#1a1a20]/50 to-[#25252d]/50"
                                            } transition-all duration-300 group`}
                                        >
                                            <ExposedData entry={entry}/>
                                            <td className="py-4 px-6">
                          <span
                              className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 text-sm`}
                          >
                            {entry.source}
                          </span>
                                            </td>
                                            <td className="py-4 px-6">
                          <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                  entry.lastBreach === "N/A"
                                      ? "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400"
                                      : "bg-gradient-to-r from-red-700 to-red-800 text-red-100"
                              }`}
                          >
                            {entry.lastBreach}
                          </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {entry.isTeaser ? (
                                                    <button
                                                        onClick={() => router.push("/pricing")}
                                                        className="bg-gradient-to-r from-[#f03262] to-[#c91d4e] hover:from-[#e63368] hover:to-[#d11a4f] text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-[#f03262]/20 flex items-center justify-center gap-1"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                                            />
                                                        </svg>
                                                        Upgrade Now
                                                    </button>
                                                ) : (
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
                                                )}
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
                                                        Try searching with different keyword
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                )
                            )}
                            {/* Pagination */}
                            {hasSubscription && (
                                <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                                    {/* Left: Showing info */}
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-500 text-sm">
                                            Showing {hasSubscription ? stealerData.length : 1} of {pagination.total} entries (Page {pagination.page})
                                        </p>
                                    </div>
                                    {/* Right: Pagination & Limit Controls */}
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
                                            onKeyDown={handleSizeInputKeyDown}
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
                                            onKeyDown={handlePageInputKeyDown}
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


