import Link from "next/link";
import { Question } from "../types";

interface QuestionCardProps {
  question: Question;
  onDelete: (id: string) => void;
}

export default function QuestionCard({
  question,
  onDelete,
}: QuestionCardProps) {
  const truncatedQuestion =
    question.question.length > 150
      ? `${question.question.substring(0, 150)}...`
      : question.question;

  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h3 className="font-medium text-lg mb-2">{truncatedQuestion}</h3>

      <div className="flex justify-end space-x-3 mt-4">
        <Link
          href={`/study?id=${question.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Study
        </Link>
        <button
          onClick={() => onDelete(question.id)}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
