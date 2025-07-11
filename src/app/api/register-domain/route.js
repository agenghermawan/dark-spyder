export const dynamic = 'force-dynamic';

export async function POST(req) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return new Response(
            JSON.stringify({ message: "Unauthorized: Token missing" }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Get invoiceId from query param
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
        return new Response(
            JSON.stringify({ message: "Missing invoiceId in query params" }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const res = await fetch(`http://103.245.181.5:5001/register-domain?invoiceId=${encodeURIComponent(invoiceId)}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        const text = await res.text();
        return new Response(
            JSON.stringify({
                message: "Invalid response from backend",
                backend: text.slice(0, 500)
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}