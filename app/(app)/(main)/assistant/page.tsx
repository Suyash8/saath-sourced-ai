"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, BrainCircuit, User, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "saathi-assistant-chat";

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error("Error loading saved messages:", error);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a response from the assistant.");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="AI Assistant" backHref="/dashboard">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewChat}
          disabled={isLoading || messages.length === 0}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </Header>

      <div className="container mx-auto p-4 space-y-4 pb-32 md:pb-24">
        {messages.length === 0 && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-lg rounded-lg px-4 py-2 bg-card border text-foreground">
              <p>Hi! I&apos;m Saathi, your AI business assistant. I can help you:</p>
              <ul>
                <li>Analyze deals and compare prices</li>
                <li>Provide business optimization tips</li>
                <li>Answer questions about group buying</li>
                <li>Give market insights and trends</li>
              </ul>
              <p>What would you like to know?</p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : ""
            }`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <BrainCircuit className="h-5 w-5" />
              </div>
            )}
            <div
              className={`prose prose-sm dark:prose-invert max-w-lg rounded-lg px-4 py-2 ${
                msg.role === "user"
                  ? "bg-muted text-foreground"
                  : "bg-card border text-foreground"
              }`}
            >
              <Markdown>{msg.content}</Markdown>
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted-foreground text-background flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center animate-pulse">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div className="rounded-lg px-4 py-2 bg-card border text-foreground">
              <p className="text-sm animate-pulse">Saathi is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 bg-card border-t p-4">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 container mx-auto"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Saathi anything..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
