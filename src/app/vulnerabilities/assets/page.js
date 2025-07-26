'use client';

import React, {useEffect, useState} from "react";
import Navbar from "../../../components/navbar";
import {FaServer, FaBinoculars, FaSearch, FaSyncAlt, FaFilter, FaTrash} from "react-icons/fa";
import {useRouter} from "next/navigation";
import AssetGroupModal from "../../../components/vurnerability/AssetGroupModal";

const API_KEY = "cf9452c4-7a79-4352-a1d3-9de3ba517347";

// Utility
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

const tableHeadClasses = "py-3 px-4 text-xs font-semibold uppercase tracking-wide border-b border-gray-700 bg-[#19191c] text-gray-400";
const tableBodyClasses = "py-4 px-6 border-b border-gray-800 group hover:bg-[#23232b] transition";

// Main Page
const AssetGroups = () => {
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalGroupId, setModalGroupId] = useState(null);

    // Table/filter state
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const handleRowDetail = (item) => {
        setModalGroupId(item.id);
        setModalOpen(true);
    };


    // Fetch asset groups
    const fetchAssetGroups = async (search = false) => {
        setIsLoading(true);
        try {
            const offset = (page - 1) * size;
            const params = new URLSearchParams();
            params.append("offset", offset);
            params.append("limit", size);
            if (search && searchQuery.trim()) {
                params.append("search", searchQuery.trim());
            } else if (!search && searchInput.trim()) {
                params.append("search", searchInput.trim());
            }

            const options = {
                method: "GET",
                headers: {"X-API-Key": API_KEY},
            };

            // Default: show all if no search
            const url = `https://api.projectdiscovery.io/v1/asset/enumerate?${params.toString()}`;
            const res = await fetch(url, options);
            if (!res.ok) throw new Error("Failed to fetch asset groups");
            const result = await res.json();
            setData(Array.isArray(result.data) ? result.data : []);
            setTotal(result.total_results || result.result_count || 0);
            setTotalPages(result.total_pages || 1);
        } catch (e) {
            setData([]);
            setTotal(0);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssetGroups();
        // eslint-disable-next-line
    }, [page, size]);

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchQuery(searchInput);
        fetchAssetGroups(true);
    };


    return (
        <div className="bg-gradient-to-br from-[#161622] to-[#232339] text-white min-h-screen">
            <Navbar/>
            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Asset groups</h1>
                        <p className="text-gray-400 text-base">View and manage internet exposure using multiple
                            discovery tools.</p>
                    </div>

                </div>
                <div className="bg-[#18181c] rounded-2xl px-6 py-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center bg-[#20202b] rounded-lg px-4 py-2 w-full max-w-md"
                        >
                            <FaSearch className="text-gray-400 mr-2"/>
                            <input
                                type="text"
                                className="bg-transparent outline-none text-white w-full"
                                placeholder="Search asset groups"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                            />
                        </form>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            {/*<button*/}
                            {/*    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#23232b] hover:bg-[#28283a] text-gray-200 font-semibold shadow transition text-sm">*/}
                            {/*    <FaFilter/>*/}
                            {/*    <span>Filter by</span>*/}
                            {/*</button>*/}
                            {/*<button*/}
                            {/*    className="p-3 rounded-lg bg-[#23232b] hover:bg-[#28283a] text-gray-400 shadow transition text-sm"*/}
                            {/*    title="Delete selected">*/}
                            {/*    <FaTrash/>*/}
                            {/*</button>*/}
                            <button
                                className="p-3 rounded-lg bg-[#23232b] hover:bg-[#28283a] text-gray-400 shadow transition text-sm"
                                title="Refresh" onClick={() => fetchAssetGroups(true)}>
                                <FaSyncAlt/>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-[#22222b]">
                        <AssetGroupTable
                            data={data}
                            isLoading={isLoading}
                            formatAgo={formatAgo}
                            onRowDetail={handleRowDetail}
                        />
                    </div>
                    {/* Pagination */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 py-2 text-gray-400 text-xs">
                        <div>
                            <select
                                className="bg-[#23232b] px-2 py-1 rounded border border-gray-700 text-gray-200"
                                value={size}
                                onChange={e => {
                                    setSize(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                {[10, 20, 50, 100].map(s => <option key={s} value={s}>{s} per page</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <button
                                className="px-3 py-1 rounded bg-[#19191d] border border-gray-700 hover:bg-[#23232b] font-semibold"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >{"<"}</button>
                            <span>
                                Showing {(page - 1) * size + 1} - {Math.min(page * size, total)} of {total || "many"}
                            </span>
                            <button
                                className="px-3 py-1 rounded bg-[#19191d] border border-gray-700 hover:bg-[#23232b] font-semibold"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >{">"}</button>
                        </div>
                    </div>
                </div>
            </section>

            <AssetGroupModal open={modalOpen} onClose={() => setModalOpen(false)} groupId={modalGroupId} />
        </div>
    );
};


 function AssetGroupTable({ data, isLoading, formatAgo, onRowDetail }) {
    return (
        <div className="relative overflow-x-auto rounded-2xl border border-[#22222b] shadow-xl bg-[#19191d]">
            <table className="min-w-full font-mono text-[15px] leading-5 bg-[#19191d] rounded-xl">
                <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-[#17171b] to-[#22222a] text-gray-400 border-b border-gray-700">
                    <th className="py-3 px-4 text-xs font-semibold text-left w-2">
                        <input type="checkbox" className="form-checkbox h-4 w-4" disabled />
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-left">Assets</th>
                    <th className="py-3 px-4 text-xs font-semibold text-left w-44">Source</th>
                    <th className="py-3 px-4 text-xs font-semibold text-left w-44">Total services</th>
                    <th className="py-3 px-4 text-xs font-semibold text-left w-32">Duration</th>
                    <th className="py-3 px-4 text-xs font-semibold text-left w-32">Last Updated</th>
                    <th className="py-3 px-4 text-xs font-semibold text-left w-12"></th>
                </tr>
                </thead>
                <tbody>
                {isLoading && (
                    <tr>
                        <td colSpan={7} className="py-12 px-6 text-center text-pink-400 font-bold">
                            Loading...
                        </td>
                    </tr>
                )}
                {!isLoading && data.length === 0 && (
                    <tr>
                        <td colSpan={7} className="py-12 px-6 text-center text-gray-400">
                            <div className="flex flex-col items-center justify-center">
                                <svg className="w-12 h-12 mb-4 text-gray-600" fill="none"
                                     stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                          d="M9.172 16.172a4 4 0 0 1 5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                                </svg>
                                <p className="text-xl font-bold">No asset group data found</p>
                            </div>
                        </td>
                    </tr>
                )}
                {!isLoading && data.map((item, idx) => (
                    <tr key={item.id}
                        className="border-b border-gray-800 cursor-pointer group hover:bg-gradient-to-r from-[#19191d] to-[#23232b] hover:shadow-lg transition duration-150"
                        onClick={() => onRowDetail?.(item)}
                    >
                        <td className="py-4 px-4">
                            <input type="checkbox" disabled className="form-checkbox h-4 w-4" />
                        </td>
                        <td className="py-4 px-4 font-mono text-base text-white flex items-center gap-3">
                            <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-tr from-green-800 to-green-500 shadow flex items-center justify-center">
                                <FaServer className="text-green-100 text-base" />
                            </span>
                            <span className="hover:underline font-bold tracking-tight">{item.name}</span>
                        </td>
                        <td className="py-4 px-4 text-xs">
                            <span className="bg-[#21222b] px-3 py-1 rounded text-xs font-semibold text-gray-200 border border-gray-700 flex items-center gap-2 shadow">
                                <FaSearch className="mr-1 text-gray-400" />
                                Auto Discovery
                            </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-white flex gap-3 items-center">
                            <span>{item.total_assets || 1} services</span>
                            {item.new_assets > 0 && (
                                <span className="ml-2 px-3 py-1 rounded-full bg-green-900 text-green-400 text-xs font-bold animate-pulse">
                                    {item.new_assets} new
                                </span>
                            )}
                        </td>
                        <td className="py-4 px-4 text-gray-200 font-mono">
                            {item.enumeration_time
                                ? item.enumeration_time.split('.')[0].replace('s', 's')
                                : "-"}
                        </td>
                        <td className="py-4 px-4 text-gray-400 font-mono">
                            {formatAgo(item.updated_at)}
                        </td>
                        <td className="py-4 px-4 text-gray-500">
                            <button
                                className="p-2 rounded-full hover:bg-[#23232b] transition"
                                onClick={e => {
                                    e.stopPropagation();
                                    onRowDetail?.(item);
                                }}
                                title="Details"
                            >
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="12" cy="5" r="1"></circle>
                                    <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AssetGroups;