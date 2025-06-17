"use client";
import Navbar from "../components/navbar";
import Globe from "../components/globe";
import Footer from "../components/footer";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  EyeIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ShieldExclamationIcon,
  GlobeEuropeAfricaIcon,
  BuildingOffice2Icon,
  SignalIcon,
  CpuChipIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("law");

  const handleDiscover = () => {
    router.push(`/dark_web/stealer?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="relative overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen w-full">
        <Globe />

        <section className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Detect real vulnerabilities
            </h2>
            <p className="text-xl md:text-2xl mb-8 animate-fade-in">
              Harness the power of Nuclei for fast and accurate{" "}
              <br className="hidden md:block" /> findings without false
              positives.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto shadow-lg rounded-lg overflow-hidden animate-fade-in">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your domain to get started"
                className="input-glass flex-grow px-4 py-3 bg-black/20 backdrop-blur-md border border-white/10 focus:border-[#f03262]/50 focus:outline-none transition-all duration-300 text-white placeholder-white/70"
                onKeyDown={(e) => e.key === "Enter" && handleDiscover()}
              />
              <button
                onClick={handleDiscover}
                className="bg-[#f03262] hover:bg-[#d82a56] text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 transform"
              >
                Discover
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Products Section - Dark Theme */}
      <section className="py-20 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#f03262] font-mono text-sm tracking-widest">
              OUR SOLUTIONS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-4">
              Advanced Threat Intelligence
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#f03262] to-[#d82a56] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <EyeIcon className="w-8 h-8 text-[#f03262]" />,
                title: "Darkweb Tracker",
                description:
                  "Our platform maps relationships between threat actors, compromised data, and criminal networks across dark web markets and forums.",
                features: [
                  "Real-time monitoring",
                  "Entity relationship mapping",
                  "Automated alerts",
                ],
              },
              {
                icon: <ShieldCheckIcon className="w-8 h-8 text-[#f03262]" />,
                title: "Credential Protection",
                description:
                  "Proactively identify and secure compromised credentials before they're exploited with continuous monitoring of breach databases.",
                features: [
                  "Breach detection",
                  "Credential validation",
                  "Automated remediation",
                ],
              },
              {
                icon: <GlobeAltIcon className="w-8 h-8 text-[#f03262]" />,
                title: "Dark Web Monitoring",
                description:
                  "24/7 surveillance of underground communities with advanced analysis to detect emerging threats targeting your organization.",
                features: [
                  "Keyword monitoring",
                  "Threat actor profiling",
                  "Risk scoring",
                ],
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-[#f03262] transition-all hover:shadow-lg hover:shadow-[#f03262]/10"
              >
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
                  {product.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {product.title}
                </h3>
                <p className="text-gray-300 mb-5">{product.description}</p>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <CheckCircleIcon className="w-4 h-4 text-[#f03262] mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="text-[#f03262] hover:text-white font-medium flex items-center group">
                  Explore solution
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Platform Section - Light/Dark Split */}
      <section className="bg-gradient-to-b from-gray-900 to-black border-t border-b border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          {/* Image Panel - Enhanced Dark */}
          <div className="relative h-[500px] lg:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Dark Web Intelligence Dashboard"
              fill
              className="object-cover opacity-90"
            />

            {/* Animated overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex items-end p-10">
              <div className="bg-gradient-to-r from-black/90 to-gray-900/90 backdrop-blur-sm p-6 rounded-xl border border-[#f03262]/20 shadow-lg shadow-[#f03262]/10">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-[#f03262] rounded-full mr-2 animate-pulse"></div>
                  <h4 className="text-white font-bold">
                    LIVE THREAT MONITORING
                  </h4>
                </div>
                <p className="text-gray-300 text-sm font-mono tracking-wider">
                  Tracking 2,400+ darknet sources across 47 TLDs
                </p>
              </div>
            </div>
          </div>

          {/* Content Panel - Dark Theme */}
          <div className="bg-gray-900 p-12 border-l border-gray-800 flex flex-col justify-center">
            <span className="text-[#f03262] font-mono text-sm tracking-widest mb-2">
              DARKWEB SURVEILLANCE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-6 bg-gradient-to-r from-white to-[#f03262] bg-clip-text text-transparent">
              Advanced Threat Intelligence
            </h2>
            <p className="text-gray-300 mb-8">
              Our platform combines machine learning with human analysts to
              monitor underground markets, private forums, and encrypted
              channels.
            </p>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="group flex items-start p-4 rounded-lg transition-all hover:bg-gray-800/50 hover:border-l-2 hover:border-[#f03262]">
                <div className="bg-[#f03262]/20 p-2 rounded-lg mr-4 group-hover:bg-[#f03262]/30 transition-all">
                  <CpuChipIcon className="w-6 h-6 text-[#f03262]" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    Behavioral Pattern Detection
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Identifies emerging TTPs with 94% accuracy using neural
                    networks trained on dark web data
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group flex items-start p-4 rounded-lg transition-all hover:bg-gray-800/50 hover:border-l-2 hover:border-[#f03262]">
                <div className="bg-[#f03262]/20 p-2 rounded-lg mr-4 group-hover:bg-[#f03262]/30 transition-all">
                  <SignalIcon className="w-6 h-6 text-[#f03262]" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    Global Darknet Coverage
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Monitoring Tor, I2P, and private forums in 18 languages
                    including Russian, Chinese, and Arabic
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group flex items-start p-4 rounded-lg transition-all hover:bg-gray-800/50 hover:border-l-2 hover:border-[#f03262]">
                <div className="bg-[#f03262]/20 p-2 rounded-lg mr-4 group-hover:bg-[#f03262]/30 transition-all">
                  <LockClosedIcon className="w-6 h-6 text-[#f03262]" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    Covert Infrastructure
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Military-grade encryption with anonymous collection nodes
                    and zero-trust architecture
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-[#f03262] to-[#d82a56] hover:from-[#f03262]/90 hover:to-[#d82a56]/90 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-[#f03262]/30 flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Request Access
              </button>
              <button className="border border-[#f03262] text-[#f03262] hover:bg-[#f03262]/10 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center">
                <ArrowRightIcon className="w-5 h-5 mr-2" />
                View Sample Reports
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header with gradient */}
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-[#f03262] tracking-widest">
              USE CASES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 bg-clip-text text-transparent bg-gradient-to-r from-[#f03262] to-[#d82a56]">
              Intelligence for Every Mission
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-900 rounded-full p-1 border border-gray-800 shadow-lg shadow-[#f03262]/10">
              {["law", "gov", "enterprise"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#f03262] to-[#d82a56] text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {tab === "law" && "Law Enforcement"}
                  {tab === "gov" && "Government"}
                  {tab === "enterprise" && "Enterprise"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                id: "law",
                title: "Law Enforcement",
                description:
                  "Track criminal networks, automate investigations, and gather court-admissible evidence with advanced dark web surveillance.",
                icon: (
                  <ShieldExclamationIcon className="w-10 h-10 text-[#f03262]" />
                ),
                features: [
                  "Darknet actor profiling",
                  "Automated evidence collection",
                  "Cross-platform correlation",
                ],
              },
              {
                id: "gov",
                title: "Government",
                description:
                  "Protect critical infrastructure and national security with real-time threat intelligence and deep web monitoring.",
                icon: (
                  <GlobeEuropeAfricaIcon className="w-10 h-10 text-[#f03262]" />
                ),
                features: [
                  "Threat actor attribution",
                  "Critical asset protection",
                  "Policy compliance tools",
                ],
              },
              {
                id: "enterprise",
                title: "Enterprise",
                description:
                  "Mitigate brand risks, detect data leaks, and prevent cyber attacks before they impact your business.",
                icon: (
                  <BuildingOffice2Icon className="w-10 h-10 text-[#f03262]" />
                ),
                features: [
                  "Credential leak detection",
                  "Brand impersonation alerts",
                  "Third-party risk scoring",
                ],
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`border rounded-xl p-8 transition-all cursor-pointer ${
                  activeTab === item.id
                    ? "border-[#f03262] bg-gray-800/50 shadow-lg shadow-[#f03262]/20"
                    : "border-gray-800 hover:border-[#f03262] hover:bg-gray-800/30"
                }`}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-lg bg-gray-800 mr-4">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-300 mb-6">{item.description}</p>
                <ul className="space-y-3">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <CheckCircleIcon className="w-5 h-5 text-[#f03262] mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
