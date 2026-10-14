"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { site } from "@/site.config";

type State = "idle" | "sending" | "done" | "error";

const NOT_SURE = "Not sure yet";

const empty = { name: "", email: "", phone: "", business: "", service: "", description: "" };

/**
 * The enquiry form on /contact. A link can preselect the service with
 * ?service=<slug>, so "talk to us" from a service page — or a pick from the
 * prompt that opens as you read — lands ready to send.
 *
 * The chosen service arrives as a prop, resolved from the URL on the server.
 * Reading window.location here instead would miss it on every click within
 * the site: Next rewrites the address bar in an effect on the router at the
 * root of the tree, and effects run child-first, so this form would read the
 * previous page's query string and quietly fill in nothing.
 */
export default function ContactForm({
  initialService = "",
}: {
  initialService?: string;
}) {
  const [form, setForm] = useState({ ...empty, service: initialService });
  const [website, setWebsite] = useState(""); // honeypot, hidden from people
  const [state, setState] = useState<State>("idle");
  const [note, setNote] = useState("");
  const [sentName, setSentName] = useState("");

  const set =
    (key: keyof typeof empty) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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

      {/* a div, not a label: the trigger is a button, and a wrapping label
          would forward its own clicks and toggle the panel straight shut */}
      <div className="cf-field">
        <span id="cf-service-label">What do you need?</span>
        <Select
          required
          name="service"
          value={form.service}
          onValueChange={(service) => setForm((f) => ({ ...f, service }))}
        >
          <SelectTrigger aria-labelledby="cf-service-label">
            {/* the chosen title is passed in rather than left to Radix, which
                resolves it from the option list through a client-only portal
                — so a preselected service would render as an empty box until
                hydration. The value is the title, so there is nothing to look
                up; an unset value still falls through to the placeholder. */}
            <SelectValue placeholder="Choose a service">
              {form.service}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {site.services.map((s) => (
              <SelectItem key={s.slug} value={s.title}>
                {s.title}
              </SelectItem>
            ))}
            <SelectItem value={NOT_SURE}>{NOT_SURE}</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
