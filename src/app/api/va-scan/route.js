import { NextResponse } from "next/server";
const API_KEY = process.env.PD_API_KEY || "cf9452c4-7a79-4352-a1d3-9de3ba517347";

export async function POST(req) {
    try {
        const { domain } = await req.json();
        if (!domain) {
            return NextResponse.json({ error: "No domain provided" }, { status: 400 });
        }
        // Fetch templates
        const templateRes = await fetch("https://api.projectdiscovery.io/v1/template/public", {
            headers: {
                "X-API-Key": API_KEY,
                "Content-Type": "application/json"
            }
        });
        const templateData = await templateRes.json();
        if (!templateData.results || !Array.isArray(templateData.results) || templateData.results.length === 0) {
            return NextResponse.json({ error: "No public templates found" }, { status: 500 });
        }
        const templates = templateData.results.map(t => t.uri).filter(Boolean).slice(0, 5);
        // Submit scan, return scan_id
        const scanRes = await fetch("https://api.projectdiscovery.io/v1/scans", {
            method: "POST",
            headers: {
                "X-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                targets: [domain],
                templates,
                name: `Scan for ${domain} ~ Clandestine`
            }),
        });
        const scanData = await scanRes.json();
        if (!scanRes.ok || !scanData.id) {
            return NextResponse.json({ error: scanData.message || JSON.stringify(scanData) }, { status: 502 });
        }
        // !! DO NOT WAIT HERE. Just return scan_id
        return NextResponse.json({ scan_id: scanData.id, status: scanData.status || "queued" });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}