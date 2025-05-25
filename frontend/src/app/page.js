// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Terminal from "./components/Terminal";

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
    <div className="flex-1 flex flex-col items-center p-4 overflow-auto">
      {/* Logo */}
      <Image
        src="/brain-no-bg.png"
        alt="MM Logo"
        width={200}
        height={50}
        priority
        className="mx-auto mb-2 w-48 h-auto"
      />

      {/* SOL balance */}
      <div className="mb-6 text-sm text-[#a1dbf4]">
        {loadingBalance
          ? "Loading balance…"
          : balanceError
          ? balanceError
          : `$${usdBalance} USD`}
      </div>

      {/* Terminal */}
      <div className="w-full max-w-lg mx-auto">
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
    </div>
  );
}
