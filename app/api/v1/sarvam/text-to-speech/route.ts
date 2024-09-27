import sarvamService from "@/backend/service/sarvam-ai/SarvamService";
import { NextResponse } from "next/server";
import {
  LLMProvider,
  mapToLLMProvider,
} from "@/backend/service/support/LLMProviderMapper";

async function postHandler(request: Request) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const llmProvider: LLMProvider = (await mapToLLMProvider(
      (searchParams.get("llmOption") as string) || "GoogleAI",
    )) as LLMProvider;

    const sarvamSpeech: string[] = await sarvamService.getSpeechFromText(
      body.message as string,
    );
    const nextResponse = {
      status: 200,
      content: { audios: sarvamSpeech },
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
