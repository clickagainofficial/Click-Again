"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, Send, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PublicSmtpSettings } from "@/lib/settings";

type Status = { kind: "ok" | "error"; text: string } | null;

/** One-click fill-ins for the mailboxes people actually use. */
const presets = [
  { label: "Gmail", host: "smtp.gmail.com", port: 465, secure: true },
  { label: "Outlook", host: "smtp.office365.com", port: 587, secure: false },
  { label: "Zoho", host: "smtp.zoho.in", port: 465, secure: true },
  { label: "Hostinger", host: "smtp.hostinger.com", port: 465, secure: true },
];

type TextKey = "host" | "user" | "pass" | "fromName" | "fromEmail" | "notifyTo";

export default function SmtpSettingsForm({ initial }: { initial: PublicSmtpSettings }) {
  const { hasPass: initialHasPass, ...rest } = initial;
  const [form, setForm] = useState({ ...rest, pass: "" });
  const [hasPass, setHasPass] = useState(initialHasPass);
  const [testTo, setTestTo] = useState(initial.notifyTo || initial.user);
  const [busy, setBusy] = useState<"save" | "test" | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const field = (key: TextKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggle = (key: "secure" | "confirmEnabled" | "notifyEnabled") => (v: boolean) =>
    setForm((f) => ({ ...f, [key]: v }));

  async function call(path: string, method: string, body: object) {
    const res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
    return data;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy("save");
    setStatus(null);
    try {
      const saved: PublicSmtpSettings = await call("/api/admin/settings", "PUT", form);
      setHasPass(saved.hasPass);
      setForm((f) => ({ ...f, pass: "" }));
      setStatus({ kind: "ok", text: "Saved. New enquiries will use these settings." });
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(null);
    }
  }

  async function test() {
    setBusy("test");
    setStatus(null);
    try {
      await call("/api/admin/settings/test", "POST", { ...form, to: testTo });
      setStatus({ kind: "ok", text: `Test mail sent to ${testTo}. Check the inbox (and spam).` });
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(null);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="size-4" /> SMTP server
          </CardTitle>
          <CardDescription>
            For Gmail, turn on 2-step verification and use an{" "}
            <a
              className="text-foreground underline underline-offset-2"
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noreferrer"
            >
              app password
            </a>{" "}
            here — not your normal password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <Button
                key={p.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm((f) => ({ ...f, host: p.host, port: p.port, secure: p.secure }))
                }
              >
                {p.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={form.host}
                onChange={field("host")}
                placeholder="smtp.gmail.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={form.port}
                onChange={(e) => setForm((f) => ({ ...f, port: Number(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Use SSL/TLS</p>
              <p className="text-muted-foreground text-xs">
                On for port 465. Off for 587 (STARTTLS).
              </p>
            </div>
            <Switch checked={form.secure} onCheckedChange={toggle("secure")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user">Username</Label>
              <Input
                id="user"
                value={form.user}
                onChange={field("user")}
                placeholder="clickagainofficial@gmail.com"
                autoComplete="off"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass">Password</Label>
              <Input
                id="pass"
                type="password"
                value={form.pass}
                onChange={field("pass")}
                placeholder={hasPass ? "Saved — leave blank to keep" : "App password"}
                autoComplete="new-password"
                required={!hasPass}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Who it comes from, and who hears about it</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromName">From name</Label>
              <Input
                id="fromName"
                value={form.fromName}
                onChange={field("fromName")}
                placeholder="Click Again"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={form.fromEmail}
                onChange={field("fromEmail")}
                placeholder="Usually the same as the username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notifyTo">Send new-enquiry alerts to</Label>
            <Input
              id="notifyTo"
              type="email"
              value={form.notifyTo}
              onChange={field("notifyTo")}
              placeholder="clickagainofficial@gmail.com"
            />
          </div>

          <div className="divide-y rounded-lg border">
            <div className="flex items-center justify-between gap-4 p-3">
              <div>
                <p className="text-sm font-medium">Thank-you mail to the customer</p>
                <p className="text-muted-foreground text-xs">
                  Sent to the email they enter on the form.
                </p>
              </div>
              <Switch
                checked={form.confirmEnabled}
                onCheckedChange={toggle("confirmEnabled")}
                aria-label="Thank-you mail to the customer"
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-3">
              <div>
                <p className="text-sm font-medium">Alert to us</p>
                <p className="text-muted-foreground text-xs">
                  Name, phone and what they need, with call and WhatsApp buttons.
                </p>
              </div>
              <Switch
                checked={form.notifyEnabled}
                onCheckedChange={toggle("notifyEnabled")}
                aria-label="Alert to us"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Send a test</CardTitle>
          <CardDescription>
            Sends the customer thank-you mail, with sample details, using what&apos;s on
            this form — saved or not.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            placeholder="you@example.com"
            aria-label="Send the test to"
          />
          <Button type="button" variant="outline" onClick={test} disabled={busy !== null}>
            {busy === "test" ? <Loader2 className="animate-spin" /> : <Send />}
            Send test
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={busy !== null}>
          {busy === "save" ? <Loader2 className="animate-spin" /> : null}
          Save settings
        </Button>
        {status ? (
          <p
            role="status"
            className={`flex items-center gap-2 text-sm ${
              status.kind === "ok" ? "text-emerald-700" : "text-destructive"
            }`}
          >
            {status.kind === "ok" ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <XCircle className="size-4" />
            )}
            {status.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}
