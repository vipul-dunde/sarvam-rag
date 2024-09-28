import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessageChunk } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import {
  LLMProvider,
  mapToLLMProvider,
} from "@/backend/support/LLMProviderMapper";
import langChainHelperService from "@/backend/services/langchain/LangChainHelperService";

async function postHandler(request: Request) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const llmProvider: LLMProvider = (await mapToLLMProvider(
      (searchParams.get("llmOption") as string) || "GoogleAI",
    )) as LLMProvider;

    const llm: ChatGoogleGenerativeAI | ChatOpenAI =
      await langChainHelperService.getInitialisedLLMFromProviderWithLangChain(
        llmProvider,
      );

    const prompt: string = `Respond to the following message: ${body.query}`;
    const response: AIMessageChunk = await llm.invoke(prompt);
    const nextResponse = {
      status: 200,
      content: response.content,
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
