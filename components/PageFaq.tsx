import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";

/**
 * A page's "Questions people ask" block: the same accordion as /contact,
 * plus the FAQPage data so answer engines can quote it. Each page passes
 * its own questions; no two pages share one, so they don't compete.
 */
export default function PageFaq({
  items,
  title = "Questions people ask",
  id = "faq",
}: {
  items: readonly { q: string; a: string }[];
  title?: string;
  id?: string;
}) {
  if (!items.length) return null;
  return (
    <section className="page-faq" aria-labelledby={`${id}-title`}>
      <h2 className="sec-title" id={`${id}-title`}>
        {title}
      </h2>
      <FaqList items={items} />
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}
