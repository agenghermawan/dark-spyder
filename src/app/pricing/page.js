'use client'
import Navbar from "../../components/navbar";
import Globe from "../../components/globe";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import Footer from "../../components/footer";

export default function PricingPage() {
    const [authState, setAuthState] = useState('loading');
    const [currentPlan, setCurrentPlan] = useState(null);
    const [remainingScans, setRemainingScans] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch("/api/me", {
                    credentials: "include",
                });
                if (res.ok) {
                    setAuthState('authenticated');
                    // Fetch current plan and usage
                    const [planRes, usageRes] = await Promise.all([
                        fetch("/api/user/plan"),
                        fetch("/api/user/usage")
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
                    setAuthState('unauthenticated');
                }
            } catch {
                setAuthState('unauthenticated');
            }
        };

        checkLoginStatus();
    }, []);

    const plans = [
        {
            id: "basic",
            domains: "1 Domain",
            price: "$600",
            period: "/month",
            description: "For small-scale security monitoring",
            features: [
                "Unlimited scans",
                "Unlimited assets per domain",
                "24/7 vulnerability scanning",
                "Real-time alerts",
                "Basic reporting"
            ],
            isCurrent: currentPlan?.planId === "basic",
            popular: false
        },
        {
            id: "professional",
            domains: "5 Domains",
            price: "$900",
            period: "/month",
            description: "For growing businesses",
            features: [
                "Unlimited scans",
                "Unlimited assets per domain",
                "Priority scanning queue",
                "Advanced reporting",
                "API access",
                "Email support"
            ],
            isCurrent: currentPlan?.planId === "professional",
            popular: false
        },
        {
            id: "enterprise",
            domains: "10 Domains",
            price: "$1,600",
            period: "/month",
            description: "For professional security teams",
            features: [
                "Unlimited scans",
                "Unlimited assets per domain",
                "Dedicated scan nodes",
                "Custom scan profiles",
                "Scheduled scanning",
                "Phone & email support"
            ],
            isCurrent: currentPlan?.planId === "enterprise",
            popular: false
        },
        {
            id: "business",
            domains: "20 Domains",
            price: "$2,700",
            period: "/month",
            description: "For enterprise security operations",
            features: [
                "Unlimited scans",
                "Unlimited assets per domain",
                "Dedicated account manager",
                "Compliance reporting",
                "Integration support",
                "24/7 technical support"
            ],
            isCurrent: currentPlan?.planId === "business",
            popular: false
        },
        {
            id: "premium",
            domains: "40 Domains",
            price: "$5,000",
            period: "/month",
            description: "For large-scale security programs",
            features: [
                "Unlimited scans",
                "Unlimited assets per domain",
                "Custom SLAs",
                "Executive reports",
                "Onboarding assistance",
                "Dedicated support line"
            ],
            isCurrent: currentPlan?.planId === "premium",
            popular: true
        },
        {
            id: "premium",
            domains: "60 Domains",
            price: "$6,000",
            period: "/month",
            description: "For large-scale security programs",
            features: [
                "Unlimited scans",
                "Unlimited assets per domain",
                "Custom SLAs",
                "Executive reports",
                "Onboarding assistance",
                "Dedicated support line"
            ],
            isCurrent: currentPlan?.planId === "premium",
            popular: false
        }
    ];

    return (
        <div className="relative overflow-x-hidden">
            <Navbar/>

            {/* Pricing Section */}
            <section
                className="relative bg-[#0D0D10] py-20 overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(circle at top left, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)',
                }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-white mb-4">Choose Your Scanning Plan</h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Flexible pricing based on the number of domains scanned per month
                        </p>
                        {authState === 'authenticated' && currentPlan?.planId === 'free' && remainingScans !== null && (
                            <div className="mt-4 bg-[#1A1B1E] inline-block px-4 py-2 rounded-lg">
                                <p className="text-[#f33d74] font-medium">
                                    You have {remainingScans} free scans remaining this month
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`bg-[#1A1B1E] rounded-2xl p-8 text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] relative ${
                                    plan.popular ? 'ring-2 ring-[#f33d74]' : ''
                                } ${
                                    plan.isCurrent ? 'border-2 border-green-500' : ''
                                }`}
                            >
                                {plan.isCurrent && (
                                    <div
                                        className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                        CURRENT PLAN
                                    </div>
                                )}

                                {plan.popular && (
                                    <div
                                        className="bg-[#f33d74] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                                        POPULAR
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold mb-2">{plan.domains}</h3>
                                <p className="text-gray-400 mb-6">{plan.description}</p>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-gray-400">{plan.period}</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <svg className="w-5 h-5 text-[#f33d74] mr-2 mt-0.5" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M5 13l4 4L19 7"/>
                                            </svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {authState === 'authenticated' ? (
                                    plan.isCurrent ? (
                                        <button
                                            className="w-full py-3 rounded-md font-medium bg-gray-600 cursor-not-allowed"
                                            disabled
                                        >
                                            Current Plan
                                        </button>
                                    ) : (
                                        <Link href={`/upgrade?plan=${plan.id}`}>
                                            <button className={`w-full py-3 rounded-md font-medium ${
                                                plan.popular ? 'bg-[#f33d74] hover:bg-[#e63368]' : 'bg-gray-700 hover:bg-gray-600'
                                            } transition-colors duration-300`}>
                                                {plan.id === 'free' ? 'Downgrade' : 'Upgrade Now'}
                                            </button>
                                        </Link>
                                    )
                                ) : (
                                    <Link href={{
                                        pathname: '/login',
                                        query: {redirect: `/pricing?highlight=${plan.id}`}
                                    }}>
                                        <button className={`w-full py-3 rounded-md font-medium ${
                                            plan.popular ? 'bg-[#f33d74] hover:bg-[#e63368]' : 'bg-gray-700 hover:bg-gray-600'
                                        } transition-colors duration-300`}>
                                            Get Started
                                        </button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Footer Section */}
            <Footer/>
        </div>
    )
}
