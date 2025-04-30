"use client";

import { useState } from "react";
import { MessageState } from "../types";

interface AddQuestionFormProps {
  onQuestionAdded?: () => void;
}

export default function AddQuestionForm({
  onQuestionAdded,
}: AddQuestionFormProps) {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setMessage({ type: "error", text: "Question is required" });
      return;
    }

    if (!answer.trim()) {
      setMessage({ type: "error", text: "Answer is required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, answer }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add question");
      }

      setQuestion("");
      setAnswer("");
      setMessage({ type: "success", text: "Question added successfully!" });

      if (onQuestionAdded) {
        onQuestionAdded();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-red-100 text-red-800 border border-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Question
        </label>
        <textarea
          id="question"
          name="question"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div>
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Answer
        </label>
        <textarea
          id="answer"
          name="answer"
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter the answer here"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Question"}
        </button>
      </div>
    </form>
  );
}
