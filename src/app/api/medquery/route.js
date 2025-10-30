import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

<<<<<<< HEAD


export async function POST(req) {
  try {

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
=======
// Create the SSM client. Because of the IAM role, you don't need to provide any credentials.
// It's important to specify the region.
const ssmClient = new SSMClient({ region: "eu-north-1" }); // <--- IMPORTANT: Change to YOUR AWS region

const parameterName = "/chatbot/production/GROQ_API_KEY";
let groqApiKey; // We'll store the key here

// This function fetches the key from AWS.
async function getApiKey() {
  if (groqApiKey) {
    return groqApiKey; // Return cached key if we already have it
  }

  const command = new GetParameterCommand({
    Name: parameterName,
    WithDecryption: true, // Necessary for SecureString types
  });

  const response = await ssmClient.send(command);
  groqApiKey = response.Parameter.Value;
  return groqApiKey;
}

export async function POST(req) {
  try {
    const key = await getApiKey(); // Fetch the key on the first request
    const client = new Groq({apiKey: key});
>>>>>>> fef2bd41163dcf72509c128f26dd011452df34a8

    const {messages} = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({error: "Missing messages"}, {status: 400});
    }

    const chat = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
    });

    const answer = chat.choices[0].message.content;
    return NextResponse.json({answer});
  } catch (err) {
<<<<<<< HEAD
    console.error("Medquery API error:", err);

    const errorMessage = err.message || "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
=======
    console.error("API error:", err);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
>>>>>>> fef2bd41163dcf72509c128f26dd011452df34a8
  }
}