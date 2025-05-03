'use client';
import Navbar from "@/components/navbar";
import Globe from "@/components/globe";
import Image from "next/image";
import {useState} from "react";
import { gsap } from "gsap";

export default function Home() {
    const [activeTab, setActiveTab] = useState('law');

    return (<div className="relative">
        <Navbar/>

        {/* Globe background */}
        <div className="relative h-screen w-full">
            <Globe/>

            {/* Floating text on top of Globe */}
            <section
                className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Detect real vulnerabilities
                    </h2>
                    <p className="text-xl mb-8">
                        Harness the power of Nuclei for fast and accurate <br/> findings without false
                        positives.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden">
                        <input
                            type="text"
                            placeholder="Enter your domain to get started"
                            className="input-glass"
                        />
                        <button
                            className="bg-[#f03262] hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300">
                            Discover
                        </button>
                    </div>
                </div>
            </section>
        </div>

        {/* Now normal content continues */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-light text-white mb-12 text-center">Products</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Product 1 */}
                    <div className="bg-[#1b1e25] p-6 rounded-lg shadow-lg text-white flex flex-col">
                        <div className="flex flex-row items-center mb-4 gap-2">
                            <Image
                                src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/648428d13422cd6b71b2aae4_Verified.svg"
                                alt="icon 1" width={24} height={24}
                            />
                            <h3 className="text-xl font-semibold">Darkweb Tracker</h3>
                        </div>
                        <p className="mb-4">
                            A deep and dark web intelligence platform, Darkweb Tracker is the complete digital forensics
                            tool for investigators. Look up threat information, trace relations between data, and
                            visualize the investigation on an easy-to-use canvas.
                        </p>
                        <div className="mt-auto">
                            <a href="#"
                               className="font-medium inline-flex items-center bg-[#373940] px-4 py-2 rounded-lg">
                                Learn more <span className="ml-1">→</span>
                            </a>
                        </div>
                    </div>

                    {/* Product 2 */}
                    <div className="bg-[#1b1e25] p-6 rounded-lg shadow-lg text-white flex flex-col">
                        <div className="flex flex-row items-center mb-4 gap-2">
                            <Image
                                src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/64822037a880b5a21319bdd0_Locker%20%E2%80%94%20Closed.svg"
                                alt="icon 2" width={24} height={24}
                            />
                            <h3 className="text-xl font-semibold">Credential Protection</h3>
                        </div>
                        <p className="mb-4">
                            Detect and identify account credentials that have been leaked into the dark web as a result
                            of breach incidents. Swiftly take action to address vulnerabilities within the organization.
                        </p>
                        <div className="mt-auto">
                            <a href="#"
                               className="font-medium inline-flex items-center bg-[#373940] px-4 py-2 rounded-lg">
                                Learn more <span className="ml-1">→</span>
                            </a>
                        </div>
                    </div>

                    {/* Product 3 */}
                    <div className="bg-[#1b1e25] p-6 rounded-lg shadow-lg text-white flex flex-col">
                        <div className="flex flex-row items-center mb-4 gap-2">
                            <Image
                                src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/648220373743a62ee771eb5d_Search.svg"
                                alt="icon 3" width={24} height={24}
                            />
                            <h3 className="text-xl font-semibold">Dark Web Monitoring</h3>
                        </div>
                        <p className="mb-4">
                            Track and list down organizations whose data has been breached and leaked onto the deep and
                            dark web. With 24/7 surveillance, act on any relevant leaks with efficiency and accuracy.
                        </p>
                        <div className="mt-auto">
                            <a href="#"
                               className="font-medium inline-flex items-center bg-[#373940] px-4 py-2 rounded-lg">
                                Learn more <span className="ml-1">→</span>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        {/* Last section with image */}
        <div className="flex flex-col md:flex-row p-4 text-center md:p-0 justify-center items-center h-screen mt-[-120px]">
            <div>
                <Image
                    src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/660476aebba28791e873d4fe_Stealthmole%20Intelligence%20(compressed)-p-2000.webp"
                    alt="logo"
                    width={1000}
                    height={1000}
                />
            </div>
            <div>
                <h3 className="text-white text-4xl font-bold" style={{marginTop: "100px"}}>
                    Monitor and protect with Asia's leading AI powered dark web threat intelligence
                </h3>
            </div>
        </div>

        <section className="py-16 px-4 sm:px-6 lg:px-8"
                 style={{
                     backgroundColor: '#0D0D10', // warna dasar hitam gelap
                     backgroundImage: 'radial-gradient(circle at top left, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)',
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: 'cover',
                 }}
        >
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-light text-white mb-12 text-center">Use Cases</h2>

                <div className="flex justify-center mb-8">
                    <div className="flex bg-[#0D0D10] rounded-full p-2 gap-2">
                        <button
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeTab === 'law' ? 'bg-[#F33D74] text-white' : 'text-white'
                            }`}
                            onClick={() => setActiveTab('law')}
                        >
                            Law Enforcement Agencies
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeTab === 'gov' ? 'bg-[#F33D74] text-white' : 'text-white'
                            }`}
                            onClick={() => setActiveTab('gov')}
                        >
                            Governments
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeTab === 'enterprise' ? 'bg-[#F33D74] text-white' : 'text-white'
                            }`}
                            onClick={() => setActiveTab('enterprise')}
                        >
                            Enterprises
                        </button>
                    </div>
                </div>

                {/* Content based on active tab */}
                <div className="flex flex-col items-center text-center">
                    {activeTab === 'law' && (
                        <>
                            <Image
                                src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6485ee54cdba2a48dbe7edce_matt-popovich-7mqsZsE6FaU-unsplash.jpg"
                                alt="Law Enforcement"
                                width={900}
                                height={500}
                                className="rounded-2xl mb-4"
                            />
                            <h3 className="text-2xl font-semibold text-white mb-4">Law Enforcement Agencies</h3>
                            <p className="text-gray-400 max-w-3xl leading-relaxed">
                                StealthMole provides Law Enforcement Agencies with powerful tools necessary to
                                efficiently and effectively
                                gather insights on criminal activities, investigate cybercrimes, and identify potential
                                threats.
                                Using the platform, LEAs can automate a significant amount of their investigation
                                efforts,
                                saving valuable time and resources and enhancing their capacity to protect and save
                                lives.
                            </p>
                        </>
                    )}

                    {activeTab === 'gov' && (
                        <>
                            <Image
                                src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6485ee66ad4a2634dfaa52f7_sebastian-pichler-bAQH53VquTc-unsplash.jpg"
                                alt="Law Enforcement"
                                width={900}
                                height={500}
                                className="rounded-2xl mb-4"
                            />

                            <h3 className="text-2xl font-semibold text-white mb-4">Governments</h3>
                            <p className="text-gray-400 max-w-3xl leading-relaxed">
                                Empower government agencies with threat intelligence, risk management, and critical
                                infrastructure protection solutions.
                                StealthMole helps governments proactively respond to emerging digital threats and ensure
                                national security.
                            </p>
                        </>
                    )}

                    {activeTab === 'enterprise' && (
                        <>

                            <Image
                                src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6485ee7025afd798f170a8d9_sean-pollock-PhYq704ffdA-unsplash-p-1080.jpg"
                                alt="Law Enforcement"
                                width={900}
                                height={500}
                                className="rounded-2xl mb-4"
                            />

                            <h3 className="text-2xl font-semibold text-white mb-4">Enterprises</h3>
                            <p className="text-gray-400 max-w-3xl leading-relaxed">
                                Enterprises can leverage StealthMole to monitor data breaches, safeguard their brand
                                reputation,
                                and mitigate cyber risks. Our platform delivers real-time insights to protect business
                                assets from online threats.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>

        <section className="relative bg-[#0D0D10] overflow-hidden"
                 style={{
                     backgroundColor: '#0D0D10', // warna dasar hitam gelap
                     backgroundImage: 'radial-gradient(circle at bottom right, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)',
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: 'cover',
                 }}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#8a004f]/30"/>

            {/* Footer Card */}
            <div className="relative max-w-7xl mx-auto px-6 py-16">
                <div className="bg-[#1A1B1E] rounded-2xl px-10 py-16 text-white">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-semibold mb-4">Uncover hidden threats with StealthMole</h2>
                        <p className="text-gray-400 mb-6">
                            Talk to us to learn how you can build a solid cyber defense strategy today
                        </p>
                        <button
                            className="bg-[#f33d74] hover:bg-[#e63368] text-white px-6 py-3 rounded-md text-sm font-medium">
                            Request demo
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-sm text-gray-400">
                        <div>
                            <h3 className="text-white font-medium mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">About</a></li>
                                <li><a href="#" className="hover:underline">Contact us</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">Blog</a></li>
                                <li><a href="#" className="hover:underline">Webinars</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-4">Products</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">Darkweb Tracker</a></li>
                                <li><a href="#" className="hover:underline">Credential Protection</a></li>
                                <li><a href="#" className="hover:underline">Incident Monitoring</a></li>
                                <li><a href="#" className="hover:underline">Telegram Tracker</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-4">Sectors</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">Law Enforcement Agencies</a></li>
                                <li><a href="#" className="hover:underline">Governments</a></li>
                                <li><a href="#" className="hover:underline">Enterprises</a></li>
                            </ul>
                        </div>

                        <div className="col-span-2">
                            <h3 className="text-white font-medium mb-4">Get in Touch</h3>
                            <p>2 Venture Drive, #09-01 Vision Exchange, Singapore 608526</p>
                            <p className="mt-2">sales@stealthmole.com</p>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div
                        className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6495604fb7188b7b3e3edd45_Logotype.svg"
                                alt="StealthMole" width={80} height={80}/>

                            <span>2025. All rights reserved</span>
                        </div>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="hover:underline">Terms & Conditions</a>
                            <a href="#" className="hover:underline">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>)
}