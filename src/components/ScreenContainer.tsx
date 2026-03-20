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
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        background: "#f5f7fb",
        color: "#1f2937",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>{title}</h1>
        {children}
      </div>
    </main>
  );
}

export default ScreenContainer;