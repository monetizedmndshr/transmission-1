// src/app/chat/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";

export default function ChatPage() {
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef();

  // initialize username
  useEffect(() => {
    let u = localStorage.getItem("chat-username");
    if (!u) {
      u = "user" + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem("chat-username", u);
    }
    setUsername(u);
  }, []);

  // subscribe to Pusher once we have a username
  useEffect(() => {
    if (!username) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher-auth",
      auth: { params: { username } },
    });
    const channel = pusher.subscribe("presence-chat");
    channel.bind("pusher:subscription_succeeded", (m) => setMembers(m.count));
    channel.bind("pusher:member_added", () => setMembers(channel.members.count));
    channel.bind("pusher:member_removed", () => setMembers(channel.members.count));
    channel.bind("chat-event", (data) =>
      setMessages((m) => [...m, `${data.username}: ${data.message}`])
    );
    return () => {
      channel.unbind_all();
      pusher.unsubscribe("presence-chat");
    };
  }, [username]);

  // auto-scroll on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    await fetch("/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input.trim(), username }),
    });
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-[#a1dbf4] font-mono">
      <div className="p-4 text-sm">[ {members} ONLINE ]</div>

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 space-y-2 text-sm"
      >
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>

       <div
   className="
     mt-4 flex items-center bg-black
     px-4 py-2
     /* mobile-only: extra padding */
     pb-[calc(2rem+env(safe-area-inset-bottom))]
     /* desktop+: back to normal padding */
     md:pb-[calc(1rem+env(safe-area-inset-bottom))]
   "    >    
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 p-2 bg-black border border-[#a1dbf4] text-[#a1dbf4] text-sm"
          placeholder="Hit Enter to send…"
        />
        <button
          onClick={send}
          className="ml-2 px-4 py-2 border border-[#a1dbf4] rounded hover:bg-[#a1dbf4]/20 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}