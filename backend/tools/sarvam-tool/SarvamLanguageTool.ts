import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { translateOpenAPISpec } from "@/backend/tools/support/openapi-specs/OpenAPISpecifications";
import sarvamAIApiCallingToolkit from "@/backend/tools/sarvam-tool/SarvamAIApiCallingToolkit";
import { LLMProvider } from "@/backend/support/LLMProviderMapper";

export const SARVAM_LANGUAGE_TOOL = "sarvamLanguageTool";

class SarvamLanguageTool {
  private async getSarvamToolSchema(query?: string) {
    return z
      .object({
        operation: z
          .string()
          .describe(
            "This operation strictly handles translation requests. When the user asks to translate a sentence to another language, prepare only the POST payload/body based on the reference schema: " +
              JSON.stringify(
                translateOpenAPISpec.paths["/translate"].post.requestBody
                  .content["application/json"].example,
              ) +
              " for the user's query: " +
              query +
              ". Only process valid translation queries—ignore any other types of requests.",
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
