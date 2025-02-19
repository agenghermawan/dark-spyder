'use client';

import React, {useState} from "react";
import {FaKey, FaShieldAlt, FaTrash, FaCopy, FaQrcode} from "react-icons/fa";
import Navbar from "@/components/navbar";

const Settings = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [twoFACode, setTwoFACode] = useState("");
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const handleChangePassword = () => {
        // Logic untuk mengubah password
        alert("Password changed successfully!");
    };

    const handleEnable2FA = () => {
        // Logic untuk mengaktifkan 2FA
        setIs2FAEnabled(true);
        alert("2FA enabled successfully!");
    };

    const handleRequestDataCopy = () => {
        // Logic untuk meminta salinan data
        alert("Data copy requested!");
    };

    const handleDeleteAccount = () => {
        // Logic untuk menghapus akun
        alert("Account deletion initiated!");
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                        ⚙️ Account Settings
                    </h1>

                    {/* Change Password Section */}
                    <div className="bg-[#141414] p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaKey className="mr-2 text-purple-500"/> Change Password
                        </h2>
                        <p className="text-gray-400 mb-4">
                            Once you change your password, all active sessions (except current) will be terminated.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full p-3 bg-[#1F1F1F] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 bg-[#1F1F1F] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={handleChangePassword}
                                className="w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* 2FA Section */}
                    <div className="bg-[#141414] p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaShieldAlt className="mr-2 text-green-400"/> Two-Factor Authentication (2FA)
                        </h2>
                        <p className="text-gray-400 mb-4">
                            <span className="text-red-500 font-bold">Attention!</span> Enabling 2FA is an irreversible action.
                            It can't be turned off without access to your account. We don't accept any requests to turn it off.
                        </p>
                        {!is2FAEnabled ? (
                            <>
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-white p-2 rounded-lg">
                                        {/* QR Code Placeholder */}
                                        <div className="w-32 h-32 bg-gray-300 flex items-center justify-center">
                                            <FaQrcode className="text-4xl text-gray-600"/>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-4 text-center">
                                    Or enter this secret code in your TOTP app manually:{" "}
                                    <span className="font-mono text-purple-500">AB3651CA0876BC</span>
                                </p>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="One-time code"
                                        value={twoFACode}
                                        onChange={(e) => setTwoFACode(e.target.value)}
                                        className="w-full p-3 bg-[#1F1F1F] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <button
                                        onClick={handleEnable2FA}
                                        className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Enable 2FA
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-green-400">✅ 2FA is already enabled.</p>
                        )}
                    </div>

                    {/* Account Actions Section */}
                    <div className="bg-[#141414] p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaTrash className="mr-2 text-red-500"/> Account Actions
                        </h2>
                        <div className="space-y-4">
                            <button
                                onClick={handleRequestDataCopy}
                                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                            >
                                <FaCopy className="mr-2"/> Request Data Copy
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                            >
                                <FaTrash className="mr-2"/> Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
