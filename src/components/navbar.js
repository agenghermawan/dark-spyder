import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="z-50 bg-[#14141f] w-full p-4 shadow-lg rounded-[12px]">
      {/* Mobile Menu */}
      <div className="md:hidden flex justify-between items-center p-4">
        <div>
          <Image
            src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6495604fb7188b7b3e3edd45_Logotype.svg"
            alt="logo"
            width={150}
            height={40}
          />
        </div>
        <button
          className="text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 text-white">
          <div className="space-y-4">
            <div className="group">
              <div className="font-bold flex items-center justify-between py-2 border-b border-gray-700">
                Products
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 11L12 14L14.9998 11.0002"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <ul className="pl-4 py-2 space-y-2">
                <li className="px-4 py-2 hover:bg-gray-800 rounded">
                  Dark Web
                </li>
                <li className="px-4 py-2 hover:bg-gray-800 rounded">VA</li>
              </ul>
            </div>

            <div className="group">
              <div className="font-bold flex items-center justify-between py-2 border-b border-gray-700">
                Sectors
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 11L12 14L14.9998 11.0002"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <ul className="pl-4 py-2 space-y-2">
                <Link
                  to={"/sectors/law_enforcement_agencies"}
                  className="px-4 py-2 hover:bg-gray-800 rounded"
                >
                  Law Enforcement Agencies
                </Link>
                <li className="px-4 py-2 hover:bg-gray-800 rounded">
                  Enterprises
                </li>
                <li className="px-4 py-2 hover:bg-gray-800 rounded">
                  Governments
                </li>
              </ul>
            </div>

            <div className="group">
              <div className="font-bold flex items-center justify-between py-2 border-b border-gray-700">
                Company
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 11L12 14L14.9998 11.0002"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <ul className="pl-4 py-2 space-y-2">
                <Link
                  href={"/company/about"}
                  className="px-4 py-2 hover:bg-gray-800"
                >
                  About Us
                </Link>
                <li className="px-4 py-2 hover:bg-gray-800">Contact</li>
              </ul>
            </div>

            <div className="flex space-x-4 pt-4">
              <button className="text-white hover:text-gray-300 px-4 py-2 rounded-lg transition duration-300 border border-[#1c1f26] w-full">
                Login
              </button>
              <button className="bg-[#f03262] hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 w-full">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navbar */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 w-full md:w-8/12 mx-auto items-center justify-between">
        <Link href={"/"}>
          <Image
            src="https://cdn.prod.website-files.com/64820a5a7bb824d4fde49544/6495604fb7188b7b3e3edd45_Logotype.svg"
            alt="logo"
            width={200}
            height={50}
          />
        </Link>

        <div className="flex flex-row justify-center items-center pt-4 space-x-6 text-white">
          {/* Products Dropdown */}
          <div className="group relative cursor-pointer pb-4">
            <div className="font-medium flex items-center">
              Products
              <svg
                className="mt-1"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 11L12 14L14.9998 11.0002"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute left-0 top-full mt-0 hidden group-hover:block w-72 bg-[#070a11] border rounded-md border-gray-700 z-50 pt-1">
              <ul className="py-2 flex flex-col space-y-2 px-4">
                <li className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out">
                  Dark Web
                </li>
                <li className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out">
                  VA
                </li>
              </ul>
            </div>
          </div>

          {/* Sectors Dropdown */}
          <div className="group relative cursor-pointer pb-4">
            <div className="font-medium flex items-center">
              Sectors
              <svg
                className="mt-1"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 11L12 14L14.9998 11.0002"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute left-0 top-full mt-0 hidden group-hover:block w-72 bg-[#070a11] border rounded-md border-gray-700 z-50 pt-1">
              <ul className="py-2 flex flex-col space-y-2 px-4">
                <Link
                  href={"/sectors/law_enforcement_agencies"}
                  className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Law Enforcement Agencies
                </Link>
                <Link
                  href={"/sectors/enterprises"}
                  className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Enterprises
                </Link>
                <Link
                  href={"/sectors/governments"}
                  className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Governments
                </Link>
              </ul>
            </div>
          </div>

          {/* Company Dropdown */}
          <div className="group relative cursor-pointer pb-4">
            <div className="font-medium flex items-center">
              Company
              <svg
                className="mt-1"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 11L12 14L14.9998 11.0002"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute left-0 top-full mt-0 hidden group-hover:block w-72 bg-[#070a11] border rounded-md border-gray-700 z-50 pt-1">
              <ul className="py-2 flex flex-col space-y-2 px-4">
                <Link
                  href={"/company/about"}
                  className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  About Us
                </Link>
                <li className="px-4 py-2 hover:bg-gray-800 rounded hover:text-[#f53d6b] hover:scale-105 transition-all duration-300 ease-in-out">
                  Contact
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-end space-x-4">
            <button className="text-white hover:scale-105 px-4 py-2 rounded-lg transition duration-300 border border-[#1c1f26]">
              Login
            </button>
            <button className="bg-[#f03262] btn-hover text-white px-6 py-2 rounded-lg transition duration-300">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
