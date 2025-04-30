"use client";

import { useState } from "react";
import Link from "next/link";
import Layout from "./components/Layout";
import AddQuestionForm from "./components/AddQuestionForm";
import QuestionList from "./components/QuestionList";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleQuestionAdded = () => {
    // Force refresh the question list
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Speaking cùng Thạch Nhé App
        </h1>

        <div className="flex justify-center mb-8 space-x-4">
          <Link
            href="/study"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-medium"
          >
            Study Mode
          </Link>
          <Link
            href="/random-study"
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg font-medium"
          >
            Random Study Mode
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Add New Question</h2>
            <AddQuestionForm onQuestionAdded={handleQuestionAdded} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Question List</h2>
            <QuestionList
              key={refreshKey}
              onQuestionDeleted={handleQuestionAdded}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
