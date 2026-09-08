"use client";

import { useState } from "react";

type State = "idle" | "sending" | "done" | "error";

export default function NotifyForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot, hidden from people
  const [state, setState] = useState<State>("idle");
  const [note, setNote] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;

    setState("sending");
    setNote("");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setNote(data?.error ?? "Something went wrong. Try again.");
        return;
      }

      setState("done");
      setEmail("");
      setNote("You're on the list. We'll ping you the moment we go live.");
    } catch {
      setState("error");
      setNote("Network error. Try again in a moment.");
    }
  }

  return (
    <div className="rise d4">
      <form className="notify" onSubmit={onSubmit} noValidate={false}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          autoComplete="email"
        />
        {/* honeypot: off-screen and skipped by tab order, only bots fill it */}
        <input
          className="hp"
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button className="btn" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending..." : "Notify me"}
        </button>
      </form>
      <p className={`form-note${state === "done" ? " ok" : ""}`} role="status">
        {note || "No spam. One email when we launch."}
      </p>
    </div>
  );
}
