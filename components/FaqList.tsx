"use client";

import { useState } from "react";

type Item = { q: string; a: string };

/** Native <details> would do, but keeping it in state lets only one answer
 *  sit open at a time, which keeps the section from growing into a wall. */
export default function FaqList({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = open === i;

        return (
          <div className={isOpen ? "faq-item is-open" : "faq-item"} key={item.q}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <span className="faq-sign" aria-hidden="true" />
            </button>

            {isOpen ? <p className="faq-a">{item.a}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
