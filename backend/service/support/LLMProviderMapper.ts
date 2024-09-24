export enum LLMProvider {
  OpenAI = "OpenAI",
  GoogleAI = "GooglePaLM",
}

export async function mapToLLMProvider(
  input: string,
): Promise<LLMProvider | null> {
  switch (input.trim().toLowerCase()) {
    case "openai":
      return LLMProvider.OpenAI;
    case "googleai":
      return LLMProvider.GoogleAI;
    default:
      return LLMProvider.GoogleAI; // Or throw an error, or handle the unknown case as needed
  }
}

export enum VectorStoreType {
  Memory = "memoryvectorstore",
  Qdrant = "qdrantvectorstore",
}

export async function mapToVectorStoreType(
  input: string,
): Promise<VectorStoreType | null> {
  switch (input.trim().toLowerCase()) {
    case "MemoryVectorStore".toLowerCase():
      return VectorStoreType.Memory;
    case "MongoDBAtlasVectorSearch".toLowerCase():
      return VectorStoreType.Qdrant;
    default:
      return VectorStoreType.Qdrant; // Or throw an error, or handle the unknown case as needed
  }
}
