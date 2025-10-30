import { NextResponse } from "next/server";
import Groq from "groq-sdk";



export async function POST(req) {
  try {

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

    const errorMessage = err.message || "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}