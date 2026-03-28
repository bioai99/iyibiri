"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", textAlign: "center", padding: "20px" }}>
          <p style={{ fontSize: "48px" }}>😕</p>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Bir şeyler ters gitti</h2>
          <button
            onClick={reset}
            style={{ background: "#F2B705", color: "#1B3A5C", fontWeight: "600", padding: "8px 20px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "14px" }}
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
