import { useEffect, useState } from "react";

// Helper to format amount with decimals
function formatAmount(amount, decimals = 6) {
    if (!amount) return "-";
    const str = amount.toString().padStart(decimals + 1, "0");
    const intPart = str.slice(0, -decimals);
    let fracPart = str.slice(-decimals);
    fracPart = fracPart.replace(/0+$/, "");
    return fracPart.length ? `${intPart}.${fracPart}` : intPart;
}

export default function PaymentFlowModalPricing({
                                                    show,
                                                    invoiceId,
                                                    idPricing,
                                                    plan,
                                                    domainLimit = 1, // <= PASS THIS FROM PARENT
                                                    onClose,
                                                }) {
    // asset selection state
    const [assets, setAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [assetsError, setAssetsError] = useState(null);

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedBlockchain, setSelectedBlockchain] = useState(null);

    // payment creation state
    const [creatingPayment, setCreatingPayment] = useState(false);
    const [createError, setCreateError] = useState(null);

    // payment data (instructions)
    const [paymentData, setPaymentData] = useState(null);

    // status check
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [statusError, setStatusError] = useState(null);
    const [notPaidError, setNotPaidError] = useState(false);

    // register domains
    const [domains, setDomains] = useState([""]);
    const [registering, setRegistering] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState("");
    const [registerError, setRegisterError] = useState(null);

    // Show register form if paid
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    // Fetch asset list
    useEffect(() => {
        if (!show || !invoiceId || !idPricing || !plan) return;
        setLoadingAssets(true);
        setAssetsError(null);
        setSelectedAsset(null);
        setSelectedBlockchain(null);
        setPaymentData(null);
        setPaymentStatus(null);
        setStatusError(null);
        setDomains([""]);
        setRegisterError(null);
        setRegisterSuccess("");
        setNotPaidError(false);
        setShowRegisterForm(false);
        fetch("/api/asset-list", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idPricing, plan }),
        })
            .then(res => res.json())
            .then(data => setAssets(Array.isArray(data.data) ? data.data : []))
            .catch(() => setAssetsError("Failed to load asset list."))
            .finally(() => setLoadingAssets(false));
    }, [show, invoiceId, idPricing, plan]);

    useEffect(() => {
        setSelectedAsset(null);
        setSelectedBlockchain(null);
        setCreateError(null);
        setPaymentData(null);
        setPaymentStatus(null);
        setStatusError(null);
        setDomains([""]);
        setRegisterError(null);
        setRegisterSuccess("");
        setNotPaidError(false);
        setShowRegisterForm(false);
    }, [show, assets.length]);

    // Show register form if paymentStatus.Status === 100
    useEffect(() => {
        if (paymentStatus && paymentStatus.Status === 100) {
            setShowRegisterForm(true);
        } else {
            setShowRegisterForm(false);
        }
    }, [paymentStatus]);

    // Create Payment
    const handleCreatePayment = async () => {
        if (!selectedAsset || !selectedBlockchain) return;
        setCreatingPayment(true);
        setCreateError(null);
        try {
            const res = await fetch("/api/create-payment", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invoiceId,
                    assetCode: selectedAsset.Code,
                    blockchainCode: selectedBlockchain.Code,
                    isEvm: selectedBlockchain.IsEvm !== undefined ? selectedBlockchain.IsEvm : true,
                })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to create payment");
            setPaymentData(result.data);
        } catch (e) {
            setCreateError(e.message || "Failed to create payment.");
        } finally {
            setCreatingPayment(false);
        }
    };

    // Find decimals for selected blockchain
    const decimals =
        selectedBlockchain?.Decimals ||
        selectedAsset?.Decimals ||
        paymentData?.Decimals ||
        6;

    // Check Payment Status (use /api/process-payment)
    const handleCheckPayment = async () => {
        setCheckingStatus(true);
        setStatusError(null);
        setPaymentStatus(null);
        setNotPaidError(false);
        try {
            const paymentId = paymentData?.Id;
            if (!paymentId) throw new Error("Payment ID not available.");
            const res = await fetch("/api/process-payment", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId })
            });
            const result = await res.json();
            if (!res.ok) {
                if (result.error && result.error === "Plan is not Paid yet") {
                    setNotPaidError(true);
                    return;
                }
                throw new Error(result.message || "Failed to check payment status");
            }
            setPaymentStatus(result.data || result);
        } catch (e) {
            setStatusError(e.message || "Failed to check payment status.");
        } finally {
            setCheckingStatus(false);
        }
    };

    // Add domain (with limit)
    const handleAddDomain = () => {
        if (domains.length < domainLimit) {
            setDomains([...domains, ""]);
        }
    };

    // Register domains
    const handleRegisterDomain = async () => {
        setRegistering(true);
        setRegisterError(null);
        setRegisterSuccess("");
        try {
            const filteredDomains = domains.map(d => d.trim()).filter(Boolean);
            if (!filteredDomains.length) throw new Error("Please enter at least one domain.");
            if (filteredDomains.length > domainLimit) throw new Error(`Maximum ${domainLimit} domains allowed.`);
            const res = await fetch(`/api/register-domain?invoiceId=${invoiceId}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selected_domains: filteredDomains })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to register domains");
            setRegisterSuccess("Domains registered successfully!");
            setDomains([""]);
        } catch (e) {
            setRegisterError(e.message || "Failed to register domains.");
        } finally {
            setRegistering(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
            <div className="relative w-full max-w-md bg-[#232339] rounded-2xl shadow-xl p-6 animate-fade-in">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >×</button>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                    Payment & Domain Registration
                </h2>
                {assetsError && (
                    <div className="bg-red-900 text-red-200 p-2 rounded mb-4 text-center">{assetsError}</div>
                )}

                {showRegisterForm ? (
                    <div className="mt-6 border-t border-gray-700 pt-4">
                        <h3 className="text-lg font-bold text-white mb-3">Register Domains to Monitor</h3>
                        <div className="space-y-2">
                            {domains.map((domain, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        className="w-full p-2 rounded bg-gray-700 text-white"
                                        placeholder="Enter domain (e.g. example.com)"
                                        value={domain}
                                        onChange={e => {
                                            const newDomains = [...domains];
                                            newDomains[idx] = e.target.value;
                                            setDomains(newDomains);
                                        }}
                                    />
                                    {domains.length > 1 && (
                                        <button
                                            className="bg-red-600 hover:bg-red-700 px-2 rounded text-white text-sm font-bold"
                                            onClick={() => setDomains(domains.filter((_, i) => i !== idx))}
                                            title="Remove"
                                        >-</button>
                                    )}
                                </div>
                            ))}
                            <button
                                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm font-bold mt-1"
                                onClick={handleAddDomain}
                                disabled={domains.length >= domainLimit}
                            >+ Add Domain</button>
                            {domains.length >= domainLimit && (
                                <div className="text-xs text-yellow-400 mt-1">
                                    Maximum {domainLimit} domains allowed for this plan.
                                </div>
                            )}
                        </div>
                        <button
                            className="w-full py-2 rounded bg-[#f33d74] hover:bg-[#e63368] text-white font-bold mt-4"
                            onClick={handleRegisterDomain}
                            disabled={registering}
                        >
                            {registering ? "Registering..." : "Register Domains"}
                        </button>
                        {registerError && <div className="text-red-400 mt-2">{registerError}</div>}
                        {registerSuccess && <div className="text-green-400 mt-2">{registerSuccess}</div>}
                    </div>
                ) : !paymentData ? (
                    <>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Select Coin:</label>
                                <select
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                    value={selectedAsset?.Code || ""}
                                    onChange={e => {
                                        const asset = assets.find(a => a.Code === e.target.value);
                                        setSelectedAsset(asset || null);
                                        setSelectedBlockchain(null);
                                    }}
                                    disabled={loadingAssets || !assets.length}
                                >
                                    <option value="">-- Select Coin --</option>
                                    {assets.map(asset => (
                                        <option key={asset.Code} value={asset.Code}>
                                            {asset.Name} ({asset.Code.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Select Blockchain:</label>
                                <select
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                    value={selectedBlockchain?.Code || ""}
                                    onChange={e => {
                                        const bc = selectedAsset?.Blockchains?.find(bc => bc.Code === e.target.value);
                                        setSelectedBlockchain(bc || null);
                                    }}
                                    disabled={!selectedAsset}
                                >
                                    <option value="">-- Select Blockchain --</option>
                                    {(selectedAsset?.Blockchains || []).map(bc => (
                                        <option key={bc.Code} value={bc.Code}>
                                            {bc.Name} {bc.Code ? `(${bc.Code.toUpperCase()})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            className="mt-6 w-full py-2 rounded bg-[#f33d74] hover:bg-[#e63368] text-white font-bold transition disabled:opacity-50"
                            onClick={handleCreatePayment}
                            disabled={!selectedAsset || !selectedBlockchain || creatingPayment}
                        >
                            {creatingPayment ? "Processing..." : "Continue & Show Payment Instructions"}
                        </button>
                        {createError && <div className="text-red-400 mt-2 text-center">{createError}</div>}
                    </>
                ) : (
                    <>
                        {/* Payment instructions */}
                        <div className="mt-2 border-t border-gray-700 pt-4">
                            <h3 className="text-lg font-bold text-white mb-2">Payment Instructions</h3>
                            <div className="text-white mb-2">
                                <b>Recipient Address:</b> <br />
                                <span className="break-all text-green-300 font-mono">
                                    {paymentData?.RecipientAddress || "-"}
                                </span>
                            </div>
                            <div className="text-white mb-2">
                                <b>Amount:</b> <br />
                                <span className="font-mono text-yellow-300">
                                    {formatAmount(paymentData?.Amount, decimals)} {paymentData?.AssetCode?.toUpperCase()}
                                </span>
                            </div>
                            <div className="text-white mb-2">
                                <b>Blockchain:</b> <br />
                                <span>{paymentData?.BlockchainCode?.toUpperCase()}</span>
                            </div>
                            <div className="text-white mb-2">
                                <b>Fee:</b> <br />
                                <span>{paymentData?.Fee || "0"}</span>
                            </div>
                            <div className="text-white mb-2">
                                <b>Payment ID:</b> <br />
                                <span>{paymentData?.Id || "-"}</span>
                            </div>
                            <div className="bg-yellow-900 text-yellow-300 rounded p-2 text-xs mt-4">
                                <b>Important:</b> The amount you transfer must <u>exactly</u> match the value shown above (including all decimals).<br />
                                If you use an exchange (e.g., TokoCrypto) that charges a withdrawal fee, <u>add the fee to your transfer amount</u> so that we receive the exact required amount.<br />
                                <b>No refund</b> will be issued if the amount received is incorrect.
                            </div>
                        </div>
                        {/* Check Payment Status */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleCheckPayment}
                                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold"
                                disabled={checkingStatus}
                            >
                                {checkingStatus ? "Checking Payment Status..." : "I've Paid, Check Payment Status"}
                            </button>
                            {statusError && <div className="text-red-400 mt-2">{statusError}</div>}
                            {notPaidError && (
                                <div className="text-yellow-400 mt-4">
                                    Your payment has not been received yet. Please try again in a few moments.<br />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn .25s;
                }
                @keyframes fadeIn {
                    from { opacity:0; transform:scale(0.97);}
                    to { opacity:1; transform:scale(1);}
                }
            `}</style>
        </div>
    );
}