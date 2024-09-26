import { VECTOR_STORE_TOOL } from "@/backend/service/tools/VectorStoreTool";
import { WEB_QUERY_TOOL } from "@/backend/service/tools/WebQueryTool";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";

export enum ToolProvider {
  VectorStoreTool = VECTOR_STORE_TOOL as any,
  WebQueryTool = WEB_QUERY_TOOL as any,
}

export async function getDataFromTools(query: string, input: string) {
  switch (input.trim()) {
    case ToolProvider.VectorStoreTool as unknown as string:
      return await qdrantLCVectorStore.getSimilarDocsAsString(query);
    case ToolProvider.WebQueryTool as unknown as string:
      return ToolProvider.WebQueryTool;
    default:
      return ToolProvider.VectorStoreTool; // Or throw an error, or handle the unknown case as needed
  }
}
