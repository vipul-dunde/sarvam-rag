"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"; // VSCode theme

const apiEndpoints = [
  {
    name: "Chat With LLM + VectorStore with Application",
    method: "POST",
    endpoint: "/api/chat",
    description: "Responds to your question",
    curl: "curl --location \\\n 'https://sarvam-rag.vercel.app/api/v1/vectorstore?filename=filename.pdf' \\\n --form 'filename.pdf=@files/your-file-path",
  },
  {
    name: "Upload file to Qdrant Vector Store",
    method: "POST",
    endpoint: "/api/v1/vectorstore",
    description: "Upload Only PDF file to Qdrant Vector Store",
    curl: "curl --location \\\n 'https://sarvam-rag.vercel.app/api/v1/vectorstore?filename=filename.pdf' \\\n --form 'filename.pdf=@files/your-file-path",
  },
  {
    name: `Delete All Documents from Qdrant Vector Store`,
    method: "DELETE",
    endpoint: "/api/v1/vectorstore",
    description: "Updates user by ID",
    curl: "curl --location \\\n 'https://sarvam-rag.vercel.app/api/v1/vectorstore?filename=filename.pdf' \\\n --form 'filename.pdf=@files/your-file-path",
  },
  {
    name: "Delete User",
    method: "DELETE",
    endpoint: "/api/users/:id",
    description: "Deletes user by ID",
    curl: "curl --location \\\n 'https://sarvam-rag.vercel.app/api/v1/vectorstore?filename=filename.pdf' \\\n --form 'filename.pdf=@files/your-file-path",
  },
];

// Helper function to generate formatted cURL command with line breaks
const generateCurlCommand = (method: string, endpoint: string) => {
  return `curl -X ${method} \\\n  https://your-domain.com${endpoint} \\\n  -H "Content-Type: application/json"`;
};

// Helper function to make API requests
const tryApiRequest = async (
  method: string,
  endpoint: string,
  setResponse: (response: string) => void,
) => {
  const url = `https://your-domain.com${endpoint}`;

  try {
    const response = await fetch(url, { method });
    const data = await response.json();
    setResponse(JSON.stringify(data, null, 2));
  } catch (error) {
    setResponse(`Error: ${(error as Error).message}`);
  }
};

const ApiTable = () => {
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-black">API Endpoints</h2>

      <div className="w-full max-w-3xl space-y-6">
        {apiEndpoints.map((api) => (
          <Card key={api.name} className="bg-white shadow-md text-black">
            <CardHeader className="border-b">
              <h3 className="text-xl font-semibold">{api.name}</h3>
            </CardHeader>
            <CardContent className="mt-3">
              <p className="text-black">
                Method: <span className="font-semibold">{api.method}</span>
              </p>
              <p>
                Endpoint: <span>{api.endpoint}</span>
              </p>
              <p>
                Description: <span>{api.description}</span>
              </p>
              {responses[api.name] && (
                <div className="mt-4 bg-black p-3 rounded-lg">
                  <p className="text-white font-mono text-xs">Response:</p>
                  <pre className="font-mono text-sm bg-black p-3 rounded-md text-white">
                    {responses[api.name]}
                  </pre>
                </div>
              )}

              <div className="mt-4 bg-black p-3 rounded-lg">
                <p className="font-mono text-xs text-white">cURL</p>
                <SyntaxHighlighter
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    backgroundColor: "black",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  {api?.curl || generateCurlCommand(api.method, api.endpoint)}
                  {generateCurlCommand(api.method, api.endpoint)}
                </SyntaxHighlighter>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <button
                className="bg-black text-white px-4 py-2 rounded-md mt-3"
                onClick={() =>
                  tryApiRequest(api.method, api.endpoint, (response) =>
                    setResponses((prev) => ({
                      ...prev,
                      [api.name]: response,
                    })),
                  )
                }
              >
                Try
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiTable;
