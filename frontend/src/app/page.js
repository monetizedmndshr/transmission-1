// src/app/page.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Terminal from "./components/Terminal";

export default function Page() {
  const [isFinished, setIsFinished] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center p-4 overflow-auto">
      {/* Logo */}
      <div>
        <Image
          src="/mm-logo.png"
          alt="MM Logo"
          width={200}
          height={50}
          priority
          className="mx-auto mb-6 w-48 h-auto"
        />
      </div>

      {/* Terminal (just grows; parent scrolls) */}
      <div className="w-full max-w-lg mx-auto">
        <Terminal onDone={() => setIsFinished(true)} />
      </div>

      {/* Continue button always pinned right below */}
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
