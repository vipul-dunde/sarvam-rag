import { VECTOR_STORE_TOOL } from "@/backend/service/tools/VectorStoreTool";
import { WEB_QUERY_TOOL } from "@/backend/service/tools/WebQueryTool";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import mathematicsTool, {
  MATHEMATICS_TOOL,
} from "@/backend/service/tools/MathematicsTool";
import MathematicsTool from "@/backend/service/tools/MathematicsTool";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";

export enum ToolProvider {
  VectorStoreTool = VECTOR_STORE_TOOL as any,
  WebQueryTool = WEB_QUERY_TOOL as any,
  MathematicsTool = MATHEMATICS_TOOL as any,
}

export async function getDataFromTools(
  query: string | any,
  input: string,
  llmProvider: LLMProvider,
  toolCall?: any,
) {
  switch (input.trim()) {
    case ToolProvider.VectorStoreTool as unknown as string:
      return await qdrantLCVectorStore.getSimilarDocsAsString(
        llmProvider,
        query,
      );
    case ToolProvider.MathematicsTool as unknown as string: {
      const mathTool = new MathematicsTool();
      return mathTool.performOperation(
        toolCall[0].args.operation,
        toolCall[0].args.operands,
      );
    }
    case ToolProvider.WebQueryTool as unknown as string:
      return ToolProvider.WebQueryTool;
    default:
      return ToolProvider.VectorStoreTool; // Or throw an error, or handle the unknown case as needed
  }
}
