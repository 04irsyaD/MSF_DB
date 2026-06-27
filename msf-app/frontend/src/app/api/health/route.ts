import { NextResponse } from "next/server";

export async function GET() {
  // Check if Ollama is configured and reachable
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  let ollamaStatus = "down";
  let ollamaModel = "none";

  try {
    const res = await fetch(`${ollamaBaseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      ollamaStatus = "up";
      const data = await res.json();
      if (data.models && data.models.length > 0) {
        ollamaModel = data.models[0].name;
      }
    }
  } catch (e) {
    // Ollama not reachable (common on Vercel deployment)
  }

  return NextResponse.json({
    status: "healthy",
    services: {
      api: "up",
      ollama: ollamaStatus,
      ollama_model: ollamaModel,
    },
    version: "2.0.0-serverless",
  });
}
