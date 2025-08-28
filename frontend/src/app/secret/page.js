// src/app/secret/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Terminal from "../components/Terminal";

export default function SecretPage() {
  const [usdBalance, setUsdBalance] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    fetch("/api/balance")
      .then((res) => res.json())
      .then((data) => {
        if (data.usd) setUsdBalance(data.usd);
        else setError(data.error || "Error fetching balance");
      })
      .catch(() => setError("Fetch failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
  <div className="flex-1 flex flex-col items-center p-4 overflow-hidden text-[#99C2FA]">
      {/* Brain logo links back home */}
        <img
          src="/mm-logo.png"
          alt="Congratulations"
          className="mx-auto mb-4 w-48 h-auto cursor-pointer"
        />

      {/* Balance */}
      {/* <div className="mb-6 text-sm text-[#a1dbf4]">
        {loading
          ? "Loading balance…"
          : error
          ? error
          : `$${usdBalance} USD`}
      </div> */}

      {/* Timer (6h cadence) */}

      {/* Terminal */}
      <Terminal
  messages={[
    "> NODE 03 ACTIVE…",
    "",
    "> SEEK AND YOU SHALL FIND",
    "> FRAGMENTS FOUND: 5 / 5",
    "> STATUS: AUTHORIZED",
    "",
    // ── KEY SHARD FILES ──
    "> K1: 2Se8PSkxkk4NtzPjPBqv",
    "> K2: jJ6pFV2cjHFJu8tkbYGv",
    "> K3: uPaK7etCvMKftWr6Ty1A",
    "> K4: rezfam1g8CWndCN1RsZx",
    "> K5: N7oHNbvK",
    "",
    // ── RECONSTRUCTION ──
    "> KEY = K1 + K2 + K3 + K4 + K5",
    "",
    "> CONGRATULATIONS, USER",

    ">_"
  ]}
/>


      {/* Footer */}
      {/* <div className="mt-8 text-center text-[#a1dbf4] text-sm">
        <p>Welcome to the hidden node. Your journey continues…</p>
      </div> */}
    </div>
  );
}
