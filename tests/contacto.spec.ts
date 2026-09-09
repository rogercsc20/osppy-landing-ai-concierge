import { expect, test } from "@playwright/test";

// The contact route and its form (2026-09-08, HQA-D175/D176). Few and real, like casa.spec.ts.

const BANCO = ["expertos", "lideres", "a la medida", "transformacion digital", "de vanguardia", "garantiza", "sin riesgo", "—"];
const plano = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** A complete, valid body. `abierto` is old enough to clear the time threshold. */
const completo = () => ({
  nombre: "Ana Ruiz",
  correo: "ana@fabrica.mx",
  telefono: "+52 33 1234 5678",
  empresa: "Fábrica del Bajío",
  puesto: "Dirección de operaciones",
  pais: "México",
  ciudad: "León",
  mensaje: "Queremos ordenar la información de planta.",
  aviso: true,
  correos: false,
  sitio: "",
  abierto: Date.now() - 60_000,
});

test("la ruta existe en los dos idiomas y la cruzada no", async ({ request }) => {
  for (const r of ["/es/contacto", "/en/contact", "/es/privacidad", "/en/privacy"]) {
    expect((await request.get(r)).status(), r).toBe(200);
  }
  for (const r of ["/en/contacto", "/es/contact", "/en/privacidad", "/es/privacy"]) {
    expect((await request.get(r)).status(), r).toBe(404);
  }
});

test("los llamados a la acción llevan a la ruta, y la dirección escrita sigue siendo un correo", async ({ page }) => {
  await page.goto("/es");
  const cta = page.getByRole("link", { name: "Habla con un experto" });
  await expect(cta).toHaveCount(2);
  for (const h of await cta.evaluateAll((els) => els.map((e) => e.getAttribute("href")))) expect(h).toBe("/es/contacto");
  await expect(page.locator('footer a[href="/es/contacto"]')).toHaveCount(1);
  await expect(page.locator('footer a[href="mailto:hello@osppy.com"]')).toHaveCount(1);

  await page.goto("/es/datos");
  await expect(page.getByRole("link", { name: "Habla con un experto" })).toHaveAttribute("href", "/es/contacto");
  await page.goto("/es/industrias/manufactura");
  await expect(page.getByRole("link", { name: "Habla con un experto" })).toHaveAttribute("href", "/es/contacto");
});

test("un envío incompleto no manda nada y lo anuncia", async ({ page }) => {
  let intentos = 0;
  await page.route("**/api/contacto", (r) => {
    intentos++;
    return r.abort();
  });
  await page.goto("/es/contacto");
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.locator('[role="status"]')).toHaveText("Revisa los campos marcados.");
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(7);
  await expect(page.locator('[name="nombre"]')).toBeFocused();
  await expect(page.locator("#error-nombre")).toHaveText("Escribe tu nombre.");
  expect(intentos, "no debe salir ninguna petición").toBe(0);
});

test("la casilla del aviso es obligatoria", async ({ page }) => {
  let intentos = 0;
  await page.route("**/api/contacto", (r) => {
    intentos++;
    return r.abort();
  });
  await page.goto("/es/contacto");
  for (const [n, v] of [
    ["nombre", "Ana Ruiz"],
    ["correo", "ana@fabrica.mx"],
    ["telefono", "+52 33 1234 5678"],
    ["empresa", "Fábrica del Bajío"],
    ["puesto", "Dirección de operaciones"],
    ["ciudad", "León"],
  ]) {
    await page.fill(`[name="${n}"]`, v);
  }
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.locator("#error-aviso")).toHaveText("Necesitamos tu aceptación para poder contestarte.");
  await expect(page.locator('[name="aviso"]')).toBeFocused();
  expect(intentos, "no debe salir ninguna petición").toBe(0);

  // marcada, la petición sí sale
  await page.check('[name="aviso"]');
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect.poll(() => intentos).toBe(1);
});

test("la casilla enlaza el aviso, y el aviso dice de quién es el sitio sin marcadores", async ({ page }) => {
  await page.goto("/es/contacto");
  const enlace = page.getByRole("link", { name: "aviso de privacidad" });
  await expect(enlace).toHaveAttribute("href", "/es/privacidad");
  await enlace.click();
  await expect(page.locator("h1")).toHaveText("Aviso de privacidad");
  const html = await page.content();
  expect(html, "sin marcadores en el aviso").not.toContain("[RAZÓN SOCIAL]");
  expect(html).not.toContain("[DOMICILIO]");
  await expect(page.getByText("Osppy es un nombre comercial.").first()).toBeVisible();
});

test("el servidor no cree lo que le manda el navegador", async ({ request }) => {
  // la trampa: 200 y ningún correo, sin decirle al robot qué lo delató
  const trampa = await request.post("/api/contacto", { data: { ...completo(), sitio: "http://spam" } });
  expect(trampa.status()).toBe(200);

  // el umbral de tiempo
  const rapido = await request.post("/api/contacto", { data: { ...completo(), abierto: Date.now() } });
  expect(rapido.status()).toBe(429);

  // faltan campos, o el correo no es correo, o el teléfono no lo es
  for (const parche of [{ nombre: "" }, { correo: "ana@sindominio" }, { telefono: "123" }, { aviso: false }, { aviso: undefined }]) {
    const r = await request.post("/api/contacto", { data: { ...completo(), ...parche } });
    expect(r.status(), JSON.stringify(parche)).toBe(400);
  }

  // completo y válido: pasa la validación. 200 cuando existe RESEND_API_KEY,
  // 503 cuando todavía no, que es lo que dice el aviso y lo que ve la máquina de pruebas.
  const bueno = await request.post("/api/contacto", { data: completo() });
  expect([200, 503]).toContain(bueno.status());
});

test("nada del banco en el HTML de las cuatro rutas nuevas", async ({ request }) => {
  for (const ruta of ["/es/contacto", "/en/contact", "/es/privacidad", "/en/privacy"]) {
    const html = plano(await (await request.get(ruta)).text());
    for (const t of BANCO) expect(html, `${ruta} contiene ${t}`).not.toContain(plano(t));
  }
});
