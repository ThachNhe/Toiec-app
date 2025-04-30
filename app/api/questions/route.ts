import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Question } from "../../types";

// Path to the JSON file for storing questions
const dataFilePath = path.join(process.cwd(), "app/data/questions.json");

// Ensure the data directory exists
function ensureDataDirExists(): void {
  const dataDir = path.dirname(dataFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read questions from the JSON file
function getQuestions(): Question[] {
  ensureDataDirExists();

  if (!fs.existsSync(dataFilePath)) {
    // Create an empty file if it doesn't exist
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
    return [];
  }

  try {
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContent || "[]");
  } catch (error) {
    console.error("Error reading questions file:", error);
    return [];
  }
}

// Save questions to the JSON file
function saveQuestions(questions: Question[]): boolean {
  ensureDataDirExists();

  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(questions, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving questions:", error);
    return false;
  }
}

// GET handler to retrieve all questions
export async function GET() {
  try {
    const questions = getQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error in GET questions:", error);
    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// Type for the request body
interface AddQuestionRequest {
  question: string;
  answer: string;
}

// POST handler to add a new question
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AddQuestionRequest;
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { message: "Question and answer are required" },
        { status: 400 }
      );
    }

    const questions = getQuestions();

    const newQuestion: Question = {
      id: uuidv4(),
      question,
      answer,
      createdAt: new Date().toISOString(),
    };

    questions.push(newQuestion);

    const success = saveQuestions(questions);

    if (!success) {
      return NextResponse.json(
        { message: "Failed to save question" },
        { status: 500 }
      );
    }

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Error in POST question:", error);
    return NextResponse.json(
      { message: "Failed to add question" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a question
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Question ID is required" },
        { status: 400 }
      );
    }

    const questions = getQuestions();
    const filteredQuestions = questions.filter((q) => q.id !== id);

    if (questions.length === filteredQuestions.length) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    const success = saveQuestions(filteredQuestions);

    if (!success) {
      return NextResponse.json(
        { message: "Failed to delete question" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE question:", error);
    return NextResponse.json(
      { message: "Failed to delete question" },
      { status: 500 }
    );
  }
}
