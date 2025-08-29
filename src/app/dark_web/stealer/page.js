"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import ExposedData from "../../../components/stealer/exposed_data";
import CyberParticles from "../../../components/stealer/stealer_particles";
import StealerDetailModal from "../../../components/stealer/stealer_detail_modal";

// ErrorModal Component
function ErrorModal({show, message, onClose, userDomains, plan}) {
    if (!show) return null;
    const isExpired = message && message.toLowerCase().includes("expired");
    const isNotAllowed = message && (
        message.toLowerCase().includes("not allowed") ||
        message.toLowerCase().includes("not registered") ||
        message.toLowerCase().includes("no domain")
    );
    const showAllowed = isNotAllowed && plan?.domain !== "unlimited" && userDomains?.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-[#232339] rounded-2xl shadow-xl p-6 max-w-md w-full relative flex flex-col items-center">
                <button
                    className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >×
                </button>
                <div className="mb-2 mt-2 flex justify-center">
                    {isExpired ? (
                        <svg width="60" height="60" fill="none" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="27" stroke="#f03262" strokeWidth="3" fill="#18181c"/>
                            <path d="M30 17v13l9 6" stroke="#f03262" strokeWidth="2.5" strokeLinecap="round"/>
                            <circle cx="30" cy="30" r="23" stroke="#fff" strokeDasharray="2 6" opacity="0.2"/>
                            <g>
                                <circle cx="30" cy="30" r="10" fill="#f03262" fillOpacity="0.08"/>
                                <path d="M24 38c2.7 2.5 9.3 2.5 12 0" stroke="#f03262" strokeWidth="2"
                                      strokeLinecap="round"/>
                                <ellipse cx="30" cy="28" rx="1.8" ry="1.8" fill="#fff"/>
                            </g>
                            <text x="30" y="54" textAnchor="middle" fontSize="12" fill="#f03262"
                                  fontWeight="bold">EXPIRED
                            </text>
                        </svg>
                    ) : (
                        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="drop-shadow-xl">
                            <circle cx="28" cy="28" r="26" fill="#18181c" stroke="#f03262" strokeWidth="2"/>
                            <rect x="18" y="24" width="20" height="14" rx="4" fill="#232339" stroke="#f03262"
                                  strokeWidth="1.5"/>
                            <path d="M28 31v-3" stroke="#f03262" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="28" cy="31" r="2" fill="#f03262"/>
                            <rect x="23" y="22" width="10" height="6" rx="3" fill="#101014" stroke="#f03262"
                                  strokeWidth="1"/>
                        </svg>
                    )}
                </div>
                <h2 className={`text-lg font-bold mb-4 text-center ${isExpired ? "text-yellow-400" : "text-red-400"}`}>
                    {isExpired ? "Your Plan Has Expired" : "Domain not allowed"}
                </h2>
                <div className="text-white text-center whitespace-pre-line mb-2">
                    {isExpired
                        ? "Your subscription plan has expired. Please renew or purchase a new plan to continue accessing this feature."
                        : message}
                </div>
                {showAllowed && (
                    <div className="mt-2 text-sm text-cyan-400 text-center">
                        Allowed domains: {userDomains.join(", ")}
                    </div>
                )}
                {isExpired && (
                    <a
                        href="/pricing"
                        className="mt-3 bg-[#f03262] hover:bg-[#c91d4e] text-white px-5 py-2 rounded-lg font-semibold shadow transition-all"
                    >
                        Renew / Choose Plan
                    </a>
                )}
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
    const { authState } = useAuth();

    // Plan & domain
    const [plan, setPlan] = useState(null);
    const [userDomains, setUserDomains] = useState([]);
    const [domainLoaded, setDomainLoaded] = useState(false);

    // Data & Fetching
    const [stealerData, setStealerData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSubscription, setHasSubscription] = useState(true);
    const [errorModal, setErrorModal] = useState({ show: false, message: "" });

    // Pagination
    const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
    const [pageInput, setPageInput] = useState(1);
    const [sizeInput, setSizeInput] = useState(10);

    // Domain Search (API)
    const [domain, setDomain] = useState("");
    const [showEmptyAlert, setShowEmptyAlert] = useState(false);

    // Local filter (search in table data, not API)
    const [localSearch, setLocalSearch] = useState("");

    // Marking
    const [markingId, setMarkingId] = useState(null);
    const [updatedIds, setUpdatedIds] = useState({});

    // Modal detail: simpan hanya id
    const [detailModal, setDetailModal] = useState({ show: false, id: null });

    const resultsRef = useRef(null);
    const tableRef = useRef(null);

    // Fetch plan & domain only (auth sudah dari context)
    useEffect(() => {
        if (authState !== "authenticated") {
            setDomainLoaded(true);
            return;
        }
        let ignore = false;
        (async () => {
            try {
                const planRes = await fetch("/api/my-plan", { credentials: "include" });
                if (planRes.ok) {
                    const planData = await planRes.json();
                    setPlan(planData.data);
                    setHasSubscription(!!planData.data);
                    if (planData.data?.domain !== "unlimited") {
                        const domains = Array.isArray(planData.data?.registered_domain) ? planData.data.registered_domain : [];
                        setUserDomains(domains);
                        if (!domain && domains.length > 0) setDomain(domains[0]);
                    }
                } else {
                    setHasSubscription(false);
                }
            } finally {
                if (!ignore) setDomainLoaded(true);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [authState]);

    // Fetch stealer data from API (domain, page, size)
    const fetchStealerData = async ({ domain: domainParam, page = 1, size = 10 }) => {
        setIsLoading(true);
        setShowEmptyAlert(false);

        let searchDomain = (domainParam && domainParam.trim());
        if (!searchDomain) {
            if (plan?.domain !== "unlimited" && userDomains.length > 0) {
                searchDomain = userDomains[0];
            }
        }
        if (!searchDomain) {
            setShowEmptyAlert(true);
            setStealerData([]);
            setIsLoading(false);
            return;
        }
        setDomain(searchDomain);

        const query = `domain=${encodeURIComponent(searchDomain)}&type=stealer&page=${page}&size=${size}`;
        let errorHappened = false;
        try {
            const res = await fetch(`/api/proxy?${query}`);
            if (res.status === 403) {
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
            if (!errorHappened) {
                setTimeout(() => {
                    if (resultsRef.current) {
                        resultsRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                }, 100);
            }
        }
    };

    // Handler: Search domain (API)
    const handleSearch = async () => {
        if (authState === "loading") return;
        if (authState !== "authenticated") {
            router.push("/login");
            return;
        }
        if (!domain.trim()) return;
        setPagination((prev) => ({ ...prev, page: 1 }));
        await fetchStealerData({ domain, page: 1, size: pagination.size });
    };

    // Handler: Pagination (API)
    const handlePagination = async (direction) => {
        let newPage = pagination.page;
        if (direction === "prev" && newPage > 1) newPage--;
        else if (direction === "next" && newPage * pagination.size < pagination.total) newPage++;
        setPagination((prev) => ({ ...prev, page: newPage }));
        await fetchStealerData({
            domain,
            page: newPage,
            size: pagination.size,
        });
    };

    // Handler: Page input (API)
    const handlePageInputChange = (e) => setPageInput(e.target.value);
    const handlePageInputBlur = async () => {
        let value = parseInt(pageInput, 10);
        if (isNaN(value) || value < 1) value = 1;
        const maxPage = Math.ceil(pagination.total / pagination.size) || 1;
        if (value > maxPage) value = maxPage;
        setPageInput(value);
        setPagination((prev) => ({ ...prev, page: value }));
        await fetchStealerData({
            domain,
            page: value,
            size: pagination.size,
        });
    };

    // Handler: Size input (API)
    const handleSizeInputChange = (e) => setSizeInput(e.target.value);
    const handleSizeInputBlur = async () => {
        let value = parseInt(sizeInput, 10);
        if (isNaN(value) || value < 1) value = 10;
        if (value > 1000) value = 1000;
        setSizeInput(value);
        setPagination((prev) => ({ ...prev, size: value, page: 1 }));
        await fetchStealerData({
            domain,
            page: 1,
            size: value,
        });
    };

    // Handler: Mark valid/not valid (API)
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

    // Local filter for displayed data in table (not API search)
    const filteredStealerData = localSearch
        ? stealerData.filter(item =>
            Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(localSearch.toLowerCase())
        )
        : stealerData;

    // Cari entry terbaru untuk modal (ALWAYS up-to-date)
    const currentEntry = filteredStealerData.find(e => e.id === detailModal.id);
    const effectiveValid =
        currentEntry && updatedIds[currentEntry.id] !== undefined
            ? updatedIds[currentEntry.id]
            : currentEntry?.valid;
    const entryForModal = currentEntry
        ? { ...currentEntry, valid: effectiveValid }
        : null;

    return (
        <div>
            <ErrorModal
                show={errorModal.show}
                message={errorModal.message}
                onClose={() => setErrorModal({ show: false, message: "" })}
                userDomains={userDomains}
                plan={plan}
            />
            <StealerDetailModal
                show={detailModal.show}
                entry={entryForModal}
                onClose={() => setDetailModal({ show: false, id: null })}
            />
            <div className="relative h-screen w-full">
                <CyberParticles />
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
                                onBlur={() => {
                                    if (
                                        !domain &&
                                        userDomains.length > 0 &&
                                        plan?.domain !== "unlimited"
                                    )
                                        setDomain(userDomains[0]);
                                }}
                                placeholder={
                                    plan?.domain === "unlimited"
                                        ? "Search by Domain"
                                        : `Search by Domain (${userDomains[0] || "your domain"})`
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && authState === "authenticated") {
                                        handleSearch();
                                    }
                                }}
                                className="input-glass bg-black text-white placeholder-gray-500 border border-gray-700 flex-1 px-4 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isLoading || !domain.trim()}
                                className={`${
                                    isLoading || !domain.trim()
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
                        {plan?.domain === "unlimited" ? null : (
                            <div className="mt-2 text-sm text-gray-400">
                                {userDomains.length > 0
                                    ? `Allowed domains: ${userDomains.join(", ")}`
                                    : "No domain available in your account. Please select a plan and register your domain to enable this feature."}
                            </div>
                        )}
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
                        <div className="mb-4 flex items-center gap-3 flex-wrap">
                            <input
                                type="text"
                                value={localSearch}
                                onChange={e => setLocalSearch(e.target.value)}
                                placeholder="Filter data in current results (e.g. email, password, etc)"
                                className="px-4 py-2 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                                style={{ minWidth: 170 }}
                            />
                        </div>
                        <div className="overflow-x-auto" ref={tableRef}>
                            {filteredStealerData.length > 0 ? (
                                <table
                                    className="w-full font-mono text-sm bg-gradient-to-br from-[#18181c] via-[#232339] to-[#18181c] border border-[#2e2e2e] rounded-xl shadow-2xl overflow-hidden">
                                    <thead>
                                    <tr className="text-left border-b border-[#2e2e2e] text-[#f03262] bg-gradient-to-r from-[#26263a] to-[#1e1e24]">
                                        <th className="py-4 px-4" width="600">Exposed Data</th>
                                        <th className="py-4 px-4">Intel Source</th>
                                        <th className="py-4 px-4">Last Seen in Dump</th>
                                        <th className="py-4 px-4 text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredStealerData.map((entry, index) => {
                                        const effectiveValid = updatedIds[entry.id] !== undefined
                                            ? updatedIds[entry.id]
                                            : entry.valid;
                                        return (
                                            <tr
                                                key={entry.id}
                                                className="border-b border-[#29293a] group transition-all duration-150 hover:bg-gradient-to-r from-[#232339] to-[#f03262]/10"
                                            >
                                                <ExposedData entry={entry} />
                                                <td className="py-4 px-4">
                                                    <span
                                                        className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 text-sm">
                                                        {entry.source}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400">
                                                        {entry.lastBreach}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                                                        <button
                                                            onClick={() => setDetailModal({ show: true, id: entry.id })}
                                                            className="bg-gradient-to-r from-[#18181c] to-[#f03262]/60 hover:from-[#232339] hover:to-[#f03262] text-pink-300 border border-[#f03262] px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 font-bold shadow-lg mr-2"
                                                        >
                                                            More Detail
                                                        </button>
                                                        {(() => {
                                                            if (effectiveValid === true) {
                                                                return (
                                                                    <button
                                                                        onClick={() => markAsValid(entry.id, false)}
                                                                        disabled={markingId === entry.id}
                                                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-1"
                                                                    >
                                                                        Mark as Not Valid
                                                                    </button>
                                                                );
                                                            }
                                                            if (effectiveValid === false) {
                                                                return (
                                                                    <button
                                                                        onClick={() => markAsValid(entry.id, true)}
                                                                        disabled={markingId === entry.id}
                                                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-1"
                                                                    >
                                                                        Mark as Valid
                                                                    </button>
                                                                );
                                                            }
                                                            return (
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
                                                            );
                                                        })()}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
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
                                            <th className="py-4 px-6  text-center">Actions</th>
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
                                <div
                                    className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-500 text-sm">
                                            Showing {filteredStealerData.length} of {pagination.total} entries
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