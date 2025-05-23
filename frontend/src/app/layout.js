// src/app/layout.js
import "./globals.css";
import { Share_Tech_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "MONETIZEDMNDSHR",
  description: "An immersive onchain experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${shareTechMono.className}
          bg-black text-[#a1dbf4] font-mono
          flex flex-col h-screen overflow-hidden
        `}
      >
        {/* NAVBAR (fixed height) */}
        <nav className="flex-none w-full border-b border-[#a1dbf4]/20">
          <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-2">
            <Link href="/dex" className="text-sm hover:underline">
              [ DEX ]
            </Link>
            <Link href="/" className="text-sm hover:underline">
              [ MM ]
            </Link>
            <Link
              href="https://x.com/MonetizedMNDSHR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              [ X ]
            </Link>
          </div>
        </nav>

        {/* MAIN (fills remaining space, content clipped) */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>

        {/* Vercel Analytics */}
        <Analytics /> 
        <SpeedInsights />

      </body>
    </html>
  );
}
