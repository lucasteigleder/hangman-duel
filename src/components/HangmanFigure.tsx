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
        margin: "1.5rem 0 2rem",
      }}
    >
      <svg width="240" height="320" viewBox="0 0 240 320" aria-label="Galgenmännchen">
        {/* Galgen */}
        <line x1="20" y1="300" x2="140" y2="300" stroke="#222" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="300" x2="50" y2="40" stroke="#222" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="40" x2="160" y2="40" stroke="#222" strokeWidth="4" strokeLinecap="round" />
        <line x1="160" y1="40" x2="160" y2="70" stroke="#222" strokeWidth="4" strokeLinecap="round" />

        {/* Kopf */}
        {showHead && (
          <circle
            cx="160"
            cy="95"
            r="24"
            fill="none"
            stroke="#222"
            strokeWidth="4"
          />
        )}

        {/* Körper */}
        {showBody && (
          <line
            x1="160"
            y1="119"
            x2="160"
            y2="185"
            stroke="#222"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* linker Arm */}
        {showLeftArm && (
          <line
            x1="160"
            y1="140"
            x2="128"
            y2="158"
            stroke="#222"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* rechter Arm */}
        {showRightArm && (
          <line
            x1="160"
            y1="140"
            x2="192"
            y2="158"
            stroke="#222"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* linkes Bein */}
        {showLeftLeg && (
          <line
            x1="160"
            y1="185"
            x2="132"
            y2="215"
            stroke="#222"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* rechtes Bein */}
        {showRightLeg && (
          <line
            x1="160"
            y1="185"
            x2="188"
            y2="215"
            stroke="#222"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}

export default HangmanFigure;