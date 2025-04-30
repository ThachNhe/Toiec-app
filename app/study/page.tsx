"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "../components/Layout";
import StudyMode from "../components/StudyMode";
import { Question } from "../types";

// Component con sử dụng useSearchParams
function StudyContent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const questionId = searchParams.get("id");

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
        setError("Failed to load questions. Please try again.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questionId
    ? questions.find((q) => q.id === questionId)
    : null;

  const handleSelectQuestion = (id: string) => {
    router.push(`/study?id=${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Study Mode</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Question list sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Questions</h2>

            {questions.length === 0 ? (
              <p className="text-gray-500">
                No questions available. Add some questions first!
              </p>
            ) : (
              <div className="overflow-y-auto max-h-[70vh]">
                <ul className="space-y-2">
                  {questions.map((question) => (
                    <li key={question.id}>
                      <button
                        onClick={() => handleSelectQuestion(question.id)}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          question.id === questionId
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      >
                        {question.question.length > 40
                          ? `${question.question.substring(0, 40)}...`
                          : question.question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Study area */}
        <div className="lg:col-span-3">
          {currentQuestion ? (
            <StudyMode question={currentQuestion} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center min-h-[400px]">
              <p className="text-xl text-gray-500">
                {questions.length > 0
                  ? "Select a question from the list to start studying"
                  : "No questions available. Please add some questions first!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component chính
export default function StudyPage() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <StudyContent />
      </Suspense>
    </Layout>
  );
}
