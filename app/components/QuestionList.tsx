"use client";

import { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import { Question } from "../types";

interface QuestionListProps {
  onQuestionDeleted?: () => void;
}

export default function QuestionList({ onQuestionDeleted }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions");
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const response = await fetch(`/api/questions?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      setQuestions(questions.filter((q) => q.id !== id));

      if (onQuestionDeleted) {
        onQuestionDeleted();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete question. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <p className="text-gray-500">
          No questions added yet. Add your first question!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
