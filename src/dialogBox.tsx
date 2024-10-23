import React, { useEffect, useState } from "react";

interface DialogueBoxProps {
  text: string; // The text now supports HTML content
  onDisplayEnd: () => void;
  isVisible: boolean;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({
  text,
  onDisplayEnd,
  isVisible,
}) => {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (isVisible) {
      // Immediately show the full HTML content when dialogue becomes visible
      setCurrentText(text);
    }
  }, [isVisible, text]);

  const closeDialogue = () => {
    setCurrentText("");
    onDisplayEnd();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Enter" && isVisible) {
        closeDialogue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      id="textbox-container"
      style={{
        position: "absolute",
        bottom: "0px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        backgroundColor: "#fff",
        padding: "20px",
        color: "#000",
        fontSize: "12px",
        textAlign: "center",
        zIndex: 1000,
        boxShadow: `
          6px 6px 0px #242424,
          10px 10px 0px #242424,
          -3px -3px 0px #242424,
          -6px -6px 0px #242424
        `,
        fontFamily: "'Press Start 2P', cursive",
        boxSizing: "border-box",
      }}
    >
      <button
        id="close"
        onClick={closeDialogue}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        X
      </button>

      <div
        style={{
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <p
          id="dialogue"
          style={{ margin: 0 }}
          dangerouslySetInnerHTML={{ __html: currentText }} // Render HTML content
        ></p>
      </div>

      {currentText && (
        <p
          id="press-enter"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "12px",
            fontSize: "10px",
            color: "#242424",
            fontFamily: "'Press Start 2P', cursive",
          }}
        >
          Press Enter to continue
        </p>
      )}
    </div>
  );
};

export default DialogueBox;
