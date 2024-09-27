import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import langChainDocumentService from "@/backend/service/langchain/LangChainDocumentService";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import {
  LLMProvider,
  mapToLLMProvider,
} from "@/backend/service/support/LLMProviderMapper";
import googleAIAdapter from "@/backend/service/llm/googleai/GoogleAIAdapter";
import { PrismaClient } from "@prisma/client";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import langChainHelperService from "@/backend/service/langchain/LangChainHelperService";
const prismaDB = new PrismaClient();

async function postHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename: string = searchParams.get("filename") as string;
    const llmProvider: LLMProvider = (await mapToLLMProvider(
      (searchParams.get("llmOption") as string) || "GoogleAI",
    )) as LLMProvider;
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
    const llm: ChatGoogleGenerativeAI | ChatOpenAI =
      await langChainHelperService.getInitialisedLLMFromProviderWithLangChain(
        llmProvider,
      );

    const llmResponse = await llm.invoke(
      "Create 30 Words Description What is this PDF and content about" +
        document[0].pageContent,
    );

    try {
      if (llmProvider === LLMProvider.GoogleAI) {
        await prismaDB.topicsGoogle.create({
          data: {
            fileName: filename as string,
            Description: llmResponse.content as string,
          },
        });
      } else {
        await prismaDB.topicsOpenAI.create({
          data: {
            fileName: filename as string,
            Description: llmResponse.content as string,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
    await qdrantLCVectorStore.manageQdrantVectorStore(llmProvider, document);
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
