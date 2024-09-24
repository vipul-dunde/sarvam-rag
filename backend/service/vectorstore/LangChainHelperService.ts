import { LLMProvider} from "@/backend/service/support/LLMProviderMapper";
import googleAIAdapter from "@/backend/service/aimodels/googleai/GoogleAIAdapter";
import openAIAdapter from "@/backend/service/aimodels/openai/OpenAIAdapter";

class LangChainHelperService {
  public async getInitialisedVectorAndLLMFromProviderWithLangChain(
    provider: LLMProvider,
  ) {
    switch (provider) {
      case LLMProvider.GoogleAI:
        return await googleAIAdapter.getInitialisedVectorStoreAndLLM();
      case LLMProvider.OpenAI:
        return await openAIAdapter.getInitialisedVectorStoreAndLLM();
      default:
        return await googleAIAdapter.getInitialisedVectorStoreAndLLM();
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
