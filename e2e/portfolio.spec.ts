import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

function visibleThemeToggle(page: Page) {
  return page.locator('button[aria-label^="Switch to"]:visible').first();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("theme toggle switches, persists, and survives reload", async ({
  page,
}) => {
  await page.evaluate(() => window.localStorage.setItem("theme", "light"));
  await page.reload();

  await expect(page.locator("html")).toHaveClass(/light/);
  const toggle = visibleThemeToggle(page);
  await expect(toggle).toBeEnabled();
  await expect(toggle).toHaveAttribute("aria-label", "Switch to dark mode");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");

  await toggle.click();

  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(visibleThemeToggle(page)).toHaveAttribute(
    "aria-label",
    "Switch to light mode",
  );
  await expect(visibleThemeToggle(page)).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.reload();

  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(visibleThemeToggle(page)).toHaveAttribute(
    "aria-label",
    "Switch to light mode",
  );
});

test("work pagination keeps focus and live announcements", async ({ page }) => {
  const list = page.locator("#work-project-list > a");
  const pager = page.getByRole("navigation", { name: "Work pagination" });

  await expect(list).toHaveCount(4);
  await expect(pager.getByText("Page 1 of 5")).toBeVisible();

  await pager.getByRole("button", { name: "Page 2" }).click();

  await expect(
    pager.getByRole("button", { name: "Page 2" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(pager.getByText("Page 2 of 5")).toBeVisible();
  await expect(list).toHaveCount(4);
  await expect(list.first()).toBeFocused();
});

test("floating back-to-top responds to scroll", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const button = page.getByRole("button", { name: "Back to top" });

  await expect(button).toHaveCount(0);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(button).toBeVisible();

  await button.click();

  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThan(5);
  await expect(button).toHaveCount(0);
});

test("social and contact links appear exactly once", async ({ page }, testInfo) => {
  await expect(page.locator('a[href*="github.com"]')).toHaveCount(1);
  await expect(page.locator('a[href*="linkedin.com"]')).toHaveCount(1);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);

  const footer = page.locator('footer[aria-labelledby="footer-heading"]');
  const socialLinks = footer
    .getByRole("navigation", { name: "Social links" })
    .getByRole("link");
  const legalLinks = footer
    .getByRole("navigation", { name: "Legal" })
    .getByRole("link");

  await expect(socialLinks).toHaveCount(2);
  await expect(legalLinks).toHaveCount(2);
  await expect(
    legalLinks.filter({ hasText: "Privacy Policy" }),
  ).toHaveAttribute("href", "/privacy");
  await expect(legalLinks.filter({ hasText: "Terms of Use" })).toHaveAttribute(
    "href",
    "/terms",
  );
  await expect(footer).not.toContainText("Built with Next.js");
  await expect(footer).not.toContainText("Available for Q4 2026");
  await expect(footer).not.toContainText("Johannesburg");
  await expect(footer).not.toContainText("SAST");

  if (!testInfo.project.name.startsWith("mobile")) {
    for (const link of await socialLinks.all()) {
      await link.hover();
      await expect(link).toHaveCSS("background-color", "rgb(35, 56, 232)");
      await expect(link).toHaveCSS("color", "rgb(243, 241, 234)");
    }
  }
});

test("legal pages carry policy content and footer links", async ({ page }) => {
  await page.goto("/privacy");

  await expect(page).toHaveURL(/\/privacy$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Privacy Policy" }),
  ).toBeVisible();
  await expect(page.getByText("Last updated 27 October 2026")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "What I collect" }),
  ).toBeVisible();

  const footer = page.locator('footer[aria-labelledby="footer-heading"]');
  await footer.getByRole("link", { name: "Terms of Use" }).click();

  await expect(page).toHaveURL(/\/terms$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Terms of Use" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Project inquiries" }),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "Privacy Policy" }),
  ).toHaveAttribute("href", "/privacy");
});

test("sitemap lists the legal pages", async ({ request }) => {
  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("/privacy");
  expect(body).toContain("/terms");
});

test("desktop sidebar uses icon navigation and a distinct studio card", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name.startsWith("mobile"),
    "The sidebar is desktop-only.",
  );

  const sidebar = page.locator("aside");
  await expect(sidebar).toBeVisible();

  const nav = sidebar.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link")).toHaveCount(4);

  for (const link of await nav.getByRole("link").all()) {
    await expect(link.locator("svg")).toHaveCount(1);
  }

  await expect(sidebar.getByText("Studio")).toBeVisible();
  await expect(sidebar.getByText("Available for Q4 2026")).toBeVisible();
  await expect(
    sidebar.locator('button[aria-label^="Switch to"]'),
  ).toHaveCount(1);
});

test("does not overflow horizontally at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
});

test("has no serious accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(
    page.getByRole("button", { name: "Back to top" }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );

  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});

test("legal pages have no serious accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const path of ["/privacy", "/terms"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    );

    expect(blocking, `${path}\n${JSON.stringify(blocking, null, 2)}`).toEqual(
      [],
    );
  }
});

test("contact form is labelled and validates before sending", async ({ page }) => {
  const form = page.locator("#contact-form");

  await expect(form).toBeVisible();
  await expect(form.getByLabel("Name", { exact: true })).toBeVisible();
  await expect(form.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(form.getByLabel("Company", { exact: false })).toBeVisible();
  await expect(form.getByLabel("Project type", { exact: true })).toBeVisible();
  await expect(form.getByLabel("Budget", { exact: true })).toBeVisible();
  await expect(form.getByLabel("Timeline", { exact: true })).toBeVisible();
  await expect(form.getByLabel("Project brief", { exact: true })).toBeVisible();

  let requests = 0;
  await page.route("**/api/contact", async (route) => {
    requests += 1;
    await route.abort();
  });

  await form.getByRole("button", { name: "Send project brief" }).click();

  await expect(form.getByRole("alert")).toHaveText(
    "Please check the highlighted fields.",
  );
  await expect(form.getByText("Tell me your name.")).toBeVisible();
  await expect(form.getByLabel("Name", { exact: true })).toBeFocused();
  expect(requests).toBe(0);

  await page.unroute("**/api/contact");
});

test("contact form sends a validated inquiry and confirms success", async ({
  page,
}) => {
  let submitted: Record<string, unknown> | null = null;

  await page.route("**/api/contact", async (route) => {
    submitted = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  const form = page.locator("#contact-form");

  await form.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
  await form.getByLabel("Email", { exact: true }).fill("ada@example.com");
  await form.getByLabel("Company", { exact: false }).fill("Fieldnote");
  await form.getByLabel("Project type", { exact: true }).selectOption("Web app");
  await form
    .getByLabel("Budget", { exact: true })
    .selectOption("R50k – R100k");
  await form.getByLabel("Timeline", { exact: true }).selectOption("2–4 weeks");
  await form
    .getByLabel("Project brief", { exact: true })
    .fill(
      "We need a focused client portal for a small team, with auth and a clean handover.",
    );

  await form.getByRole("button", { name: "Send project brief" }).click();

  await expect(
    page.getByRole("heading", { name: "Message sent.", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Thanks, Ada Lovelace.");
  await expect(page.getByRole("status")).toContainText("ada@example.com");
  expect(submitted).toMatchObject({
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "Fieldnote",
    projectType: "Web app",
    budget: "R50k – R100k",
    timeline: "2–4 weeks",
    "bot-field": "",
  });

  await page.getByRole("button", { name: "Send another message" }).click();
  await expect(page.locator("#contact-form")).toBeVisible();

  await page.unroute("**/api/contact");
});

test("contact API rejects invalid payloads", async ({ request }) => {
  const response = await request.post("/api/contact", {
    data: {
      name: "A",
      email: "nope",
      projectType: "",
      budget: "",
      timeline: "",
      message: "too short",
    },
  });

  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body.error).toBe("Please check the highlighted fields.");
  expect(body.fieldErrors).toMatchObject({
    name: "Tell me your name.",
    email: "Enter a valid email address.",
  });
});

test("contact API accepts same-origin requests before validation", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "A" }),
    });

    return {
      status: response.status,
      body: (await response.json()) as { error?: string },
    };
  });

  expect(result.status).toBe(422);
  expect(result.body.error).toBe("Please check the highlighted fields.");
});

test("contact API rejects oversized payloads", async ({ request }) => {
  const response = await request.post("/api/contact", {
    data: { message: "x".repeat(20_001) },
  });

  expect(response.status()).toBe(413);
  expect(await response.json()).toEqual({
    error: "That message is too large.",
  });
});

test("contact API silently accepts honeypot submissions", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    data: {
      name: "Spam Bot",
      email: "spam@example.com",
      projectType: "Web app",
      budget: "Not sure yet",
      timeline: "Flexible",
      message: "This submission fills the hidden field and should go nowhere.",
      "bot-field": "https://spam.example",
    },
  });

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ ok: true });
});

test("contact API rejects cross-origin browser requests", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    headers: { Origin: "https://evil.example" },
    data: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      projectType: "Web app",
      budget: "Not sure yet",
      timeline: "Flexible",
      message: "This request should be rejected before it can send an email.",
    },
  });

  expect(response.status()).toBe(403);
  expect(await response.json()).toEqual({
    error: "Requests must come from the portfolio site.",
  });
});
