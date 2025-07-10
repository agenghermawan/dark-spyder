"use client";
import React, { useEffect, useState, useRef } from "react";

export default function ExtractLogsPage({ searchParams }) {
    const params = React.use(searchParams);
    const [html, setHtml] = useState("");
    const [loading, setLoading] = useState(true);
    const htmlRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        const query = new URLSearchParams(params).toString();
        fetch(`/api/proxy/download?${query}`, { credentials: "include" })
            .then((res) => res.text())
            .then(setHtml)
            .finally(() => setLoading(false));
    }, [params]);

    const handleDownloadPDF = () => {
        window.print();
    };

    if (loading) {
        return (
            <div
                style={{
                    background: "#18191A",
                    color: "#7289da",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div className="spinner" style={{
                    marginBottom: 24,
                    width: 60,
                    height: 60,
                    border: "8px solid #23272a",
                    borderTop: "8px solid #7289da",
                    borderRadius: "50%",
                    animation: "spin 1.2s linear infinite"
                }} />
                <style>
                    {`@keyframes spin {
                        0% { transform: rotate(0deg);}
                        100% { transform: rotate(360deg);}
                    }`}
                </style>
                <div style={{ fontSize: 24, fontWeight: 600 }}>Loading Extract Logs...</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#18191A",
            padding: "0",
            margin: "0"
        }}>
            <div style={{

                margin: "0 auto",
                padding: "36px 16px 0 16px"
            }}>
                <h1 style={{
                    color: "#fff",
                    fontSize: 32,
                    fontWeight: 700,
                    marginBottom: 24,
                    textAlign: "center"
                }}>
                    Extracted Logs
                </h1>
                <div style={{ textAlign: "right", marginBottom: 16, marginRight: 16 }}>
                    <button
                        onClick={handleDownloadPDF}
                        style={{
                            background: "linear-gradient(90deg, #7289da 0%, #23272a 100%)",
                            color: "#fff",
                            padding: "10px 28px",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            marginRight: 0
                        }}
                    >
                        Download PDF
                    </button>
                </div>
                <div
                    ref={htmlRef}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </div>
    );
}