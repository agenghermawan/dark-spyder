import { NextResponse } from "next/server";

export async function GET(req) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized: Token missing" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type');

    const res = await fetch(`http://103.245.181.5:5001/update?q=${q}&type=${type}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
}