"use client";

import Image from "next/image";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const VENDOR = "isuite.ai";
const EMBED_SRC = `https://app.${VENDOR}/api/public/webchat/ced059756901c6e1/embed.js`;

/** Is the vendor's panel actually on screen right now? */
function panelOpen(el: HTMLIFrameElement | null) {
  if (!el?.isConnected) return false;
  const s = getComputedStyle(el);
  if (s.display === "none" || s.visibility === "hidden") return false;
  if (Number(s.opacity) === 0) return false;
  const r = el.getBoundingClientRect();
  return r.width > 1 && r.height > 1;
}

/**
 * The web chat, wearing Clicky's face.
 *
 * The vendor's embed drops a bare <button> and a lazy <iframe> straight into
 * <body> — no id, no class, and no public method to open it. So the only way
 * to put our own mascot on the launcher is to find their button, hide it, and
 * forward our clicks to it.
 *
 * Open/closed is read off their iframe rather than counted from our own
 * clicks. The panel has its own close button, and that one lives inside a
 * cross-origin frame we cannot listen to — so anything that counts clicks
 * drifts out of step the first time a visitor closes it from in there. The
 * label hangs off that same state: up whenever the panel is shut, gone while
 * it is open, back again when it closes.
 *
 * Reaching into someone else's DOM fails safe: their button is only hidden
 * once we have actually found it, and if it ever disappears we put it back and
 * take ours away. Worst case a visitor sees the vendor's stock launcher —
 * never no launcher at all.
 */
export default function ClickyChat() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const native = useRef<HTMLButtonElement | null>(null);

  /** Their launcher: a bare <button> parked directly on <body>. Ours lives
   *  inside a div, so this selector cannot pick up our own. */
  const findNative = useCallback(
    () => document.querySelector<HTMLButtonElement>("body > button"),
    []
  );

  // Wait for the embed to mount its button, then take over the corner.
  useEffect(() => {
    let done = false;

    function adopt(btn: HTMLButtonElement) {
      if (done) return;
      done = true;
      native.current = btn;
      // Hidden by a stylesheet rule, not an inline style: the embed writes
      // style.display = "flex" back onto its button every time the panel
      // opens, closes or the window resizes, which undid an inline "none"
      // and left their bubble sitting on top of Clicky.
      btn.setAttribute("data-cc-hidden", "");
      btn.setAttribute("aria-hidden", "true");
      btn.tabIndex = -1;
      setReady(true);
    }

    const existing = findNative();
    if (existing) adopt(existing);

    const observer = new MutationObserver(() => {
      const btn = findNative();
      if (btn) {
        adopt(btn);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });

    // the script is async and may be blocked outright; stop watching rather
    // than leave an observer running for the life of the page
    const giveUp = window.setTimeout(() => observer.disconnect(), 20_000);

    return () => {
      observer.disconnect();
      window.clearTimeout(giveUp);
      // put their button back the way we found it
      const btn = native.current;
      if (btn?.isConnected) {
        btn.removeAttribute("data-cc-hidden");
        btn.removeAttribute("aria-hidden");
        btn.tabIndex = 0;
      }
    };
  }, [findNative]);

  // Mirror the panel's real state. The iframe is built on first open, so we
  // watch for it arriving, then watch what it does.
  useEffect(() => {
    if (!ready) return;

    let frame: HTMLIFrameElement | null = null;
    let watchFrame: MutationObserver | null = null;

    const find = () =>
      document.querySelector<HTMLIFrameElement>(`iframe[src*="${VENDOR}"]`);

    function hook(el: HTMLIFrameElement) {
      frame = el;
      watchFrame?.disconnect();
      watchFrame = new MutationObserver(() => setOpen(panelOpen(frame)));
      watchFrame.observe(el, {
        attributes: true,
        attributeFilter: ["style", "class", "hidden"],
      });
      setOpen(panelOpen(el));
    }

    const existing = find();
    if (existing) hook(existing);

    const watchBody = new MutationObserver(() => {
      if (frame?.isConnected) return;
      const el = find();
      if (el) hook(el);
      else setOpen(false);
    });
    watchBody.observe(document.body, { childList: true, subtree: true });

    return () => {
      watchBody.disconnect();
      watchFrame?.disconnect();
    };
  }, [ready]);

  function toggle() {
    const btn = native.current;
    // gone from the page: hand the corner back rather than swallow the click
    if (!btn?.isConnected) {
      setReady(false);
      return;
    }
    btn.click();
  }

  return (
    <>
      <Script src={EMBED_SRC} strategy="lazyOnload" />

      {ready ? (
        <div className={`cc${open ? " is-open" : ""}`}>
          {!open ? (
            <button type="button" className="cc-bubble" onClick={toggle}>
              Chat with Clicky
            </button>
          ) : null}

          <div className="cc-dock">
            <span className="cc-ring" aria-hidden="true" />
            <button
              type="button"
              className="cc-launcher"
              onClick={toggle}
              aria-label={open ? "Close the chat" : "Chat with Clicky"}
            >
              <Image
                src="/How-we-work/web/clicky-face.webp"
                alt=""
                width={160}
                height={160}
                draggable={false}
              />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
