import { NextResponse } from "next/server";
import { qdrantLCVectorStore } from "@/backend/vector-store/qdrant/QdrantVectorStore";
import {
  LLMProvider,
  mapToLLMProvider,
} from "@/backend/support/LLMProviderMapper";

async function deleteHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const llmProvider: LLMProvider = (await mapToLLMProvider(
      (searchParams.get("llmOption") as string) || "GoogleAI",
    )) as LLMProvider;
    await qdrantLCVectorStore.clearQdrantVectorStore(llmProvider);
    const nextResponse = {
      status: 200,
      content: "Cleared Vector Store",
      error: null,
    };
    return NextResponse.json(nextResponse, { status: 200 });
  } catch (error) {
    console.error(error);
    const nextResponse = {
      status: 500,
      content: null,
      error: (error as Error).message,
    };
    return NextResponse.json(nextResponse, { status: 500 });
  }
}

export const DELETE = deleteHandler;
