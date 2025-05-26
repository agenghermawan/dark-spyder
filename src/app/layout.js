import { Poppins } from "next/font/google";
import "./globals.css";
import LoaderWrapper from "../components/ui/loader-wrapper";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata = {
    title: 'Clandestine Project',
    description: 'Deskripsi default website kamu.',
    icons: {
        icon: 'image/favicon.ico',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={poppins.variable}>
        <body className="antialiased">
        <LoaderWrapper>
            {children}
        </LoaderWrapper>
        </body>
        </html>
    );
}
