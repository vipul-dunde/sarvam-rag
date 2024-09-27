import { Tool } from "langchain/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import VectorStoreTool from "@/backend/service/agent/tools/vector-store/VectorStoreTool";
import { AIMessageChunk } from "@langchain/core/messages";
import { getDataFromTools } from "@/backend/service/agent/tools/support/ToolMapper";
import MathematicsTool from "@/backend/service/agent/tools/math-tool/MathematicsTool";
import { ChatOpenAI } from "@langchain/openai";
import { LLMProvider } from "@/backend/service/support/LLMProviderMapper";
import SarvamLanguageTool from "@/backend/service/agent/tools/sarvam-tool/SarvamLanguageTool";

class AgentService {
  private async getTools(
    llmProvider: LLMProvider,
    query?: string,
  ): Promise<Tool[]> {
    let tools: Tool[] = [];
    const vectorStoreTool: VectorStoreTool = new VectorStoreTool();
    tools.push(
      (await vectorStoreTool.initialiseVectorStoreTool(llmProvider)) as any,
    );
    const mathematicsTool: MathematicsTool = new MathematicsTool();
    tools.push((await mathematicsTool.initialiseMathTool()) as any);
    const sarvamLanguageTool: SarvamLanguageTool = new SarvamLanguageTool();
    tools.push(
      (await sarvamLanguageTool.initialiseSarvamLanguageTool(
        llmProvider,
        query,
      )) as any,
    );
    return tools;
  }

  private async makeFinalLLMCall(
    llm: ChatGoogleGenerativeAI | ChatOpenAI,
    query: string,
    toolData: any,
  ) {
    const prompt = `Users are asking questions about the following topic: ${query}\n Retrieved relevant data from Vector Store: ${toolData}, Prepare answer in short for the query with vector store data.`;
    const llmResponse: AIMessageChunk = await llm.invoke(prompt);
    return llmResponse.content;
  }

  private async makeToolCall(
    bindedLLM: any,
    query: string,
    llm: ChatGoogleGenerativeAI | ChatOpenAI,
    llmProvider: LLMProvider,
  ) {
    let prompt: string = `The user has submitted the following query: "${query}".\n
1. First, review the tool descriptions to determine if the query can be addressed by any available tool.\n
2. If the query is specific and suitable for a tool, process it using the appropriate tool.\n
3. If the query is too general or doesn't match any tool, respond directly without using any tools.`;

    const toolResponse: AIMessageChunk = await bindedLLM.invoke(prompt);
    if (toolResponse.tool_calls && toolResponse.tool_calls?.length == 1) {
      const toolDataAsString = await getDataFromTools(
        query,
        toolResponse.tool_calls[0]?.name as string,
        llmProvider,
        toolResponse.tool_calls,
      );

      const finalLLMResponse = await this.makeFinalLLMCall(
        llm,
        query,
        toolDataAsString,
      );

      return {
        llmResponse: finalLLMResponse,
        toolName: toolResponse.tool_calls[0]?.name as string,
        toolUsed: true,
      };
    }

    const normalCallResponse: AIMessageChunk = await llm.invoke(
      "Respond to : " + query,
    );
    return {
      llmResponse: normalCallResponse.content,
      toolUsed: false,
      toolName: "",
    };
  }

  public async initialiseAgent(
    query: string,
    llm: ChatGoogleGenerativeAI | ChatOpenAI,
    llmProvider: LLMProvider,
  ) {
    const tools: Tool[] = await this.getTools(llmProvider, query);
    const toolLLM = await llm.bindTools(tools);
    return await this.makeToolCall(toolLLM, query, llm, llmProvider);
  }
}

const agentService = new AgentService();
export default agentService;
