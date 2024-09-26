import { NextResponse } from "next/server";
import googleAIAdapter from "@/backend/service/llm/googleai/GoogleAIAdapter";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessageChunk } from "@langchain/core/messages";

async function postHandler(request: Request) {
  try {
    const body = await request.json();
    const toolId = body?.toolId || "vectorStoreTool";
    const llm: ChatGoogleGenerativeAI =
      await googleAIAdapter.getInitialisedVectorStoreAndLLM();
    const prompt: string = `<prompt>
  <context>
    <description>
      Users are seeking information or asking questions related to a specific topic.
    </description>
    <topic>${body.query}</topic>
  </context>
  <instructions>
    <guidelines>
      <focus>Provide clear, concise, and accurate responses to the users' questions.</focus>
      <style>Respond in a conversational tone, ensuring the information is accessible and easy to understand.</style>
      <depth>Offer in-depth explanations where necessary, ensuring no essential detail is left out.</depth>
      <examples>
        <example>
          <question>What is the topic about?</question>
          <answer>Provide a high-level overview with examples or analogies to clarify the concept.</answer>
        </example>
        <example>
          <question>How can I apply this topic?</question>
          <answer>Offer actionable steps or scenarios where this topic might be applicable.</answer>
        </example>
      </examples>
    </guidelines>
    <outputFormat>Provide your response in paragraph form, ensuring key points are highlighted where relevant. Response should not very long single line, split into multiple lines</outputFormat>
  </instructions>
</prompt>`;
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
