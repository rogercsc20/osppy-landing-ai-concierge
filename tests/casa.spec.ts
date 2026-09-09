import { expect, test } from "@playwright/test";

// v6 smoke tests (2026-09-08; site prompt §11.3): few and real.

const ORDEN = ["#inicio", "#quienes", "#metodo", "#ayudamos", "#industrias", "#datos", "#real", "#hablemos"];
const BANCO = ["expertos", "lideres", "a la medida", "transformacion digital", "de vanguardia", "garantiza", "sin riesgo", "\u2014"];

const plano = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

test("la casa dice los tiempos en el orden aprobado", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("h1")).toHaveText("IA que ya trabaja.");
  const tops = await page.evaluate((ids) => ids.map((id) => document.querySelector(id)?.getBoundingClientRect().top ?? -1), ORDEN);
  for (let i = 1; i < tops.length; i++) expect(tops[i]).toBeGreaterThan(tops[i - 1]);
});

test("un solo llamado a la acción, dos veces", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByRole("link", { name: "Habla con un experto" })).toHaveCount(2);
});

test("las redirecciones siguen siendo contratos", async ({ request }) => {
  const raiz = await request.get("/", { maxRedirects: 0 });
  expect(raiz.status()).toBe(307);
  expect(raiz.headers()["location"]).toContain("/es");
  const aviso = await request.get("/aviso", { maxRedirects: 0 });
  expect(aviso.status()).toBe(307);
  expect(aviso.headers()["location"]).toContain("/privacy");
  const login = await request.get("/login", { maxRedirects: 0 });
  expect(login.headers()["location"]).toContain("app.osppy.com");
});

test("nada del banco en el HTML renderizado, en los dos idiomas", async ({ request }) => {
  for (const ruta of ["/es", "/en", "/es/datos"]) {
    const html = plano(await (await request.get(ruta)).text());
    for (const t of BANCO) expect(html, `${ruta} contiene ${t}`).not.toContain(plano(t));
  }
});

test("el cambio de idioma y el idioma del documento", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveText("AI that already works.");
  await page.getByRole("link", { name: "Leer este sitio en español" }).click();
  await expect(page).toHaveURL(/\/es$/);
});

test("reducción de movimiento: sin desplazamiento suave", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/es");
  const sb = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(sb).toBe("auto");
  await ctx.close();
});

test("el modo oscuro es una opción y se recuerda", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Cambiar al modo oscuro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("una tarjeta de industria abre su página con el ratón, y arrastrar el carrusel no navega", async ({ page }) => {
  await page.goto("/es");
  await page.locator("#industrias").scrollIntoViewIfNeeded();
  const pista = page.locator("#industrias ul");
  // arrastrar mueve la pista y NO navega
  const caja = await pista.boundingBox();
  await page.mouse.move(caja!.x + caja!.width * 0.6, caja!.y + caja!.height / 2);
  await page.mouse.down();
  await page.mouse.move(caja!.x + caja!.width * 0.2, caja!.y + caja!.height / 2, { steps: 12 });
  await page.mouse.up();
  expect(await pista.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  await expect(page).toHaveURL(/\/es$/);
  // un clic sin arrastre sí abre la página de la industria (con el ratón, no solo con el dedo)
  await pista.evaluate((el) => el.scrollTo({ left: 0, behavior: "instant" }));
  await page.locator("#industrias a", { hasText: "Ver tendencias" }).first().click();
  await expect(page).toHaveURL(/\/es\/industrias\/manufactura$/);
  await expect(page.locator("h1")).toContainText("Cómo ayudamos a la manufactura");
});
