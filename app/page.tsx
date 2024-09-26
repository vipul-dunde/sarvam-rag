"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button"; // ShadCN button component
import { Input } from "@/components/ui/input"; // ShadCN input component
import { Textarea } from "@/components/ui/textarea";
import {
  ReloadIcon,
  UploadIcon,
  TriangleRightIcon,
  SpeakerLoudIcon,
} from "@radix-ui/react-icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { PutBlobResult } from "@vercel/blob"; // ShadCN textarea component

export default function ChatPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [chatInput, setChatInput] = useState<string>("");
  const [messages, setMessages] = useState<
    {
      question: string;
      response: string;
      fileUrl?: string;
      coreresponse?: string;
    }[]
  >([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioAvailable, setAudioAvailable] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAudioClick = async (text: string) => {
    try {
      setAudioAvailable(true);
      const response = await fetch("/api/v1/sarvam/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });
      setAudioAvailable(false);
      const data = await response.json();
      if (data.content.audios) {
        const playAudioSequentially = async (audios: string[]) => {
          for (const audiostring of audios) {
            const audioBlob = new Blob(
              [
                new Uint8Array(
                  atob(audiostring)
                    .split("")
                    .map((c) => c.charCodeAt(0)),
                ),
              ],
              { type: "audio/wav" },
            );
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
            const audio = new Audio(audioUrl);

            await new Promise<void>((resolve) => {
              audio.onended = () => resolve();
              audio.play();
            });
            console.log("Played audio:", audioUrl);
          }
        };

        await playAudioSequentially(data.content.audios as string[]);
        setAudioAvailable(false);
      }
    } catch (error) {
      setAudioAvailable(false);
      console.error("Error fetching audio:", error);
    }
  };

  const handleUpload = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current?.files[0];
    setLoadingUpload(true); // Set loading state for file upload

    try {
      const response = await fetch(
        `/api/v1/vectorstore/create?filename=${file.name}`,
        {
          method: "POST",
          body: file,
        },
      );
      const newBlob = (await response.json()).content as PutBlobResult;
      console.log("Uploaded file:", newBlob.url);
      setBlob(newBlob);

      setMessages((prev) => [
        ...prev,
        {
          question: "File Uploaded to Blob and VectorStore",
          response: JSON.stringify(newBlob, null, 2),
          fileUrl: newBlob.url as string,
          coreresponse: JSON.stringify(newBlob, null, 2),
        },
      ]);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoadingUpload(false); // Stop loading state after upload
    }
  };

  function splitIntoLines(content: string, wordsPerLine: number): string {
    const words = content.split(" ");
    let result = "";

    for (let i = 0; i < words.length; i += wordsPerLine) {
      const line = words.slice(i, i + wordsPerLine).join(" ");
      result += line + "\n";
    }

    return result.trim();
  }

  const handleChatSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!chatInput.trim()) return;
    setLoadingChat(true); // Set loading state for chat submission

    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: chatInput }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          question: chatInput,
          response: splitIntoLines(data.content, 12) || data.error,
          coreresponse: data.content.toString(),
        },
      ]);

      setChatInput("");
    } catch (error) {
      console.error("Error submitting chat:", error);
    } finally {
      setLoadingChat(false); // Stop loading state after chat submission
    }
  };

  return (
    <div className="font-semibold">
      <div className="flex flex-col items-center p-6">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">
          Chat Platform
        </h2>
      </div>
      <div className="mx-auto flex-grow">
        {/* Chat window */}
        <div className="max-w-6xl mx-auto">
          {messages.length !== 0 && (
            <div>
              <div
                ref={scrollRef}
                className="bg-white border border-gray-300 rounded-lg shadow-md p-10 h-96 overflow-y-auto"
              >
                {messages.map((message, index) => (
                  <div key={index}>
                    <div className="mt-4 bg-gray-800 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <p className="font-mono text-md text-white my-auto">
                          {" - " + message.question}
                        </p>
                        <Button
                          onClick={async () => {
                            await handleAudioClick(
                              message.coreresponse as string,
                            );
                          }}
                        >
                          <p className="font-extralight text-xs text-white my-auto mr-2">
                            Sarvam AI API
                          </p>
                          {audioAvailable ? (
                            <ReloadIcon className="h-3 w-3 animate-spin" />
                          ) : (
                            <SpeakerLoudIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <SyntaxHighlighter
                        language="bash"
                        style={vscDarkPlus}
                        customStyle={{
                          backgroundColor: "black",
                          padding: "0.5rem",
                          borderRadius: "0.5rem",
                        }}
                      >
                        {message.response && message.response}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleChatSubmit} className="mt-20 max-w-3xl mx-auto">
          <div className="flex space-x-2">
            <Input
              name="file"
              ref={inputFileRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              className="mt-3 border-gray-300"
              variant="default"
              size="icon"
              onClick={() => inputFileRef.current?.click()}
              disabled={loadingUpload}
            >
              {loadingUpload ? (
                <ReloadIcon className="h-4 w-4 animate-spin" />
              ) : (
                <UploadIcon className="h-6 w-6" />
              )}
            </Button>
            <Textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              className="flex-grow border border-gray-300 rounded-md pt-4 text-md text-cyan-950 font-mono"
              disabled={loadingChat || loadingUpload}
            />
            <Button
              type="submit"
              variant="default"
              className="mt-3 border-gray-300"
              disabled={loadingChat || loadingUpload}
              size="icon"
            >
              {loadingChat ? (
                <ReloadIcon className="h-4 w-4 animate-spin" />
              ) : (
                <TriangleRightIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
