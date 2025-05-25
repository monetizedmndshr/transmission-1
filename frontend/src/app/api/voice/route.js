// src/app/api/voice/route.js
import { NextResponse } from "next/server";

// your TwiML message:
const TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">
    Welcome to Monetized Mindshare. Transmission begins now.
  </Say>
  <Pause length="1"/>
  <Hangup/>
</Response>`;

export async function POST() {
  return new NextResponse(TWIML, {
    headers: { "Content-Type": "text/xml" },
  });
}

// if Twilio ever does a GET instead:
export async function GET() {
  return POST();
}
