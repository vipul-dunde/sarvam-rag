import langChainHelperService from "@/backend/service/langchain/LangChainHelperService";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";
import { OpenApiToolkit } from "langchain/agents/toolkits";
import { JsonSpec } from "langchain/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { translateOpenAPISpec } from "@/backend/service/tools/openAPiSpec/translateOpenAPISpec";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredToolInterface } from "@langchain/core/tools";

class SarvamAIToolkit {
  public async builtAPICallingToolKit(
    llmOption: LLMProvider,
    query: string,
    aiPayload?: any,
  ): Promise<any> {
    const llm: ChatGoogleGenerativeAI | ChatOpenAI =
      await langChainHelperService.getInitialisedLLMFromProviderWithLangChain(
        llmOption as LLMProvider,
      );

    const headers: any = {
      "api-subscription-key": process.env.SARVAM_SUBSCRIPTION_KEY as string,
      "Content-Type": "application/json",
    };

    const payload = {
      input: "Input received from user",
      source_language_code: "en-IN",
      target_language_code: "language code from openAPI spec",
      speaker_gender: "gander of speaker",
      mode: "formal",
      model: "mayura:v1",
      enable_preprocessing: true,
    };

    const toolkit: OpenApiToolkit = new OpenApiToolkit(
      new JsonSpec(translateOpenAPISpec),
      llm,
      headers,
    );
    const tools: StructuredToolInterface[] = toolkit.getTools();
    const exampleQuery: string = `Make a POST request to the Sarvam AI /translate API. The translate query from user is: ${query}\n, Make sure to check uploaded openAPI spec carefully. For request make sure to refer ${JSON.stringify(payload)} or Directly Use ${JSON.stringify(aiPayload)} if it's valid, Only Return Translated Text`;
    const agentExecutor: any = createReactAgent({ llm, tools });
    const events = await agentExecutor.stream(
      { messages: [["user", exampleQuery]] },
      { streamMode: "values" },
    );
    let response: any = {
      toolCall: {},
      message: "",
    };

    for await (const event of events) {
      const lastMsg = event.messages[event.messages.length - 1];
      if (lastMsg.tool_calls?.length) {
        response.toolCall = lastMsg.tool_calls[0];
      } else if (lastMsg.content) {
        response.message = lastMsg.content;
      }
    }
    return JSON.stringify(response);
  }
}
const sarvamAIToolkit: SarvamAIToolkit = new SarvamAIToolkit();
export default sarvamAIToolkit;
