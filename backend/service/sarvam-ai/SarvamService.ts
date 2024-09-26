class SarvamService {
  public async runSarvamTextSpeechAPI(text: string[]): Promise<string[]> {
    const audioResponses: string[] = [];
    for (let chunk of text) {
      chunk = chunk
        .replace(/`/g, "") // Removes backticks
        .replace(/```[\s\S]*?```/g, "") // Removes code blocks
        .replace(/[*_~]/g, "") // Removes markdown symbols like *, _, ~
        .replace(/[\r\n]+/g, " ") // Replaces newlines with spaces
        .replace(/\s+/g, " ") // Removes extra spaces
        .trim();
      const payload = {
        inputs: [chunk],
        target_language_code: "hi-IN",
        speaker: "meera",
        pitch: 1,
        pace: 1.3,
        loudness: 1.5,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: "bulbul:v1",
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": process.env.SARVAM_SUBSCRIPTION_KEY,
        },
      };
      const response = await fetch("https://api.sarvam.ai/text-to-speech", {
        ...options,
        body: JSON.stringify(payload),
      });
      const audioResponse = await response.json();
      if (audioResponse.audios) {
        audioResponses.push(audioResponse.audios[0]);
      }
    }
    return audioResponses;
  }

  public async getSpeechFromText(text: string): Promise<string[]> {
    try {
      const response = { content: text };
      const result = await this.splitStringIntoChunks(
        response.content as string,
      );
      return await this.runSarvamTextSpeechAPI(result);
    } catch (error) {
      throw new Error("Error in getSpeechFromText " + (error as Error).message);
    }
  }

  public async splitStringIntoChunks(
    text: string,
    maxLength: number = 500,
  ): Promise<string[]> {
    const result: string[] = [];
    let startIndex = 0;
    while (startIndex < text.length) {
      const data = text.substring(
        startIndex,
        Math.min(startIndex + maxLength, text.length),
      );
      result.push(data);
      startIndex += maxLength;
    }
    return result;
  }
}

const sarvamService: SarvamService = new SarvamService();
export default sarvamService;
