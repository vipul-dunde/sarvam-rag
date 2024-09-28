import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

class OpenAIAdapter {
  public async getOpenAiEmbeddings() {
    return new OpenAIEmbeddings({
      model: "text-embedding-3-large",
      dimensions: 768,
    });
  }

  public async getInitialisedLLM() {
    return new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.7,
    });
  }
}

const openAIAdapter: OpenAIAdapter = new OpenAIAdapter();
export default openAIAdapter;
