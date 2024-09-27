import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { translateOpenAPISpec } from "@/backend/service/agent/tools/support/openapi-specs/OpenAPISpecifications";
import sarvamAIApiCallingToolkit from "@/backend/service/agent/tools/sarvam-tool/SarvamAIApiCallingToolkit";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";

export const SARVAM_LANGUAGE_TOOL = "sarvamLanguageTool";

class SarvamLanguageTool {
  private async getSarvamToolSchema(query?: string) {
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

  public async initialiseSarvamLanguageTool(llm: any, query?: string) {
    return tool(
      async ({ operation }) => {
        console.log("operation: ", operation);
        return operation;
      },
      {
        name: SARVAM_LANGUAGE_TOOL,
        description:
          "This tool is used to translate a sentence to another language.",
        schema: await this.getSarvamToolSchema(query),
      },
    );
  }

  public async performOperation(
    llmProvider: LLMProvider,
    query: string,
    operation?: any,
  ) {
    return (
      "Strictly Only Return Translated Output String from " +
      (await sarvamAIApiCallingToolkit.builtAPICallingToolKit(
        llmProvider,
        query,
        operation,
      ))
    );
  }
}

export default SarvamLanguageTool;
