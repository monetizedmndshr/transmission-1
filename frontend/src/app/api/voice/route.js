// src/app/api/voice/route.js

// 1) Tell Next.js this must run in Node (not the Edge runtime)
export const runtime = "nodejs";

import { VoiceResponse } from "twilio";

export async function POST(req) {
  try {
    // (optional) parse incoming form data if you need it:
    // const form = await req.formData();
    // const to   = form.get("To");
    // const from = form.get("From");

    // build the TwiML
    const twiml = new VoiceResponse();
    twiml.say(
      { voice: "alice", language: "en-US" },
        "Congratulations and welcome to Monetized Mindshare. One percent. Twelve clues. Every 8 hours. Good luck."
    );
    twiml.hangup();

    return new Response(twiml.toString(), {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("Voice webhook error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const GET = POST;



