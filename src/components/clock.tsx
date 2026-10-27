"use client";

import { useEffect, useState } from "react";

import { site } from "@/content/site";

function formatTime() {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: site.timeZone,
  }).format(new Date());
}

export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatTime());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <span>{time ?? "--:--"}</span>;
}
