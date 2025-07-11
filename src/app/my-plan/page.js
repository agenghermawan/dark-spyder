'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyPaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/my-plan", { credentials: "include" })
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to fetch payments");
                return res.json();
            })
            .then((data) => {
                // Adjust to the response structure you provided
                if (data && Array.isArray(data.data)) {
                    setPayments(data.data);
                } else {
                    setPayments([]);
                }
            })
            .catch((err) => {
                setError(err.message || "Error loading payments");
                setPayments([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#161622] p-6">
            <div className="max-w-4xl mx-auto my-10 bg-[#232339] rounded-2xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">My Payments</h1>
                <p className="text-gray-400 mb-10 text-center">
                    View your subscription invoices and payment status. You can register your domain after a successful payment.
                </p>

                {loading ? (
                    <div className="text-center text-gray-400">Loading payments...</div>
                ) : error ? (
                    <div className="text-center text-red-400">{error}</div>
                ) : payments.length === 0 ? (
                    <div className="text-center text-gray-400">No payments found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-white">
                            <thead>
                            <tr className="border-b border-gray-600">
                                <th className="py-2 px-2">Invoice ID</th>
                                <th className="py-2 px-2">Domain</th>
                                <th className="py-2 px-2">Plan</th>
                                <th className="py-2 px-2">Status</th>
                                <th className="py-2 px-2">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payments.map((payment, idx) => {
                                const invoiceId = payment.invoice?.Id || "-";
                                // You might want to fetch status from another API or add it in the future
                                // For now, always show "Pay Now" since no payment status in your sample response
                                return (
                                    <tr key={invoiceId + idx} className="border-b border-gray-700">
                                        <td className="py-2 px-2">{invoiceId}</td>
                                        <td className="py-2 px-2">{payment.domain || "-"}</td>
                                        <td className="py-2 px-2 capitalize">{payment.plan || "-"}</td>
                                        <td className="py-2 px-2 text-yellow-400">Pending</td>
                                        <td className="py-2 px-2 flex gap-2">
                                            <a
                                                href={`https://atlos.io/payment/${invoiceId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#f33d74] hover:bg-[#e63368] px-3 py-1 rounded text-xs font-semibold text-white transition"
                                            >
                                                Pay Now
                                            </a>
                                            {/*
                                                  If you have the status (e.g., paid), show this:
                                                  <Link
                                                    href={`/register-domain?invoiceId=${invoiceId}`}
                                                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-semibold text-white transition"
                                                  >
                                                    Register Domain
                                                  </Link>
                                                */}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}