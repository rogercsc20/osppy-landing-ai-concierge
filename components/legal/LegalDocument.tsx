import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
      <p key={i} className="text-[15px] leading-relaxed text-ink/75">
        {block}
      </p>
    );
  }
  if ("sub" in block) {
    return (
      <h3 key={i} className="mt-2 text-base font-semibold text-ink">
        {block.sub}
      </h3>
    );
  }
  return (
    <ul key={i} className="flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-ink/75">
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
    <>
      <Navbar />
      <main className="min-h-screen bg-warm-white px-4 pb-24 pt-28 sm:px-6">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-ink/45">{updated}</p>

          {intro && (
            <div className="mt-8 flex flex-col gap-3 border-l-2 border-turquoise/40 pl-5">
              {intro.map((p, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-ink/70">
                  {p}
                </p>
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-col gap-10">
            {sections.map((section, i) => (
              <section key={i}>
                <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
                  <span className="mr-2 text-turquoise-deep">{i + 1}.</span>
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
      <Footer />
    </>
  );
}
