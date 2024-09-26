import { NextResponse } from "next/server";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import googleAIAdapter from "@/backend/service/llm/googleai/GoogleAIAdapter";
import agentService from "@/backend/service/agent/AgentService";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const llm: ChatGoogleGenerativeAI =
      await googleAIAdapter.getInitialisedVectorStoreAndLLM();

    if (!llm.bindTools) {
      throw new Error("This model does not support tools.");
    }

    const response = await agentService.initialiseAgent(
      body.query as string,
      llm,
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
