import { OpenAI } from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const MODELS = {
  FAST: "gpt-3.5-turbo", // For simple Q&A
  SMART: "gpt-4", // For complex reasoning (roadmaps)
} as const;