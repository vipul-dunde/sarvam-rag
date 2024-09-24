import {NextResponse} from 'next/server';
import {qdrantLCVectorStore} from "@/backend/service/vectorstore/QdrantVectorStore";
import {LLMProvider} from "@/backend/service/support/LLMProviderMapper";
import googleAIAdapter from "@/backend/service/aimodels/googleai/GoogleAIAdapter";
import {DocumentInterface} from "@langchain/core/documents";
import {AIMessageChunk} from "@langchain/core/messages";

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    const vectorStore = await qdrantLCVectorStore.getQdrantVectorStore(LLMProvider.GoogleAI);
    const data: DocumentInterface[] = await vectorStore.similaritySearch(body.query as string, 2);
    const llm = await googleAIAdapter.getInitialisedVectorStoreAndLLM();
    const prompt = `Users are asking questions about the following topic: ${body.query}\n Retrieved relevant data from Vector Store: ${data[0].pageContent}, Prepare answer in short for the query with vector store data.`;
    const response: AIMessageChunk = await llm.invoke(prompt);
    return NextResponse.json(response.content, {status: 200});
}

