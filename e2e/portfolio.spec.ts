import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { testimonials } from "../src/content/site";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const expectedSiteOrigin = configuredSiteUrl
  ? new URL(configuredSiteUrl).origin
  : "https://example.com";

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

test("dark-mode select options use readable card colors", async ({ page }) => {
  await page.evaluate(() => window.localStorage.setItem("theme", "dark"));
  await page.reload();

  const option = page.locator('select[name="projectType"] option').nth(1);
  await expect(option).toHaveCSS("background-color", "rgb(20, 27, 23)");
  await expect(option).toHaveCSS("color", "rgb(242, 238, 227)");
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
  await expect(page.locator('a[href*="linkedin.com"]')).toHaveCount(0);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(2);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);

  const footer = page.locator('footer[aria-labelledby="footer-heading"]');
  const connectLinks = footer
    .getByRole("navigation", { name: "Connect links" })
    .getByRole("link");
  const hoverBackground = testInfo.project.name.includes("dark")
    ? "rgb(63, 107, 88)"
    : "rgb(30, 58, 49)";
  const legalLinks = footer
    .getByRole("navigation", { name: "Legal" })
    .getByRole("link");

  await expect(connectLinks).toHaveCount(2);
  await expect(
    connectLinks.filter({ hasText: "GitHub" }),
  ).toHaveAttribute("href", "https://github.com/reeperx");
  await expect(
    connectLinks.filter({ hasText: "WhatsApp" }),
  ).toHaveAttribute("href", "https://wa.me/27717884230");
  await expect(
    page.locator('#contact a[href="https://wa.me/27717884230"]'),
  ).toContainText("071 788 4230");
  await expect(legalLinks).toHaveCount(2);
  await expect(footer.getByText(/The Original Brand/)).toBeVisible();
  await expect(
    legalLinks.filter({ hasText: "Privacy Policy" }),
  ).toHaveAttribute("href", "/privacy");
  await expect(legalLinks.filter({ hasText: "Terms of Use" })).toHaveAttribute(
    "href",
    "/terms",
  );
  await expect(footer).not.toContainText("Built with Next.js");
  await expect(footer).not.toContainText("Available for Q4 2026");
  await expect(footer).not.toContainText("Gauteng");
  await expect(footer).not.toContainText("SAST");

  if (!testInfo.project.name.startsWith("mobile")) {
    for (const link of await connectLinks.all()) {
      await link.hover();
      await expect(link).toHaveCSS("background-color", hoverBackground);
      await expect(link).toHaveCSS("color", "rgb(242, 238, 227)");
    }
  }
});

test("legal pages carry policy content and footer links", async ({ page }) => {
  await page.goto("/privacy");

  await expect(page).toHaveURL(/\/privacy$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Privacy Policy" }),
  ).toBeVisible();
  await expect(page.getByText("Last updated 29 October 2026")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "What I collect" }),
  ).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/opengraph-image$/,
  );

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

test("sitemap lists work, legal pages, and project images", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("/work");
  expect(body).toContain("/privacy");
  expect(body).toContain("/terms");
  expect(body).toContain("ngobz-mobile.jpg");
  expect(body.match(/<lastmod>2026-10-29<\/lastmod>/g)).toHaveLength(4);
});

test("robots and manifest expose crawl and install metadata", async ({
  request,
}) => {
  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.status()).toBe(200);
  const robots = await robotsResponse.text();
  expect(robots).toContain("Disallow: /api/");
  expect(robots).toContain(`Sitemap: ${expectedSiteOrigin}/sitemap.xml`);
  expect(robots).toContain(`Host: ${new URL(expectedSiteOrigin).host}`);

  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.status()).toBe(200);
  expect(manifestResponse.headers()["content-type"]).toContain(
    "application/manifest+json",
  );
  const manifest = (await manifestResponse.json()) as {
    name?: string;
    short_name?: string;
    start_url?: string;
    icons?: Array<{ src?: string }>;
  };
  expect(manifest.name).toContain("TOGB");
  expect(manifest.short_name).toBe("TOGB");
  expect(manifest.start_url).toBe("/");
  expect(manifest.icons?.[0]?.src).toBe("/icon.svg");
});

test("homepage exposes complete canonical and social metadata", async ({
  page,
  request,
}) => {
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).not.toBeNull();
  expect(new URL(canonical!).pathname).toBe("/");

  await expect(page).toHaveTitle(/Web Developer in Gauteng/i);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /websites and web apps for small teams in Gauteng/i,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    "TOGB",
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "en_ZA",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/opengraph-image/,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    /\/twitter-image/,
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );

  const ogImage = await request.get("/opengraph-image");
  expect(ogImage.status()).toBe(200);
  expect(ogImage.headers()["content-type"]).toContain("image/png");

  const twitterImage = await request.get("/twitter-image");
  expect(twitterImage.status()).toBe(200);
  expect(twitterImage.headers()["content-type"]).toContain("image/png");
});

test("hero artwork and anime portrait use the generated assets", async ({
  page,
}) => {
  const heroImage = page
    .locator('section[aria-labelledby="hero-title"] img')
    .first();
  await expect(heroImage).toHaveAttribute("src", /togb-hero/);
  await expect
    .poll(async () =>
      heroImage.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);

  await page.locator("#about").scrollIntoViewIfNeeded();
  const portrait = page.locator("#about img");
  await expect(portrait).toHaveAttribute("src", /togb-portrait-anime/);
  await expect
    .poll(async () =>
      portrait.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
});

test("structured data describes the studio and only approved reviews", async ({
  page,
}) => {
  const payloads = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => JSON.parse(node.textContent ?? "{}")),
    );
  const graph = payloads.flatMap((payload) => {
    if (Array.isArray(payload)) {
      return payload as Array<Record<string, unknown>>;
    }

    const entry = payload as {
      "@graph"?: Array<Record<string, unknown>>;
    };

    return entry["@graph"] ?? [entry];
  });
  const types = graph.map((entry) => entry["@type"]);

  expect(types).toEqual(
    expect.arrayContaining([
      "WebSite",
      "Person",
      "ProfessionalService",
      "WebPage",
      "FAQPage",
    ]),
  );

  const serialized = JSON.stringify(payloads);
  expect(serialized).not.toContain("Sample");

  const service = graph.find(
    (entry) => entry["@type"] === "ProfessionalService",
  ) as
    | {
        hasOfferCatalog?: { itemListElement?: unknown[] };
        slogan?: string;
        telephone?: string;
        logo?: string;
        contactPoint?: { telephone?: string };
        review?: Array<{
          reviewBody?: string;
          author?: { name?: string };
        }>;
        aggregateRating?: { reviewCount?: number };
      }
    | undefined;
  expect(service?.slogan).toBe("Websites built to earn their keep.");
  expect(service?.telephone).toBe("+27717884230");
  expect(service?.logo).toContain("/icon.svg");
  expect(service?.contactPoint?.telephone).toBe("+27717884230");
  expect(service?.hasOfferCatalog?.itemListElement?.length).toBeGreaterThan(0);

  const reviews = service?.review ?? [];
  expect(reviews).toHaveLength(testimonials.length);

  if (testimonials.length === 0) {
    expect(serialized).not.toContain('"Review"');
    expect(serialized).not.toContain('"AggregateRating"');
  } else {
    expect(reviews[0]?.reviewBody).toBe(testimonials[0].quote);
    expect(reviews[0]?.author?.name).toBe(testimonials[0].name);

    const ratedCount = testimonials.filter(
      (testimonial) => typeof testimonial.rating === "number",
    ).length;

    if (ratedCount > 0) {
      expect(service?.aggregateRating?.reviewCount).toBe(ratedCount);
    } else {
      expect(service?.aggregateRating).toBeUndefined();
    }
  }

  const faq = graph.find((entry) => entry["@type"] === "FAQPage") as
    | { mainEntity?: unknown[] }
    | undefined;
  expect(faq?.mainEntity?.length).toBeGreaterThan(0);
});

test("Vercel Web Analytics is wired into the app", async ({ page }) => {
  await expect
    .poll(() => page.evaluate(() => "va" in window))
    .toBe(true);

  await expect(
    page.locator('script[src="/_vercel/insights/script.js"]'),
  ).toHaveCount(1);
});

test("security headers are set on responses", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("all work page is a server-rendered, crawlable index", async ({
  page,
  request,
}) => {
  const htmlResponse = await request.get("/work");
  const html = await htmlResponse.text();
  expect(html).toContain("All work");
  expect(html).toContain("NGOBZ Mobile");

  await page.goto("/work");
  await expect(
    page.getByRole("heading", { level: 1, name: "All work" }),
  ).toBeVisible();

  const projects = page.locator("#work-project-list > a");
  await expect(projects).toHaveCount(19);
  await expect(
    page.getByRole("navigation", { name: "Work pagination" }),
  ).toHaveCount(0);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/work$/,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/opengraph-image$/,
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    /\/twitter-image$/,
  );

  const payloads = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => JSON.parse(node.textContent ?? "{}")),
    );
  const entries = payloads.flatMap(
    (payload: { "@type"?: string } | Array<{ "@type"?: string }>) =>
      Array.isArray(payload) ? payload : [payload],
  );
  expect(entries.some((entry) => entry["@type"] === "WebPage")).toBe(false);

  const collection = entries.find(
    (payload) => payload["@type"] === "CollectionPage",
  ) as
    | {
        mainEntity?: {
          "@type"?: string;
          numberOfItems?: number;
          itemListElement?: unknown[];
        };
      }
    | undefined;
  expect(collection?.mainEntity?.["@type"]).toBe("ItemList");
  expect(collection?.mainEntity?.numberOfItems).toBe(19);
  expect(collection?.mainEntity?.itemListElement).toHaveLength(19);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});

test("all work page does not overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/work");
  await expect(
    page.getByRole("heading", { level: 1, name: "All work" }),
  ).toBeVisible();

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
});

test("homepage links to the complete work index", async ({ page }) => {
  const viewAll = page.getByRole("link", {
    name: /View all 19 projects/,
  });
  await expect(viewAll).toHaveAttribute("href", "/work");

  await viewAll.click();
  await expect(page).toHaveURL(/\/work$/);
});

test("testimonials show only approved client content", async ({ page }) => {
  const testimonials = page.getByRole("region", { name: "What clients say" });

  if ((await testimonials.count()) === 0) {
    await expect(page.getByText("Sample", { exact: true })).toHaveCount(0);
    return;
  }

  await expect(testimonials).toBeVisible();
  await expect(testimonials.locator("blockquote")).not.toHaveCount(0);
  await expect(testimonials.getByText("Sample", { exact: true })).toHaveCount(
    0,
  );
});

test("FAQ answers common search questions", async ({ page }) => {
  const faq = page.getByRole("region", { name: "Questions, answered" });
  await expect(faq).toBeVisible();
  await expect(faq.locator("details")).toHaveCount(7);

  await faq.getByText("How much does a website cost?").click();
  await expect(faq.getByText(/fixed quote/i)).toBeVisible();
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
  await expect(
    sidebar.getByRole("link", { name: /TOGB/ }),
  ).toBeVisible();
  await expect(
    sidebar.getByText("Websites built to earn their keep."),
  ).toBeVisible();
  await expect(sidebar.getByText("The Original Brand")).toBeVisible();

  const nav = sidebar.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link")).toHaveCount(4);

  for (const link of await nav.getByRole("link").all()) {
    await expect(link.locator("svg")).toHaveCount(1);
  }

  await expect(sidebar.getByText("Studio")).toBeVisible();
  await expect(sidebar.getByText("Two Q4 slots open")).toBeVisible();
  await expect(sidebar).not.toContainText("Available for Q4 2026");
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
