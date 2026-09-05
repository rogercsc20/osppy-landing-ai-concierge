import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

/* WHAT — three ways in, as three LONG RECTANGLES stacked one under the other
   (v5 T4, operator dictation: "fuera los tres recuadros lado a lado;
   rectángulos largos, uno debajo del otro" and "hover muy presente: el
   rectángulo crece bastante al pasar el cursor"). Before v5 they were three
   equal cards in `lg:grid-cols-3`; the grid is gone at every width.

   The WHOLE CARD is still the link and the arrow is still decorative, rather
   than a card with a link inside it: one target, one focus stop, and the test
   `the three cards are the links, and the whole card is the target` asserts
   the `<h3>` lives INSIDE the `<a>`. A rectangle with a button inside it
   breaks that, and rightly.

   HOW THE GROWTH IS BUILT, and why it is not the obvious way. The thing that
   grows is a SURFACE LAYER behind the content — an absolutely positioned
   `<span>` carrying `.glass`, the border and the radius — and nothing else.
   Three consequences, all of them the point:

   - The anchor's box in flow never changes size, so nothing below the section
     moves and the page never reflows on a pointer move. A growth in `height`
     (or in `grid-template-rows`, which is the same layout change wearing a
     different name) reflows the whole document from here down.
   - The text does not scale with it, so it stays crisp and stays put: the
     frame opens around the words instead of stretching them. `scaleY` on the
     whole card would distort every glyph in it.
   - The growth is therefore free: one composited layer, no layout, no paint
     of the content.

   The transition names `scale`, not `transform`, and that is not a detail:
   Tailwind v4's `scale-*` utilities write the STANDALONE `scale` property,
   so `getComputedStyle(el).transform` stays `none` while the element is
   scaled. `transition-[transform,…]` here named a property that never
   changes — measured against `next start`, the growth reached its final
   `scale: 1 1.18` within 60 ms with no ease at all. The v5 note that said to
   grow "with `transform`" predates that rename; the mechanism is the same,
   the property name is not.

   The factor is per-breakpoint because the rectangle is not the same shape at
   every width — stacked below `lg` it is ~1.7x taller than the single row it
   becomes above, and one factor would grow it by that many more pixels there.
   Both are tuned to about the same number of pixels per edge, measured, and to
   stay well inside the `gap` so a grown rectangle never touches its neighbour.
   Its neighbours do not react at all: three doors, and the pointer opens one.

   The row does not start until `lg`. At 768 it was measured cramped: a name
   column wide enough for "Implementación" leaves the body ~184 px and breaks
   one sentence over three lines, which is a worse rectangle than the stacked
   one. Below `lg` the rectangle is still long and still full-width; only its
   inside is stacked.

   Reduced motion is honoured by NOT RUNNING: the growth is under
   `motion-safe:`, so under `reduce` the rule does not exist and the rectangle
   keeps exactly the geometry the server sent. The border still answers the
   pointer, because a colour is not motion. */

const SERVICIOS = [
  { key: "capacitacion", href: "/capacitacion" },
  { key: "asesoria", href: "/asesoria" },
  { key: "implementacion", href: "/implementacion" },
] as const;

export async function Hacemos() {
  const t = await getTranslations("home.hacemos");

  return (
    <section id="hacemos" className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display max-w-3xl text-h2 font-semibold text-text">
            {t("headline")}
          </h2>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 sm:gap-7" variant="fade-up">
          {SERVICIOS.map(({ key, href }) => (
            <Link
              key={key}
              href={href as AppPathname}
              className="group relative block rounded-2xl px-7 py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text sm:px-9 sm:py-8"
            >
              <span
                aria-hidden="true"
                className="glass absolute inset-0 rounded-2xl transition-[scale,border-color] duration-300 ease-luxe group-hover:border-accent-text/40 group-focus-visible:border-accent-text/40 motion-safe:group-hover:scale-y-[1.09] motion-safe:group-focus-visible:scale-y-[1.09] lg:motion-safe:group-hover:scale-y-[1.18] lg:motion-safe:group-focus-visible:scale-y-[1.18]"
              />

              <div className="relative lg:grid lg:grid-cols-[15rem_minmax(0,1fr)_auto] lg:items-center lg:gap-x-8 xl:grid-cols-[18rem_minmax(0,1fr)_auto] xl:gap-x-14">
                <span className="inline-block w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary-foreground lg:col-start-1 lg:row-start-1">
                  {t(`${key}.estado`)}
                </span>

                <h3 className="font-display mt-3 text-h3 font-semibold text-text lg:col-start-1 lg:row-start-2 lg:mt-2">
                  {t(`${key}.titulo`)}
                </h3>

                <p className="mt-4 leading-relaxed text-text-2 lg:col-start-2 lg:row-start-2 lg:mt-0">
                  {t(`${key}.body`)}
                </p>

                <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent-text lg:col-start-3 lg:row-start-2 lg:mt-0">
                  {t(`${key}.cta`)}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
