// src/app/layout.js
import "./globals.css";
import { Share_Tech_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const shareTechMono = Share_Tech_Mono({ subsets:["latin"], weight:"400", display:"swap" });

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
          relative bg-black text-[#ffba00]
          font-mono flex flex-col items-center justify-center 
          h-screen  /* lock to viewport height */
          p-4 overflow-hidden
          filter brightness-110 contrast-125 saturate-130
        `}
      >

        {/* NAV & CONTENT (z-10) */}
        <nav className="relative z-10 flex-none w-full border-b border-[#99C2FA]/20">
          <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-2">
            <Link href="/dex" className="text-sm hover:underline">[ DEX ]</Link>
            <Link href="/"    className="text-sm hover:underline">[ MM ]</Link>
            <Link href="https://x.com/MonetizedMNDSHR"
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm hover:underline">[ X ]</Link>
          </div>
        </nav>

        <main className="relative z-10 flex-1 flex flex-col overflow-hidden min-h-0">          <div 
            className="
              crt-window 
              relative 
              flex flex-col        /* ← make it flex */
              h-full               /* ← fill the parent */
              min-h-0              /* ← allow children to shrink to 0 */
              w-full max-w-4xl
            "
            >
            {children}
          </div>
        </main>

        <div className="pointer-events-none fixed inset-0 glass-overlay-no-blur z-40" />        

        {/* 5) Chromatic aberration (z-60) */}
        <div className="pointer-events-none fixed inset-0 chromatic-overlay z-60" />

        {/* Analytics & SpeedInsights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}