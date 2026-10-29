import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const paper = "#f2eee3";
const signal = "#d95d39";
const brass = "#b08a57";

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
          padding: "58px 68px",
          background: "linear-gradient(135deg, #1e3a31 0%, #0c110e 62%)",
          color: paper,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -150,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "rgba(176, 138, 87, 0.14)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -280,
            left: -160,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: "rgba(217, 93, 57, 0.08)",
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
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: "-0.055em",
              lineHeight: 1,
            }}
          >
            {site.wordmark}
            <span style={{ color: signal }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(242, 238, 227, 0.68)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 1,
                background: brass,
                display: "flex",
              }}
            />
            {site.brandLine}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 56,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 26,
              maxWidth: 690,
            }}
          >
            <div
              style={{
                fontSize: 82,
                fontWeight: 800,
                lineHeight: 0.94,
                letterSpacing: "-0.06em",
              }}
            >
              {site.tagline}
            </div>
            <div
              style={{
                fontSize: 23,
                lineHeight: 1.4,
                color: "rgba(242, 238, 227, 0.76)",
              }}
            >
              Independent web developer. Fast, considered websites and web apps
              for small teams.
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              flexShrink: 0,
              width: 258,
              height: 318,
              borderRadius: 30,
              border: "1px solid rgba(242, 238, 227, 0.22)",
              background: "rgba(242, 238, 227, 0.04)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 22,
                left: 24,
                display: "flex",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(242, 238, 227, 0.5)",
              }}
            >
              Original / 01
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 148,
                  height: 36,
                  borderRadius: 7,
                  background: paper,
                  display: "flex",
                }}
              />
              <div
                style={{
                  width: 42,
                  height: 118,
                  borderRadius: 7,
                  background: paper,
                  display: "flex",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                right: 32,
                bottom: 32,
                width: 18,
                height: 18,
                borderRadius: 4,
                background: signal,
                display: "flex",
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 22,
            borderTop: "1px solid rgba(242, 238, 227, 0.18)",
            fontSize: 17,
            color: "rgba(242, 238, 227, 0.66)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#b9d6b4",
                display: "flex",
              }}
            />
            {site.role} · {site.shortLocation}
          </div>
          <div style={{ display: "flex", color: "rgba(242, 238, 227, 0.5)" }}>
            Est. {site.established} · {site.name}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
