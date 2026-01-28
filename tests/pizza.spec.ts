import { test, expect } from "playwright-test-coverage";
import { basicInit, loginSteps } from "./test-helper-methods";


test("login", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("a");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("link", { name: "KC" })).toBeVisible();
});

test("purchase with login", async ({ page }) => {
  await basicInit(page);

  // Go to order page
  await page.getByRole("button", { name: "Order now" }).click();

  // Create order
  await expect(page.locator("h2")).toContainText("Awesome is a click away");
  await page.getByRole("combobox").selectOption("4");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 2");
  await page.getByRole("button", { name: "Checkout" }).click();

  // Login
  await loginSteps(page, "d@jwt.com", "a");

  // Pay
  await expect(page.getByRole("main")).toContainText(
    "Send me those 2 pizzas right now!",
  );
  await expect(page.locator("tbody")).toContainText("Veggie");
  await expect(page.locator("tbody")).toContainText("Pepperoni");
  await expect(page.locator("tfoot")).toContainText("0.008 ₿");
  await page.getByRole("button", { name: "Pay now" }).click();

  // Check balance
  await expect(page.getByText("0.008")).toBeVisible();
});

test("view diner dashboard", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "d@jwt.com", "a");
  await page.getByTestId("profile-icon").click();
  await expect(page.locator("tbody")).toContainText("0.004 ₿");
});

test("view admin dashboard", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "a@jwt.com", "b");
  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByRole("table")).toContainText("LotaPizza");
  await page.getByRole("cell", { name: "PizzaCorp" }).click();
  await expect(page.getByRole("table")).toContainText("PizzaCorp");
  await expect(page.getByRole("table")).toContainText("topSpot");
  await expect(page.getByRole("table")).toContainText("Lehi");
});

test("view franchisee dashboard", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "f@jwt.com", "c");
  //
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
});

test("logout", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "d@jwt.com", "a");
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
});

test("view docs page", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "d@jwt.com", "a");
  await page.goto("/docs");
  await expect(page.getByText("JWT Pizza API")).toBeVisible();
});

test("visit 'About' page", async ({ page }) => {
  await page.goto("/");

  // Go to order page
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main")).toContainText("The secret sauce");
});

test("visit 'History' page", async ({ page }) => {
  await page.goto("/");

  // Go to order page
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("main")).toContainText("Mama Rucci, my my");
});
