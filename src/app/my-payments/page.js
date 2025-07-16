'use client';

import { useEffect, useState } from "react";
import PaymentFlowModal from "../../components/pricing/payment_flow_modal";
import Navbar from "../../components/navbar";

export default function MyPaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [modalProps, setModalProps] = useState({});

    useEffect(() => {
        setLoading(true);
        fetch("/api/my-payment", { credentials: "include" })
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to fetch payments");
                return res.json();
            })
            .then((data) => {
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

    const handleShowModal = (payment) => {
        // If payment.payment exists, pass paymentData (skip asset selection)
        const isBypass = payment.payment?.Id === "x9BG0DgLaT6HY2RP";
        const domainLimit = Number(payment.domain) || 1; // fallback minimal 1

        if (payment.payment?.Id) {
            setModalProps({
                show: true,
                onClose: () => setShowPaymentModal(false),
                invoiceId: payment.invoice?.Id,
                idPricing: payment.id,
                plan: payment.plan,
                paymentData: payment.payment,
                forceRegisterDomain: isBypass,
                domainLimit,
            });
        } else {
            setModalProps({
                show: true,
                onClose: () => setShowPaymentModal(false),
                invoiceId: payment.invoice?.Id,
                idPricing: payment.id,
                plan: payment.plan,
                paymentData: null,
            });
        }
        setShowPaymentModal(true);
    };

    return (
        <div className="min-h-screen bg-[#161622] p-6">
            <Navbar />
            <PaymentFlowModal {...modalProps} show={showPaymentModal} />
            <div className="max-w-4xl mx-auto my-10 bg-[#232339] rounded-2xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">My Payments</h1>
                <p className="text-gray-400 mb-10 text-center">
                    For each invoice, complete payment and register your domain(s) to monitor.
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
                                <th className="py-2 px-2 text-center w-8">No</th>
                                <th className="py-2 px-2">Invoice ID</th>
                                <th className="py-2 px-2">Domain</th>
                                <th className="py-2 px-2">Plan</th>
                                <th className="py-2 px-2">Payment ID</th>
                                <th className="py-2 px-2">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payments.map((payment, idx) => {
                                const invoiceId = payment.invoice?.Id || "-";
                                const paymentId = payment.payment?.Id || "-";
                                return (
                                    <tr key={payment.id + idx} className="border-b border-gray-700">
                                        <td className="py-2 px-2 text-center font-bold">{idx + 1}</td>
                                        <td className="py-2 px-2">{invoiceId}</td>
                                        <td className="py-2 px-2">{payment.domain || "-"}</td>
                                        <td className="py-2 px-2 capitalize">{payment.plan || "-"}</td>
                                        <td className="py-2 px-2 font-mono">{paymentId}</td>
                                        <td className="py-2 px-2">
                                            <button
                                                onClick={() => handleShowModal(payment)}
                                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs font-semibold text-white transition"
                                            >
                                                {payment.payment?.Id
                                                    ? "Check Payment & Register Domain"
                                                    : "Pay Now"}
                                            </button>
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