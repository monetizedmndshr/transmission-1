// src/app/api/voice/route.js
import { VoiceResponse } from "twilio";

export async function POST(req) {
  const twiml = new VoiceResponse();
  twiml.say(
    { voice: "alice", language: "en-US" },
    "Welcome to Monetized Mindshare. Twelve clues, released every eight hours. Your wallet holds one percent of the key. Good luck."
  );
  twiml.hangup();

  return new Response(twiml.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/xml"
    },
  });
}
