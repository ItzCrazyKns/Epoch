"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { UIRenderer, ResponseRoot } from "@/components/llm-components";

interface Message {
  role: "user" | "assistant";
  content: string | ResponseRoot;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello, how may I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingResponse, setCurrentStreamingResponse] = useState<ResponseRoot | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const streamResponse = async (userMessage: string) => {
    setIsStreaming(true);
    setCurrentStreamingResponse(null);

    let latestResponse: ResponseRoot | null = null;

    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content),
    }));

    apiMessages.push({
      role: "user",
      content: userMessage,
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              if (latestResponse) {
                const finalResponse: ResponseRoot = latestResponse;
                setMessages(prev => [...prev, {
                  role: "assistant",
                  content: finalResponse
                }]);
              }
              setCurrentStreamingResponse(null);
              setIsStreaming(false);
              setFormValues({});
              return;
            }

            try {
              const parsed = JSON.parse(data) as ResponseRoot;
              latestResponse = parsed;
              setCurrentStreamingResponse(parsed);
            } catch (e) {
              console.error("Failed to parse JSON:", e);
            }
          }
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, an error occurred while processing your request."
      }]);
      setIsStreaming(false);
      setCurrentStreamingResponse(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    await streamResponse(userMessage);
  };

  const handleButtonAction = async (action: string, label: string) => {
    if (isStreaming) return;

    let actionMessage = `User clicked button: "${label}"`;

    if (Object.keys(formValues).length > 0) {
      actionMessage += "\n\nForm data:\n" + Object.entries(formValues)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n");
    }

    setMessages(prev => [...prev, { role: "user", content: actionMessage }]);
    await streamResponse(actionMessage);
  };

  const handleFormChange = (id: string, value: string) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white min-h-screen w-screen">
      <div className="max-w-3xl mx-auto flex flex-col space-y-6 md:space-y-10 mt-6 md:mt-10 pb-32 md:pb-40 px-4 md:px-0">
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === "user" ? (
              <p className="text-black/50 text-sm font-[450]">{message.content as string}</p>
            ) : (
              <div className="flex flex-row space-x-2 md:-translate-x-6">
                <Avatar className="size-6 mt-4 shrink-0">
                  <div className="bg-linear-to-br from-pink-500 to-yellow-500 h-8 w-8 rounded-full"></div>
                </Avatar>
                <Card className="flex-1 shadow-none bg-gray-50 border-gray-200 min-w-0">
                  <CardContent className="text-gray-600 text-sm font-[450] px-3 md:px-5">
                    {typeof message.content === "string" ? (
                      <p className="leading-relaxed">{message.content}</p>
                    ) : (
                      <div className="space-y-4">
                        {message.content.children?.map((child, childIndex) => (
                          <UIRenderer
                            key={childIndex}
                            component={child}
                            onAction={handleButtonAction}
                            formValues={formValues}
                            onFormChange={handleFormChange}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}

        {isStreaming && currentStreamingResponse && (
          <div className="flex flex-row space-x-2 md:-translate-x-6">
            <Avatar className="size-6 mt-4 shrink-0">
              <div className="bg-linear-to-br from-pink-500 to-yellow-500 h-8 w-8 rounded-full"></div>
            </Avatar>
            <Card className="flex-1 shadow-none bg-gray-50 border-gray-200 min-w-0">
              <CardContent className="text-gray-600 text-sm font-[450] px-3 md:px-5">
                <div className="space-y-4">
                  {currentStreamingResponse.children?.map((child, index) => (
                    <UIRenderer
                      key={index}
                      component={child}
                      onAction={handleButtonAction}
                      formValues={formValues}
                      onFormChange={handleFormChange}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs mt-4">
                  <div className="animate-spin h-3 w-3 border-2 border-gray-300 border-t-gray-600 rounded-full" />
                  <span>Streaming...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[802px] mx-auto px-4 md:px-0">
        <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        <div className="bg-white pt-1 pb-6 md:pb-8">
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 pr-2 pl-3 py-2.5">
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              className="flex-1 resize-none text-sm bg-transparent border-0 shadow-none py-0 px-0 placeholder:font-[490] placeholder:text-gray-400 text-gray-700 max-h-32 overflow-y-auto leading-relaxed"
              placeholder="Ask anything..."
            />
            <button
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="bg-gradient-to-br from-pink-500 to-yellow-500 text-white p-2 rounded-full text-sm font-medium shadow-sm hover:opacity-90 transition duration-200 cursor-pointer shrink-0 self-end disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp size={13}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
