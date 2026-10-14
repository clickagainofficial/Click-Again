/**
 * Drops a JSON-LD block into the page. Server-rendered, so it is in the HTML
 * the first time a crawler or an agent reads the document.
 *
 * `<` is escaped because a string in the data could otherwise close the
 * script tag early and inject markup into the page.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
