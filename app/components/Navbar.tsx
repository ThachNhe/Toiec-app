"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            English Learning
          </Link>

          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md ${
                pathname === "/" ? "bg-blue-700" : "hover:bg-blue-500"
              }`}
            >
              Home
            </Link>

            <Link
              href="/study"
              className={`px-3 py-2 rounded-md ${
                pathname === "/study" || pathname.startsWith("/study?")
                  ? "bg-blue-700"
                  : "hover:bg-blue-500"
              }`}
            >
              Study
            </Link>

            <Link
              href="/random-study"
              className={`px-3 py-2 rounded-md ${
                pathname === "/random-study"
                  ? "bg-blue-700"
                  : "hover:bg-blue-500"
              }`}
            >
              Random Study
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
