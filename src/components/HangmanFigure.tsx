type HangmanFigureProps = {
  wrongGuessCount: number;
};

function HangmanFigure({ wrongGuessCount }: HangmanFigureProps) {
  const parts = {
    head: wrongGuessCount >= 6,
    body: wrongGuessCount >= 5,
    leftArm: wrongGuessCount >= 3,
    rightArm: wrongGuessCount >= 4,
    leftLeg: wrongGuessCount >= 1,
    rightLeg: wrongGuessCount >= 2,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "220px",
        height: "260px",
        margin: "1.5rem 0",
      }}
    >
      <div style={{ position: "absolute", left: 20, bottom: 0, width: 120, height: 4, background: "#111" }} />
      <div style={{ position: "absolute", left: 50, bottom: 0, width: 4, height: 220, background: "#111" }} />
      <div style={{ position: "absolute", left: 50, top: 20, width: 100, height: 4, background: "#111" }} />
      <div style={{ position: "absolute", left: 146, top: 20, width: 4, height: 30, background: "#111" }} />

      {parts.head && (
        <div
          style={{
            position: "absolute",
            left: 125,
            top: 50,
            width: 40,
            height: 40,
            border: "4px solid #111",
            borderRadius: "50%",
          }}
        />
      )}

      {parts.body && (
        <div style={{ position: "absolute", left: 145, top: 90, width: 4, height: 70, background: "#111" }} />
      )}

      {parts.leftArm && (
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 110,
            width: 30,
            height: 4,
            background: "#111",
            transform: "rotate(-30deg)",
            transformOrigin: "right center",
          }}
        />
      )}

      {parts.rightArm && (
        <div
          style={{
            position: "absolute",
            left: 148,
            top: 110,
            width: 30,
            height: 4,
            background: "#111",
            transform: "rotate(30deg)",
            transformOrigin: "left center",
          }}
        />
      )}

      {parts.leftLeg && (
        <div
          style={{
            position: "absolute",
            left: 123,
            top: 175,
            width: 30,
            height: 4,
            background: "#111",
            transform: "rotate(35deg)",
            transformOrigin: "right center",
          }}
        />
      )}

      {parts.rightLeg && (
        <div
          style={{
            position: "absolute",
            left: 148,
            top: 175,
            width: 30,
            height: 4,
            background: "#111",
            transform: "rotate(-35deg)",
            transformOrigin: "left center",
          }}
        />
      )}
    </div>
  );
}

export default HangmanFigure;