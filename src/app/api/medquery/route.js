import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// The Groq client is NOT created here anymore.

export async function POST(req) {
  try {
    // THIS IS THE NEW PART: Create the client *inside* the function.
    // This code only runs when a user sends a message, not during the build.
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    const chat = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
    });

    const answer = chat.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Medquery API error:", err);
    // Be more specific in the error response for debugging
    const errorMessage = err.message || "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}