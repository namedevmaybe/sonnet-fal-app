"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Sun, Moon, Upload, Download, Type } from "lucide-react";
import html2canvas from "html2canvas-pro";
import Image from "next/image";

// Sample JSON data structure - replace with your actual JSON file loading mechanism
const sampleSonnets = [
  {
    id: 1,
    text: "Shall I compare thee to a summer's day?\nThou art more lovely and more temperate.\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date.",
    hopefulInterpretation:
      "This sonnet speaks to eternal beauty and how your inner radiance transcends the fleeting nature of physical beauty. You're entering a period where your true essence will shine through.",
    honestInterpretation:
      "While you may be concerned with appearances, this sonnet reminds you that external beauty fades. Consider what lasting qualities you're cultivating beyond the superficial.",
    mood: "romantic",
    category: "safe",
  },
  {
    id: 2,
    text: "When in disgrace with fortune and men's eyes,\nI all alone beweep my outcast state,\nAnd trouble deaf heaven with my bootless cries,\nAnd look upon myself and curse my fate.",
    hopefulInterpretation:
      "Though you may feel overlooked or unfortunate now, brighter days are approaching. This period of difficulty is temporary and will give way to recognition and joy.",
    honestInterpretation:
      "You're experiencing a period of isolation or rejection. Rather than despairing, use this time for self-reflection and growth - your fortunes will change when you change your perspective.",
    mood: "melancholy",
    category: "reflective",
  },
  {
    id: 3,
    text: "Let me not to the marriage of true minds\nAdmit impediments. Love is not love\nWhich alters when it alteration finds,\nOr bends with the remover to remove.",
    hopefulInterpretation:
      "True love awaits you - the kind that stands firm through all of life's changes. Your capacity for constancy will be rewarded with a deep and lasting connection.",
    honestInterpretation:
      "You may need to examine whether your relationships are built on true commitment. This sonnet challenges you to consider if you're willing to love unconditionally through difficulties.",
    mood: "loving",
    category: "safe",
  },
];

// Define the Sonnet type
interface Sonnet {
  id: number;
  text: string;
  hopefulInterpretation: string;
  honestInterpretation: string;
  mood: string;
  category: string;
}

const SonnetFalPicker = () => {
  const [sonnets, setSonnets] = useState<Sonnet[]>(sampleSonnets);
  const [moods, setMoods] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentSonnet, setCurrentSonnet] = useState<Sonnet | null>(null);
  const [showHopeful, setShowHopeful] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [useScriptFont, setUseScriptFont] = useState(true);
  const [theme, setTheme] = useState("light");
  const [isPickingAnimation, setIsPickingAnimation] = useState(false);
  const [cardHeight, setCardHeight] = useState<number>(0);

  const sonnetRef = useRef<HTMLDivElement>(null);
  const frontFaceRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique moods and categories from sonnets
  useEffect(() => {
    const uniqueMoods = [...new Set(sonnets.map((sonnet) => sonnet.mood))];
    const uniqueCategories = [
      ...new Set(sonnets.map((sonnet) => sonnet.category)),
    ];
    setMoods(uniqueMoods);
    setCategories(uniqueCategories);
  }, [sonnets]);

  // Load JSON data from file and system theme preference
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (theme === "system") {
          setTheme(event.matches ? "dark" : "light");
        }
      });
  }, []);

  // Apply theme class to body
  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-light", "theme-dark");
    if (theme === "system") {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        body.classList.add("theme-dark");
      } else {
        body.classList.add("theme-light");
      }
    } else {
      body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  // Measure the height of the front face once a sonnet is displayed
  useEffect(() => {
    if (frontFaceRef.current) {
      setCardHeight(frontFaceRef.current.offsetHeight);
    }
  }, [currentSonnet, useScriptFont, theme]);

  // Function to handle file import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === "string") {
          const importedSonnets: Sonnet[] = JSON.parse(result);
          setSonnets(importedSonnets);
          setSelectedMoods([]);
          setSelectedCategories([]);
          setCurrentSonnet(null);
          alert("Sonnets imported successfully!");
        } else {
          alert("Failed to read file content as string.");
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Error importing file. Please ensure it is a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Function to pick a random sonnet based on selected moods and categories
  const pickRandomSonnet = () => {
    setIsPickingAnimation(true);
    setTimeout(() => {
      let filteredSonnets = [...sonnets];
      if (selectedMoods.length > 0) {
        filteredSonnets = filteredSonnets.filter((sonnet) =>
          selectedMoods.includes(sonnet.mood)
        );
      }
      if (selectedCategories.length > 0) {
        filteredSonnets = filteredSonnets.filter((sonnet) =>
          selectedCategories.includes(sonnet.category)
        );
      }
      if (filteredSonnets.length === 0) {
        alert(
          "No sonnets match your selected criteria. Please try different selections."
        );
        setIsPickingAnimation(false);
        return;
      }
      const randomIndex = Math.floor(Math.random() * filteredSonnets.length);
      setCurrentSonnet(filteredSonnets[randomIndex]);
      setIsFlipped(false);
      setShowHopeful(true);
      setIsPickingAnimation(false);
    }, 1500);
  };

  // Functions for mood and category selection
  const handleMoodSelect = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood));
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Function to export current sonnet as an image
  const exportAsImage = async () => {
    if (!currentSonnet || !sonnetRef.current) return;

    try {
      // Find the currently visible card content div
      let visibleSideDiv = null;

      if (sonnetRef.current) {
        const rotatedDiv = isFlipped
          ? sonnetRef.current.querySelector(
              'div[style*="transform: rotateY(180deg)"]'
            )
          : sonnetRef.current.querySelector(
              'div[style*="transform: rotateY(0deg)"]'
            );

        if (rotatedDiv) {
          visibleSideDiv = rotatedDiv.querySelector("div");
        }
      }

      if (!visibleSideDiv) {
        console.error("Could not find visible side div");
        return;
      }

      // Use html2canvas on just the visible content div
      const canvas = await html2canvas(visibleSideDiv, {
        backgroundColor: theme === "dark" ? "#1c1917" : null,
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Hide any elements with the class "no-export"
          const noExportElements = clonedDoc.querySelectorAll(".no-export");
          noExportElements.forEach((el) => {
            (el as HTMLElement).style.display = "none";
          });
        },
      });

      // Trigger download with the image
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `sonnet-fal-${currentSonnet.id}.png`;
      link.click();
    } catch (error) {
      console.error("Error exporting image:", error);
      copyToClipboard();
    }
  };

  // Helper function to copy text to clipboard
  const copyToClipboard = () => {
    if (!currentSonnet) return;
    const shareText = `I received this sonnet Fal:\n\n${
      currentSonnet.text
    }\n\n${
      showHopeful
        ? currentSonnet.hopefulInterpretation
        : currentSonnet.honestInterpretation
    }`;
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert("Copied to clipboard! You can now share it anywhere.");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        alert(
          "Could not copy to clipboard. Please select and copy the text manually."
        );
      });
  };

  // Function to flip between interpretations
  const flipInterpretation = () => {
    setShowHopeful(!showHopeful);
    setIsFlipped(!isFlipped);
  };

  // Function to toggle between fonts
  const toggleFont = () => {
    setUseScriptFont(!useScriptFont);
  };

  // Function to toggle theme
  const toggleTheme = () => {
    const themes = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Determine actual theme
  const getActualTheme = () => {
    if (theme !== "system") return theme;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const actualTheme = getActualTheme();
  const isDark = actualTheme === "dark";
  const bgColor = isDark ? "bg-stone-900" : "bg-amber-50";
  const textColor = isDark ? "text-amber-200" : "text-amber-900";
  const accentColor = isDark ? "text-amber-400" : "text-amber-700";
  const buttonBg = isDark
    ? "bg-amber-700 hover:bg-amber-600"
    : "bg-amber-700 hover:bg-amber-800";
  const filterButtonActive = isDark
    ? "bg-amber-600 text-stone-900"
    : "bg-amber-600 text-white";
  const filterButtonInactive = isDark
    ? "bg-stone-700 text-amber-300 hover:bg-stone-600"
    : "bg-amber-200 text-amber-800 hover:bg-amber-300";
  const parchmentBg = isDark ? "bg-stone-700" : "bg-amber-100";

  return (
    <div
      className={`flex flex-col items-center min-h-screen ${bgColor} p-4 transition-colors duration-500`}
    >
      <div className="w-full max-w-4xl">
        {/* New Row for Buttons Above the Header Image */}
        <div className="w-full flex justify-center gap-4 mb-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDark
                ? "bg-stone-700 text-amber-300"
                : "bg-amber-200 text-amber-800"
            } transition-colors`}
            title={`Current theme: ${theme}`}
          >
            {theme === "light" && <Sun size={20} />}
            {theme === "dark" && <Moon size={20} />}
            {theme === "system" &&
              (isDark ? <Moon size={20} /> : <Sun size={20} />)}
          </button>
          <button
            onClick={toggleFont}
            className={`p-2 rounded-full ${
              isDark
                ? "bg-stone-700 text-amber-300"
                : "bg-amber-200 text-amber-800"
            } transition-colors`}
            title={`Current font: ${useScriptFont ? "Script" : "Serif"}`}
          >
            <Type size={20} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-full ${
              isDark
                ? "bg-stone-700 text-amber-300"
                : "bg-amber-200 text-amber-800"
            } transition-colors`}
            title="Import JSON file"
          >
            <Upload size={20} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
          </button>
        </div>

        {/* Header Image */}
        <div className="h-48 mb-8 flex justify-center items-center relative">
          <div
            className={`h-full w-full flex justify-center items-center border-b-2 ${
              isDark ? "border-amber-800" : "border-amber-700"
            }`}
          >
            <Image
              src="https://raw.githubusercontent.com/namedevmaybe/sonnet-fal-app/master/public/Images/Shakespeare.jpg"
              alt="Shakespeare Illustration"
              fill={true}
              style={{ objectFit: "cover", objectPosition: "50% 20%" }}
            />
          </div>
        </div>

        {/* Title */}
        <div
          className={`text-center mb-8 transform transition-all duration-700 hover:scale-105`}
        >
          <h1
            className={`text-4xl font-serif ${textColor} mb-2 animate-appearance-in`}
          >
            Sonnet Fal Picker
          </h1>
          <p className={`text-lg ${accentColor} mt-2 italic`}>
            Discover the wisdom of sonnets through the ancient tradition of Fal
          </p>
        </div>

        {/* Filters */}
        <div
          className={`mb-8 p-6 ${parchmentBg} rounded-lg border ${
            isDark ? "border-amber-900" : "border-amber-600"
          } shadow-xl transition-all duration-500 animate-float`}
        >
          <h2 className={`text-2xl font-serif ${textColor} mb-4`}>
            Choose Your Destiny
          </h2>
          {/* Moods */}
          <div className="mb-6">
            <h3 className={`text-xl ${accentColor} mb-2`}>Moods:</h3>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 ${
                    selectedMoods.includes(mood)
                      ? filterButtonActive
                      : filterButtonInactive
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
          {/* Categories */}
          <div className="mb-6">
            <h3 className={`text-xl ${accentColor} mb-2`}>Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 ${
                    selectedCategories.includes(category)
                      ? filterButtonActive
                      : filterButtonInactive
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          {/* Pick button */}
          <button
            onClick={pickRandomSonnet}
            disabled={isPickingAnimation}
            className={`w-full py-3 ${buttonBg} text-white rounded-lg shadow-lg font-serif text-xl transition-all duration-300 transform hover:scale-102 relative overflow-hidden ${
              isPickingAnimation ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isPickingAnimation ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⟳</span>
                Consulting the Fates...
              </span>
            ) : (
              "Receive Your Sonnet Fal"
            )}
          </button>
        </div>

        {/* Flip Card Display Area */}
        {currentSonnet && (
          <div
            className={`relative mb-8 transition-all duration-700 animate-fadeIn ${
              isPickingAnimation ? "opacity-0" : "opacity-100"
            }`}
            style={{ perspective: "1000px" }}
          >
            <div
              ref={sonnetRef}
              className={`relative w-full max-w-3xl mx-auto transition-transform duration-500 ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                position: "relative",
                height: cardHeight || "auto",
              }}
            >
              {/* Front Side (Hopeful Interpretation) */}
              <div
                ref={frontFaceRef}
                className="absolute w-full"
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(0deg)",
                }}
              >
                <div
                  className={`${parchmentBg} p-10 rounded-lg shadow-2xl border-4 ${
                    isDark ? "border-amber-900" : "border-amber-600"
                  } transition-all duration-500 ${
                    isDark ? "bg-parchment-dark" : "bg-parchment-light"
                  }`}
                  style={{
                    backgroundImage: `url('/api/placeholder/800/600')`,
                    boxShadow: isDark
                      ? "0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.5)"
                      : "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                    transform: "rotateX(2deg)",
                  }}
                >
                  <div className="mb-6">
                    <h3
                      className={`text-2xl ${
                        useScriptFont ? "font-script" : "font-serif"
                      } ${textColor} mb-4 text-center`}
                    >
                      Your Sonnet
                    </h3>
                    <p
                      className={`whitespace-pre-line ${
                        useScriptFont
                          ? "font-script text-xl leading-loose"
                          : "font-serif text-lg leading-relaxed"
                      } ${textColor} italic`}
                      style={{
                        textShadow: isDark
                          ? "1px 1px 3px rgba(0,0,0,0.5)"
                          : "none",
                      }}
                    >
                      {currentSonnet?.text}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3
                      className={`text-xl ${
                        useScriptFont ? "font-script" : "font-serif"
                      } ${textColor} mb-2 text-center`}
                    >
                      Hopeful Interpretation
                    </h3>
                    <p
                      className={`${textColor} leading-relaxed ${
                        useScriptFont ? "font-script" : ""
                      }`}
                    >
                      {currentSonnet?.hopefulInterpretation}
                    </p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={flipInterpretation}
                      className={`px-4 py-2 ${buttonBg} text-white rounded shadow transition-all duration-300 hover:scale-105 no-export`}
                    >
                      Show Honest Interpretation
                    </button>
                    <button
                      onClick={exportAsImage}
                      className={`px-4 py-2 ${buttonBg} text-white rounded shadow flex items-center transition-all duration-300 hover:scale-105 no-export`}
                    >
                      <Download size={18} className="mr-1" />
                      Save to Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Back Side (Honest Interpretation) */}
              <div
                className="absolute w-full"
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div
                  className={`${parchmentBg} p-10 rounded-lg shadow-2xl border-4 ${
                    isDark ? "border-amber-900" : "border-amber-600"
                  } transition-all duration-500 ${
                    isDark ? "bg-parchment-dark" : "bg-parchment-light"
                  }`}
                  style={{
                    backgroundImage: `url('/api/placeholder/800/600')`,
                    boxShadow: isDark
                      ? "0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.5)"
                      : "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                    transform: "rotateX(2deg)",
                  }}
                >
                  <div className="mb-6">
                    <h3
                      className={`text-2xl ${
                        useScriptFont ? "font-script" : "font-serif"
                      } ${textColor} mb-4 text-center`}
                    >
                      Your Sonnet
                    </h3>
                    <p
                      className={`whitespace-pre-line ${
                        useScriptFont
                          ? "font-script text-xl leading-loose"
                          : "font-serif text-lg leading-relaxed"
                      } ${textColor} italic`}
                      style={{
                        textShadow: isDark
                          ? "1px 1px 3px rgba(0,0,0,0.5)"
                          : "none",
                      }}
                    >
                      {currentSonnet?.text}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3
                      className={`text-xl ${
                        useScriptFont ? "font-script" : "font-serif"
                      } ${textColor} mb-2 text-center`}
                    >
                      Honest Interpretation
                    </h3>
                    <p
                      className={`${textColor} leading-relaxed ${
                        useScriptFont ? "font-script" : ""
                      }`}
                    >
                      {currentSonnet?.honestInterpretation}
                    </p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={flipInterpretation}
                      className={`px-4 py-2 ${buttonBg} text-white rounded shadow transition-all duration-300 hover:scale-105 no-export`}
                    >
                      Show Hopeful Interpretation
                    </button>
                    <button
                      onClick={exportAsImage}
                      className={`px-4 py-2 ${buttonBg} text-white rounded shadow flex items-center transition-all duration-300 hover:scale-105 no-export`}
                    >
                      <Download size={18} className="mr-1" />
                      Save to Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className={`text-center ${accentColor} text-sm mt-8 transition-colors duration-500`}
        >
          <p>فال حافظ meets English Sonnets</p>
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap");
        :root {
          --font-serif: "Cormorant Garamond", serif;
          --font-script: "Tangerine", cursive;
        }
        .font-serif {
          font-family: var(--font-serif);
        }
        .font-script {
          font-family: var(--font-script);
          font-size: 175%;
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes appearance-in {
          0% {
            opacity: 0;
            letter-spacing: -0.5em;
          }
          40% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
            letter-spacing: normal;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-appearance-in {
          animation: appearance-in 1.2s ease-out forwards;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
        .bg-parchment-light {
          background-image: url("/api/placeholder/800/600");
          background-color: #f5e7d3;
          background-blend-mode: multiply;
        }
        .bg-parchment-dark {
          background-image: url("/api/placeholder/800/600");
          background-color: #44403c;
          background-blend-mode: multiply;
        }

        ::selection {
          background: ${isDark
            ? "rgba(251, 191, 36, 0.3)"
            : "rgba(217, 119, 6, 0.3)"}; /* Amber with opacity */
          color: ${textColor};
        }
        ::-moz-selection {
          background: ${isDark
            ? "rgba(251, 191, 36, 0.3)"
            : "rgba(217, 119, 6, 0.3)"}; /* Amber with opacity */
          color: ${textColor};
        }
      `}</style>
    </div>
  );
};

export default SonnetFalPicker;
