import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import langChainDocumentService from "@/backend/service/langchain/LangChainDocumentService";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";
import googleAIAdapter from "@/backend/service/llm/googleai/GoogleAIAdapter";
import { PrismaClient } from "@prisma/client";
const prismaDB = new PrismaClient();

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
    const llm = await googleAIAdapter.getInitialisedVectorStoreAndLLM();
    const llmResponse = await llm.invoke(
      "Create 30 Words Description What is this PDF and content about" +
        document[0].pageContent,
    );

    try {
      await prismaDB.topics.create({
        data: {
          fileName: filename as string,
          Description: llmResponse.content as string,
        },
      });
    } catch (error) {
      console.error(error);
    }
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
