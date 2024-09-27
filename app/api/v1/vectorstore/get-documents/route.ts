import { NextResponse } from "next/server";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import {
  LLMProvider,
  mapToLLMProvider,
} from "@/backend/service/support/LLMProviderMapper";

async function getHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query: string = searchParams.get("query") as string;
    const llmProvider: LLMProvider = (await mapToLLMProvider(
      (searchParams.get("llmOption") as string) || "GoogleAI",
    )) as LLMProvider;

    const documents = await qdrantLCVectorStore.getSimilarDocs(
      llmProvider,
      query,
      3,
    );
    const nextResponse = {
      status: 200,
      content: documents,
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

export const GET = getHandler;
