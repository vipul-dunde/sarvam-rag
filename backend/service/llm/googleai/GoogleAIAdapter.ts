import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import {
  HarmBlockThreshold,
  HarmCategory,
  TaskType,
} from "@google/generative-ai";

class GoogleAIAdapter {
  public async getGoogleAIEmbeddings() {
    return new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
    });
  }

  public async getInitialisedLLM(): Promise<ChatGoogleGenerativeAI> {
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      streamUsage: false,
      streaming: false,
      temperature: 0.7,
      topK: 0,
      topP: 0,
      model: "gemini-1.5-flash",
      maxOutputTokens: 1000000,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
  }
}

const googleAIAdapter: GoogleAIAdapter = new GoogleAIAdapter();
export default googleAIAdapter;
