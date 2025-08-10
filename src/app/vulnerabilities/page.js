"use client";

import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/navbar";
import LoadingSpinner from "../../components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import AssetDetailModal from "../../components/va/va_detail_modal";
import VAThemedParticles from "../../components/va/va_particles";

// ErrorModal with dark web SVG (copy this to components/va/ErrorModal.jsx if you want to reuse)
function ErrorModal({ show, message, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#232339] rounded-2xl shadow-xl p-6 max-w-md w-full relative flex flex-col items-center">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-2 mt-2 flex justify-center">
          {/* Dark web SVG */}
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="drop-shadow-xl">
            <circle cx="28" cy="28" r="26" fill="#18181c" stroke="#f03262" strokeWidth="2" />
            <rect x="18" y="24" width="20" height="14" rx="4" fill="#232339" stroke="#f03262" strokeWidth="1.5" />
            <path d="M28 31v-3" stroke="#f03262" strokeWidth="2" strokeLinecap="round" />
            <circle cx="28" cy="31" r="2" fill="#f03262" />
            <rect x="23" y="22" width="10" height="6" rx="3" fill="#101014" stroke="#f03262" strokeWidth="1" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-pink-400 mb-4 text-center">
          Subscription Required
        </h2>
        <div className="text-white text-center whitespace-pre-line">
          {message ||
            "To access vulnerability search, please purchase a subscription plan and register your domain."}
        </div>
      </div>
    </div>
  );
}

const API_KEY = "cf9452c4-7a79-4352-a1d3-9de3ba517347";
const severityColor = {
  critical: "bg-red-900 text-red-200",
  high: "bg-orange-900 text-orange-200",
  medium: "bg-yellow-900 text-yellow-200",
  low: "bg-green-900 text-green-200",
  info: "bg-gray-900 text-gray-200",
  unknown: "bg-gray-800 text-gray-300",
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

export default function VulnerabilitiesPage() {
  const router = useRouter();

  // Auth & Plan
  const [authState, setAuthState] = useState("loading");
  const [userDomains, setUserDomains] = useState([]);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [domainLoaded, setDomainLoaded] = useState(false);

  // Data & Fetching
  const [vulnData, setVulnData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // Modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const resultsRef = useRef(null);

  // Auth check & fetch domains & subscription
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        setAuthState(res.ok ? "authenticated" : "unauthenticated");
        if (res.ok) {
          const planRes = await fetch("/api/my-plan", { credentials: "include" });
          if (planRes.ok) {
            const planData = await planRes.json();
            const domains = Array.isArray(planData.data?.registered_domain)
              ? planData.data.registered_domain
              : [];
            setUserDomains(domains);
            setHasSubscription(planData.data?.active === true); // adjust this check to your API
            if (!domain && domains.length > 0) setDomain(domains[0]);
          }
        }
      } catch {
        setAuthState("unauthenticated");
      } finally {
        if (!ignore) setDomainLoaded(true);
      }
    })();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line
  }, []);

  // Fetch vulnerabilities data from API (domain, page, size)
  const fetchVulnData = async ({
    domain: domainParam,
    page = 1,
    size = 10,
  }) => {
    setIsLoading(true);
    setShowEmptyAlert(false);

    let searchDomain =
      (domainParam && domainParam.trim()) ||
      (userDomains.length > 0 ? userDomains[0] : "");
    if (!searchDomain) {
      setShowEmptyAlert(true);
      setVulnData([]);
      setIsLoading(false);
      return;
    }
    setDomain(searchDomain);

    const params = new URLSearchParams();
    params.append("type", "template");
    params.append("limit", size);
    params.append("offset", (page - 1) * size);
    params.append("vuln_status", "open,triaged,fix_in_progress");
    params.append("severity", "critical,high,medium,low,unknown");
    params.append("search", searchDomain);

    try {
      const options = {
        method: "GET",
        headers: { "X-API-Key": API_KEY },
      };
      const url = `https://api.projectdiscovery.io/v1/scans/results/filters?${params.toString()}`;
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("API not OK");
      const result = await res.json();

      const arr = Array.isArray(result.data) ? result.data : [];
      setVulnData(arr);
      setShowEmptyAlert(arr.length === 0);
      setPagination((prev) => ({
        ...prev,
        page,
        size,
        total: result.total_results || result.result_count || arr.length,
      }));
      setPageInput(page);
      setSizeInput(size);
    } catch (err) {
      setShowEmptyAlert(true);
      setVulnData([]);
      setErrorModal({
        show: true,
        message: err.message || "Failed to fetch data.",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  // Handler: Search domain (API)
  const handleSearch = async () => {
    if (authState === "loading") return;
    if (authState !== "authenticated") {
      router.push("/login");
      return;
    }
    // Validate subscription and domain before allowing search
    if (!hasSubscription || userDomains.length === 0) {
      setErrorModal({
        show: true,
        message:
          "You need an active subscription and a registered domain to use vulnerability search. Please purchase a plan and add your domain.",
      });
      return;
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
    await fetchVulnData({ domain: domain, page: 1, size: pagination.size });
  };

  // Handler: Pagination (API)
  const handlePagination = async (direction) => {
    let newPage = pagination.page;
    if (direction === "prev" && newPage > 1) newPage--;
    else if (
      direction === "next" &&
      newPage * pagination.size < pagination.total
    )
      newPage++;
    setPagination((prev) => ({ ...prev, page: newPage }));
    await fetchVulnData({
      domain: domain,
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
    await fetchVulnData({
      domain: domain,
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
    await fetchVulnData({
      domain: domain,
      page: 1,
      size: value,
    });
  };

  // Modal (detail)
  const handleRowClick = (item) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  // Local filter for table (not API search)
  const filteredVulnData = localSearch
    ? vulnData.filter(
        (item) =>
          (item.name || "").toLowerCase().includes(localSearch.toLowerCase()) ||
          (item.value || "").toLowerCase().includes(localSearch.toLowerCase()) ||
          (item.severity || "").toLowerCase().includes(localSearch.toLowerCase())
      )
    : vulnData;

  // Spinner saat auth check
  if (
    authState === "loading" ||
    (authState === "authenticated" && !domainLoaded)
  ) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#161622] text-white">
        <Navbar />
        <span className="mt-8 text-lg text-gray-400 animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <VAThemedParticles />
      <ErrorModal
        show={errorModal.show}
        message={errorModal.message}
        onClose={() => setErrorModal({ show: false, message: "" })}
      />
      <div className="relative h-screen w-full">
        <section className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Vulnerability Assessment
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              View open vulnerabilities found on your assets.
            </p>
            <div className="flex flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden w-full">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onBlur={() => {
                  if (!domain && userDomains.length > 0)
                    setDomain(userDomains[0]);
                }}
                placeholder={`Search by Domain (${userDomains[0] || "your domain"})`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && authState === "authenticated") {
                    handleSearch();
                  }
                }}
                className="input-glass bg-black text-white border border-gray-700 flex-1 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
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
              {userDomains.length > 0
                ? `Allowed domains: ${userDomains.join(", ")}`
                : "No domain available in your account. Please select a plan and register your domain to enable this feature."}
            </div>
          </div>
        </section>
      </div>
      {(vulnData.length > 0 || showEmptyAlert) && (
        <section className="py-16 px-4 sm:px-6 lg:px-8" ref={resultsRef}>
          <div className="w-10/12 mx-auto">
            <p className="text-sm uppercase text-green-500 mb-2 tracking-widest text-center">
              🛡️ Vulnerability Assessment
            </p>
            <h2 className="text-4xl font-light text-white mb-8 text-center">
              Open Vulnerabilities
            </h2>
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filter data in current results (e.g. template, severity, etc)"
                className="px-4 py-2 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                style={{ minWidth: 170 }}
              />
            </div>
            <div className="overflow-x-auto">
              {filteredVulnData.length > 0 ? (
                <table className="min-w-full bg-gradient-to-br from-[#111215]/90 via-[#1a1b20]/90 to-[#111215]/90 backdrop-blur-lg text-white rounded-xl shadow-2xl font-mono border border-[#2e2e2e] overflow-hidden">
                  <thead>
                    <tr className="text-left border-b border-gray-700 text-gray-400 bg-gradient-to-r from-[#1e1e24] to-[#2a2a32]">
                      <th className="py-4 px-6">Severity</th>
                      <th className="py-4 px-6">Title</th>
                      <th className="py-4 px-6">Count</th>
                      <th className="py-4 px-6">Template</th>
                      <th className="py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVulnData.map((item, idx) => (
                      <tr
                        key={item.value + idx}
                        className="border-b border-gray-800 hover:bg-gradient-to-r from-[#1a1a20] to-[#25252d] transition-all duration-300 group"
                      >
                        <td className="py-4 px-6">
                          <span
                            className={`px-4 py-1 rounded-full font-semibold ${
                              severityColor[
                                (item.severity || "critical").toLowerCase()
                              ] || severityColor["critical"]
                            }`}
                          >
                            {item.severity
                              ? item.severity.charAt(0).toUpperCase() +
                                item.severity.slice(1)
                              : "Critical"}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-white">
                          {item.name}
                        </td>
                        <td className="py-4 px-6">
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 text-xs font-mono">
                            {item.count}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-[#18181c] px-3 py-1 rounded text-xs font-mono text-gray-200 mr-1">
                            TEMPLATE
                          </span>
                          <span className="bg-[#23232b] px-2 py-1 rounded text-xs text-gray-300">
                            {item.value}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            className="px-4 py-2 rounded-lg bg-[#23232b] hover:bg-pink-600 text-pink-400 hover:text-white transition"
                            onClick={() => handleRowClick(item)}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                showEmptyAlert && (
                  <table className="min-w-full bg-gradient-to-br from-[#111215]/90 via-[#1a1b20]/90 to-[#111215]/90 backdrop-blur-lg text-white rounded-xl shadow-2xl font-mono border border-[#2e2e2e] overflow-hidden">
                    <thead>
                      <tr className="text-left border-b border-gray-700 text-gray-400 bg-gradient-to-r from-[#1e1e24] to-[#2a2a32]">
                        <th className="py-4 px-6">Severity</th>
                        <th className="py-4 px-6">Title</th>
                        <th className="py-4 px-6">Count</th>
                        <th className="py-4 px-6">Template</th>
                        <th className="py-4 px-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td
                          colSpan="5"
                          className="py-8 px-6 text-center text-gray-400"
                        >
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
                              No vulnerability data found
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
              <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-gray-500 text-sm">
                    Showing {filteredVulnData.length} of {pagination.total}{" "}
                    entries (Page {pagination.page})
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
                    disabled={
                      pagination.page * pagination.size >= pagination.total
                    }
                    className={`px-4 py-2 text-sm ${
                      pagination.page * pagination.size >= pagination.total
                        ? "bg-[#f03262]/50 cursor-not-allowed"
                        : "bg-[#f03262] hover:bg-[#c91d4e]"
                    } rounded-lg transition-colors`}
                  >
                    Next
                  </button>
                  <label className="ml-2 text-sm text-gray-300">
                    Limit/Per Page:
                  </label>
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
                    max={Math.max(
                      1,
                      Math.ceil(pagination.total / pagination.size)
                    )}
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onBlur={handlePageInputBlur}
                    className="w-16 px-2 py-2 rounded-md border border-gray-700 bg-black/30 text-white text-center focus:ring-2 focus:ring-[#f03262] focus:border-transparent"
                    title="Go to page"
                  />
                </div>
              </div>
            </div>
          </div>
          <AssetDetailModal
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            item={detailItem}
          />
        </section>
      )}
    </div>
  );
}