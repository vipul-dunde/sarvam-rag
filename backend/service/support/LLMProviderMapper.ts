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
