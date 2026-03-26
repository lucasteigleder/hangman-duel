import type { ReactNode } from "react";

type ScreenContainerProps = {
  title: string;
  children: ReactNode;
};

function ScreenContainer({ title, children }: ScreenContainerProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "rgba(255, 255, 255, 0.92)",
          border: "1px solid rgba(217, 227, 243, 0.9)",
          borderRadius: "28px",
          padding: "1.4rem",
          boxShadow: "0 18px 50px rgba(37, 99, 235, 0.12)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ marginBottom: "1.2rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.4rem)",
              lineHeight: 1.05,
              marginBottom: "0.4rem",
            }}
          >
            {title}
          </h1>
        </div>

        {children}
      </div>
    </main>
  );
}

export default ScreenContainer;