"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wand2, CheckCircle, AlertCircle } from "lucide-react";

interface GenerateMockDataButtonProps {
  endpoint: string;
  label: string;
}

export function GenerateMockDataButton({
  endpoint,
  label,
}: GenerateMockDataButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to generate mock data");
      }
    } catch (error) {
      console.error("Error generating mock data:", error);
      setStatus("error");
      setMessage("Failed to generate mock data");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-center space-y-4">
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="transition-all duration-300 hover:scale-105"
        size="lg"
      >
        <Wand2
          className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
        />
        {isGenerating ? "Generating..." : label}
      </Button>

      {status === "success" && (
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-md animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-md animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{message}</span>
        </div>
      )}
    </div>
  );
}
