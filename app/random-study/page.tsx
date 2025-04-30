// app/random-study/page.tsx - Random Study Mode Page
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import StudyMode from "../components/StudyMode";
import { Question } from "../types";

export default function RandomStudyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
  const [studiedCount, setStudiedCount] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions");
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data);

        // Initialize the remaining questions with all questions in random order
        if (data.length > 0) {
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setRemainingQuestions(shuffled);
          setCurrentQuestion(shuffled[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load questions. Please try again.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleNextQuestion = () => {
    // Remove the current question from the remaining questions
    const newRemaining = remainingQuestions.slice(1);
    setRemainingQuestions(newRemaining);
    setStudiedCount(studiedCount + 1);

    // If there are more questions, set the next one as current
    if (newRemaining.length > 0) {
      setCurrentQuestion(newRemaining[0]);
    } else if (questions.length > 0) {
      // If we've gone through all questions, reshuffle and start again
      const reshuffled = [...questions].sort(() => Math.random() - 0.5);
      setRemainingQuestions(reshuffled);
      setCurrentQuestion(reshuffled[0]);
    }
  };

  const handleRestartStudy = () => {
    if (questions.length > 0) {
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setRemainingQuestions(shuffled);
      setCurrentQuestion(shuffled[0]);
      setStudiedCount(0);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Random Study Mode
        </h1>

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <div>
              <p className="text-lg">
                Studied: <span className="font-bold">{studiedCount}</span> /
                Total: <span className="font-bold">{questions.length}</span>
              </p>
              <p className="text-sm text-gray-500">
                Questions remaining: {remainingQuestions.length}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRestartStudy}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Restart
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {currentQuestion ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <StudyMode
              question={currentQuestion}
              onNext={handleNextQuestion}
              randomMode={true}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center min-h-[400px]">
            <p className="text-xl text-gray-500">
              {questions.length > 0
                ? "No questions available for study. Please restart."
                : "No questions available. Please add some questions first!"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
