import { NextResponse } from "next/server";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";

async function deleteHandler() {
  try {
    await qdrantLCVectorStore.clearQdrantVectorStore(LLMProvider.GoogleAI);
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
