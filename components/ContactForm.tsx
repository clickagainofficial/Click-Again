"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { site } from "@/site.config";

type State = "idle" | "sending" | "done" | "error";

const NOT_SURE = "Not sure yet";

const empty = { name: "", email: "", phone: "", business: "", service: "", description: "" };

/**
 * The enquiry form on /contact. A link can preselect the service with
 * ?service=<slug>, so "talk to us" from a service page lands ready to send.
 */
export default function ContactForm() {
  const [form, setForm] = useState(empty);
  const [website, setWebsite] = useState(""); // honeypot, hidden from people
  const [state, setState] = useState<State>("idle");
  const [note, setNote] = useState("");
  const [sentName, setSentName] = useState("");

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const match = site.services.find((s) => s.slug === slug);
    if (match) setForm((f) => ({ ...f, service: match.title }));
  }, []);

  const set =
    (key: keyof typeof empty) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;

    setState("sending");
    setNote("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setNote(data?.error ?? "Something went wrong. Try again.");
        return;
      }

      setSentName(form.name.trim().split(/\s+/)[0]);
      setState("done");
      setForm(empty);
    } catch {
      setState("error");
      setNote("Network error. Try again in a moment.");
    }
  }

  if (state === "done") {
    return (
      <div className="cf-done" role="status">
        <p className="cf-done-head">Thanks{sentName ? `, ${sentName}` : ""}.</p>
        <p>
          We have your details and will call you back within a working day. A
          copy is on its way to your inbox.
        </p>
        <button type="button" className="btn-ghost" onClick={() => setState("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="cf" onSubmit={onSubmit}>
      <div className="cf-row">
        <label className="cf-field">
          <span>Your name</span>
          <input
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
          />
        </label>
        <label className="cf-field">
          <span>Phone number</span>
          <input
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            pattern="[\s\-+0-9]{10,16}"
            title="A 10-digit mobile number"
            value={form.phone}
            onChange={set("phone")}
          />
        </label>
      </div>

      <div className="cf-row">
        <label className="cf-field">
          <span>Email</span>
          <input
            type="email"
            required
            maxLength={120}
            autoComplete="email"
            placeholder="you@business.com"
            value={form.email}
            onChange={set("email")}
          />
        </label>
        <label className="cf-field">
          <span>Business name</span>
          <input
            type="text"
            required
            maxLength={120}
            autoComplete="organization"
            value={form.business}
            onChange={set("business")}
          />
        </label>
      </div>

      <label className="cf-field">
        <span>What do you need?</span>
        <select required value={form.service} onChange={set("service")}>
          <option value="" disabled>
            Choose a service
          </option>
          {site.services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value={NOT_SURE}>{NOT_SURE}</option>
        </select>
      </label>

      <label className="cf-field">
        <span>
          Tell us a little more <em>(optional)</em>
        </span>
        <textarea
          rows={4}
          maxLength={2000}
          placeholder="What you sell, who buys it, what you want more of."
          value={form.description}
          onChange={set("description")}
        />
      </label>

      {/* honeypot: off-screen and skipped by tab order, only bots fill it */}
      <input
        className="hp"
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="cf-foot">
        <button className="btn" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending..." : "Send enquiry"}
        </button>
        <p className={`cf-note${state === "error" ? " is-error" : ""}`} role="status">
          {note || (
            <>
              We&apos;ll use these details only to get back to you about your
              enquiry — by email, call or WhatsApp. See our <Link href="/privacy">Privacy Policy</Link>.
            </>
          )}
        </p>
      </div>
    </form>
  );
}
