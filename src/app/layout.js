import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
    variable: "--font-poppins", // nama variable harus cocok di CSS
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"], // optional, tergantung kebutuhan
});

export const metadata = {
    title: "Dark Spyder",
    description:
        "Dark Spyder is a modern intelligence platform for scanning, monitoring, and discovering digital threats across the surface, deep, and dark web.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={poppins.variable}>
        <head />
        <body className="antialiased" style={{
            fontFamily: 'var(--font-poppins)',
            color: '#070a11',
            fontSize: '16px',
            fontWeight: '400',
            lineHeight: '32px'
        }}>
        {children}
        </body>
        </html>
    );
}
