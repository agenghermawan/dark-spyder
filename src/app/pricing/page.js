'use client'
import Navbar from "@/components/navbar";
import Globe from "@/components/globe";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";

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
            <section
                className="relative bg-[#0D0D10] overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(circle at bottom right, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)',
                }}
            >
                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="bg-[#1A1B1E] rounded-2xl px-10 py-16 text-white shadow-2xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-semibold mb-4">Uncover hidden threats with StealthMole</h2>
                            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                Talk to our experts to learn how you can build a solid cyber defense strategy tailored
                                to your organization's needs
                            </p>
                            <button
                                className="bg-[#f33d74] hover:bg-[#e63368] text-white px-8 py-3 rounded-md text-sm font-medium hover:scale-105 transition-transform duration-300">
                                Request demo
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-sm text-gray-400">
                            {/* Footer links sections */}
                            {[
                                {
                                    title: "Company",
                                    links: ["About", "Contact us"]
                                },
                                {
                                    title: "Resources",
                                    links: ["Blog", "Webinars", "Case Studies"]
                                },
                                {
                                    title: "Products",
                                    links: ["Darkweb Tracker", "Credential Protection", "Incident Monitoring", "Telegram Tracker"]
                                },
                                {
                                    title: "Sectors",
                                    links: ["Law Enforcement Agencies", "Governments", "Enterprises", "Financial Services"]
                                },
                                {
                                    title: "Legal",
                                    links: ["Terms & Conditions", "Privacy Policy", "GDPR Compliance"]
                                }
                            ].map((section, index) => (
                                <div key={index}>
                                    <h3 className="text-white font-medium mb-4">{section.title}</h3>
                                    <ul className="space-y-2">
                                        {section.links.map((link, linkIndex) => (
                                            <li key={linkIndex}>
                                                <a href="#"
                                                   className="hover:underline hover:text-[#f33d74] transition-colors duration-300">
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div>
                                <h3 className="text-white font-medium mb-4">Get in Touch</h3>
                                <p className="mb-2">2 Venture Drive, #09-01</p>
                                <p className="mb-2">Vision Exchange, Singapore 608526</p>
                                <p className="mb-4">sales@stealthmole.com</p>
                                <div className="flex space-x-4">
                                    <a href="#" className="hover:text-[#f33d74] transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-[#f33d74] transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-[#f33d74] transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Footer */}
                        <div
                            className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                                <Image
                                    src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6495604fb7188b7b3e3edd45_Logotype.svg"
                                    alt="StealthMole"
                                    width={100}
                                    height={40}
                                />
                                <span>© 2025 StealthMole. All rights reserved</span>
                            </div>
                            <div className="flex space-x-4 mt-4 md:mt-0">
                                <a href="#"
                                   className="hover:underline hover:text-[#f33d74] transition-colors duration-300">Terms
                                    & Conditions</a>
                                <a href="#"
                                   className="hover:underline hover:text-[#f33d74] transition-colors duration-300">Privacy
                                    Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
