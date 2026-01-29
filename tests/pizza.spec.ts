import { test, expect } from "playwright-test-coverage";
import { basicInit, fillUserFields, loginSteps } from "./test-helper-methods";

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
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByText("pizzaPocket")).toBeVisible();
  await expect(page.locator("tbody")).toContainText("SLC");
});

test("logout", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "d@jwt.com", "a");
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
});

test("register", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByRole('heading')).toContainText('Welcome to the party');
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('Fake Guy');
  await fillUserFields(page, "z@jwt.com", "z");
  await page.getByRole('button', { name: 'Register' }).click();
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
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main")).toContainText("The secret sauce");
});

test("visit 'History' page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("main")).toContainText("Mama Rucci, my my");
});

test("visit 'Not Found' custom page", async ({ page }) => {
  await page.goto("/fake-page");
  await expect(page.getByText('Oops')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('It looks like we have dropped a pizza on the floor. Please try another page.');
  await expect(page.getByRole('list')).toContainText('fake-page');
});

test("close store of franchise", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "f@jwt.com", "c");
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("heading")).toContainText("Sorry to see you go");
});

test("create store of franchise", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "f@jwt.com", "c");
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await page.getByRole("button", { name: "Create store" }).click();
  await expect(page.getByRole("heading")).toContainText("Create store");
  await expect(page.getByRole('textbox', { name: 'store name' })).toBeVisible();
  await page.getByRole("textbox", { name: "store name" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("TempStore");
  await page.getByRole("button", { name: "Create" }).click();
});
