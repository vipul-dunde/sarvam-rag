import { NextResponse } from "next/server";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";
import googleAIAdapter from "@/backend/service/llm/googleai/GoogleAIAdapter";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vectorStore = await qdrantLCVectorStore.getQdrantVectorStore(
      LLMProvider.GoogleAI,
    );
    const data = await vectorStore.similaritySearch(body.query as string, 2);
    const llm = await googleAIAdapter.getInitialisedVectorStoreAndLLM();
    if (!llm.bindTools) {
      throw new Error("This model does not support tools.");
    }

    const calculatorSchema = z.object({
      operation: z
        .enum(["add", "subtract", "multiply", "divide"])
        .describe("The type of operation to execute."),
      number1: z.number().describe("The first number to operate on."),
      number2: z.number().describe("The second number to operate on."),
    });

    const calculatorTool = tool(
      async ({ operation, number1, number2 }) => {
        // Functions must return strings
        if (operation === "add") {
          return `${number1 + number2}`;
        } else if (operation === "subtract") {
          return `${number1 - number2}`;
        } else if (operation === "multiply") {
          return `${number1 * number2}`;
        } else if (operation === "divide") {
          return `${number1 / number2}`;
        } else {
          throw new Error("Invalid operation.");
        }
      },
      {
        name: "calculator",
        description: "Can perform mathematical operations.",
        schema: calculatorSchema,
      },
    );

    const llmbind = await llm.bindTools([calculatorTool]);
    // const prompt = `Users are asking questions about the following topic: ${body.query}\n Retrieved relevant data from Vector Store: ${data.length > 0 ? data[0].pageContent: 'No Vector dats available'}, Prepare answer in short for the query with vector store data. respond is JSON`;
    const prompt = `${body.query}`;
    const response = await llmbind.invoke(prompt);
    const nextResponse = {
      status: 200,
      content: response.tool_calls,
      error: null,
    };
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
