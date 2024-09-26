import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { Tool } from "langchain/tools";
import { VECTOR_STORE_TOOL } from "@/backend/service/tools/VectorStoreTool";

export const WEB_QUERY_TOOL = "webQueryTool";

class WebQueryTool {
  public async initialiseVectorStoreTool(llm: any) {
    const vectorStoreTool = tool(
      async function ({ operation }): Promise<any> {
        const insideLLM = await llm.invoke("Return Eassy on AI");
        return {
          operation: operation,
          output: "insideLLM.content",
        };
      },
      {
        name: VECTOR_STORE_TOOL,
        description:
          "A tool for retrieving knowledge from a vector store. Use this tool to gather information needed to respond to any user questions.",
        schema: await this.getVectorStoreSchema(),
      },
    );
    return vectorStoreTool;
  }

  private async getVectorStoreSchema(query?: string) {
    return z
      .object({
        operation: z
          .string()
          .describe(
            "If query does not look very general, then check vector store",
          ),
        output: z.string().describe("Output of the query"),
      })
      .required();
  }
}

export default WebQueryTool;
