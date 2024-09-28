import { LLMProvider } from "@/backend/support/LLMProviderMapper";
import googleAIAdapter from "@/backend/llm/googleai/GoogleAIAdapter";
import openAIAdapter from "@/backend/llm/openai/OpenAIAdapter";

class LangChainHelperService {
  public async getInitialisedLLMFromProviderWithLangChain(
    provider: LLMProvider,
  ) {
    switch (provider) {
      case LLMProvider.GoogleAI:
        return await googleAIAdapter.getInitialisedLLM();
      case LLMProvider.OpenAI:
        return await openAIAdapter.getInitialisedLLM();
      default:
        return await googleAIAdapter.getInitialisedLLM();
    }
  }

  public async getEmbeddingsFromProvider(provider: LLMProvider) {
    switch (provider) {
      case LLMProvider.GoogleAI:
        return await googleAIAdapter.getGoogleAIEmbeddings();
      case LLMProvider.OpenAI:
        return await openAIAdapter.getOpenAiEmbeddings();
      default:
        return await googleAIAdapter.getGoogleAIEmbeddings();
    }
  }
}

const langChainHelperService: LangChainHelperService =
  new LangChainHelperService();
export default langChainHelperService;
