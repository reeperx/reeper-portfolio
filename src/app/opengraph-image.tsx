import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          padding: "64px 72px",
          background: "#2338e8",
          color: "#f3f1ea",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -150,
            right: -120,
            width: 440,
            height: 440,
            borderRadius: "50%",
            background: "rgba(255, 92, 43, 0.18)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: 280,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(109, 124, 255, 0.28)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#f3f1ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2338e8",
                fontSize: 48,
                fontWeight: 900,
                letterSpacing: "-0.08em",
              }}
            >
              r<span style={{ color: "#ff5c2b" }}>.</span>
            </div>
            <span
              style={{
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: "-0.055em",
              }}
            >
              {site.wordmark}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
              fontSize: 20,
              color: "rgba(243, 241, 234, 0.76)",
            }}
          >
            <span>{site.role}</span>
            <span>{site.location}</span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
            }}
          >
            {site.tagline}
          </div>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.35,
              color: "rgba(243, 241, 234, 0.78)",
            }}
          >
            Fast, considered websites and web apps for small teams.
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 20,
            color: "rgba(243, 241, 234, 0.76)",
          }}
        >
          <div
            style={{
              width: 60,
              height: 4,
              borderRadius: 999,
              background: "#ff5c2b",
              display: "flex",
            }}
          />
          <span>
            {site.name} · {site.shortLocation}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
