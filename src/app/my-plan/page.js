'use client';

import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";

function RegisterDomainModal({ show, onClose, invoiceId, domainLimit, registeredDomains, onSuccess }) {
    const [domains, setDomains] = useState([""]);
    const [registering, setRegistering] = useState(false);
    const [registerError, setRegisterError] = useState(null);
    const [registerSuccess, setRegisterSuccess] = useState("");

    const maxToAdd = domainLimit;

    useEffect(() => {
        if (show) {
            setDomains(registeredDomains.length > 0 ? [...registeredDomains] : [""]);
            setRegisterError(null);
            setRegisterSuccess("");
            setRegistering(false);
        }
    }, [show, registeredDomains]);

    const handleAddDomain = () => {
        if (domains.length < maxToAdd) {
            setDomains([...domains, ""]);
        }
    };

    const handleRegisterDomain = async () => {
        setRegistering(true);
        setRegisterError(null);
        setRegisterSuccess("");
        try {
            const filteredDomains = domains.map(d => d.trim()).filter(Boolean);
            if (!filteredDomains.length) throw new Error("Please enter at least one domain.");
            if (filteredDomains.length > maxToAdd) throw new Error(`Maximum ${maxToAdd} domains allowed.`);
            if (!invoiceId) throw new Error("Invoice ID is missing.");
            const res = await fetch(`/api/register-domain?invoiceId=${invoiceId}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selected_domains: filteredDomains })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to register domains");
            setRegisterSuccess("Domains registered successfully!");
            setDomains(filteredDomains);
            if (onSuccess) onSuccess();
            onClose();
        } catch (e) {
            setRegisterError(e.message || "Failed to register domains.");
        } finally {
            setRegistering(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
            <div className="relative w-full max-w-md bg-[#232339] rounded-2xl shadow-xl p-6 animate-fade-in">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >×</button>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                    Register Domains
                </h2>
                <div className="mb-2 text-center text-gray-300 text-sm">
                    You can register up to <span className="font-bold text-yellow-400">{maxToAdd}</span> domains for this plan.
                </div>
                <div className="space-y-2">
                    {domains.map((domain, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                placeholder="Enter domain (e.g. example.com)"
                                value={domain}
                                onChange={e => {
                                    const newDomains = [...domains];
                                    newDomains[idx] = e.target.value;
                                    setDomains(newDomains);
                                }}
                            />
                            {domains.length > 1 && (
                                <button
                                    className="bg-red-600 hover:bg-red-700 px-2 rounded text-white text-sm font-bold"
                                    onClick={() => setDomains(domains.filter((_, i) => i !== idx))}
                                    title="Remove"
                                >-</button>
                            )}
                        </div>
                    ))}
                    <button
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm font-bold mt-1"
                        onClick={handleAddDomain}
                        disabled={domains.length >= maxToAdd}
                    >+ Add Domain</button>
                    {domains.length >= maxToAdd && (
                        <div className="text-xs text-yellow-400 mt-1">
                            Maximum {maxToAdd} domains allowed.
                        </div>
                    )}
                </div>
                <button
                    className="w-full py-2 rounded bg-[#f33d74] hover:bg-[#e63368] text-white font-bold mt-4"
                    onClick={handleRegisterDomain}
                    disabled={registering}
                >
                    {registering ? "Registering..." : "Register Domains"}
                </button>
                {registerError && <div className="text-red-400 mt-2">{registerError}</div>}
                {registerSuccess && <div className="text-green-400 mt-2">{registerSuccess}</div>}
            </div>
            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn .25s;
                }
                @keyframes fadeIn {
                    from { opacity:0; transform:scale(0.97);}
                    to { opacity:1; transform:scale(1);}
                }
            `}</style>
        </div>
    );
}

export default function MyPlanPage() {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        fetchPlan();
    }, []);

    const fetchPlan = () => {
        setLoading(true);
        fetch("/api/my-plan", { credentials: "include" })
            .then(async (res) => {
                // Jangan anggap error kalau status 200 meskipun plan-nya kosong
                const data = await res.json();
                if (data && data.data) {
                    setPlan(data.data);
                    setError(null);
                } else {
                    setPlan(null);
                    setError(null); // <-- pastikan error null, supaya render "No active plan found"
                }
            })
            .catch((err) => {
                setError(err.message || "Error loading plan");
                setPlan(null);
            })
            .finally(() => setLoading(false));
    };

    const domainsUsed = plan?.registered_domain?.length || 0;
    const domainsMax = Number(plan?.domain) || 0;

    return (
        <div className="min-h-screen bg-[#161622] p-6">
            <Navbar />
            <RegisterDomainModal
                show={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                invoiceId={plan?.plan}
                domainLimit={domainsMax}
                registeredDomains={plan?.registered_domain || []}
                onSuccess={fetchPlan}
            />
            <div className="max-w-2xl mx-auto my-10 bg-[#232339] rounded-2xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">My Plan</h1>
                {loading ? (
                    <div className="text-center text-gray-400">Loading plan info...</div>
                ) : error ? (
                    <div className="text-center text-red-400">{error}</div>
                ) : !plan ? (
                    <div className="text-center text-gray-400">No active plan found.</div>
                ) : (
                    <div>
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-4 justify-between items-center">
                                <div>
                                    <div className="text-gray-400 text-sm">Plan ID</div>
                                    <div className="text-white font-mono">{plan.plan}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-sm">Expired At</div>
                                    <div className="text-white">{plan.expired ? new Date(plan.expired).toLocaleString() : '-'}</div>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-4 items-center">
                                <div>
                                    <div className="text-gray-400 text-sm">Domain Limit</div>
                                    <div className="text-white text-xl font-bold">{domainsMax}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-sm">Registered</div>
                                    <div className="text-green-400 text-xl font-bold">{domainsUsed}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-sm">Remaining</div>
                                    <div className="text-yellow-400 text-xl font-bold">{domainsMax - domainsUsed}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-lg font-semibold text-white">Registered Domains</div>
                                {(domainsUsed < domainsMax) && (
                                    <button
                                        onClick={() => setShowRegisterModal(true)}
                                        className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-xs font-semibold text-white transition"
                                    >
                                        + Register New Domain
                                    </button>
                                )}
                            </div>
                            <ul className="bg-[#181825] rounded-lg p-4">
                                {plan.registered_domain?.length > 0 ? (
                                    plan.registered_domain.map((d, idx) => (
                                        <li key={idx} className="py-1 text-white font-mono border-b border-gray-800 last:border-b-0">{d}</li>
                                    ))
                                ) : (
                                    <li className="text-gray-400">No domains registered yet.</li>
                                )}
                            </ul>
                            {domainsUsed >= domainsMax && (
                                <div className="mt-4 text-yellow-400 text-center">
                                    Domain limit reached for this plan. Upgrade your plan to register more domains.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}