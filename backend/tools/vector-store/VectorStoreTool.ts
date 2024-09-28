import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { LLMProvider } from "@/backend/support/LLMProviderMapper";
import { prismaDB } from "@/backend/support/PrismaClient";

export const VECTOR_STORE_TOOL = "vectorStoreTool";

class VectorStoreTool {
  private async getVectorStoreSchema(llmProvider: LLMProvider) {
    try {
      let topics;
      if (llmProvider === LLMProvider.GoogleAI) {
        topics = await prismaDB.topicsGoogle.findMany({
          select: { fileName: true, Description: true },
        });
      } else {
        topics = await prismaDB.topicsOpenAI.findMany({
          select: { fileName: true, Description: true },
        });
      }

      const documents = topics
        .map(
          (topic, index) =>
            `${index + 1} - ${topic.fileName} -> ${topic.Description}`,
        )
        .join("\n");

      return z
        .object({
          descriptionAndTopics: z
            .string()
            .describe(
              `Utilize this tool to efficiently retrieve knowledge from a vector store. This tool is specifically designed to gather relevant information for addressing user inquiries. Please ensure that the vector store strictly covers the following topics:\n${documents}. Your responses should be clear, concise, and directly related to the specified topics.`,
            ),
          output: z.string().describe("Output of the query"),
        })
        .required();
    } catch (error) {
      console.error("Error fetching topics from database", error);
      throw new Error("Failed to retrieve topics for vector store schema.");
    }
  }

  public async initialiseVectorStoreTool(llmProvider: LLMProvider) {
    const schema = await this.getVectorStoreSchema(llmProvider);
    type VectorStoreSchema = z.infer<typeof schema>; // Infer type from schema

    return tool(
      async function ({
        descriptionAndTopics,
      }: VectorStoreSchema): Promise<any> {
        console.log(descriptionAndTopics);
      },
      {
        name: VECTOR_STORE_TOOL,
        description:
          "A tool for retrieving knowledge from a vector store. Use this tool to gather information needed to respond to any user questions.",
        schema,
      },
    );
  }
}

export default VectorStoreTool;
