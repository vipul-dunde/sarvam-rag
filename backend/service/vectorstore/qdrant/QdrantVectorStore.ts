import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";
import { type Document as LangChainDocument } from "@langchain/core/documents";
import { QdrantVectorStore } from "@langchain/qdrant";
import langChainHelperService from "@/backend/service/langchain/LangChainHelperService";
import { QdrantClient } from "@qdrant/qdrant-js";
import { PrismaClient } from "@prisma/client";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

class QdrantLCVectorStore {
  public async getSimilarDocs(
    llmProvider: LLMProvider,
    query: string,
    count: number = 3,
  ) {
    const vectorStore = await this.getQdrantVectorStore(llmProvider);
    return await vectorStore.similaritySearch(query, count);
  }

  public async getSimilarDocsAsString(
    llmProvider: LLMProvider,
    query: string,
    count: number = 2,
    threshold: number = 0.5,
  ) {
    const vectorStore = await this.getQdrantVectorStore(LLMProvider.GoogleAI);
    const similarDocs = await vectorStore.similaritySearchWithScore(query);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 4000,
      chunkOverlap: 600,
    });

    return JSON.stringify(
      await splitter.splitDocuments(
        similarDocs.filter((doc) => doc[1] >= threshold).map((doc) => doc[0]),
      ),
    );
  }

  public async getQdrantVectorStore(llmProvider: LLMProvider) {
    try {
      const embeddings =
        await langChainHelperService.getEmbeddingsFromProvider(llmProvider);
      const collectionName = (
        llmProvider === LLMProvider.GoogleAI
          ? process.env.QDRANT_GOOGLE_COLLECTION_NAME
          : process.env.QDRANT_OPENAI_COLLECTION_NAME
      ) as string;
      return QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL as string,
        collectionName: collectionName,
        apiKey: process.env.QDRANT_API_KEY as string,
      });
    } catch (error) {
      console.error(
        `Error getting Qdrant Vector Store: ${(error as Error).message}`,
      );
      throw new Error(
        `Error getting Qdrant Vector Store: ${(error as Error).message}`,
      );
    }
  }

  public async manageQdrantVectorStore(
    llmProvider: LLMProvider,
    documents: LangChainDocument[],
  ) {
    const embeddings =
      await langChainHelperService.getEmbeddingsFromProvider(llmProvider);
    const collectionName = (
      llmProvider === LLMProvider.GoogleAI
        ? process.env.QDRANT_GOOGLE_COLLECTION_NAME
        : process.env.QDRANT_OPENAI_COLLECTION_NAME
    ) as string;
    const vectorStore: QdrantVectorStore = new QdrantVectorStore(embeddings, {
      url: process.env.QDRANT_URL as string,
      collectionName: collectionName,
      apiKey: process.env.QDRANT_API_KEY as string,
    });
    const documentSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 4000,
      chunkOverlap: 600,
    });
    documents = await documentSplitter.splitDocuments(documents);
    await vectorStore.addDocuments(documents, { customPayload: [] });
    return vectorStore;
  }

  public async clearQdrantVectorStore(llmProvider: LLMProvider) {
    try {
      const client: QdrantClient = new QdrantClient({
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
      });
      const collectionName = (
        llmProvider === LLMProvider.GoogleAI
          ? process.env.QDRANT_GOOGLE_COLLECTION_NAME
          : process.env.QDRANT_OPENAI_COLLECTION_NAME
      ) as string;
      console.log(`Clearing Qdrant Vector Store: ${collectionName}`);
      await client.deleteCollection(collectionName);
      const prismaDB = new PrismaClient();
      await prismaDB.topics.deleteMany();
      await client.createCollection(collectionName, {
        vectors: { size: 768, distance: "Cosine" },
      });
    } catch (error) {
      console.error(
        `Error clearing Qdrant Vector Store: ${(error as Error).message}`,
      );
      throw new Error(
        `Error clearing Qdrant Vector Store: ${(error as Error).message}`,
      );
    }
  }
}

export const qdrantLCVectorStore: QdrantLCVectorStore =
  new QdrantLCVectorStore();
