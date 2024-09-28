import type { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

class LangChainDocumentService {
  public async loadPDFWithBlobURL(url: string): Promise<Document[]> {
    const nike10kPdfPath: any = url;
    const fetchResponse = await fetch(nike10kPdfPath);
    const loader: PDFLoader = new PDFLoader(
      (await fetchResponse.blob()) as Blob,
    );
    return await loader.load();
  }
}

const langChainDocumentService: LangChainDocumentService =
  new LangChainDocumentService();
export default langChainDocumentService;
