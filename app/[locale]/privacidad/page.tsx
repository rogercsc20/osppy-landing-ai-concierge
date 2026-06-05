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
    title: isES ? "Aviso de Privacidad — Osppy" : "Privacy Policy — Osppy",
    description: isES
      ? "Aviso de Privacidad de Osppy conforme a la LFPDPPP."
      : "Osppy's Privacy Policy.",
  };
}

const ES: { updated: string; intro: string[]; sections: Section[] } = {
  updated: "Última actualización: 5 de junio de 2026",
  intro: [
    "En cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (la «LFPDPPP»), su Reglamento y los Lineamientos del Aviso de Privacidad, ponemos a tu disposición el presente Aviso de Privacidad.",
    "Te recomendamos leerlo en su totalidad antes de proporcionarnos cualquier dato personal o utilizar nuestros servicios.",
  ],
  sections: [
    {
      heading: "Identidad y domicilio del responsable",
      blocks: [
        "Osppy (en lo sucesivo, «Osppy», «nosotros» o el «Responsable»), operado por [RAZÓN SOCIAL], con domicilio en [DOMICILIO FISCAL COMPLETO], México, es responsable del tratamiento y protección de tus datos personales conforme al presente Aviso de Privacidad.",
        "Para cualquier asunto relacionado con tus datos personales puedes contactarnos en el correo electrónico hello@osppy.com.",
      ],
    },
    {
      heading: "Datos personales que recabamos",
      blocks: [
        "Para prestar nuestros servicios podemos recabar las siguientes categorías de datos personales:",
        {
          list: [
            "Datos de identificación y contacto: nombre, nombre del hotel o establecimiento, número de teléfono (incluido el número de WhatsApp Business), correo electrónico y puesto.",
            "Datos de facturación: razón social, RFC, domicilio fiscal y datos necesarios para emitir comprobantes fiscales y procesar pagos.",
            "Datos operativos de tu establecimiento: precios, horarios, políticas, disponibilidad y demás información que cargues para configurar el asistente.",
            "Datos de las conversaciones: mensajes intercambiados a través de WhatsApp entre tu establecimiento y tus huéspedes, gestionados por nuestro asistente.",
            "Datos de uso y técnicos: dirección IP, tipo de dispositivo y navegador, páginas visitadas y datos generados mediante cookies y tecnologías similares.",
          ],
        },
      ],
    },
    {
      heading: "Finalidades del tratamiento",
      blocks: [
        { sub: "Finalidades primarias (necesarias para el servicio)" },
        {
          list: [
            "Crear, configurar y administrar tu cuenta y la conexión con tu número de WhatsApp Business.",
            "Operar el asistente de inteligencia artificial para responder a tus huéspedes con la información de tu establecimiento.",
            "Escalar conversaciones a una persona cuando se detecte una situación sensible o así lo configures.",
            "Procesar pagos, emitir facturas y dar cumplimiento a obligaciones fiscales y contables.",
            "Brindar soporte técnico y atención al cliente.",
            "Cumplir con obligaciones legales y atender requerimientos de autoridades competentes.",
          ],
        },
        { sub: "Finalidades secundarias (no necesarias para el servicio)" },
        {
          list: [
            "Enviarte comunicaciones sobre novedades, mejoras del producto y contenido informativo.",
            "Realizar encuestas de satisfacción y estudios estadísticos para mejorar nuestros servicios.",
          ],
        },
        "Si no deseas que tus datos se traten para las finalidades secundarias, puedes manifestarlo enviando un correo a hello@osppy.com. Tu negativa no será motivo para negarte los servicios contratados.",
      ],
    },
    {
      heading: "Datos personales sensibles",
      blocks: [
        "Osppy no solicita ni requiere datos personales sensibles para la prestación de sus servicios. En caso de que llegaras a proporcionarlos de manera voluntaria a través de las conversaciones, te informamos que su tratamiento se limitará estrictamente a las finalidades aquí descritas y se sujetará a medidas de seguridad reforzadas.",
      ],
    },
    {
      heading: "Tratamiento de datos de tus huéspedes",
      blocks: [
        "Cuando utilizas Osppy para responder a tus huéspedes, tú actúas como responsable de los datos personales de dichos huéspedes y Osppy actúa como encargado, tratando esos datos únicamente conforme a tus instrucciones y para prestarte el servicio.",
        "Eres responsable de contar con un aviso de privacidad propio y de obtener el consentimiento que, en su caso, corresponda de tus huéspedes.",
      ],
    },
    {
      heading: "Transferencias y remisiones de datos",
      blocks: [
        "Para operar el servicio, tus datos pueden ser tratados por proveedores que actúan como encargados (por ejemplo, proveedores de mensajería como WhatsApp/Meta, servicios de cómputo en la nube, modelos de inteligencia artificial y procesadores de pagos), quienes están obligados a mantener la confidencialidad y seguridad de la información.",
        "No transferimos tus datos personales a terceros para finalidades distintas a las descritas, salvo en los casos previstos por el artículo 37 de la LFPDPPP o cuando contemos con tu consentimiento. Algunos de estos proveedores pueden encontrarse fuera de México; en tales casos, adoptamos medidas para que se otorgue un nivel de protección adecuado.",
      ],
    },
    {
      heading: "Uso de inteligencia artificial",
      blocks: [
        "Nuestro servicio utiliza modelos de inteligencia artificial para generar respuestas automáticas. Las respuestas se basan en la información que configuras y pueden contener imprecisiones. El sistema está diseñado para escalar a una persona en situaciones sensibles. Puedes revisar e intervenir en las conversaciones en todo momento.",
      ],
    },
    {
      heading: "Uso de cookies y tecnologías de rastreo",
      blocks: [
        "Nuestro sitio web utiliza cookies y tecnologías similares para su correcto funcionamiento, recordar tus preferencias (como el idioma) y obtener estadísticas de uso. Puedes deshabilitar las cookies desde la configuración de tu navegador, aunque algunas funciones podrían verse afectadas.",
      ],
    },
    {
      heading: "Medios para ejercer tus derechos ARCO",
      blocks: [
        "Tienes derecho a Acceder a tus datos personales, Rectificarlos cuando sean inexactos, Cancelarlos cuando consideres que no se requieren para las finalidades señaladas y Oponerte a su tratamiento (derechos «ARCO»).",
        "Para ejercerlos, envía una solicitud al correo hello@osppy.com indicando: (i) tu nombre y medio para recibir respuesta; (ii) los documentos que acrediten tu identidad o, en su caso, la representación legal; (iii) la descripción clara de los datos respecto de los que buscas ejercer algún derecho; y (iv) cualquier elemento que facilite la localización de los datos.",
        "Daremos respuesta a tu solicitud en un plazo máximo de 20 días hábiles y, de resultar procedente, la haremos efectiva dentro de los 15 días hábiles siguientes.",
      ],
    },
    {
      heading: "Revocación del consentimiento y limitación de uso",
      blocks: [
        "Puedes revocar el consentimiento que nos hayas otorgado para el tratamiento de tus datos, así como limitar su uso o divulgación, enviando tu solicitud a hello@osppy.com. Es posible que, por obligaciones legales, debamos seguir tratando ciertos datos por un tiempo determinado.",
      ],
    },
    {
      heading: "Conservación de los datos",
      blocks: [
        "Conservaremos tus datos personales durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales aplicables (por ejemplo, las de carácter fiscal). Concluidos dichos plazos, los datos serán cancelados conforme a la normativa vigente.",
      ],
    },
    {
      heading: "Medidas de seguridad",
      blocks: [
        "Implementamos medidas de seguridad administrativas, técnicas y físicas razonables para proteger tus datos personales contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizados.",
      ],
    },
    {
      heading: "Modificaciones al Aviso de Privacidad",
      blocks: [
        "Nos reservamos el derecho de actualizar el presente Aviso de Privacidad. Cualquier modificación se publicará en esta misma página, indicando la fecha de la última actualización. Te recomendamos revisarla periódicamente.",
      ],
    },
    {
      heading: "Autoridad",
      blocks: [
        "Si consideras que tu derecho a la protección de datos personales ha sido vulnerado, puedes acudir ante la autoridad competente en la materia para presentar la queja o denuncia que corresponda.",
      ],
    },
    {
      heading: "Aceptación del Aviso de Privacidad",
      blocks: [
        "Al proporcionarnos tus datos personales y/o utilizar nuestros servicios, manifiestas haber leído, entendido y aceptado los términos del presente Aviso de Privacidad.",
      ],
    },
  ],
};

const EN: { updated: string; intro: string[]; sections: Section[] } = {
  updated: "Last updated: June 5, 2026",
  intro: [
    "This Privacy Policy describes how Osppy collects, uses, and protects your personal data. For users in Mexico, it is issued in accordance with the Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP); the Spanish-language version of this notice is the legally operative one.",
    "Please read it in full before providing any personal data or using our services.",
  ],
  sections: [
    {
      heading: "Identity and address of the data controller",
      blocks: [
        "Osppy (“Osppy”, “we”, or the “Controller”), operated by [LEGAL ENTITY NAME], with address at [FULL REGISTERED ADDRESS], Mexico, is responsible for the processing and protection of your personal data under this Privacy Policy.",
        "For any matter related to your personal data, you can contact us at hello@osppy.com.",
      ],
    },
    {
      heading: "Personal data we collect",
      blocks: [
        "To provide our services we may collect the following categories of personal data:",
        {
          list: [
            "Identification and contact data: name, hotel or business name, phone number (including the WhatsApp Business number), email, and role.",
            "Billing data: legal name, tax ID (RFC), tax address, and data needed to issue invoices and process payments.",
            "Your establishment's operational data: pricing, schedules, policies, availability, and other information you load to configure the assistant.",
            "Conversation data: messages exchanged via WhatsApp between your establishment and your guests, handled by our assistant.",
            "Usage and technical data: IP address, device and browser type, pages visited, and data generated through cookies and similar technologies.",
          ],
        },
      ],
    },
    {
      heading: "Purposes of processing",
      blocks: [
        { sub: "Primary purposes (necessary for the service)" },
        {
          list: [
            "Create, configure, and manage your account and the connection to your WhatsApp Business number.",
            "Operate the AI assistant to answer your guests with your establishment's information.",
            "Escalate conversations to a human when a sensitive situation is detected or as you configure.",
            "Process payments, issue invoices, and comply with tax and accounting obligations.",
            "Provide technical support and customer service.",
            "Comply with legal obligations and respond to requests from competent authorities.",
          ],
        },
        { sub: "Secondary purposes (not necessary for the service)" },
        {
          list: [
            "Send you communications about news, product improvements, and informational content.",
            "Conduct satisfaction surveys and statistical studies to improve our services.",
          ],
        },
        "If you do not want your data processed for secondary purposes, you may tell us by writing to hello@osppy.com. Your refusal will not be grounds to deny you the contracted services.",
      ],
    },
    {
      heading: "Sensitive personal data",
      blocks: [
        "Osppy does not request or require sensitive personal data to provide its services. If you voluntarily provide such data through conversations, its processing will be strictly limited to the purposes described here and subject to enhanced security measures.",
      ],
    },
    {
      heading: "Processing of your guests' data",
      blocks: [
        "When you use Osppy to answer your guests, you act as the controller of those guests' personal data and Osppy acts as the processor, handling that data solely under your instructions and to provide the service.",
        "You are responsible for maintaining your own privacy notice and for obtaining any applicable consent from your guests.",
      ],
    },
    {
      heading: "Data transfers",
      blocks: [
        "To operate the service, your data may be processed by providers acting as processors (for example, messaging providers such as WhatsApp/Meta, cloud computing services, AI models, and payment processors), who are required to maintain the confidentiality and security of the information.",
        "We do not transfer your personal data to third parties for purposes other than those described, except in the cases provided by law or where we have your consent. Some of these providers may be located outside Mexico; in such cases, we adopt measures to ensure an adequate level of protection.",
      ],
    },
    {
      heading: "Use of artificial intelligence",
      blocks: [
        "Our service uses artificial intelligence models to generate automated responses. Responses are based on the information you configure and may contain inaccuracies. The system is designed to escalate to a human in sensitive situations. You can review and intervene in conversations at any time.",
      ],
    },
    {
      heading: "Cookies and tracking technologies",
      blocks: [
        "Our website uses cookies and similar technologies to function properly, remember your preferences (such as language), and obtain usage statistics. You can disable cookies in your browser settings, although some features may be affected.",
      ],
    },
    {
      heading: "Exercising your data rights (ARCO)",
      blocks: [
        "You have the right to Access your personal data, Rectify it when inaccurate, Cancel it when you believe it is not required for the stated purposes, and Object to its processing (“ARCO” rights).",
        "To exercise them, send a request to hello@osppy.com including: (i) your name and a means to receive a reply; (ii) documents proving your identity or legal representation; (iii) a clear description of the data concerned; and (iv) any element that helps locate the data.",
        "We will respond within a maximum of 20 business days and, if applicable, make it effective within the following 15 business days.",
      ],
    },
    {
      heading: "Withdrawal of consent and limitation of use",
      blocks: [
        "You may withdraw the consent you have given for the processing of your data, as well as limit its use or disclosure, by sending your request to hello@osppy.com. Due to legal obligations, we may need to continue processing certain data for a defined period.",
      ],
    },
    {
      heading: "Data retention",
      blocks: [
        "We will retain your personal data for as long as necessary to fulfill the purposes described and applicable legal obligations (for example, tax-related ones). Once those periods conclude, the data will be cancelled in accordance with applicable regulations.",
      ],
    },
    {
      heading: "Security measures",
      blocks: [
        "We implement reasonable administrative, technical, and physical security measures to protect your personal data against damage, loss, alteration, destruction, or unauthorized use, access, or processing.",
      ],
    },
    {
      heading: "Changes to this Privacy Policy",
      blocks: [
        "We reserve the right to update this Privacy Policy. Any change will be posted on this page, indicating the date of the last update. We recommend reviewing it periodically.",
      ],
    },
    {
      heading: "Authority",
      blocks: [
        "If you believe your right to the protection of personal data has been violated, you may turn to the competent authority on the matter to file the corresponding complaint.",
      ],
    },
    {
      heading: "Acceptance of this Privacy Policy",
      blocks: [
        "By providing your personal data and/or using our services, you acknowledge that you have read, understood, and accepted the terms of this Privacy Policy.",
      ],
    },
  ],
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isES = locale === "es";
  const content = isES ? ES : EN;

  return (
    <LegalDocument
      title={isES ? "Aviso de Privacidad" : "Privacy Policy"}
      updated={content.updated}
      intro={content.intro}
      sections={content.sections}
    />
  );
}
