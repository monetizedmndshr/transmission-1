// force this handler to run on the Node.js runtime (not the Edge)
export const runtime = "nodejs";

import { VoiceResponse } from "twilio";

export async function POST(req) {
  try {
    console.log("▶️  /api/voice invoked");  // sanity-check log
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
    console.error("❌ /api/voice ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// If Twilio ever does a GET instead of POST:
export const GET = POST;