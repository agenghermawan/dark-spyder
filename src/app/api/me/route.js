import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
    // Ambil token dari cookies
    const token = req.cookies.get("token")?.value;  // Mengambil hanya nilai dari cookie "token"
    console.log("Token dari cookie: ", token);  // Memastikan token ada di cookies

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verifikasi dan dekode token
        const decoded = jwt.verify(token, 'asdfasdfasdfasdf'); // Ganti dengan secret key yang sesuai
        console.log("Decoded user:", decoded.user);  // Memastikan data user terdekripsi dengan benar

        return NextResponse.json({ user: decoded.user });
    } catch (error) {
        console.error("Error decoding token:", error);
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
}
