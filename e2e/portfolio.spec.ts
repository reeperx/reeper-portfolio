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
  const footerLinks = footer.getByRole("link");
  await expect(footerLinks).toHaveCount(2);
  await expect(footer.locator("nav")).toHaveCount(0);
  await expect(footer).not.toContainText("Available for Q4 2026");
  await expect(footer).not.toContainText("Johannesburg");
  await expect(footer).not.toContainText("SAST");

  if (!testInfo.project.name.startsWith("mobile")) {
    for (const link of await footerLinks.all()) {
      await link.hover();
      await expect(link).toHaveCSS("background-color", "rgb(35, 56, 232)");
      await expect(link).toHaveCSS("color", "rgb(243, 241, 234)");
    }
  }
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
