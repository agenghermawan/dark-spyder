'use client';

import Navbar from "@/components/dashboard/navbar";
import React, {useEffect, useState} from "react";
import {FaSpider, FaSearch} from "react-icons/fa";
import Footer from "@/components/dashboard/footer";

const Leaks = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Contoh data leaks
    const leaksData = [
        {id: 1, database: "MyHeritage.com", count: 89769623, breachDate: "2017-10", tags: "Top 10 passwords"},
        {id: 2, database: "BlackHatDevil.com", count: 804927, breachDate: "2018-05", tags: "Top 10 passwords"},
        {id: 3, database: "MineSerwer.pl", count: 11323, breachDate: "2019-12", tags: "Top 10 passwords"},
        // Tambahkan data lainnya di sini
    ];

    // Filter data berdasarkan search query
    const filteredData = leaksData.filter((leak) =>
        leak.database.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col items-center animate-pulse">
                    <FaSpider className="text-purple-500 text-6xl mb-4 animate-spin"/>
                    <h1 className="text-4xl font-bold text-green-400 tracking-widest glitch">
                        DARK SPYDER
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar/>
            <div className="bg-[#0A0A0A] text-white p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center mb-12 text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent mb-4">
                            🔍 Discover Exposed Credentials
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mb-6">
                            Stay ahead by monitoring leaked credentials and securing your assets. Explore our extensive
                            database of exposed data to protect your digital footprint.
                        </p>
                        {/* Subheader */}
                      
                    </div>


                    <div className="bg-[#141414] p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search database..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-[#1F1F1F] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                                    />
                                    <FaSearch className="absolute right-3 top-3 text-gray-400"/>
                                </div>
                            </div>
                            <span className="text-gray-400">Showing {filteredData.length} entries</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                <tr className="bg-[#1F1F1F] text-gray-400">
                                    <th className="px-6 py-3 text-left">Database</th>
                                    <th className="px-6 py-3 text-left">Count</th>
                                    <th className="px-6 py-3 text-left">Breach Date</th>
                                    <th className="px-6 py-3 text-left">Tags</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedData.map((leak) => (
                                    <tr key={leak.id}
                                        className="border-b border-[#1F1F1F] hover:bg-[#1F1F1F] transition-colors">
                                        <td className="px-6 py-4">{leak.database}</td>
                                        <td className="px-6 py-4">{leak.count.toLocaleString()}</td>
                                        <td className="px-6 py-4">{leak.breachDate}</td>
                                        <td className="px-6 py-4">{leak.tags}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-6">
              <span className="text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-[#1F1F1F] text-white rounded-lg disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-[#1F1F1F] text-white rounded-lg disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Leaks;
