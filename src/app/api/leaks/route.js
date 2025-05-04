export const dynamic = 'force-dynamic';
import jwt from "jsonwebtoken";

export async function GET(req) {
    console.log("🔍 Proxy route accessed");

    // Retrieve search parameters from the URL
    const {searchParams} = new URL(req.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    const page = searchParams.get('page');
    const size = searchParams.get('size');

    const token = req.cookies.get("token")?.value;

    if (!token) {
        return new Response(
            JSON.stringify({message: "Unauthorized: Token missing"}),
            {status: 401, headers: {'Content-Type': 'application/json'}}
        );
    }

    let decodedUser;
    try {
        decodedUser = jwt.decode(token);
    } catch (error) {
        return new Response(
            JSON.stringify({message: "Failed to decode token"}),
            {status: 401, headers: {'Content-Type': 'application/json'}}
        );
    }


    const res = await fetch(`http://103.245.181.5:5001/search?q=${q}&type=${type}&page=${page}&size=${size}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${decodedUser.user}`
        }
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
