import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import langChainDocumentService from "@/backend/service/langchain/LangChainDocumentService";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";

async function postHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename: string = searchParams.get("filename") as string;
    const blob = await put(
      filename,
      request.body as ReadableStream<Uint8Array>,
      {
        access: "public",
      },
    );
    const document = await langChainDocumentService.loadPDFWithBlobURL(
      blob.url,
    );
    await qdrantLCVectorStore.manageQdrantVectorStore(
      LLMProvider.GoogleAI,
      document,
    );
    const nextResponse = {
      status: 200,
      content: blob,
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

export const POST = postHandler;
