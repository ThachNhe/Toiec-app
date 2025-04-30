"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  running: boolean;
  initialTime: number;
  onComplete?: () => void;
}

export default function Timer({
  running,
  initialTime,
  onComplete,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      const id = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(id);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      setTimerId(id);

      return () => {
        clearInterval(id);
      };
    } else if (!running && timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [running, timeLeft, onComplete]);

  useEffect(() => {
    if (!running) {
      setTimeLeft(initialTime);
    }
  }, [running, initialTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div
      className={`text-2xl font-bold mono ${
        timeLeft < 10 ? "text-red-600" : "text-gray-700"
      }`}
    >
      {formattedTime}
    </div>
  );
}
