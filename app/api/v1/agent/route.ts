import { NextResponse } from "next/server";
import agentService from "@/backend/service/agent/AgentService";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  LLMProvider,
  mapToLLMProvider,
} from "@/backend/service/support/LLMProviderMapper";
import langChainHelperService from "@/backend/service/langchain/LangChainHelperService";
import { ChatOpenAI } from "@langchain/openai";

export async function POST(request: Request) {
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

    if (!llm.bindTools) {
      throw new Error("This model does not support tools.");
    }

    const response = await agentService.initialiseAgent(
      body.query as string,
      llm,
      llmProvider,
    );

    const nextResponse = {
      status: 200,
      content: response,
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
