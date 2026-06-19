"use client";

import { useState, useEffect } from "react";

const rows = [
  "QWEAIFOUNDEROSZXCVB",
  "RAIAGENTYFGEKBVCXZQ",
  "DJKMARKETAGENTOPLKJ",
  "WERTVIBECODINGIDETY",
  "AINEWSLETTERFIRMBNM",
  "GRECRUITINGFIRMBNMK",
  "HCONTENTWRITERPOIUY",
  "JCONSULTINGBVCXZZLQ",
  "KSUPPORTAGENTMNBVCX",
  "LRUYADGROWTHAGENCYZ",
];

const highlights = [
  {
    row: 1,
    start: 1,
    end: 7,
    name: "AI AGENT",
  },
  {
    row: 2,
    start: 3,
    end: 13,
    name: "MARKET AGENT",
  },
  {
    row: 4,
    start: 0,
    end: 15,
    name: "AI NEWSLETTER",
  },
  {
    row: 7,
    start: 1,
    end: 10,
    name: "CONSULTING",
  },
  {
    row: 8,
    start: 1,
    end: 12,
    name: "SUPPORT AGENT",
  },
  {
    row: 9,
    start: 6,
    end: 17,
    name: "GROWTH AGENCY",
  },
];

export default function WordSearch() {
  const [activeHighlights, setActiveHighlights] = useState([
    0, 1, 2,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHighlights((prev) =>
        prev.map(
          (index) =>
            (index + 1) % highlights.length
        )
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeWords = activeHighlights.map(
    (index) => highlights[index]
  );

  const getWordAtPosition = (
    row: number,
    col: number
  ) => {
    return activeWords.find(
      (word) =>
        word.row === row &&
        col >= word.start &&
        col <= word.end
    );
  };

  const handleWordClick = (
    word: string
  ) => {
    alert(word);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-0"
        >
          {row.split("").map((char, colIndex) => {
            const word = getWordAtPosition(
              rowIndex,
              colIndex
            );

            const isHighlighted =
              Boolean(word);

            const isStart =
              word &&
              colIndex === word.start;

            const isEnd =
              word &&
              colIndex === word.end;

            return (
              <div
                key={colIndex}
                onClick={() =>
                  word &&
                  handleWordClick(
                    word.name
                  )
                }
                style={{ fontFamily: "var(--font-pixelify)" }}
                className={`
                  relative
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-bold
                  transition-all
                  duration-300

                  ${
                    isHighlighted
                      ? `
                        bg-[#FF8A00]/20
                        text-black
                        cursor-pointer
                        border-y
                        border-[#000000]
                      `
                      : `
                        text-black/35
                      `
                  }

                  ${
                    isStart
                      ? `
                        border-l
                        border-[#000000]]
                        rounded-l-full
                      `
                      : ""
                  }

                  ${
                    isEnd
                      ? `
                        border-r
                        border-[#000000]
                        rounded-r-full
                      `
                      : ""
                  }
                `}
              >
                {char}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}