import React from "react";

// Utility: format "ago"
function formatAgo(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    if (isNaN(diffMs)) return "-";
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    const diffMo = Math.floor(diffDay / 30);
    return `${diffMo}mo ago`;
}

function AssetDetailModal({open, onClose, item}) {
    if (!open || !item) return null;

    const asset = item.asset_metadata || {};
    const event = Array.isArray(item.event) ? item.event[0] : {};
    const info = event.info || {};
    const classification = info.classification || {};

    return (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/80">
            <div className="w-full max-w-screen-md h-full overflow-y-auto shadow-2xl bg-[#18181d] p-5 relative flex flex-col">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <span className="text-lg font-bold text-white">{info.name || asset.title || asset.host}</span>
                        <span
                            className="ml-3 bg-[#23232b] px-2 py-1 rounded text-xs font-mono text-gray-300">{classification["cve-id"]?.[0] || item.template_id || item["template-id"]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className="px-3 py-1 rounded-full bg-red-900 text-red-200 font-semibold text-xs">Critical</span>
                        <button className="rounded px-2 py-1 text-gray-400 hover:text-white text-xl"
                                onClick={onClose}>×
                        </button>
                    </div>
                </div>
                {/* Dropdown Actions */}
                <div className="flex gap-2 mb-6">
                    <button className="bg-[#23232b] px-3 py-1 rounded text-xs text-gray-300 font-semibold">Retest
                    </button>
                    <span className="bg-[#23232b] px-3 py-1 rounded text-xs text-gray-300 font-semibold">Open</span>
                    <span className="bg-[#23232b] px-3 py-1 rounded text-xs text-gray-300 font-semibold">Ticket</span>
                    <button className="ml-auto bg-[#23232b] px-3 py-1 rounded text-xs text-gray-300 font-semibold">Full
                        report
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Description */}
                    {info.description && (
                        <p className="text-gray-200 mb-2">{info.description}</p>
                    )}
                    {/* Remediation */}
                    {info.remediation && (
                        <div className="mb-2">
                            <div className="font-semibold text-gray-300 mb-1">Remediation</div>
                            <div className="text-gray-200 text-sm">{info.remediation}</div>
                        </div>
                    )}
                    {/* References */}
                    {info.reference && (
                        <div className="mb-2">
                            <div className="font-semibold text-gray-300 mb-1">Reference</div>
                            <div className="flex flex-col gap-1 text-sm">
                                {info.reference.map((url, i) =>
                                    <a key={url + i} href={url} className="text-blue-400 underline" target="_blank"
                                       rel="noopener">{url}</a>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Found At */}
                    {event["matched-at"] && (
                        <div className="mb-2">
                            <div className="font-semibold text-gray-300 mb-1">Found at</div>
                            <div
                                className="bg-[#23232b] p-2 rounded text-xs font-mono text-gray-200 overflow-x-auto">{event["matched-at"]}</div>
                        </div>
                    )}
                    {/* Extracted */}
                    {event["extracted-results"] && (
                        <div className="mb-2">
                            <div className="font-semibold text-gray-300 mb-1">Extracted</div>
                            <div
                                className="bg-[#23232b] p-2 rounded text-xs text-gray-200">{event["extracted-results"].join(", ")}</div>
                        </div>
                    )}
                    {/* Request/Response */}
                    <div className="mb-4">
                        <div className="flex gap-2 text-xs text-gray-400 font-semibold mb-1">
                            <span>Request</span>
                            {/* Tabs: Response, JSON, CURL - TODO if needed */}
                        </div>
                        <div
                            className="bg-[#23232b] p-2 rounded text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre">
                            {event.request}
                        </div>
                    </div>
                    {/* Asset Info Table */}
                    <table className="w-full text-xs mb-4">
                        <tbody>
                        <tr>
                            <td className="py-1 text-gray-400">First seen</td>
                            <td className="py-1 text-gray-100">{formatAgo(asset.created_at || item.created_at)}</td>
                            <td className="py-1 text-gray-400">Last seen</td>
                            <td className="py-1 text-gray-100">{formatAgo(asset.updated_at || item.updated_at)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 text-gray-400">Host</td>
                            <td className="py-1 text-gray-100">{asset.host}</td>
                            <td className="py-1 text-gray-400">IP address</td>
                            <td className="py-1 text-gray-100">{Array.isArray(asset.ip) ? asset.ip.join(", ") : asset.ip}</td>
                        </tr>
                        <tr>
                            <td className="py-1 text-gray-400">Template ID</td>
                            <td className="py-1">
                                <a href={item.template_url} target="_blank" rel="noopener"
                                   className="text-blue-400 underline">{item.template_id || item["template-id"] || "-"}</a>
                            </td>
                            <td className="py-1 text-gray-400">Vuln ID</td>
                            <td className="py-1">
                                <a href="#" className="text-blue-400 underline">{item.vuln_id}</a>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-1 text-gray-400">Scan ID</td>
                            <td className="py-1">
                                <a href="#" className="text-blue-400 underline">{item.scan_id}</a>
                            </td>
                            <td className="py-1 text-gray-400">Asset Group</td>
                            <td className="py-1">
                                <a href="#" className="text-blue-400 underline">{asset.enumeration_name || "-"}</a>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-1 text-gray-400">CVSS</td>
                            <td className="py-1 text-gray-100">{classification["cvss-score"]}</td>
                            <td className="py-1 text-gray-400">CWE</td>
                            <td className="py-1 text-gray-100">{Array.isArray(classification["cwe-id"]) ? classification["cwe-id"].join(", ") : classification["cwe-id"]}</td>
                        </tr>
                        <tr>
                            <td className="py-1 text-gray-400">Vendor</td>
                            <td className="py-1 text-gray-100">{info.metadata?.vendor}</td>
                            <td className="py-1 text-gray-400">Product</td>
                            <td className="py-1 text-gray-100">{info.metadata?.product}</td>
                        </tr>
                        <tr>
                            <td className="py-1 text-gray-400">Protocol</td>
                            <td className="py-1 text-gray-100">{event.type || asset.webserver}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {/* Optional: add more detail if needed */}
            </div>
        </div>
    );
}

export default AssetDetailModal;