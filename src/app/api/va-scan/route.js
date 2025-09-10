import { NextResponse } from "next/server";
const API_KEY = process.env.PD_API_KEY || "cf9452c4-7a79-4352-a1d3-9de3ba517347";

export async function POST(req) {
    try {
        const { domain } = await req.json();
        if (!domain) return NextResponse.json({ error: "No domain provided" }, { status: 400 });

        // 1. Submit scan ke /v1/scans
        const scanRes = await fetch("https://api.projectdiscovery.io/v1/scans", {
            method: "POST",
            headers: {
                "X-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                targets: [domain],
                templates: ["all"],
                name: "Scan for " + domain
            }),
        });
        const scanData = await scanRes.json();
        if (!scanRes.ok) {
            return NextResponse.json({ error: JSON.stringify(scanData) }, { status: 502 });
        }
        // scan_id dapat dari scanData.id
        const scan_id = scanData.id;

        // 2. Polling result (GET /v1/scans/{scan_id}/results/vulnerabilities)
        let retries = 0;
        while (retries < 30) {
            const res = await fetch(`https://api.projectdiscovery.io/v1/scans/${scan_id}/results/vulnerabilities`, {
                headers: {
                    "X-API-Key": API_KEY,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (res.ok && Array.isArray(data.data)) {
                return NextResponse.json({ status: "completed", vulnerabilities: data.data });
            }
            await new Promise((r) => setTimeout(r, 2000));
            retries++;
        }
        return NextResponse.json({
            status: "timeout",
            vulnerabilities: [],
            message: "Timeout polling vulnerability result.",
        }, { status: 504 });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}