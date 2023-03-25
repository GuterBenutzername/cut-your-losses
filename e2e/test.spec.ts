import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "New Course" }).click();
  await page.getByLabel("Course Name").fill("Test 1");
  await page.getByLabel("Course Name").press("Enter");
  await page.getByRole("button", { name: "+" }).click();
  await page.getByLabel("Name").fill("Test Assignment A");
  await page.getByLabel("Name").press("Tab");
  await page.getByLabel("Grade").fill("100");
  await page.getByLabel("Grade").press("Tab");
  await page.getByLabel("Weight").fill("0.25");
  await page.getByRole("button", { name: "+" }).click();
  await page.locator("#assignment-name-0").fill("Test Assignment B");
  await page.locator("#assignment-name-0").press("Tab");
  await page.locator("#assignment-grade-0").fill("100");
  await page.locator("#assignment-grade-0").press("Tab");
  await page.locator("#assignment-weight-0").fill("0.25");
  await expect(page.getByText("Current Average:100.00")).toBeVisible();
  await expect(page.getByText("Test 1")).toBeVisible();
});
