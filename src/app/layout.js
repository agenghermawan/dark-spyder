import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata = {
    title: "Dark Spyder",
    description:
        "Dark Spyder is a modern intelligence platform for scanning, monitoring, and discovering digital threats across the surface, deep, and dark web.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <style>{`
          body {
            font-family: "Inter Variable", sans-serif;
            color: #070a11;
            font-size: 16px;
            font-weight: 400;
            line-height: 32px;
          }
        `}</style>
        </head>
        <body className={`${inter.variable} antialiased`}>
        {children}
        </body>
        </html>
    );
}
