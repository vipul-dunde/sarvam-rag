import { NextResponse } from "next/server";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";
import { DocumentInterface } from "@langchain/core/documents";

async function getHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query: string = searchParams.get("query") as string;
    const vectorStore = await qdrantLCVectorStore.getQdrantVectorStore(
      LLMProvider.GoogleAI,
    );
    const documents = await qdrantLCVectorStore.getSimilarDocs(query, 3);
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
