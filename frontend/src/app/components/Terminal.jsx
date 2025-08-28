// src/app/components/Terminal.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Share_Tech_Mono } from "next/font/google";

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// default home‐page messages
const defaultBoot = [
  "> UPLINK ESTABLISHED…",
  "",  // blank line
  "> PROJECT: MONETIZED MINDSHARE",
  "> MISSION: TURN ATTENTION INTO VALUE",
  "> VISION: EMPOWER THE OBSERVED",
  "",  // blank line
  "> CONSCIOUSNESS = CURRENCY",
  "> STATUS: AUTHORIZED",
  ">_"
];

export default function Terminal({
  onDone,
  messages = defaultBoot  // allow passing a custom array
}) {
  const [lines, setLines]       = useState([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const outputRef = useRef(null);

  useEffect(() => {
    if (lineIndex >= messages.length) return;

    const current = messages[lineIndex];

    // handle blank lines instantly
    if (current.trim() === "") {
      setLines(prev => [...prev, ""]);
      setLineIndex(li => li + 1);
      setCharIndex(0);
      return;
    }

    const charDelay = 20;
    const linePause = 100;

    const timer = setTimeout(() => {
      setLines(prev => {
        const next = [...prev];
        if (next.length <= lineIndex) {
          next.push(current.charAt(0));
        } else {
          next[lineIndex] += current.charAt(charIndex);
        }
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
  }, [charIndex, lineIndex, messages]);

  // auto-scroll & onDone trigger
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
    if (lineIndex === messages.length && onDone) {
      onDone();
    }
  }, [lines, lineIndex, messages.length, onDone]);

  return (
    <div
      ref={outputRef}
      className={`
        ${shareTechMono.className}
        w-full space-y-1 text-sm text-[#99C2FA] text-left
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
