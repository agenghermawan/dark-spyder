import {Poppins} from "next/font/google";
import "./globals.css";

const poppins = Poppins({
    variable: "--font-poppins", // nama variable harus cocok di CSS
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"], // optional, tergantung kebutuhan
});

export const metadata = {
    title: "Clandestine Project",
    description: "Dark Spyder intelligence platform...",
    icons: {
        icon: [
            {url: '/image/favicon.ico'},
        ],
    },
}


export default function RootLayout({children}) {
    return (
        <html lang="en" className={poppins.variable}>

        <body className="antialiased">
        {children}
        </body>
        </html>
    );
}
