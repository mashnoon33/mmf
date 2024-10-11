"use client";
import { useEffect, useState } from "react";

const generateRandomChar = () => {
  const characters = ['r', 'b', 'g', 'y', 'p', 'i'].join('')
  return characters.charAt(Math.floor(Math.random() * characters.length));
};

const cycleDuration = 3000; // Duration for each word cycle in milliseconds
const displayDuration = 9000; // Duration to display the final word in milliseconds

const AnimatedLogo = () => {
  const [currentWord, setCurrentWord] = useState(Array(4).fill('').map(generateRandomChar));
  const [isCycling, setIsCycling] = useState(true);

  useEffect(() => {
    const cycleTimeouts: NodeJS.Timeout[] = [];
    let displayTimeout: NodeJS.Timeout;

    const cycleChars = (index: number) => {
      cycleTimeouts[index] = setInterval(() => {
        setCurrentWord(prevWord => {
          const newWord = [...prevWord];
          newWord[index] = generateRandomChar();
          return newWord;
        });
      }, 100); // Cycle each character very quickly
    };

    const startCycle = () => {
      setIsCycling(true);
      for (let i = 0; i < 4; i++) {
        cycleChars(i);
      }
      displayTimeout = setTimeout(() => {
        cycleTimeouts.forEach(timeout => clearInterval(timeout));
        setIsCycling(false);
        setCurrentWord(Array(4).fill('').map(generateRandomChar));
      }, cycleDuration);
    };

    startCycle();
    const restartCycle = setInterval(startCycle, cycleDuration + displayDuration);

    return () => {
      cycleTimeouts.forEach(timeout => clearInterval(timeout));
      clearTimeout(displayTimeout);
      clearInterval(restartCycle);
    };
  }, []);

  return (
    <div className="flex">
      {currentWord.map((char, index) => (
        <div key={index} className="border border-white h-10 w-10 flex items-center justify-center text-white bg-red-500">
          {char}
        </div>
      ))}
    </div>
  );
};

export default AnimatedLogo;
