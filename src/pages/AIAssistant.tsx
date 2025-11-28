import React, { useState, useRef, useEffect } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Send, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import aiChatService from "../service/aiChat";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

const suggestedPrompts = [
  {
    title: "Summarize recovery progress",
    description: "Get a comprehensive overview of patient recovery",
  },
  {
    title: "Predict risk factors",
    description: "Analyze potential complications and risk areas",
  },
  {
    title: "Explain instructions simply",
    description: "Translate medical terms into plain language",
  },
  {
    title: "Check danger signs",
    description: "Identify symptoms that require immediate attention",
  },
  {
    title: "Compare recovery timeline",
    description: "Compare current progress to typical timelines",
  },
  {
    title: "Medication interactions",
    description: "Check for potential drug interactions",
  },
  {
    title: "Diet recommendations",
    description: "Get personalized dietary suggestions",
  },
  {
    title: "Activity safety check",
    description: "Verify if specific activities are safe",
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    type: "ai",
    content:
      "Hello! I'm your AI Medical Assistant. I can help you with patient care, recovery monitoring, risk assessment, and answering medical questions. How can I assist you today?",
    timestamp: "9:00 AM",
  },
];

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userQuestion = inputValue.trim();
    const newUserMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: userQuestion,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await aiChatService.postAiChat(userQuestion);
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content:
          response.answer ||
          "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      console.error("Failed to get AI response:", error);
      const errorResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <MainLayout>
      <h1
        style={{
          marginBottom: "32px",
        }}
      >
        AI Medical Assistant
      </h1>

      <div className="grid grid-cols-[280px_1fr] gap-6">
        {/* Suggested Prompts Sidebar */}
        <div>
          <Card padding="16px">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-[#2563EB]" />
              <h3>Suggested Prompts</h3>
            </div>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt.title)}
                  className="w-full text-left p-3 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-colors bg-white cursor-pointer"
                >
                  <div className="text-[14px] text-[#0F172A] mb-1">
                    {prompt.title}
                  </div>
                  <div className="text-[12px] text-[#475569]">
                    {prompt.description}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card
          padding="0"
          className="flex flex-col"
          style={{ height: "calc(100vh - 280px)", minHeight: "600px" }}
        >
          {/* Messages Area - Scrollable */}
          <div
            className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
            style={{ minHeight: 0 }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-[12px] px-4 py-3 ${
                    message.type === "user"
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#F1F5F9] text-[#0F172A]"
                  }`}
                >
                  {message.type === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-[#2563EB]" />
                      <span className="text-[13px] text-[#2563EB]">
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none">
                    {message.type === "ai" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-[#0F172A]">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-2 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-2 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-[#475569]">{children}</li>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">
                              {children}
                            </h3>
                          ),
                          code: ({ children }) => (
                            <code className="bg-[#E2E8F0] px-1.5 py-0.5 rounded text-xs">
                              {children}
                            </code>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-[#2563EB] pl-3 italic my-2">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-line">
                        {message.content}
                      </div>
                    )}
                  </div>
                  <div
                    className={`text-[11px] mt-2 ${
                      message.type === "user"
                        ? "text-blue-200"
                        : "text-[#475569]"
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-[12px] px-4 py-3 bg-[#F1F5F9] text-[#0F172A]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-[#2563EB]" />
                    <span className="text-[13px] text-[#2563EB]">
                      AI Assistant
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2
                      className="animate-spin text-[#2563EB]"
                      size={16}
                    />
                    <span className="text-[#475569]">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at Bottom */}
          <div className="border-t border-[#E2E8F0] px-6 py-4 bg-white shrink-0">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about patient care..."
                className="flex-1 px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
              <Button
                onClick={handleSend}
                className="px-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
            <div className="mt-3 text-[12px] text-[#475569]">
              AI responses are for informational purposes only. Always consult
              healthcare professionals for medical decisions.
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
