/* eslint-disable max-statements */
import { test, expect } from "@playwright/test";

test("check that all basic functions are working", async ({ page }) => {
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

test("ensure deletion works as expected", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "New Course" }).click();
  await page.getByLabel("Course Name").fill("Test A");
  await page.getByLabel("Course Name").press("Enter");
  await page.getByRole("button", { name: "New Course" }).click();
  await page.getByLabel("Course Name").fill("Test B");
  await page.getByLabel("Course Name").press("Enter");
  await expect(page.getByRole("button", { name: /test b/iu })).toBeVisible();
  await expect(page.getByRole("button", { name: /test a/iu })).toBeVisible();
  await page.getByRole("button", { name: "delete" }).click();
  await expect(
    page.getByRole("button", { name: /test b/iu })
  ).not.toBeVisible();
  await expect(page.getByRole("button", { name: /test a/iu })).toBeVisible();
  await page.getByRole("button", { name: "delete" }).click();
  await expect(
    page.getByRole("button", { name: /test b/iu })
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: /test a/iu })
  ).not.toBeVisible();
});

test("ensure undo and redo works as expected", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "New Course" }).click();
  await page.getByLabel("Course Name").fill("Test A");
  await page.getByLabel("Course Name").press("Enter");
  await page.getByRole("button", { name: "New Course" }).click();
  await page.getByLabel("Course Name").fill("Should not be visible after undo");
  await page.getByLabel("Course Name").press("Enter");
  await expect(
    page.getByRole("button", { name: ">Should not be visible after undo" })
  ).toBeVisible();
  await page.getByRole("button", { name: "undo", exact: true }).click();
  await expect(
    page.getByRole("button", { name: ">Should not be visible after undo" })
  ).not.toBeVisible();
  await page.getByRole("button", { name: "redo", exact: true }).click();
  await expect(
    page.getByRole("button", { name: ">Should not be visible after undo" })
  ).toBeVisible();
  await page.getByRole("button", { name: "undo", exact: true }).click();
  await page.getByRole("button", { name: "+" }).click();
  await page.getByLabel("Name").fill("Test");
  await page.getByLabel("Name").press("Tab");
  await page.getByLabel("Grade").fill("100");
  await page.getByLabel("Grade").press("Tab");
  await page.getByLabel("Weight").fill("0.25");
  await page.getByRole("checkbox", { name: "future" }).check();
  await expect(page.getByLabel("Name")).toHaveValue("Test");
  await expect(page.getByLabel("Grade")).toHaveValue("100");
  await expect(page.getByLabel("Weight")).toHaveValue("0.25");
  await expect(page.getByLabel("Future")).toBeChecked();
  await page.getByRole("button", { name: "undo" }).click();
  await page.getByRole("button", { name: "undo" }).click();
  await page.getByRole("button", { name: "undo" }).click();
  await page.getByRole("button", { name: "undo" }).click();
  await expect(page.getByLabel("Name")).toHaveValue("");
  await expect(page.getByLabel("Grade")).toHaveValue("0");
  await expect(page.getByLabel("Weight")).toHaveValue("0");
  await expect(page.getByLabel("Future")).not.toBeChecked();
  await page.getByRole("button", { name: "redo" }).click();
  await page.getByRole("button", { name: "redo" }).click();
  await page.getByRole("button", { name: "redo" }).click();
  await page.getByRole("button", { name: "redo" }).click();
  await expect(page.getByLabel("Name")).toHaveValue("Test");
  await expect(page.getByLabel("Grade")).toHaveValue("100");
  await expect(page.getByLabel("Weight")).toHaveValue("0.25");
  await expect(page.getByLabel("Future")).toBeChecked();
  await page.getByRole("button", { name: "undo" }).click({
    clickCount: 6,
  });
  await expect(
    page.getByRole("button", { name: /test a/iu })
  ).not.toBeVisible();
});

test("ensure error shows up when there are no courses", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByText(/You don't have any courses!/u)).toBeVisible();
  await page.getByRole("button", { name: "New Course" }).click();
  await page.getByLabel("Course Name").fill("Test A");
  await page.getByLabel("Course Name").press("Enter");
  await expect(
    page.getByText(/You don't have any courses!/u)
  ).not.toBeVisible();
  await page.getByRole("button", { name: "New Course" }).click();
  await page.getByLabel("Course Name").fill("Test B");
  await page.getByLabel("Course Name").press("Enter");
  await expect(
    page.getByText(/You don't have any courses!/u)
  ).not.toBeVisible();
  await page.getByRole("button", { name: "delete" }).click({ clickCount: 2 });
  await expect(page.getByText(/You don't have any courses!/u)).toBeVisible();
});
