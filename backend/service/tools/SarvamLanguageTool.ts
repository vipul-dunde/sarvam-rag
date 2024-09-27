import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { translateOpenAPISpec } from "@/backend/service/tools/openAPiSpec/translateOpenAPISpec";
import sarvamAIToolkit from "@/backend/service/tools/SarvamAIToolkit";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";

export const SARVAM_LANGUAGE_TOOL = "sarvamLanguageTool";

class SarvamLanguageTool {
  public async initialiseSarvamLanguageTool(llm: any, query?: string) {
    const sarvamLanguageTool = tool(
      async ({ operation }) => {
        console.log("operation: ", operation);
        return operation;
      },
      {
        name: SARVAM_LANGUAGE_TOOL,
        description:
          "This tool is used to translate a sentence to another language.",
        schema: await this.getVectorStoreSchema(query),
      },
    );

    return sarvamLanguageTool;
  }

  private async getVectorStoreSchema(query?: string) {
    return z
      .object({
        operation: z
          .string()
          .describe(
            "This is the operation that the tool will perform when user asks to translate a sentence to another language. Prepare only POST payload/body with reference of " +
              JSON.stringify(
                translateOpenAPISpec.paths["/translate"].post.requestBody
                  .content["application/json"].example,
              ) +
              " for Query of User: " +
              query,
          ),
      })
      .required();
  }

  public async performOperation(
    llmProvider: LLMProvider,
    query: string,
    operation?: any,
  ) {
    return (
      "Strictly Only Return Translated Output String from " +
      (await sarvamAIToolkit.builtAPICallingToolKit(
        llmProvider,
        query,
        operation,
      ))
    );
  }
}

export default SarvamLanguageTool;
