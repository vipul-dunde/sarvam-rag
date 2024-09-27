import { VECTOR_STORE_TOOL } from "@/backend/service/tools/VectorStoreTool";
import { qdrantLCVectorStore } from "@/backend/service/vectorstore/qdrant/QdrantVectorStore";
import { MATHEMATICS_TOOL } from "@/backend/service/tools/MathematicsTool";
import MathematicsTool from "@/backend/service/tools/MathematicsTool";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";
import sarvamLanguageTool, {
  SARVAM_LANGUAGE_TOOL,
} from "@/backend/service/tools/SarvamLanguageTool";
import SarvamLanguageTool from "@/backend/service/tools/SarvamLanguageTool";

export enum ToolProvider {
  VectorStoreTool = VECTOR_STORE_TOOL as any,
  MathematicsTool = MATHEMATICS_TOOL as any,
  SarvamLanguageTool = SARVAM_LANGUAGE_TOOL as any,
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
    case ToolProvider.SarvamLanguageTool as unknown as string:
      const sarvamLanguageTool: SarvamLanguageTool = new SarvamLanguageTool();
      return await sarvamLanguageTool.performOperation(
        llmProvider,
        query,
        toolCall[0].args.operation,
      );
    default:
      return ToolProvider.VectorStoreTool; // Or throw an error, or handle the unknown case as needed
  }
}
