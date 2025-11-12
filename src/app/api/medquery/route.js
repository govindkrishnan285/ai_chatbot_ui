import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const userMessage = messages?.find((m) => m.role === "user")?.content?.trim();
    if (!userMessage) {
      return NextResponse.json({ answer: "Please describe your symptoms." });
    }

    // --- Extract symptom-like words ---
    const symptomList = userMessage
      .toLowerCase()
      .split(/,|and|with|having| /)
      .map((s) => s.trim())
      .filter((s) => s.length > 2);

    if (!symptomList.length) {
      return NextResponse.json({ answer: "Please list at least one symptom." });
    }

    // --- Call Flask backend ---
    const flaskRes = await fetch("http://127.0.0.1:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: symptomList }),
    });

    if (!flaskRes.ok) {
      const text = await flaskRes.text();
      console.error("Flask error:", text);
      throw new Error(`Flask returned ${flaskRes.status} ${flaskRes.statusText}`);
    }

    const data = await flaskRes.json();

    // --- Format AI response ---
    if (!data.recommendations || data.recommendations.length === 0) {
      return NextResponse.json({
        answer: "I couldn’t find matching specialists for your symptoms. Try different ones.",
      });
    }

    let reply = "Here are some doctor recommendations based on your symptoms:\n\n";

    data.recommendations.forEach((rec) => {
      reply += `**Specialist:** ${rec.specialist}\n`;
      rec.doctors.forEach((doc, i) => {
        reply += `${i + 1}. ${doc.name} — ${doc.specialization} (${doc.clinic})\n`;
      });
      reply += "\n";
    });

    return NextResponse.json({ answer: reply });
  } catch (error) {
    console.error("Error in medquery route:", error);
    return NextResponse.json({
      answer: "Sorry, something went wrong. Please try again.",
    });
  }
}
