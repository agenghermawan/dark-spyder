'use client';

import Navbar from "../../components/dashboard/navbar";
import React, {useState} from "react";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import Footer from "../../components/dashboard/footer";

const TermsOfUse = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const terms = [
        {
            title: "1. Site",
            content:
                "A website(s) available on the Internet at the addresses: darkspyder.com, darkspyder.io.",
        },
        {
            title: "2. User",
            content:
                "An individual acting in personal capacity or as a representative of a legal entity, visiting the Sites or using the Service both in full or their individual functions, on an onerous or gratuitous basis.",
        },
        {
            title: "3. Administration",
            content:
                "The operator and/or owner of the Site, a legal entity Darkspyder Security Services, Ltd. duly registered under the laws of the United Kingdom or its successor, as well as persons duly authorized to represent interests on its behalf.",
        },
        {
            title: "4. Terms of Use",
            content:
                "A license agreement between the Administration and the User for the use of the Service.",
        },
        {
            title: "5. Plan",
            content:
                "The license fee for using the Service, describing applicable terms, settlement of the license fees, and restrictions established by the Administration.",
        },
    ];

    return (
        <>
            <Navbar/>
            <div className="bg-[#0A0A0A] text-white p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col items-center justify-center mb-12 text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent mb-4">
                            📜 Terms of Use
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl">
                            Please read these Terms of Use carefully before using our services.
                        </p>
                    </div>

                    {/* Accordion Section */}
                    <div className="bg-[#141414] p-8 rounded-lg shadow-hacker-glow-blue space-y-4">
                        {terms.map((term, index) => (
                            <div
                                key={index}
                                className="border-b border-gray-700 hover:shadow-hacker-glow-blue transition-shadow duration-300"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
                                >
                                    <h2 className="text-xl font-medium text-gray-200">
                                        {term.title}
                                    </h2>
                                    <span className="text-gray-400">
          {activeIndex === index ? <FaChevronUp/> : <FaChevronDown/>}
        </span>
                                </button>
                                {activeIndex === index && (
                                    <p className="text-gray-400 pb-4">{term.content}</p>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsOfUse;

