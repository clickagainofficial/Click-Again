"use client";

import { useId, useState } from "react";

type Item = { q: string; a: string };

/**
 * One answer open at a time, so the list never grows into a wall. Closed
 * answers are hidden rather than left out, so every answer is in the HTML a
 * crawler or an answer engine reads, not only the first one.
 */
export default function FaqList({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;

        return (
          <div className={isOpen ? "faq-item is-open" : "faq-item"} key={item.q}>
            <h3 className="faq-h">
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq-sign" aria-hidden="true" />
              </button>
            </h3>

            <p className="faq-a" id={id} hidden={!isOpen}>
              {item.a}
            </p>
          </div>
        );
      })}
    </div>
  );
}
