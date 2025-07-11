"use client";
import {useState, useEffect} from "react";
import Script from "next/script";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function PricingPage() {
    // Auth & usage
    const [authState, setAuthState] = useState("loading");
    const [currentPlan, setCurrentPlan] = useState(null);
    const [remainingScans, setRemainingScans] = useState(null);

    // Pricing
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(true);
    const [plansError, setPlansError] = useState(null);

    // Subscription Modal
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [subscriptionLoading, setSubscriptionLoading] = useState(false);

    // Asset List Modal
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [assetModalPlan, setAssetModalPlan] = useState(null);
    const [assetModalCycle, setAssetModalCycle] = useState(null);
    const [assets, setAssets] = useState([]);
    const [assetsLoading, setAssetsLoading] = useState(false);
    const [assetsError, setAssetsError] = useState(null);

    // Fetch user info
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch("/api/me", {credentials: "include"});
                if (res.ok) {
                    setAuthState("authenticated");
                    const [planRes, usageRes] = await Promise.all([
                        fetch("/api/user/plan"),
                        fetch("/api/user/usage"),
                    ]);
                    if (planRes.ok) {
                        const planData = await planRes.json();
                        setCurrentPlan(planData);
                    }
                    if (usageRes.ok) {
                        const usageData = await usageRes.json();
                        setRemainingScans(usageData.remainingScans);
                    }
                } else {
                    setAuthState("unauthenticated");
                }
            } catch {
                setAuthState("unauthenticated");
            }
        };
        checkLoginStatus();
    }, []);

    // Fetch pricing
    useEffect(() => {
        setPlansLoading(true);
        setPlansError(null);
        fetch("/api/pricing", {credentials: "include"})
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to load plans");
                const data = await res.json();
                setPlans(Array.isArray(data.data) ? data.data : []);
            })
            .catch((err) => {
                setPlansError(err.message || "Error loading plans");
                setPlans([]);
            })
            .finally(() => setPlansLoading(false));
    }, []);

    // Subscription Modal logic
    const handlePlanSelect = (plan) => {
        if (plan.isContact) {
            window.location.href = "/contact-sales";
            return;
        }
        if (authState === "authenticated") {
            setSelectedPlan(plan);
            setShowSubscriptionModal(true);
        } else {
            window.location.href = `/login?redirect=/pricing&highlight=${plan._id}`;
        }
    };

    const handleSubscriptionSelect = async (billingCycle) => {
        setSubscriptionLoading(true);
        try {
            const res = await fetch("/api/create-invoice", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    idPricing: selectedPlan._id,
                    plan: billingCycle,
                }),
            });
            if (!res.ok) throw new Error("Failed to create invoice");
            const data = await res.json();
            setShowSubscriptionModal(false);

            if (data.data.Id) {
                window.location.href = `https://atlos.io/payment/${data.data.Id}`;
            } else {
                throw new Error("Invoice ID not found in response");
            }
        } catch (err) {
            alert("Failed to create invoice: " + (err.message || "Unknown error"));
        } finally {
            setSubscriptionLoading(false);
        }
    };

    // Format price
    const formatPrice = (price, cycle) => {
        if (
            typeof price === "string" &&
            price.toLowerCase() === "contact sales"
        ) {
            return (
                <span className="text-3xl font-bold text-[#f33d74]">
          Contact Sales
        </span>
            );
        }
        if (!price || isNaN(Number(price))) return null;
        return (
            <>
        <span className="text-4xl font-bold">
          ${Number(price).toLocaleString()}
        </span>
                <span className="text-gray-400">/{cycle}</span>
            </>
        );
    };

    // Check current plan
    const isCurrentPlan = (plan) => {
        if (!currentPlan?.planId) return false;
        return (
            plan._id === currentPlan.planId ||
            (plan.domain === currentPlan.domain &&
                plan.features?.join() === currentPlan.features?.join())
        );
    };

    // Asset List Modal logic
    const handleShowAssetModal = (plan) => {
        setAssetModalPlan(plan);
        setAssetModalCycle(null);
        setAssets([]);
        setShowAssetModal(true);
        setAssetsError(null);
        setAssetsLoading(false);
    };

    // User selects billing cycle in asset modal
    const handleSelectAssetCycle = async (cycle) => {
        setAssetModalCycle(cycle);
        setAssetsLoading(true);
        setAssetsError(null);
        try {
            const res = await fetch("/api/asset-list", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    idPricing: assetModalPlan._id,
                    plan: cycle,
                }),
            });
            if (!res.ok) throw new Error("Failed to load asset list");
            const data = await res.json();
            setAssets(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            setAssetsError(err.message || "Error loading asset list");
            setAssets([]);
        } finally {
            setAssetsLoading(false);
        }
    };

    // UI render
    return (
        <div className="relative overflow-x-hidden">
            <Script
                src="https://atlos.io/packages/app/atlos.js"
                strategy="afterInteractive"
            />
            <Navbar/>

            {/* Asset List Modal */}
            {showAssetModal && assetModalPlan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1A1B1E] rounded-2xl p-8 max-w-md w-full relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-white"
                            onClick={() => setShowAssetModal(false)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Supported Coins & Blockchains
                        </h2>
                        <div className="mb-2 text-sm text-gray-400">
                            Plan:{" "}
                            <span className="text-white font-semibold">
                {assetModalPlan.domain === "unlimited"
                    ? "Unlimited Domains"
                    : `${assetModalPlan.domain} Domain${
                        assetModalPlan.domain === "1" ? "" : "s"
                    }`}
              </span>
                        </div>
                        <div className="mb-4 flex gap-1">
                            {["monthly", "quarterly", "yearly"].map((cycle) => (
                                <button
                                    key={cycle}
                                    onClick={() => handleSelectAssetCycle(cycle)}
                                    className={`px-3 py-1 rounded ${
                                        assetModalCycle === cycle
                                            ? "bg-[#f33d74] text-white"
                                            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                    } text-xs font-semibold transition`}
                                >
                                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                                </button>
                            ))}
                        </div>
                        {!assetModalCycle && (
                            <div className="text-gray-400 mb-2 text-xs">
                                Select a billing cycle to view the available assets.
                            </div>
                        )}
                        {assetModalCycle && (
                            <>
                                {assetsLoading ? (
                                    <div className="text-gray-400">Loading asset list...</div>
                                ) : assetsError ? (
                                    <div className="text-red-400">{assetsError}</div>
                                ) : assets.length === 0 ? (
                                    <div className="text-gray-400">No assets found for this plan.</div>
                                ) : (
                                    <ul className="divide-y divide-gray-700 max-h-72 overflow-y-auto">
                                        {assets.map((asset, idx) => (
                                            <li
                                                key={asset.Code + idx}
                                                className="py-2 flex flex-col gap-1 text-white"
                                            >
                        <span className="font-semibold">
                          {asset.Name} ({asset.Code})
                        </span>
                                                <span className="text-xs text-gray-400">
                          {asset.Blockchains &&
                              asset.Blockchains.map((bc, i) => (
                                  <span key={bc.ChainId + i}>
                                {i > 0 && " | "}
                                      {bc.Name} ({bc.Code})
                              </span>
                              ))}
                        </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                        <button
                            onClick={() => setShowAssetModal(false)}
                            className="mt-6 w-full py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Subscription Modal */}
            {showSubscriptionModal && selectedPlan && !selectedPlan.isContact && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1A1B1E] rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Choose Billing Cycle
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Select how often you want to be billed and proceed to payment.
                        </p>
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => handleSubscriptionSelect("monthly")}
                                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-left flex justify-between items-center"
                                disabled={subscriptionLoading}
                            >
                                <span>Monthly</span>
                                <span className="font-bold">
                  $
                                    {Number(selectedPlan.monthly).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    /month
                </span>
                            </button>
                            <button
                                onClick={() => handleSubscriptionSelect("quarterly")}
                                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-left flex justify-between items-center"
                                disabled={subscriptionLoading}
                            >
                                <span>Quarterly</span>
                                <span className="font-bold">
                  $
                                    {Number(selectedPlan.quarterly).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    /quarter
                  <span className="text-sm text-green-400 ml-2">
                    (Save 10%)
                  </span>
                </span>
                            </button>
                            <button
                                onClick={() => handleSubscriptionSelect("yearly")}
                                className="w-full py-3 px-4 bg-[#f33d74] hover:bg-[#e63368] rounded-md text-white text-left flex justify-between items-center"
                                disabled={subscriptionLoading}
                            >
                                <span>Yearly</span>
                                <span className="font-bold">
                  $
                                    {Number(selectedPlan.yearly).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    /year
                  <span className="text-sm text-green-400 ml-2">
                    (Save 20%)
                  </span>
                </span>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowSubscriptionModal(false)}
                            className="w-full py-2 text-gray-400 hover:text-white"
                            disabled={subscriptionLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Pricing Section */}
            <section
                className="relative bg-[#0D0D10] py-20 overflow-hidden"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at top left, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)",
                }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Choose Your Scanning Plan
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Flexible pricing based on the number of domains you want to scan per month.
                            <br/>
                            <button
                                className="underline text-[#f33d74] hover:text-[#e63368] transition"
                                onClick={() => handleShowAssetModal(plans[0] || {})}
                                type="button"
                            >
                                View supported coins & blockchains &rarr;
                            </button>
                        </p>
                        {authState === "authenticated" &&
                            currentPlan?.planId === "free" &&
                            remainingScans !== null && (
                                <div className="mt-4 bg-[#1A1B1E] inline-block px-4 py-2 rounded-lg">
                                    <p className="text-[#f33d74] font-medium">
                                        You have {remainingScans} free scans remaining this month
                                    </p>
                                </div>
                            )}
                    </div>
                    {/* Show loading/error */}
                    {plansLoading ? (
                        <div className="text-center text-gray-400">Loading plans...</div>
                    ) : plansError ? (
                        <div className="text-center text-red-400">{plansError}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {plans.map((plan, index) => {
                                const isCurrent = isCurrentPlan(plan);
                                return (
                                    <div
                                        key={plan._id}
                                        className={`bg-[#1A1B1E] rounded-2xl p-8 text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] relative
                    ${plan.isPopular ? "ring-2 ring-[#f33d74]" : ""}
                    ${isCurrent ? "border-2 border-green-500" : ""}`}
                                    >
                                        {isCurrent && (
                                            <div
                                                className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                                CURRENT PLAN
                                            </div>
                                        )}
                                        {plan.isPopular && (
                                            <div
                                                className="bg-[#f33d74] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                                                POPULAR
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold mb-2">
                                            {plan.domain === "unlimited"
                                                ? "Unlimited Domains"
                                                : `${plan.domain} Domain${
                                                    plan.domain === "1" ? "" : "s"
                                                }`}
                                        </h3>
                                        <p className="text-gray-400 mb-6">{plan.description}</p>
                                        <div className="mb-6">
                                            {plan.isContact ? (
                                                <span className="text-3xl font-bold text-[#f33d74]">
                          Contact Sales
                        </span>
                                            ) : (
                                                <>
                                                    {formatPrice(plan.monthly, "month")}
                                                </>
                                            )}
                                        </div>
                                        <ul className="space-y-3 mb-8">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <svg
                                                        className="w-5 h-5 text-[#f33d74] mr-2 mt-0.5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleShowAssetModal(plan)}
                                                className="w-full py-2 rounded-md font-medium bg-gray-700 hover:bg-gray-600 transition-colors duration-300 text-xs"
                                                type="button"
                                            >
                                                View Coins & Blockchains
                                            </button>
                                            {plan.isContact ? (
                                                <a
                                                    href="/contact"
                                                    className="w-full block py-2 rounded-md font-medium bg-[#f33d74] hover:bg-[#e63368] text-center transition-colors duration-300 text-xs"
                                                >
                                                    Contact Sales
                                                </a>
                                            ) : authState === "authenticated" ? (
                                                isCurrent ? (
                                                    <button
                                                        className="w-full py-2 rounded-md font-medium bg-gray-600 cursor-not-allowed text-xs"
                                                        disabled
                                                    >
                                                        Current Plan
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePlanSelect(plan)}
                                                        className={`w-full py-2 rounded-md font-medium ${
                                                            plan.isPopular
                                                                ? "bg-[#f33d74] hover:bg-[#e63368]"
                                                                : "bg-gray-700 hover:bg-gray-600"
                                                        } transition-colors duration-300 text-xs`}
                                                    >
                                                        Upgrade Now
                                                    </button>
                                                )
                                            ) : (
                                                <button
                                                    onClick={() => handlePlanSelect(plan)}
                                                    className={`w-full py-2 rounded-md font-medium ${
                                                        plan.isPopular
                                                            ? "bg-[#f33d74] hover:bg-[#e63368]"
                                                            : "bg-gray-700 hover:bg-gray-600"
                                                    } transition-colors duration-300 text-xs`}
                                                >
                                                    {plan.isContact ? "Contact Sales" : "Get Started"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
            <Footer/>
        </div>
    );
}