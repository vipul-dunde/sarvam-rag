export const translateOpenAPISpec = {
  openapi: "3.0.0",
  info: {
    title: "Sarvam Translate API",
    version: "1.0.0",
    description:
      "API for translating text to target languages using the Sarvam platform.",
  },
  servers: [
    {
      url: "https://api.sarvam.ai",
    },
  ],
  paths: {
    "/translate": {
      post: {
        summary: "Translate text",
        description: "Translates input text to the target language.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  input: {
                    type: "string",
                    description: "Text to be translated.",
                  },
                  source_language_code: {
                    type: "string",
                    enum: [
                      "hi-IN",
                      "bn-IN",
                      "kn-IN",
                      "ml-IN",
                      "mr-IN",
                      "od-IN",
                      "pa-IN",
                      "ta-IN",
                      "te-IN",
                      "gu-IN",
                    ],
                    description: "Source language code.",
                  },
                  target_language_code: {
                    type: "string",
                    enum: [
                      "hi-IN",
                      "bn-IN",
                      "kn-IN",
                      "ml-IN",
                      "mr-IN",
                      "od-IN",
                      "pa-IN",
                      "ta-IN",
                      "te-IN",
                      "gu-IN",
                    ],
                    description: "Target language code.",
                  },
                  speaker_gender: {
                    type: "string",
                    enum: ["Male", "Female"],
                    description:
                      "Gender of the speaker, used for better translation quality.",
                  },
                  mode: {
                    type: "string",
                    enum: ["formal", "colloquial"],
                    description: "Mode of the translation.",
                  },
                  model: {
                    type: "string",
                    enum: ["mayura:v1"],
                    default: "mayura:v1",
                    description: "Model to be used for translation.",
                  },
                  enable_preprocessing: {
                    type: "boolean",
                    description:
                      "Enable custom preprocessing of the input text for better translations.",
                  },
                },
                required: [
                  "input",
                  "source_language_code",
                  "target_language_code",
                ],
              },
              example: {
                input: "<string>",
                source_language_code: "en-IN",
                target_language_code: "hi-IN",
                speaker_gender: "Male",
                mode: "formal",
                model: "mayura:v1",
                enable_preprocessing: true,
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    translated_text: {
                      type: "string",
                      description: "Translated text.",
                    },
                  },
                },
                example: {
                  translated_text: "<string>",
                },
              },
            },
          },
          "400": {
            description: "Bad Request - The input data is invalid.",
          },
          "500": {
            description: "Internal Server Error",
          },
        },
      },
    },
  },
};
