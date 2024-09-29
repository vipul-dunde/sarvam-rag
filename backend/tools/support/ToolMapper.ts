import { VECTOR_STORE_TOOL } from "@/backend/tools/vector-store/VectorStoreTool";
import MathematicsTool, {
  MATHEMATICS_TOOL,
} from "@/backend/tools/math-tool/MathematicsTool";
import SarvamLanguageTool, {
  SARVAM_LANGUAGE_TOOL,
} from "@/backend/tools/sarvam-tool/SarvamLanguageTool";
import { LLMProvider } from "@/backend/support/LLMProviderMapper";
import { qdrantLCVectorStore } from "@/backend/vector-store/qdrant/QdrantVectorStore";
import { PYTHON_CODE_EXECUTOR_TOOL } from "@/backend/tools/python-tool/PythonTool";
import PythonTool from "@/backend/tools/python-tool/PythonTool";

export enum ToolProvider {
  VectorStoreTool = VECTOR_STORE_TOOL as any,
  MathematicsTool = MATHEMATICS_TOOL as any,
  SarvamLanguageTool = SARVAM_LANGUAGE_TOOL as any,
  PythonCodeExecutor = PYTHON_CODE_EXECUTOR_TOOL as any,
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
    case ToolProvider.PythonCodeExecutor as unknown as string:
      const pythonTool: PythonTool = new PythonTool();
      return await pythonTool.executeCode(toolCall[0].args.code);
    default:
      return ToolProvider.VectorStoreTool;
  }
}
