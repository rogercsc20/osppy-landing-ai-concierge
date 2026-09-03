export type Block =
  | string
  | { sub: string }
  | { list: string[] };

export interface Section {
  heading: string;
  blocks: Block[];
}

function renderBlock(block: Block, i: number) {
  if (typeof block === "string") {
    return (
    <p key={i} className="text-[15px] leading-relaxed text-text-2">
      {block}
    </p>
    );
  }
  if ("sub" in block) {
    return (
    <h3 key={i} className="mt-2 text-base font-semibold text-text">
      {block.sub}
    </h3>
    );
  }
  return (
    <ul key={i} className="flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-text-2">
    {block.list.map((item, j) => (
      <li key={j}>{item}</li>
    ))}
    </ul>
  );
}

export function LegalDocument({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro?: string[];
  sections: Section[];
}) {
  return (
    <main className="min-h-screen bg-bg px-4 pb-24 pt-28 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold leading-tight text-text sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-text-2">{updated}</p>

        {intro && (
          <div className="mt-8 flex flex-col gap-3 border-l-2 border-accent/40 pl-5">
            {intro.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-text-2">
                {p}
              </p>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="mb-4 font-display text-2xl font-semibold text-text">
                <span className="mr-2 text-accent-text">{i + 1}.</span>
                {section.heading}
              </h2>
              <div className="flex flex-col gap-3">
                {section.blocks.map((b, j) => renderBlock(b, j))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
