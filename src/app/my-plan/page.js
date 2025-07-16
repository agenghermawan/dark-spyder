'use client';

import {useEffect, useState} from "react";
import Navbar from "../../components/navbar";

export default function MyPlanPage() {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/my-plan", {credentials: "include"})
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to fetch plan");
                return res.json();
            })
            .then((data) => {
                // Data example: { data: { domain, expired, plan, registered_domain: [] }, ... }
                if (data && data.data) {
                    setPlan(data.data);
                } else {
                    setPlan(null);
                }
            })
            .catch((err) => {
                setError(err.message || "Error loading plan");
                setPlan(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const domainsUsed = plan?.registered_domain?.length || 0;
    const domainsMax = Number(plan?.domain) || 0;

    return (
        <div className="min-h-screen bg-[#161622] p-6">
            <Navbar/>
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
                                    <div
                                        className="text-white">{plan.expired ? new Date(plan.expired).toLocaleString() : '-'}</div>
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
                                    <a
                                        href="/register-domain"
                                        className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-xs font-semibold text-white transition"
                                    >
                                        + Register New Domain
                                    </a>
                                )}
                            </div>
                            <ul className="bg-[#181825] rounded-lg p-4">
                                {plan.registered_domain?.length > 0 ? (
                                    plan.registered_domain.map((d, idx) => (
                                        <li key={idx}
                                            className="py-1 text-white font-mono border-b border-gray-800 last:border-b-0">{d}</li>
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