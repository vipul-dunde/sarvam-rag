import {LLMProvider} from "@/backend/service/support/LLMProviderMapper";
import { type Document as LangChainDocument } from "@langchain/core/documents";
import { QdrantVectorStore } from "@langchain/qdrant";
import langChainHelperService from "@/backend/service/vectorstore/LangChainHelperService";

class QdrantLCVectorStore {
  public async getQdrantVectorStore(llmProvider: LLMProvider) {
    const embeddings =
      await langChainHelperService.getEmbeddingsFromProvider(llmProvider);
    return QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: process.env.QDRANT_GOOGLE_COLLECTION_NAME,
      apiKey: process.env.QDRANT_API_KEY,
    });
  }

  public async manageQdrantVectorStore(
    llmProvider: LLMProvider,
    documents: LangChainDocument[],
  ) {
    const embeddings =
      await langChainHelperService.getEmbeddingsFromProvider(llmProvider);
    const vectorStore: QdrantVectorStore = new QdrantVectorStore(embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: process.env.QDRANT_GOOGLE_COLLECTION_NAME,
      apiKey: process.env.QDRANT_API_KEY,
    });
    await vectorStore.addDocuments(documents, { customPayload: [] });
    return vectorStore;
  }
}

export const qdrantLCVectorStore: QdrantLCVectorStore =
  new QdrantLCVectorStore();
