// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Terminal from "./components/Terminal";
import Link from "next/link";


export default function Page() {
  const [isFinished, setIsFinished] = useState(false);
  const [usdBalance, setUsdBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [balanceError, setBalanceError] = useState(null);

  useEffect(() => {
    fetch("/api/balance")
      .then((res) => res.json())
      .then((data) => {
        if (data.usd) setUsdBalance(data.usd);
        else setBalanceError(data.error || "Error");
      })
      .catch(() => setBalanceError("Fetch failed"))
      .finally(() => setLoadingBalance(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center p-4 overflow-hidden">
      {/* Logo */}
      <img
        src="/brain.gif"
        alt="MM Logo"
        width={200}
        height={40}
        priority="true"
        unoptimized="true"
        className="mx-auto mb-2 w-48 h-auto p-4"
      />

      {/* SOL balance */}
      <div className="mb-6 text-sm text-[#a1dbf4] p-2">
        {loadingBalance
          ? "Loading balance…"
          : balanceError
          ? balanceError
          : `$${usdBalance} USD`}
      </div>

      {/* Countdown timer (resets every 8h) */}
      <Timer />

      {/* Terminal */}
      <div className="w-full max-w-lg mx-auto overflow-auto">
        <Terminal onDone={() => setIsFinished(true)} />
      </div>

      {/* Continue */}
      {isFinished && (
        <div className="mt-6 flex justify-center w-full max-w-lg mx-auto">
          <button className="px-4 py-2 border border-[#a1dbf4] rounded hover:bg-[#a1dbf4]/10">
            Continue
          </button>
        </div>
      )}

      {/* Bottom-right eye GIF */}  
      <Link href="/chat" className="fixed bottom-10 right-10 z-10000">
        <img
            src="/mm-eye.gif"
            alt="you are being evaluated."
            className="
              pointer-events-auto
              fixed
              bottom-10
              right-10
              w-12
              h-12
              sm:w-16
              sm:h-16
            "
          />
        </Link>
    </div>
  );
}

function Timer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Launch at May 30 2025 20:00 CST → 2025-05-31T02:00:00Z
    const LAUNCH = new Date("2025-05-31T02:00:00Z").getTime();
    const INTERVAL = 8 * 60 * 60 * 1000; // 8 hours

    const update = () => {
      const now = Date.now();
      const elapsed = now - LAUNCH;
      // how far we are into the current 8h window
      const msLeft = INTERVAL - (elapsed % INTERVAL);
      const hrs = Math.floor(msLeft / (1000 * 60 * 60));
      const mins = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((msLeft % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hrs).padStart(2, "0")}:` +
        `${String(mins).padStart(2, "0")}:` +
        `${String(secs).padStart(2, "0")}`
      );
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-4 mb-6 text-sm text-[#a1dbf4]">
      INCOMING SIGNAL:{timeLeft}
    </div>
  );
}