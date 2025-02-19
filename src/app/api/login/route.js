import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  const { email, password } = await request.json();

  // Validasi username dan password
  if (email === "ad" && password === "ad") {
    // Buat session (simpan di cookie)
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 menit dari sekarang
    const cookieStore = cookies(); // Ambil instance cookies
    await cookieStore.set("session", "valid", { expires, httpOnly: true, secure: true });

    // Redirect ke dashboard
    return NextResponse.json({ success: true }, { status: 200 });
  } else {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }
}
