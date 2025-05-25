// src/app/api/voice/route.js
import { VoiceResponse } from "twilio";

export async function POST(req) {
  // build a TwiML response
  const twiml = new VoiceResponse();

  // either play an MP3
  // twiml.play("https://your-cdn.com/your-message.mp3");

  // or have Twilio speak
  twiml.say(
    { voice: "alice", language: "en-US" },
    "Welcome to Monetized Mindshare. Twelve clues, released every eight hours. Your wallet holds one percent of the key. Good luck."
  );

  // hang up when done
  twiml.hangup();

  // return TwiML XML
  return new Response(twiml.toString(), {
    headers: { "Content-Type": "application/xml" },
  });
}
