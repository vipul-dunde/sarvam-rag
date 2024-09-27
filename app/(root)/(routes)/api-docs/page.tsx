"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "@/components/ui/button";

const apiEndpoints = [
  {
    name: "Get Similar Documents from Qdrant Vector Store",
    method: "GET",
    endpoint: "/api/v1/vectorstore/get-documents",
    description: "Get Similar Documents from Qdrant Vector Store",
    curl: "curl --location \\\n 'https://sarvam-rag.vercel.app/api/v1/vectorstore/get-documents\\\n?query=%22Vipul%20Dunde%20is%20Software%20Engineer%202%22&llmOption=OpenAI'",
    response: {
      status: 200,
      content: [
        {
          pageContent:
            "SCIENCE134\n11.3.1ECHO\nIf we shout or clap near a suitable reflecting\nobject  such  as  a  tall  building  or  a\nmountain,we  will  hear  the  same  sound\nagain a little  later. This sound which we\nhear  is  called  an  echo.  The  sensation  of\nsound persists in our brain for about 0.1\ns. To hear a distinct echo the time interval\nbetween  the  original  sound  and  the\nreflected one must be  at least 0.1s. If we\ntake the speed of sound to be 344 m/s at a\ngiven temperature, say at 22 ºC in air, the\nsound must go to the obstacle and reach\nback the ear of the listener on reflection after\n0.1s. Hence, the total distance covered by\nthe sound from the point of generation to\nthe reflecting surface and back should be\nat least (344 m/s) × 0.1 s = 34.4 m. Thus,\nfor hearing distinct echoes, the minimum\ndistance of the obstacle from the source of\nsound must be half of this distance, that\nis, 17.2 m. This distance will change with\nthe temperature of air. Echoes may be heard\nmore  than  once  due  to  successive  or\nmultiple reflections. The rolling of thunder\nis due to the successive reflections of the\nsound from a number of reflecting surfaces,\nsuch as the clouds and the land.\n11.3.2REVERBERATION\nA sound created in a big hall will persist\nby repeated reflection from the walls until\nit is reduced to a value where it is no longer\naudible.  The  repeated  reflection  that\nresults  in  this  persistence  of  sound  is\ncalled reverberation. In an auditorium or\nbig hall excessive reverberation is highly\nundesirable. To reduce reverberation, the\nroof  and  walls  of  the  auditorium  are\ngenerally  covered  with  sound-absorbent\nmaterials  like  compressed  fibreboard,\nrough  plaster  or  draperies.  The  seat\nmaterials are also selected on the basis of\ntheir sound absorbing properties.\nExample 11.2 A person clapped his hands\nnear a cliff and heard the echo after 2 s.\nWhat is the distance of the cliff from the\nperson if the speed of the sound, v is\ntaken as 346 m s\n–1\n?\nSolution:\nGiven,\nSpeed of sound, v = 346 m s\n–1\nTime taken for hearing the echo,\nt = 2 s\nDistance travelled by the sound\n= v × t = 346 m s\n–1 \n× 2 s = 692 m\nIn  2  s  sound  has  to  travel  twice  the\ndistance  between  the  cliff  and  the\nperson. Hence, the distance between the\ncliff and the person\n= 692 m/2 = 346 m.\nQ\nHorn\nMegaphone\nFig 11.10:  A megaphone and a horn.\nuestion\n1.An echo is heard in 3 s. What is\nthe  distance  of  the  reflecting\nsurface from the source, given that\nthe speed of sound is  342 m s\n–1\n?\n11.3.3USES  OF  MULTIPLE  REFLECTION\nOF SOUND\n1.Megaphones  or  loudhailers,  horns,\nmusical instruments such as trumpets\nand shehanais, are all designed to send\nsound in a particular direction without\nspreading it in all directions, as shown\nin Fig 11.10.\nRationalised 2023-24",
          metadata: {
            source: "blob",
            blobType: "application/pdf",
            pdf: {
              version: "1.10.100",
              info: {
                PDFFormatVersion: "1.6",
                IsAcroFormPresent: false,
                IsXFAPresent: false,
                Title:
                  "D:\\Textbooks\\Rationalised Books\\0964-Science\\1 Source Files\\Chapter-11\\CHAP 11.pmd",
                Author: "admin",
                Creator: "Bullzip PDF Printer (12.2.0.2905)",
                Producer:
                  "PDF Printer / www.bullzip.com / FG / Freeware Edition (max 10 users)",
                CreationDate: "D:20220920145403+05'30'",
                ModDate: "D:20230309122342+05'30'",
              },
              metadata: {
                _metadata: {
                  "pdf:producer":
                    "PDF Printer / www.bullzip.com / FG / Freeware Edition (max 10 users)",
                  "xmp:modifydate": "2023-03-09T12:23:42+05:30",
                  "xmp:createdate": "2022-09-20T14:54:03+05:30",
                  "xmp:creatortool": "Bullzip PDF Printer (12.2.0.2905)",
                  "xmp:metadatadate": "2023-03-09T12:23:42+05:30",
                  "xmpmm:documentid":
                    "uuid:778470f2-3b21-11ed-0000-314a16fc2abf",
                  "xmpmm:instanceid":
                    "uuid:c36a667f-c799-47fd-b904-540ce8eb3a7d",
                  "dc:format": "application/pdf",
                  "dc:title":
                    "D:\\Textbooks\\Rationalised Books\\0964-Science\\1 Source Files\\Chapter-11\\CHAP 11.pmd",
                  "dc:creator": "admin",
                },
              },
              totalPages: 14,
            },
            loc: {
              pageNumber: 8,
            },
          },
        },
      ],
      error: null,
    },
  },
  {
    name: "Create Document in Qdrant Vector Store",
    method: "POST",
    endpoint: "/api/v1/vectorstore/create",
    description: "Create Document in Qdrant Vector Store",
    curl: `curl --location 'https://sarvam-rag.vercel.app/api/v1/vectorstore/create?filename=ncert_physics_chapter_11.pdf&llmOption=OpenAI' \\
--form 'file.pdf=@"/Users/vipul.dunde/Desktop/Personal/sarvam-rag/dataset/iesc111.pdf"'`,
    response: {
      status: 200,
      content: {
        url: "https://qujex87zvnsgqg1k.public.blob.vercel-storage.com/ncert_physics_chapter_11-RJIFeie9R9G6ElswRaLLwhHSrzAu0b.pdf",
        downloadUrl:
          "https://qujex87zvnsgqg1k.public.blob.vercel-storage.com/ncert_physics_chapter_11-RJIFeie9R9G6ElswRaLLwhHSrzAu0b.pdf?download=1",
        pathname: "ncert_physics_chapter_11.pdf",
        contentType: "application/pdf",
        contentDisposition: 'inline; filename="ncert_physics_chapter_11.pdf"',
      },
      error: null,
    },
  },
  {
    name: "Delete All Documents from Qdrant Vector Store",
    method: "DELETE",
    endpoint: "/api/v1/vectorstore/delete",
    description: "Deletes all documents from Qdrant Vector Store",
    curl: "curl --location --request DELETE 'https://sarvam-rag.vercel.app/api/v1/vectorstore/delete?llmOption=OpenAI'",
    response: {
      status: 200,
      content: "Cleared Vector Store",
      error: null,
    },
  },
  {
    curl: `curl --location 'https://sarvam-rag.vercel.app/api/v1/agent?llmOption=OpenAI' \\ --header 'Content-Type: application/json' \\ --data '{"query" : "Please help me with activity 11.3..."}`,
    description: "Get Response from Agent",
    endpoint: "/api/v1/agent",
    method: "POST",
    name: "Get Response from Agent",
    response: {
      status: 200,
      content: {
        llmResponse:
          "The question asks for help with Activity 11.3, which involves making a list of different musical instruments and discussing which part of the instrument vibrates to produce sound. \n\nHere's a short answer incorporating information from the provided text:\n\n**Activity 11.3: Musical Instruments and Vibrations**\n\n* **List of Instruments:**  Think of various musical instruments like guitars, drums, flutes, violins, pianos, etc.\n* **Vibrating Parts:**  Discuss with your friends which part of each instrument vibrates to create sound. For example:\n    * **Guitar:** Strings vibrate.\n    * **Drums:** The drumhead vibrates.\n    * **Flutes:** Air inside the flute vibrates.\n    * **Violins:** Strings vibrate.\n    * **Pianos:**  Strings vibrate.\n\n**Key Point:**  All musical instruments produce sound by causing some part of the instrument to vibrate. This vibration creates sound waves that travel through the air to our ears. \n",
        toolName: "vectorStoreTool",
        toolUsed: true,
      },
      error: null,
    },
  },
  {
    curl: `curl --location 'https://sarvam-rag.vercel.app/api/v1/sarvam/text-to-speech?llmOption=OpenAI' \\
--header 'Content-Type: application/json' \\
--data '{
    "message" : "I am Vipul Dunde"
}'`,
    description: "Convert text to speech",
    endpoint: "/api/v1/sarvam/text-to-speech",
    method: "POST",
    name: "Convert text to speech",
    response: {
      status: 200,
      content: {
        audios: [
          "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",
        ],
      },
      error: null,
    },
  },
  {
    curl: `curl --location 'https://sarvam-rag.vercel.app/api/v1/chat?llmOption=OpenAI' \\
--header 'Content-Type: application/json' \\
--data '{
    "query" : "Hey AI.. :)"
}'`,
    description: "Responds to your question",
    endpoint: "/api/v1/chat",
    method: "POST",
    name: "Chat with AI",
    response: {
      status: 200,
      content:
        "Hey there! 👋 It seems like you're starting a conversation.  I'm ready to chat and help you with whatever you need.  What's on your mind? 😊  Tell me about your interests, your questions, or anything you'd like to discuss. I'm here to listen and provide helpful information. \n",
      error: null,
    },
  },
];

const generateCurlCommand = (method: string, endpoint: string) => {
  return `curl -X ${method} \\\n  https://your-domain.com${endpoint} \\\n  -H "Content-Type: application/json"`;
};

const ApiTable = () => {
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <div className="flex flex-col items-center p-6">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">
          Api Docs
        </h2>
        <h2 className="text-3xl font-bold mb-6 text-black">
          <a href="/" className="underline">
            Chat Platform
          </a>
        </h2>
      </div>
      <div className="text-3xl font-bold mb-6 text-black">
        <Button
          className="font-bold bg-amber-500 mr-2"
          onClick={() => {
            window.location.href =
              "https://qujex87zvnsgqg1k.public.blob.vercel-storage.com/SarvamRagGoogleAI-Bwtd9zmxOlw6VbmNgeQNkaisGCUDvi.json?download=1";
          }}
        >
          Google LLM Postman Collection
        </Button>
        <Button
          className="font-bold bg-amber-500 ml-2"
          onClick={() => {
            window.location.href =
              "https://qujex87zvnsgqg1k.public.blob.vercel-storage.com/SarvamRagOpenAI-q6Ygcm4A0uBa70MxD6BSEB4CbpFS8Z.json?download=1";
          }}
        >
          OpenAI LLM Postman Collection
        </Button>
      </div>
      <div className="text-3xl font-bold mb-6 text-black"></div>
      <div className="w-full max-w-6xl space-y-6">
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
                </SyntaxHighlighter>
              </div>
              <div className="mt-4 bg-black p-3 rounded-lg">
                <p className="font-mono text-xs text-white">Sample Response:</p>
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  customStyle={{
                    backgroundColor: "black",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  {JSON.stringify(api?.response, null, 4)}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiTable;
