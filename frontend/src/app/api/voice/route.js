// src/app/api/voice/route.js
export const runtime = "nodejs"; // ⚠️ must be first

import twilio from "twilio";
const { VoiceResponse } = twilio.twiml;

export async function POST(request) {
  try {
    // parse url-encoded body
    const body = await request.text();
    const params = new URLSearchParams(body);
    const From = params.get("From") || "";
    const To   = params.get("To")   || "";

    console.log("📞 inbound call from", From, "to", To);

    // build TwiML
    const twiml = new VoiceResponse();
    twiml.say(
      { voice: "alice", language: "en-US" },
      "Welcome to Monetized Mindshare. We are seeking individuals who recognize patterns that others don't. Private keys will be released over the next few hours containing various amounts of supply. It's up to you to read in between the lines. Goodluck."
    );
    twiml.hangup();

    return new Response(twiml.toString(), {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("/api/voice error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// also allow GET
export const GET = POST;
