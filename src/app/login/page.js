"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpider } from "react-icons/fa";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Glowing Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20"></div>

            {/* Login Card */}
            <div className="w-full max-w-md relative p-8 rounded-xl bg-gray-900/90 backdrop-blur-lg border border-gray-800 shadow-2xl overflow-hidden">
                <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                    <div className="flex flex-col items-center">
                        <FaSpider className="text-purple-500 text-6xl mb-4" />
                        DarkSpyder
                    </div>
                </h1>

                {/* Form Login */}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-6">
                        <label htmlFor="email" className="block mb-2 text-sm text-gray-400">
                            Username
                        </label>
                        <input
                            type="text"
                            id="email"
                            placeholder="you@example.com"
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all relative z-10"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-sm text-gray-400">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all relative z-10"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm mb-4 text-center animate-shake">
                            {error}
                        </p>
                    )}

                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center mb-6">
                        <label className="flex items-center text-sm text-gray-400">
                            <input
                                type="checkbox"
                                className="mr-2 accent-purple-500"
                            />
                            Remember me
                        </label>
                        <a
                            href="#"
                            className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
                    >
                        Login
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    &copy; 2024{" "}
                    <a
                        href="#"
                        className="text-purple-400 hover:text-purple-300 underline transition-colors"
                    >
                        DarkSpyder
                    </a>
                </p>
            </div>
        </div>
    );
}
