"use client";

import { useState, useEffect } from "react";
import Timer from "./Timer";
import { Question } from "../types";

interface StudyModeProps {
  question: Question;
  onNext?: () => void;
  randomMode?: boolean;
}

export default function StudyMode({
  question,
  onNext,
  randomMode = false,
}: StudyModeProps) {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when question changes
    setShowAnswer(false);
    setTimerRunning(false);
    setTimerFinished(false);
  }, [question.id]);

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const startTimer = () => {
    setTimerRunning(true);
    setTimerFinished(false);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const timerComplete = () => {
    setTimerFinished(true);
    setTimerRunning(false);
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Question</h2>
        <Timer
          running={timerRunning}
          initialTime={60}
          onComplete={timerComplete}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <p className="text-lg whitespace-pre-line">{question.question}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {!timerRunning ? (
          timerFinished ? (
            <button
              onClick={startTimer}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Restart Timer
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Start Timer (1 min)
            </button>
          )
        ) : (
          <button
            onClick={stopTimer}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Stop Timer
          </button>
        )}

        <button
          onClick={toggleAnswer}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>

        {randomMode && onNext && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ml-auto"
          >
            Next Question →
          </button>
        )}
      </div>

      {showAnswer && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Answer</h2>
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="whitespace-pre-line">{question.answer}</p>
          </div>
        </div>
      )}

      {randomMode && timerFinished && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-lg border border-yellow-400 text-yellow-800">
          <p>Time's up! Review your answer or continue to the next question.</p>
        </div>
      )}
    </div>
  );
}
