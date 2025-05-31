'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../components/navbar';
import Footer from '../..//components/footer';

export default function PricingPage() {
    const [authState, setAuthState] = useState('loading');
    const [currentPlan, setCurrentPlan] = useState(null);
    const [remainingScans, setRemainingScans] = useState(null);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

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

    const handlePlanSelect = (plan) => {
        if (authState === 'authenticated') {
            setSelectedPlan(plan);
            setShowSubscriptionModal(true);
        } else {
            // Redirect to login with plan highlight
            window.location.href = `/login?redirect=/pricing&highlight=${plan.id}`;
        }
    };

    const calculateDiscountedPrice = (basePrice, billingCycle) => {
        const baseAmount = parseFloat(basePrice.replace('$', ''));
        
        // Apply discounts based on billing cycle
        switch (billingCycle) {
            case 'yearly':
                return baseAmount * 10 * 0.8; // 20% discount for yearly
            case 'quarterly':
                return baseAmount * 3 * 0.9; // 10% discount for quarterly
            case 'monthly':
                return baseAmount;
            case 'weekly':
                return baseAmount / 4; // Weekly price is 1/4 of monthly
            default:
                return baseAmount;
        }
    };

    const handleAtlosPayment = (plan, billingCycle) => {
        const orderId = `order_${Date.now()}`;
        const orderAmount = calculateDiscountedPrice(plan.price, billingCycle);
        
        if (window.atlos) {
            window.atlos.Pay({
                merchantId: process.env.NEXT_PUBLIC_ATLOS_MERCHANT_ID || 'XYZ123',
                orderId: orderId,
                orderAmount: orderAmount,
                metadata: {
                    planId: plan.id,
                    billingCycle: billingCycle,
                    domains: plan.domains,
                    features: plan.features.join(', ')
                },
                onSuccess: () => {
                    // You can add success handling here
                    console.log('Payment successful');
                },
                onFailure: (error) => {
                    // You can add error handling here
                    console.error('Payment failed:', error);
                }
            });
        } else {
            console.error('Atlos payment script not loaded');
        }
    };

    const handleSubscriptionSelect = (billingCycle) => {
        handleAtlosPayment(selectedPlan, billingCycle);
        setShowSubscriptionModal(false);
    };

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
            {/* Atlos.io Payment Script */}
            <Script src="https://atlos.io/packages/app/atlos.js" strategy="afterInteractive" />
            
            <Navbar/>

            {/* Subscription Modal */}
            {showSubscriptionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1A1B1E] rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">Select Billing Cycle</h2>
                        <p className="text-gray-400 mb-6">Choose how often you want to be billed</p>
                        
                        <div className="space-y-3 mb-6">
                            <button 
                                onClick={() => handleSubscriptionSelect('weekly')}
                                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-left flex justify-between items-center"
                            >
                                <span>Weekly</span>
                                <span className="font-bold">
                                    ${calculateDiscountedPrice(selectedPlan.price, 'weekly').toFixed(2)}/week
                                </span>
                            </button>
                            
                            <button 
                                onClick={() => handleSubscriptionSelect('monthly')}
                                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-left flex justify-between items-center"
                            >
                                <span>Monthly</span>
                                <span className="font-bold">
                                    ${calculateDiscountedPrice(selectedPlan.price, 'monthly').toFixed(2)}/month
                                </span>
                            </button>
                            
                            <button 
                                onClick={() => handleSubscriptionSelect('quarterly')}
                                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-left flex justify-between items-center"
                            >
                                <span>Quarterly</span>
                                <span className="font-bold">
                                    ${calculateDiscountedPrice(selectedPlan.price, 'quarterly').toFixed(2)}/quarter
                                    <span className="text-sm text-green-400 ml-2">(Save 10%)</span>
                                </span>
                            </button>
                            
                            <button 
                                onClick={() => handleSubscriptionSelect('yearly')}
                                className="w-full py-3 px-4 bg-[#f33d74] hover:bg-[#e63368] rounded-md text-white text-left flex justify-between items-center"
                            >
                                <span>Yearly</span>
                                <span className="font-bold">
                                    ${calculateDiscountedPrice(selectedPlan.price, 'yearly').toFixed(2)}/year
                                    <span className="text-sm text-green-400 ml-2">(Save 20%)</span>
                                </span>
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => setShowSubscriptionModal(false)}
                            className="w-full py-2 text-gray-400 hover:text-white"
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
                                        <button 
                                            onClick={() => handlePlanSelect(plan)}
                                            className={`w-full py-3 rounded-md font-medium ${
                                                plan.popular ? 'bg-[#f33d74] hover:bg-[#e63368]' : 'bg-gray-700 hover:bg-gray-600'
                                            } transition-colors duration-300`}
                                        >
                                            Upgrade Now
                                        </button>
                                    )
                                ) : (
                                    <button 
                                        onClick={() => handlePlanSelect(plan)}
                                        className={`w-full py-3 rounded-md font-medium ${
                                            plan.popular ? 'bg-[#f33d74] hover:bg-[#e63368]' : 'bg-gray-700 hover:bg-gray-600'
                                        } transition-colors duration-300`}
                                    >
                                        Get Started
                                    </button>
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
