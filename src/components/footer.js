import Image from "next/image";

export default function Footer() {
    return (
        <>
            <section
                className="relative bg-[#0D0D10] overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(circle at bottom right, rgba(243, 61, 116, 0.3) 0%, rgba(13, 13, 16, 1) 40%)',
                }}
            >
                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="bg-[#1A1B1E] rounded-2xl px-10 py-16 text-white shadow-2xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-semibold mb-4">Uncover hidden threats with Clandestine</h2>
                            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                Talk to our experts to learn how you can build a solid cyber defense strategy tailored
                                to your organization's needs
                            </p>
                            <button
                                className="bg-[#f33d74] hover:bg-[#e63368] text-white px-8 py-3 rounded-md text-sm font-medium hover:scale-105 transition-transform duration-300">
                                Request demo
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm text-gray-400">
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
                                    links: ["Database Stealer", "Database Leaks"]
                                },
                                {
                                    title: "Sectors",
                                    links: ["Law Enforcement Agencies", "Governments", "Enterprises"]
                                },
                                {
                                    title: "Legal",
                                    links: ["Terms & Conditions", "Privacy Policy"]
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

                            {/*<div>*/}
                            {/*    <h3 className="text-white font-medium mb-4">Get in Touch</h3>*/}
                            {/*    <p className="mb-2">2 Venture Drive, #09-01</p>*/}
                            {/*    <p className="mb-2">Vision Exchange, Singapore 608526</p>*/}
                            {/*    <p className="mb-4">sales@stealthmole.com</p>*/}
                            {/*    <div className="flex space-x-4">*/}
                            {/*        <a href="#" className="hover:text-[#f33d74] transition-colors duration-300">*/}
                            {/*            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">*/}
                            {/*                <path*/}
                            {/*                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>*/}
                            {/*            </svg>*/}
                            {/*        </a>*/}
                            {/*        <a href="#" className="hover:text-[#f33d74] transition-colors duration-300">*/}
                            {/*            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">*/}
                            {/*                <path*/}
                            {/*                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>*/}
                            {/*            </svg>*/}
                            {/*        </a>*/}
                            {/*        <a href="#" className="hover:text-[#f33d74] transition-colors duration-300">*/}
                            {/*            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">*/}
                            {/*                <path*/}
                            {/*                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>*/}
                            {/*            </svg>*/}
                            {/*        </a>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>

                        {/* Bottom Footer */}
                        <div
                            className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                                <Image
                                    src="/image/logo.png"
                                    alt="Clandestine"
                                    width={100}
                                    height={40}
                                    className="invert"
                                />
                                <span>© 2025 Clandestine Project. All rights reserved</span>
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
        </>
    )
}