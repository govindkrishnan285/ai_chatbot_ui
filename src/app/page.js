// /src/app/page.js

import Chatbot from "@/components/Chatbot";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen w-full items-center bg-gray-100">
            {/* Main container grows to fill available space */}
            <main className="flex w-full flex-col items-center p-4 pt-8 sm:p-6 lg:p-8 flex-grow">

                {/* Header section */}
                <div className="w-full max-w-3xl text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
                        <span role="img" aria-label="stethoscope emoji" className="mr-3">🩺</span>
                        Medical Info Chatbot
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mt-2">
                        Your AI-powered assistant for reliable medical information.
                    </p>
                </div>

                {/* Chatbot component */}
                <Chatbot />

            </main>

            {/* --- ADD THIS FOOTER --- */}
            <footer className="w-full p-4 text-center">
                <p className="text-xs text-gray-500">
                    Disclaimer: This chatbot is for informational purposes only and does not constitute medical advice.
                    Always consult with a qualified healthcare professional for any medical concerns.
                </p>
            </footer>
            {/* --- END OF FOOTER --- */}
        </div>
    );
}