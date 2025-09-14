import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const scan_id = searchParams.get("scan_id");
    const type = searchParams.get("type") || "csv";
    if (!scan_id) return NextResponse.json({ error: "scan_id required" }, { status: 400 });

    const API_KEY = process.env.PD_API_KEY || "cf9452c4-7a79-4352-a1d3-9de3ba517347";
    const url = `https://api.projectdiscovery.io/v1/scans/${scan_id}/export?type=${type}&async=false`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: { "X-API-Key": API_KEY }
        });
        if (!res.ok) {
            const err = await res.text();
            return NextResponse.json({ error: err }, { status: res.status });
        }

        // streaming as file
        const contentType =
            type === "csv"
                ? "text/csv"
                : type === "json"
                    ? "application/json"
                    : type === "pdf"
                        ? "application/pdf"
                        : "application/octet-stream";
        const filename = `scan-${scan_id}.${type}`;

        // Return as stream (for download)
        return new Response(res.body, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}