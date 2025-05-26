import Image from "next/image";

export default function footer() {
    return (
        <footer className="bg-[#0D0D10] border-t border-gray-800">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* CTA Section - Wording unchanged */}
                <div className="bg-[#1A1B1E] rounded-2xl px-10 py-16 mb-16 text-center">
                    <h2 className="text-3xl font-semibold mb-4">Uncover hidden threats with Clandestine</h2>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        Talk to our experts to learn how you can build a solid cyber defense strategy tailored
                        to your organizations needs
                    </p>
                    <button className="bg-[#f33d74] hover:bg-[#e63368] text-white px-8 py-3 rounded-md text-sm font-medium hover:scale-105 transition-transform duration-300">
                        Request demo
                    </button>
                </div>

                {/* Content Grid - New Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    {/* Brand Column */}
                    <div className="md:col-span-3">
                        <div className="flex items-center mb-6">
                            <Image
                                src="/image/logo.png"
                                alt="Clandestine"
                                width={120}
                                height={48}
                                className="invert"
                            />
                        </div>
                        <p className="text-gray-400 text-sm">
                            AI-powered dark web intelligence platform protecting your digital assets
                        </p>
                    </div>

                    {/* Navigation - Same Categories */}
                    <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Company - Same wording */}
                        <div>
                            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Company</h3>
                            <ul className="space-y-3">
                                {['About', 'Contact us'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-[#f33d74] text-sm transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Products - Same wording */}
                        <div>
                            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Products</h3>
                            <ul className="space-y-3">
                                {['Database Stealer', 'Database Leaks'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-[#f33d74] text-sm transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sectors - Same wording */}
                        <div>
                            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Sectors</h3>
                            <ul className="space-y-3">
                                {['Law Enforcement Agencies', 'Governments', 'Enterprises'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-[#f33d74] text-sm transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Same wording */}
                <div className="border-t border-gray-800 mt-16 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center">
          <span className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 Clandestine Project. All rights reserved
          </span>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-[#f33d74] text-sm transition-colors">
                            Terms & Conditions
                        </a>
                        <a href="#" className="text-gray-500 hover:text-[#f33d74] text-sm transition-colors">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
