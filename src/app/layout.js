import { GeistSans } from "geist/font/sans";
import "./globals.css";

// --- Metadata ---
export const metadata = {
    title: "Medical Info Chatbot | AI-Powered Health Information",
    description: "An AI-powered chatbot designed to provide quick and accurate medical information. For informational purposes only.",
    themeColor: "#ffffff",
};

// --- Root Layout Component ---
export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body
            className={`${GeistSans.variable} font-sans bg-gray-100 text-gray-800 antialiased`}
            suppressHydrationWarning
        >
        {children}
        </body>
        </html>
    );
}