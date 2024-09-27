import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { PrismaClient } from "@prisma/client";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";

const prismaDB: PrismaClient = new PrismaClient();
export const VECTOR_STORE_TOOL = "vectorStoreTool";

class VectorStoreTool {
  private async getVectorStoreSchema(llmProvider: LLMProvider) {
    let topics;
    if (llmProvider === LLMProvider.GoogleAI) {
      topics = await prismaDB.topicsGoogle.findMany();
    } else {
      topics = await prismaDB.topicsOpenAI.findMany();
    }
    const documents = topics.map(
      (topic, index) =>
        `${index + 1} - ${topic.fileName} -> ${topic.Description}\n`,
    );
    return z
      .object({
        descriptionAndTopics: z
          .string()
          .describe(
            `Utilize this tool to efficiently retrieve knowledge from a vector store. This tool is specifically designed to gather relevant information for addressing user inquiries. Please ensure that the vector store strictly covers the following topics: ${documents.toString()}. Your responses should be clear, concise, and directly related to the specified topics.`,
          ),
        output: z.string().describe("Output of the query"),
      })
      .required();
  }

  public async initialiseVectorStoreTool(llmProvider: LLMProvider) {
    return tool(
      async function ({ descriptionAndTopics }: any): Promise<any> {
        console.log(descriptionAndTopics);
      }.bind(this),
      {
        name: VECTOR_STORE_TOOL,
        description:
          "A tool for retrieving knowledge from a vector store. Use this tool to gather information needed to respond to any user questions.",
        schema: await this.getVectorStoreSchema(llmProvider),
      },
    );
  }
}

export default VectorStoreTool;
