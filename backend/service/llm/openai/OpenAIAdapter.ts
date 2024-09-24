import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";

class OpenAIAdapter {
  public async getOpenAiEmbeddings() {
    return new OpenAIEmbeddings({
      model: "text-embedding-3-large",
      dimensions: 768,
    });
  }

  public async getInitialisedVectorStoreAndLLM(): Promise<OpenAI> {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      temperature: 0.8,
    });
  }
}

const openAIAdapter: OpenAIAdapter = new OpenAIAdapter();
export default openAIAdapter;
