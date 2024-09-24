'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button'; // ShadCN button component
import { Input } from '@/components/ui/input';   // ShadCN input component
import { Textarea } from '@/components/ui/textarea';
import {ReloadIcon, UploadIcon, TriangleRightIcon} from "@radix-ui/react-icons";  // ShadCN textarea component

export default function ChatPage() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);
    const [chatInput, setChatInput] = useState<string>('');
    const [messages, setMessages] = useState<{ question: string; response: string; fileUrl?: string }[]>([]);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const handleUpload = async () => {
        if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
        }

        const file = inputFileRef.current?.files[0];
        setLoadingUpload(true); // Set loading state for file upload

        try {
            const response = await fetch(
                `/api/v1/vectorstore?filename=${file.name}`,
                {
                    method: 'POST',
                    body: file,
                },
            );

            const newBlob = (await response.json()) as PutBlobResult;
            setBlob(newBlob);

            // Include the uploaded file in the chat history
            setMessages((prev) => [
                ...prev,
                { question: 'File Uploaded', response: '', fileUrl: newBlob.url },
            ]);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoadingUpload(false); // Stop loading state after upload
        }
    };

    const handleChatSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!chatInput.trim()) return;
        setLoadingChat(true); // Set loading state for chat submission

        try {
            const response = await fetch('/api/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: chatInput }),
            });

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                { question: chatInput, response: data },
            ]);

            setChatInput('');
        } catch (error) {
            console.error("Error submitting chat:", error);
        } finally {
            setLoadingChat(false); // Stop loading state after chat submission
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Chat window */}
            {messages.length !== 0 &&
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-10 h-96 overflow-y-auto">
                    {messages.map((message, index) => (
                        <div key={index} className="mb-4 border-b pb-2 ml-2">
                            <div className="flex justify-between">
                                <div className="font-semibold text-gray-900">
                                    {message.question}
                                </div>
                            </div>
                            {message.response && (
                                <div className="text-gray-800 bg-gray-100 p-2 rounded-md mt-1">
                                    {message.response}
                                </div>
                            )}
                            {message.fileUrl && (
                                <div className="mt-2">
                                    <a
                                        href={message.fileUrl}
                                        target="_blank"
                                        className="text-blue-600 hover:underline"
                                        rel="noreferrer"
                                    >
                                        View Uploaded File
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>}

            {/* Chat input and file upload form */}
            <form onSubmit={handleChatSubmit} className="mt-6">
                <div className="flex space-x-2">
                    {/* Textarea for message input */}
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
                        {loadingUpload ? (<ReloadIcon className="h-4 w-4 animate-spin" />) : (<UploadIcon className="h-4 w-4" />)}
                    </Button>
                    <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your message..."
                        rows={1}
                        className="flex-grow border border-gray-300 rounded-md"
                        disabled={loadingChat || loadingUpload}
                    />
                    {/* File upload button */}
                    <Button
                        type="submit"
                        variant="default"
                        className="mt-3 border-gray-300"
                        disabled={loadingChat || loadingUpload}
                        size="icon"
                    >
                        {loadingChat ? (<ReloadIcon className="h-4 w-4 animate-spin" />) : (<TriangleRightIcon className="h-6 w-6" />)}
                    </Button>
                </div>
            </form>
        </div>
    );
}
