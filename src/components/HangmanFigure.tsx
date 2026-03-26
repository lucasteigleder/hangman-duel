type HangmanFigureProps = {
  wrongGuessCount: number;
};

function HangmanFigure({ wrongGuessCount }: HangmanFigureProps) {
  const showHead = wrongGuessCount >= 1;
  const showBody = wrongGuessCount >= 2;
  const showLeftArm = wrongGuessCount >= 3;
  const showRightArm = wrongGuessCount >= 4;
  const showLeftLeg = wrongGuessCount >= 5;
  const showRightLeg = wrongGuessCount >= 6;

  return (
    <div
      style={{
        position: "relative",
        width: "240px",
        height: "320px",
        margin: "1.5rem 0 2rem",
      }}
    >
      {/* Boden */}
      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: 0,
          width: 120,
          height: 4,
          background: "#222",
          borderRadius: 2,
        }}
      />

      {/* Mast */}
      <div
        style={{
          position: "absolute",
          left: 50,
          bottom: 0,
          width: 4,
          height: 260,
          background: "#222",
          borderRadius: 2,
        }}
      />

      {/* Querbalken */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 20,
          width: 110,
          height: 4,
          background: "#222",
          borderRadius: 2,
        }}
      />

      {/* Seil */}
      <div
        style={{
          position: "absolute",
          left: 156,
          top: 20,
          width: 4,
          height: 34,
          background: "#222",
          borderRadius: 2,
        }}
      />

      {/* Kopf */}
      {showHead && (
        <div
          style={{
            position: "absolute",
            left: 138,
            top: 54,
            width: 40,
            height: 40,
            border: "4px solid #222",
            borderRadius: "50%",
            boxSizing: "border-box",
          }}
        />
      )}

      {/* Körper */}
      {showBody && (
        <div
          style={{
            position: "absolute",
            left: 156,
            top: 94,
            width: 4,
            height: 78,
            background: "#222",
            borderRadius: 2,
          }}
        />
      )}

      {/* linker Arm */}
      {showLeftArm && (
        <div
          style={{
            position: "absolute",
            left: 128,
            top: 118,
            width: 32,
            height: 4,
            background: "#222",
            borderRadius: 2,
            transform: "rotate(-28deg)",
            transformOrigin: "right center",
          }}
        />
      )}

      {/* rechter Arm */}
      {showRightArm && (
        <div
          style={{
            position: "absolute",
            left: 158,
            top: 118,
            width: 32,
            height: 4,
            background: "#222",
            borderRadius: 2,
            transform: "rotate(28deg)",
            transformOrigin: "left center",
          }}
        />
      )}

      {/* linkes Bein */}
      {showLeftLeg && (
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 190,
            width: 34,
            height: 4,
            background: "#222",
            borderRadius: 2,
            transform: "rotate(35deg)",
            transformOrigin: "right center",
          }}
        />
      )}

      {/* rechtes Bein */}
      {showRightLeg && (
        <div
          style={{
            position: "absolute",
            left: 158,
            top: 190,
            width: 34,
            height: 4,
            background: "#222",
            borderRadius: 2,
            transform: "rotate(-35deg)",
            transformOrigin: "left center",
          }}
        />
      )}
    </div>
  );
}

export default HangmanFigure;