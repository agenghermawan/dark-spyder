"use client";
import Navbar from "../../../components/navbar";
import {useState, useEffect, useRef} from "react";
import {gsap} from "gsap";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {useRouter} from "next/navigation";
import LeakCardDynamic from '../../../components/leaks/leaks_card';
import LeaksParticles from "../../../components/leaks/leaks_particles";

gsap.registerPlugin(ScrollToPlugin);

export default function LeaksPage() {
    const router = useRouter();
    const DEFAULT_SIZE = 20;
    const [breachData, setBreachData] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // show all by default
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: DEFAULT_SIZE, total: 0 });
    const [sizeInput, setSizeInput] = useState(DEFAULT_SIZE);
    const [pageInput, setPageInput] = useState(1);
    const resultsRef = useRef(null);
    const tableRef = useRef(null);
    const [authState, setAuthState] = useState("loading");
    const [showEmptyAlert, setShowEmptyAlert] = useState(false);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); // <- supaya tidak auto-fetch di awal

    // Transform API data to card format (jangan sampai flatten lebih dari yang diterima)
    const transformBreachData = (apiData) => {
        return apiData.current_page_data
            .map((item) => {
                const source = item._source;
                const dataItem = Array.isArray(source?.Data) ? source.Data[0] : source?.Data;
                if (!dataItem) return null;
                const email = dataItem?.email || dataItem?.Email || "N/A";
                const fullName =
                    dataItem?.FullName ||
                    (dataItem?.FirstName && dataItem?.LastName
                        ? `${dataItem.FirstName} ${dataItem.LastName}`
                        : "N/A");
                const location =
                    dataItem?.Location ||
                    dataItem?.Region ||
                    dataItem?.Locality ||
                    (dataItem?.Country ? `${dataItem.Country}` : "N/A");
                const position =
                    dataItem?.Title ||
                    dataItem?.JobTitle ||
                    (dataItem?.fields?.includes("password")
                        ? "Credentials exposed"
                        : "N/A");
                const company =
                    dataItem?.CompanyName ||
                    dataItem?.JobCompanyName ||
                    (dataItem?.origin
                        ? `From: ${
                            Array.isArray(dataItem.origin)
                                ? dataItem.origin.join(", ")
                                : dataItem.origin
                        }`
                        : "N/A");
                const password =
                    dataItem?.password ||
                    (source?.source?.passwordless === 1
                        ? "No password exposed"
                        : "Not exposed");
                const breachDate =
                    source?.source?.breach_date ||
                    (source.Source === "LinkedIn Scraped Data"
                        ? "2021 (Scraped)"
                        : source.Source === "Stealer Logs"
                            ? "Recent"
                            : "Unknown date");
                const severity =
                    source.Source === "Stealer Logs"
                        ? "High"
                        : source.Source === "LinkedIn Scraped Data"
                            ? "Low"
                            : password !== "Not exposed"
                                ? "Critical"
                                : "Medium";
                return {
                    id: item._id,
                    email,
                    name: fullName,
                    firstName: dataItem?.FirstName,
                    lastName: dataItem?.LastName,
                    location,
                    position,
                    company,
                    summary: dataItem?.Summary || source?.Info || "No summary available",
                    source: source?.Source || "Unknown",
                    breachDate,
                    records:
                        source.Source === "LinkedIn Scraped Data"
                            ? "400M+ records"
                            : source.Source === "Stealer Logs"
                                ? "Compilation"
                                : "N/A",
                    severity,
                    passwordExposed: password,
                    additionalFields: dataItem?.fields || [],
                    rawData: dataItem,
                };
            })
            .filter(Boolean);
    };

    // Call update endpoint if no data found
    const callUpdateEndpoint = async () => {
        try {
            const response = await fetch(
                `/api/update?q=${encodeURIComponent(searchQuery)}&type=all`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (!response.ok) {
                console.error("Failed to trigger update endpoint.");
            }
        } catch (error) {
            console.error("Error calling update endpoint:", error);
        }
    };

    // Fetch data from API
    const loadNewData = async () => {
        try {
            setIsLoading(true);
            const { page, size } = pagination;
            const response = await fetch(
                `/api/leaks?q=${searchQuery}&type=breach&page=${page}&size=${size}`
            );
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.status} ${response.statusText}`
                );
            }
            const data = await response.json();
            if (!data.current_page_data || data.current_page_data.length === 0) {
                setBreachData([]);
                setShowEmptyAlert(true);
                await callUpdateEndpoint(); // tidak pakai await!
                setPagination((prev) => ({
                    ...prev,
                    total: 0
                }));


                return;
            } else {
                setShowEmptyAlert(false);
            }
            const transformedData = transformBreachData(data);
            setBreachData(transformedData);
            setPagination((prev) => ({
                ...prev,
                total: data.total || 0,
            }));
        } catch (error) {
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                if (resultsRef.current) {
                    import("gsap").then(({ default: gsap }) => {
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: { y: resultsRef.current, offsetY: 50 },
                            ease: "power3.out",
                        });
                    });
                }
            }, 100);
        }
    };

    // Handle user search
    const handleSearch = () => {
        if (authState === "loading" || isLoading) return;
        if (authState !== "authenticated") {
            router.push("/login");
            return;
        }

        setPagination(prev => ({
            ...prev,
            page: 1,
            size: sizeInput
        }));
        setShowEmptyAlert(false);
        setBreachData([]);
        setHasSearched(true);

        if (searchInput === searchQuery) {
            // Query tidak berubah, trigger manual
            loadNewData();
        } else {
            // Query berubah, biarkan useEffect yang tangani
            setSearchQuery(searchInput);
        }
    };

    // Pagination controls
    const handlePagination = (direction) => {
        if (isLoading) return;
        if (direction === "prev" && pagination.page > 1) {
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        } else if (
            direction === "next" &&
            pagination.page * pagination.size < pagination.total
        ) {
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    // Limit/Per Page input
    const handleSizeInputChange = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 1;
        setSizeInput(val);
    };

    const handleSizeInputKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSizeInputBlur(e);
        }
    };

    const handleSizeInputBlur = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 1;
        if (val < 1) val = 1;
        if (val > 1000) val = 1000;
        setSizeInput(val);
        setPagination(prev => ({
            ...prev,
            size: val,
            page: 1 // reset ke page 1 saat ubah limit
        }));
    };

    useEffect(() => { setPageInput(pagination.page); }, [pagination.page]);

    const handlePageInputKeyDown = (e) => {
        if (e.key === "Enter") {
            handlePageInputBlur(e);
        }
    };

    // Page input
    const handlePageInputChange = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 1;
        setPageInput(val);
    };
    const handlePageInputBlur = () => {
        let val = pageInput;
        const maxPage = Math.max(1, Math.ceil(pagination.total / pagination.size));
        if (val < 1) val = 1;
        if (val > maxPage) val = maxPage;
        setPageInput(val);
        setPagination(prev => ({
            ...prev,
            page: val
        }));
    };

    // Main effect to fetch data on search, page, or size change
    useEffect(() => {
        if (authState === "authenticated" && hasSearched) {
            loadNewData();
        }
        // eslint-disable-next-line
    }, [searchQuery, pagination.page, pagination.size, hasSearched, authState]);

    // On mount: check login/subscription
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch("/api/me", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setAuthState("authenticated");
                    setHasSubscription(data.user?.subscription?.status === "active");
                } else {
                    setAuthState("unauthenticated");
                }
            } catch {
                setAuthState("unauthenticated");
            }
        };
        checkLoginStatus();
    }, []);

    return (
        <div className="relative">
            <Navbar />
            <div className="relative h-screen w-full">
                <LeaksParticles />
                <section
                    className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-4">
                            Discover Exposed Credentials Instantly
                        </h2>
                        <p className="text-xl mb-8 text-gray-300">
                            Monitor the dark web for compromised emails, domains, and accounts.<br />
                            Protect your organization by searching global breach intelligence in seconds.
                        </p>
                        <div
                            className="flex flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden w-full">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Search by email, domain, or breach name..."
                                className="input-glass bg-black text-white placeholder-gray-500 border border-gray-700 flex-1 px-4 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[#0aafff] focus:border-transparent"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className={`${
                                    isLoading
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : authState !== "authenticated"
                                            ? "bg-gradient-to-r from-red-500 to-pink-500"
                                            : "bg-[#0aafff] hover:bg-[#0088cc]"
                                } text-white px-6 py-2 rounded-lg transition-all duration-300 font-semibold whitespace-nowrap flex items-center justify-center min-w-[120px]`}
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
                                        Querying
                                    </>
                                ) : (
                                    "Search Breaches"
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            {(breachData.length > 0 || showEmptyAlert) && (
                <section className="py-16 px-4 sm:px-6 lg:px-8" ref={resultsRef}>
                    <div className="max-w-7xl mx-auto">
                        <p className="text-sm uppercase text-cyan-500 mb-2 tracking-widest text-center">
                            {breachData[0]?.isTeaser
                                ? "🔒 Restricted Access"
                                : "🔍 Professional Data Exposure"}
                        </p>
                        <h2 className="text-4xl font-light text-white mb-8 text-center">
                            {breachData[0]?.isTeaser
                                ? "Upgrade to View Results"
                                : "Scraped Professional Profiles"}
                        </h2>
                        <div className="overflow-x-auto" ref={tableRef}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
                                {isLoading ? (
                                    <div className="col-span-full flex justify-center items-center py-16">
                                        <svg className="animate-spin h-12 w-12 text-cyan-400" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    </div>
                                ) : breachData.length === 0 && showEmptyAlert ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-16">
                                        <div className="text-4xl text-gray-700 mb-4">😕</div>
                                        <div className="text-lg text-gray-400">No results found for your search.</div>
                                    </div>
                                ) : (
                                    breachData.map((entry, idx) => (
                                        <LeakCardDynamic key={entry.id || idx} entry={entry} />
                                    ))
                                )}
                            </div>
                        </div>
                        {/* Pagination & info */}
                        <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                            <div className="flex items-center gap-2">
                                <p className="text-gray-500 text-sm">
                                    Showing {breachData.length} of {pagination.total} entries (Page {pagination.page})
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => handlePagination("prev")}
                                    disabled={pagination.page === 1 || isLoading}
                                    className={`px-4 py-2 text-sm ${
                                        pagination.page === 1 || isLoading
                                            ? "bg-gray-800 cursor-not-allowed"
                                            : "bg-gray-800 hover:bg-gray-700"
                                    } rounded-lg transition-colors`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePagination("next")}
                                    disabled={pagination.page * pagination.size >= pagination.total || isLoading}
                                    className={`px-4 py-2 text-sm ${
                                        pagination.page * pagination.size >= pagination.total || isLoading
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
                    </div>
                </section>
            )}
        </div>
    );
}