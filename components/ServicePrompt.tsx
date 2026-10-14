"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { site } from "@/site.config";

/** How long after the visitor starts scrolling before we ask. */
const DELAY_MS = 5_000;

/**
 * Asked once, then left alone for an hour — closed is an answer, and a prompt
 * that comes straight back is a pest. The time it was last shown is kept
 * rather than a flag, so the quiet hour holds across reloads and tabs and
 * expires on its own.
 */
const SEEN_KEY = "ca-service-asked";
const QUIET_MS = 60 * 60 * 1000;

/** Already on the form, or on the way out of it: nothing to ask. */
const QUIET = ["/contact"];

function askedWithinTheHour() {
  const last = Number(localStorage.getItem(SEEN_KEY));
  return last > 0 && Date.now() - last < QUIET_MS;
}

/**
 * Five seconds after a visitor starts scrolling, this opens once and asks
 * which service brought them. Picking one opens /contact with that service
 * already chosen, so the answer is not thrown away.
 *
 * It opens out from the middle of the screen like a sheet being unfolded,
 * which is enough to be noticed without having to shout.
 */
export default function ServicePrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // read at fire time rather than closed over, so moving between pages while
  // the countdown runs does not restart it
  const here = useRef(pathname);
  here.current = pathname;

  useEffect(() => {
    let timer = 0;
    const arm = () =>
      window.addEventListener("scroll", start, { passive: true, once: true });

    function start() {
      timer = window.setTimeout(() => {
        // the quiet hour, and the form itself, are the only things that stop
        // it; either way listen again, so it can come back once they lift
        const quiet =
          askedWithinTheHour() ||
          QUIET.some((p) => here.current.startsWith(p));

        if (!quiet) {
          localStorage.setItem(SEEN_KEY, String(Date.now()));
          setOpen(true);
        }
        arm();
      }, DELAY_MS);
    }

    arm();
    return () => {
      window.removeEventListener("scroll", start);
      window.clearTimeout(timer);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="np-veil" />
        <Dialog.Content className="np-paper" aria-describedby="np-sub">
          {/* the crease a folded sheet keeps after it is opened out */}
          <span className="np-fold" aria-hidden="true" />

          <p className="np-dateline">
            {site.name} <span aria-hidden="true">·</span> {site.legal.city}
          </p>

          <Dialog.Title className="np-head">
            What brought you here?
          </Dialog.Title>

          <p className="np-sub" id="np-sub">
            Point at the one closest to what you need. We&apos;ll open the
            enquiry form with it already filled in.
          </p>

          <ul className="np-picks">
            {site.services.map((s) => (
              <li key={s.slug}>
                <Link href={`/contact?service=${s.slug}`} onClick={close}>
                  {s.title}
                </Link>
              </li>
            ))}
            <li className="np-unsure">
              <Link href="/contact" onClick={close}>
                Not sure yet — just talk to us
              </Link>
            </li>
          </ul>

          <Dialog.Close className="np-later">Maybe later</Dialog.Close>

          <Dialog.Close className="np-x" aria-label="Close">
            <X aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
