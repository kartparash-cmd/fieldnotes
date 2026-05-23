import { ImageResponse } from "next/og";

export const alt = "Field Notes — Builder going deeper.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0f172a",
          padding: "96px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            color: "#94a3b8",
            fontSize: 28,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: 32,
          }}
        >
          Kartikeya Parashar
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 160,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 32,
          }}
        >
          Field Notes
        </div>
        <div
          style={{
            color: "#cbd5e1",
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          Builder going deeper.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 64,
            right: 96,
            color: "#64748b",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          fieldnotes.kaydenlabs.com
        </div>
      </div>
    ),
    { ...size },
  );
}
