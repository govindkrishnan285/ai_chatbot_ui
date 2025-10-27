// /src/app/api/medquery/route.js

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    // 1. Expect an array of messages instead of a single question
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    const chat = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      // 2. Pass the entire messages array directly to the API
      messages: messages,
    });

    const answer = chat.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Medquery API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}