// src/app/api/voice/route.js
export const runtime = "nodejs";   // ⚠️ must be first

import { VoiceResponse } from "twilio";

export async function POST(request) {
  try {
    // 1) grab the raw url-encoded payload
    const body = await request.text();

    // 2) parse it into a Map
    const params = new URLSearchParams(body);
    const From = params.get("From") || "";
    const To   = params.get("To")   || "";

    console.log("📞 inbound call from", From, "to", To);

    // 3) build your TwiML
    const twiml = new VoiceResponse();
    twiml.say(
      { voice: "alice", language: "en-US" },
        "Congratulations and welcome to Monetized Mindshare. One percent. Twelve clues. Every 8 hours. Good luck."
    );
    twiml.hangup();

    // 4) return it as XML
    return new Response(twiml.toString(), {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("❌ /api/voice error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// also handle GET (in case Twilio retries with GET)
export const GET = POST;


