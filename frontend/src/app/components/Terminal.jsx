// src/app/components/Terminal.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Share_Tech_Mono } from "next/font/google";

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bootMessages = [
  "> UPLINK ESTABLISHED…",
  "\n",                           // ← blank line here
  "> PROJECT: MONETIZED-MINDSHARE",
  "> MISSION: TURN ATTENTION INTO VALUE",
  "> VISION: EMPOWER THE OBSERVED",
  "\n",                           // ← blank line here
  "> CONSCIOUSNESS = CURRENCY",
  "> STATUS: AUTHORIZED",
  ">_"
];


export default function Terminal({ onDone }) {
  const [lines, setLines] = useState([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const outputRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    if (lineIndex >= bootMessages.length) return;
    const current = bootMessages[lineIndex];
    const charDelay = 20;
    const linePause = 100;

    const timer = setTimeout(() => {
      setLines(prev => {
        const next = [...prev];
        if (next.length <= lineIndex) next.push(current.charAt(charIndex));
        else next[lineIndex] += current.charAt(charIndex);
        return next;
      });

      if (charIndex < current.length - 1) {
        setCharIndex(ci => ci + 1);
      } else {
        setCharIndex(0);
        setLineIndex(li => li + 1);
      }
    }, charIndex < current.length - 1 ? charDelay : charDelay + linePause);

    return () => clearTimeout(timer);
  }, [charIndex, lineIndex]);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
    // Fire onDone when we've advanced past the last message
    if (lineIndex === bootMessages.length && onDone) {
      onDone();
    }
  }, [lines, lineIndex, onDone]);

  return (
    <div
      ref={outputRef}
      className={`
        ${shareTechMono.className}
        w-full space-y-1 text-sm text-[#a1dbf4] text-left
        whitespace-pre-wrap break-words
        md:whitespace-pre
      `}
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-words md:whitespace-pre">
          {line}
        </div>
      ))}
    </div>
  );
}
