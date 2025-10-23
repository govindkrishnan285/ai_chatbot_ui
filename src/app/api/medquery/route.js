import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const chat = await client.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: "You are a helpful medical assistant..." },
    { role: "user", content: question }
  ],
});

    const answer = chat.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Medquery API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
