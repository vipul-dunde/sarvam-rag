import type { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";

class LangChainDocumentService {
  public async getDocumentForObject(
    object: any[],
    fields: string[][],
  ): Promise<Document[]> {
    let documents: Document[] = [];
    let i = 1;
    object.map((product) => {
      let text = "";
      for (let field of fields) {
        text += field[0] + ": " + product[field[1]] + "\n";
      }
      documents.push({
        id: i.toString(),
        pageContent: text,
        metadata: product,
      });
      i++;
    });
    return documents;
  }

  public async loadPDFWithBlobURL(url: string): Promise<Document[]> {
    const nike10kPdfPath : any = url;
    const fetchResponse = await fetch(nike10kPdfPath);
    // const splitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 4000,
    //   chunkOverlap: 600,
    // });
    const loader: PDFLoader = new PDFLoader(await fetchResponse.blob() as Blob);
    const docs: Document[] = await loader.load();
    return docs;
  }
}

const langChainDocumentService: LangChainDocumentService =
  new LangChainDocumentService();
export default langChainDocumentService;
