import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // Import jsonwebtoken untuk membuat JWT

export async function POST(req) {
  const { username, password } = await req.json();

  // Example: Make your API request to validate credentials
  const res = await fetch("http://103.245.181.5:5001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    const user = data.token; // Anggap API mengembalikan informasi user

    // Membuat JWT token
    const token = jwt.sign(
        { user }, // Payload yang akan disertakan di token (bisa disesuaikan)
        process.env.JWT_SECRET, // Secret key untuk encode token
        { expiresIn: '1d' } // Token expire dalam 1 hari
    );

    // Mengirimkan token ke client sebagai cookie HttpOnly
    const response = NextResponse.json({ message: "Login successful" });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      maxAge: 60 * 60 * 24, // Cookie expires in 1 day
      path: "/",
    });

    return response;
  } else {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
}
