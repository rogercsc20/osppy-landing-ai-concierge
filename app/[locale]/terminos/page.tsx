import type { Metadata } from "next";
import { LegalDocument, type Section } from "@/components/legal/LegalDocument";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isES = locale === "es";
  return {
    title: isES ? "Términos de Uso — Osppy" : "Terms of Use — Osppy",
    description: isES
      ? "Términos y Condiciones de Uso del servicio Osppy."
      : "Osppy's Terms of Use.",
  };
}

const ES: { updated: string; intro: string[]; sections: Section[] } = {
  updated: "Última actualización: 5 de junio de 2026",
  intro: [
    "Los presentes Términos de Uso (los «Términos») regulan el acceso y uso del servicio Osppy. Al contratar, acceder o utilizar el servicio, aceptas estos Términos en su totalidad. Si no estás de acuerdo, no debes utilizar el servicio.",
  ],
  sections: [
    {
      heading: "Aceptación de los Términos",
      blocks: [
        "El servicio es operado por [RAZÓN SOCIAL], con domicilio en [DOMICILIO FISCAL], México («Osppy», «nosotros»). Estos Términos constituyen un acuerdo vinculante entre Osppy y la persona física o moral que contrata o utiliza el servicio (el «Cliente» o «tú»). Declaras contar con la capacidad y facultades legales para obligarte conforme a estos Términos.",
      ],
    },
    {
      heading: "Descripción del servicio",
      blocks: [
        "Osppy es un asistente que se integra con WhatsApp Business para responder de forma automática a los huéspedes de hoteles y establecimientos, con base en la información que el Cliente configura, escalando a una persona cuando resulte necesario. Las funcionalidades disponibles dependen del plan contratado y pueden actualizarse con el tiempo.",
      ],
    },
    {
      heading: "Elegibilidad y cuenta",
      blocks: [
        "Para utilizar el servicio debes proporcionar información veraz, completa y actualizada durante la contratación y configuración. Eres responsable de mantener la confidencialidad de las credenciales de acceso y de toda actividad realizada a través de tu cuenta. Deberás notificarnos de inmediato cualquier uso no autorizado.",
      ],
    },
    {
      heading: "Conexión con WhatsApp y servicios de terceros",
      blocks: [
        "El servicio requiere conectar tu número de WhatsApp Business y puede depender de plataformas de terceros (incluidos Meta Platforms, proveedores de nube, modelos de inteligencia artificial y procesadores de pago). Eres responsable de cumplir con los términos y políticas de dichos terceros. Osppy no es responsable por interrupciones, cambios o suspensiones imputables a dichas plataformas.",
      ],
    },
    {
      heading: "Planes, precios, pagos y facturación",
      blocks: [
        "Los precios y características de cada plan se publican en el sitio y pueden modificarse con previo aviso. Salvo que se indique lo contrario, el servicio se contrata bajo un esquema de suscripción mensual, sin contrato forzoso de permanencia.",
        "Los pagos se realizan por adelantado a través de los medios habilitados. La falta de pago puede dar lugar a la suspensión o cancelación del servicio. Los impuestos aplicables se cobrarán conforme a la legislación vigente y emitiremos los comprobantes fiscales correspondientes.",
      ],
    },
    {
      heading: "Uso aceptable",
      blocks: [
        "Te comprometes a no utilizar el servicio para:",
        {
          list: [
            "Enviar mensajes no solicitados (spam), fraudulentos, engañosos o que infrinjan las políticas de WhatsApp/Meta.",
            "Cargar o transmitir contenido ilícito, difamatorio, que infrinja derechos de terceros o que vulnere la privacidad de las personas.",
            "Intentar vulnerar la seguridad del servicio, realizar ingeniería inversa o acceder a él por medios no autorizados.",
            "Utilizar el servicio para fines distintos a los previstos o de forma que pueda dañar a Osppy, a otros usuarios o a terceros.",
          ],
        },
      ],
    },
    {
      heading: "Contenido y responsabilidad del Cliente",
      blocks: [
        "Eres el único responsable de la información que configures (precios, políticas, horarios, etc.) y de las comunicaciones que se generen con tus huéspedes. Nos otorgas una licencia limitada para tratar dicha información con el único fin de prestarte el servicio. Eres responsable de cumplir con la normativa aplicable a tu actividad, incluida la materia de protección de datos respecto de tus huéspedes.",
      ],
    },
    {
      heading: "Inteligencia artificial y limitaciones",
      blocks: [
        "El servicio utiliza modelos de inteligencia artificial que generan respuestas automáticas que pueden contener errores o imprecisiones. Osppy no garantiza la exactitud de cada respuesta. Te recomendamos revisar la configuración y supervisar las conversaciones. Las decisiones relevantes (por ejemplo, confirmar reservaciones o aplicar políticas) son tu responsabilidad.",
      ],
    },
    {
      heading: "Propiedad intelectual",
      blocks: [
        "El software, la marca «Osppy», los logotipos, el sitio y todos los derechos de propiedad intelectual asociados son propiedad de Osppy o de sus licenciantes. No se te otorga ningún derecho sobre los mismos salvo la licencia de uso limitada, no exclusiva e intransferible necesaria para utilizar el servicio conforme a estos Términos.",
      ],
    },
    {
      heading: "Privacidad y protección de datos",
      blocks: [
        "El tratamiento de datos personales se rige por nuestro Aviso de Privacidad, que forma parte integral de estos Términos. Al utilizar el servicio, reconoces haberlo leído y aceptado.",
      ],
    },
    {
      heading: "Disponibilidad del servicio",
      blocks: [
        "Procuramos mantener el servicio disponible de forma continua; sin embargo, puede haber interrupciones por mantenimiento, actualizaciones, fallas de terceros o causas de fuerza mayor. El servicio se proporciona «tal cual» y «según disponibilidad».",
      ],
    },
    {
      heading: "Descargo de garantías",
      blocks: [
        "En la máxima medida permitida por la ley, Osppy no otorga garantías de ningún tipo, expresas o implícitas, sobre el servicio, incluyendo garantías de comerciabilidad, idoneidad para un fin determinado o ausencia de errores.",
      ],
    },
    {
      heading: "Limitación de responsabilidad",
      blocks: [
        "En la máxima medida permitida por la ley, Osppy no será responsable por daños indirectos, incidentales, especiales, punitivos o consecuenciales, ni por pérdida de ingresos, reservaciones, clientela o datos. La responsabilidad total de Osppy, por cualquier concepto, se limitará al monto efectivamente pagado por el Cliente durante los tres (3) meses anteriores al evento que dio origen a la reclamación.",
      ],
    },
    {
      heading: "Indemnización",
      blocks: [
        "Te obligas a sacar en paz y a salvo e indemnizar a Osppy frente a cualquier reclamación, daño o gasto (incluidos honorarios razonables de abogados) derivado del uso indebido del servicio, del incumplimiento de estos Términos o de la información que configures o transmitas.",
      ],
    },
    {
      heading: "Vigencia, cancelación y terminación",
      blocks: [
        "El servicio permanecerá vigente mientras mantengas una suscripción activa. Puedes cancelar en cualquier momento; la cancelación surtirá efecto al término del periodo de facturación en curso y no genera devoluciones por periodos ya pagados, salvo que la ley disponga lo contrario.",
        "Podremos suspender o terminar el servicio en caso de incumplimiento de estos Términos, falta de pago o uso que pueda generar responsabilidad legal.",
      ],
    },
    {
      heading: "Modificaciones a los Términos",
      blocks: [
        "Podemos modificar estos Términos en cualquier momento. Las modificaciones se publicarán en esta página indicando la fecha de la última actualización. El uso continuado del servicio tras la publicación de los cambios implica tu aceptación de los mismos.",
      ],
    },
    {
      heading: "Ley aplicable y jurisdicción",
      blocks: [
        "Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Para la interpretación y cumplimiento de los mismos, las partes se someten a la jurisdicción de los tribunales competentes de [CIUDAD/ENTIDAD], renunciando a cualquier otro fuero que pudiera corresponderles.",
      ],
    },
    {
      heading: "Contacto",
      blocks: [
        "Para cualquier duda relacionada con estos Términos, puedes escribirnos a hello@osppy.com.",
      ],
    },
  ],
};

const EN: { updated: string; intro: string[]; sections: Section[] } = {
  updated: "Last updated: June 5, 2026",
  intro: [
    "These Terms of Use (the “Terms”) govern access to and use of the Osppy service. By contracting, accessing, or using the service, you accept these Terms in full. If you do not agree, you must not use the service. For users in Mexico, the Spanish-language version of these Terms prevails.",
  ],
  sections: [
    {
      heading: "Acceptance of the Terms",
      blocks: [
        "The service is operated by [LEGAL ENTITY NAME], with address at [REGISTERED ADDRESS], Mexico (“Osppy”, “we”). These Terms constitute a binding agreement between Osppy and the individual or entity that contracts or uses the service (the “Client” or “you”). You represent that you have the legal capacity and authority to be bound by these Terms.",
      ],
    },
    {
      heading: "Description of the service",
      blocks: [
        "Osppy is an assistant that integrates with WhatsApp Business to automatically answer the guests of hotels and establishments, based on the information the Client configures, escalating to a human when necessary. Available features depend on the contracted plan and may be updated over time.",
      ],
    },
    {
      heading: "Eligibility and account",
      blocks: [
        "To use the service you must provide truthful, complete, and up-to-date information during onboarding and configuration. You are responsible for keeping your access credentials confidential and for all activity carried out through your account. You must notify us immediately of any unauthorized use.",
      ],
    },
    {
      heading: "WhatsApp and third-party connections",
      blocks: [
        "The service requires connecting your WhatsApp Business number and may depend on third-party platforms (including Meta Platforms, cloud providers, AI models, and payment processors). You are responsible for complying with such third parties' terms and policies. Osppy is not liable for interruptions, changes, or suspensions attributable to those platforms.",
      ],
    },
    {
      heading: "Plans, pricing, payments, and billing",
      blocks: [
        "Prices and features of each plan are published on the site and may be changed with prior notice. Unless otherwise stated, the service is contracted under a monthly subscription model, with no mandatory lock-in period.",
        "Payments are made in advance through the enabled methods. Non-payment may result in suspension or cancellation of the service. Applicable taxes will be charged under current law, and we will issue the corresponding invoices.",
      ],
    },
    {
      heading: "Acceptable use",
      blocks: [
        "You agree not to use the service to:",
        {
          list: [
            "Send unsolicited (spam), fraudulent, or misleading messages, or messages that violate WhatsApp/Meta policies.",
            "Upload or transmit unlawful or defamatory content, content that infringes third-party rights, or that violates individuals' privacy.",
            "Attempt to breach the service's security, reverse engineer it, or access it by unauthorized means.",
            "Use the service for purposes other than those intended or in a way that could harm Osppy, other users, or third parties.",
          ],
        },
      ],
    },
    {
      heading: "Client content and responsibility",
      blocks: [
        "You are solely responsible for the information you configure (pricing, policies, schedules, etc.) and for the communications generated with your guests. You grant us a limited license to process that information for the sole purpose of providing the service. You are responsible for complying with the regulations applicable to your activity, including data protection regarding your guests.",
      ],
    },
    {
      heading: "Artificial intelligence and limitations",
      blocks: [
        "The service uses artificial intelligence models that generate automated responses, which may contain errors or inaccuracies. Osppy does not guarantee the accuracy of every response. We recommend reviewing the configuration and supervising conversations. Relevant decisions (for example, confirming bookings or applying policies) are your responsibility.",
      ],
    },
    {
      heading: "Intellectual property",
      blocks: [
        "The software, the “Osppy” brand, logos, the site, and all associated intellectual property rights are owned by Osppy or its licensors. You are granted no rights over them other than the limited, non-exclusive, non-transferable license necessary to use the service under these Terms.",
      ],
    },
    {
      heading: "Privacy and data protection",
      blocks: [
        "The processing of personal data is governed by our Privacy Policy, which is an integral part of these Terms. By using the service, you acknowledge that you have read and accepted it.",
      ],
    },
    {
      heading: "Service availability",
      blocks: [
        "We strive to keep the service continuously available; however, there may be interruptions due to maintenance, updates, third-party failures, or force majeure. The service is provided “as is” and “as available.”",
      ],
    },
    {
      heading: "Disclaimer of warranties",
      blocks: [
        "To the maximum extent permitted by law, Osppy makes no warranties of any kind, express or implied, regarding the service, including warranties of merchantability, fitness for a particular purpose, or freedom from errors.",
      ],
    },
    {
      heading: "Limitation of liability",
      blocks: [
        "To the maximum extent permitted by law, Osppy shall not be liable for indirect, incidental, special, punitive, or consequential damages, nor for loss of revenue, bookings, goodwill, or data. Osppy's total liability, for any cause, shall be limited to the amount actually paid by the Client during the three (3) months prior to the event giving rise to the claim.",
      ],
    },
    {
      heading: "Indemnification",
      blocks: [
        "You agree to hold harmless and indemnify Osppy against any claim, damage, or expense (including reasonable attorneys' fees) arising from misuse of the service, breach of these Terms, or the information you configure or transmit.",
      ],
    },
    {
      heading: "Term, cancellation, and termination",
      blocks: [
        "The service will remain in effect while you maintain an active subscription. You may cancel at any time; cancellation takes effect at the end of the current billing period and does not generate refunds for periods already paid, unless the law provides otherwise.",
        "We may suspend or terminate the service in the event of a breach of these Terms, non-payment, or use that could create legal liability.",
      ],
    },
    {
      heading: "Changes to the Terms",
      blocks: [
        "We may modify these Terms at any time. Changes will be posted on this page indicating the date of the last update. Continued use of the service after the changes are posted constitutes your acceptance of them.",
      ],
    },
    {
      heading: "Governing law and jurisdiction",
      blocks: [
        "These Terms are governed by the laws of the United Mexican States. For their interpretation and performance, the parties submit to the jurisdiction of the competent courts of [CITY/STATE], waiving any other jurisdiction that may correspond to them.",
      ],
    },
    {
      heading: "Contact",
      blocks: [
        "For any questions about these Terms, you can write to us at hello@osppy.com.",
      ],
    },
  ],
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isES = locale === "es";
  const content = isES ? ES : EN;

  return (
    <LegalDocument
      title={isES ? "Términos de Uso" : "Terms of Use"}
      updated={content.updated}
      intro={content.intro}
      sections={content.sections}
    />
  );
}
