import { useState, useEffect } from "react";

const TypingAnim = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentPhrase, setCurrentPhrase] = useState(0);

  const phrases = [
    "Chat With Your OWN AI",
    "Built With Gemini 🚀",
    "Your Own Customized AI Assistant 🤖",
  ];
  const delays = [1000, 2000, 1500];

  useEffect(() => {
    let charIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const phrase = phrases[currentPhrase];

    const type = () => {
      if (charIndex < phrase.length) {
        setDisplayText(phrase.substring(0, charIndex + 1));
        charIndex++;
        timeout = setTimeout(type, 50);
      } else {
        // After typing is complete, wait before moving to next phrase
        timeout = setTimeout(() => {
          setCurrentPhrase((prev) => (prev + 1) % phrases.length);
          setDisplayText("");
          charIndex = 0;
        }, delays[currentPhrase]);
      }
    };

    timeout = setTimeout(type, 100);

    return () => clearTimeout(timeout);
  }, [currentPhrase]);

  return (
    <div
      style={{
        fontSize: "60px",
        color: "white",
        display: "inline-block",
        textShadow: "1px 1px 20px #000",
        minHeight: "80px",
      }}
    >
      {displayText}
      <span style={{ animation: "blink 0.7s infinite" }}>|</span>
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TypingAnim;