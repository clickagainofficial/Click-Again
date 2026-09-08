"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export default function Countdown({ launchDate }: { launchDate: string }) {
  // starts null so server and first client render match, then ticks
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const target = new Date(launchDate).getTime();
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [launchDate]);

  const cells: Array<[string, number | null]> = [
    ["Days", parts?.days ?? null],
    ["Hours", parts?.hours ?? null],
    ["Minutes", parts?.minutes ?? null],
    ["Seconds", parts?.seconds ?? null],
  ];

  return (
    <div className="countdown rise d3" aria-label="Time until launch">
      {cells.map(([label, value]) => (
        <div className="cd-cell" key={label}>
          <div className="cd-num">
            {value === null ? "--" : String(value).padStart(2, "0")}
          </div>
          <div className="cd-lab">{label}</div>
        </div>
      ))}
    </div>
  );
}
