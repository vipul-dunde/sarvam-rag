import {put} from '@vercel/blob';
import {NextResponse} from 'next/server';
import langChainDocumentService from "@/backend/service/vectorstore/LangChainDocumentService";
import {qdrantLCVectorStore} from "@/backend/service/vectorstore/QdrantVectorStore";
import {LLMProvider} from "@/backend/service/support/LLMProviderMapper";

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const filename: string = searchParams.get('filename') as string;
    if (filename != null) {
        const blob = await put(filename, request.body as ReadableStream<Uint8Array>, {
            access: 'public',
        });
        console.log(blob);
        const document = await langChainDocumentService.loadPDFWithBlobURL(blob.url);
        const vectorStore = await qdrantLCVectorStore.manageQdrantVectorStore(LLMProvider.GoogleAI, document);
        return NextResponse.json(blob, {status: 200});
    }

    return NextResponse.json({ error: 'File provided failed!' }, { status: 500 });
}

