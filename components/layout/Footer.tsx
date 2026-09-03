import { useTranslations } from "next-intl";
import { Mail, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logomark } from "@/components/ui/Logo";
import { CONTACT_EMAIL, CITY, WHATSAPP_NUMBER, whatsappHref } from "@/lib/site";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="relative border-t border-line px-4 pt-14 pb-28 sm:px-6 lg:pb-36">
      {/* ghost wordmark sinking below the fold — pseudo-element content so
          contrast audits treat it as the decoration it is. The clip lives on
          this wrapper, not on the <footer>: the atmosphere runs under the
          footer now, and a footer that clipped would cut the last aura. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="absolute inset-x-0 bottom-[-0.28em] select-none text-center font-display text-[clamp(6rem,18vw,16rem)] font-semibold leading-none text-text/[0.04] after:content-['Osppy']"
        />
      </span>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Osppy */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Logomark className="h-7 w-7 rounded-md" />
              <span className="font-semibold text-text">Osppy</span>
            </div>
            <p className="text-sm leading-relaxed text-text-2">{t("footer.about")}</p>
          </div>

          {/* Líneas */}
          <nav className="flex flex-col gap-2 text-sm" aria-label={t("footer.lineas")}>
            <h2 className="mb-1 text-xs font-semibold tracking-wide text-text uppercase">
              {t("footer.lineas")}
            </h2>
            <Link href="/hoteles" className="text-text-2 transition-colors hover:text-text">
              {t("footer.hoteles")}
            </Link>
            <Link href="/citas" className="text-text-2 transition-colors hover:text-text">
              {t("footer.citas")}
            </Link>
            <Link
              href={{ pathname: "/", hash: "#hacemos" } as never}
              className="text-text-2 transition-colors hover:text-text"
            >
              {t("footer.empresarial")}
            </Link>
          </nav>

          {/* Contacto */}
          <div className="flex flex-col gap-2 text-sm">
            <h2 className="mb-1 text-xs font-semibold tracking-wide text-text uppercase">
              {t("footer.contacto")}
            </h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-1.5 text-text-2 transition-colors hover:text-text"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            {WHATSAPP_NUMBER !== "" && (
              <a
                href={whatsappHref("")}
                className="flex items-center gap-1.5 text-text-2 transition-colors hover:text-text"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {t("footer.whatsapp")}
              </a>
            )}
            <p className="text-text-2">{CITY}</p>
          </div>

          {/* Legal */}
          <nav className="flex flex-col gap-2 text-sm" aria-label={t("footer.legalTitle")}>
            <h2 className="mb-1 text-xs font-semibold tracking-wide text-text uppercase">
              {t("footer.legalTitle")}
            </h2>
            <Link href="/privacidad" className="text-text-2 transition-colors hover:text-text">
              {t("footer.privacy")}
            </Link>
            <Link href="/terminos" className="text-text-2 transition-colors hover:text-text">
              {t("footer.terms")}
            </Link>
          </nav>
        </div>

        <div className="mt-12 space-y-1.5 border-t border-line pt-6 text-center text-xs text-text-2">
          <p>
            {t("footer.rights")} · osppy.com
          </p>
          <p>{t("footer.legal")}</p>
        </div>
      </div>
    </footer>
  );
}
