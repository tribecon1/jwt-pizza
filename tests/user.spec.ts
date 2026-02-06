import { test, expect } from "playwright-test-coverage";
import { basicInit, editProfileField, loginSteps, registerRandomUser } from "./test-helper-methods";

// EDIT USER FEATURE
test("update user username", async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await registerRandomUser(page, email);
  const newUsername = "pizza dinerx";
  await editProfileField(
    page,
    email,
    async () => {
      page.getByRole("textbox").first().fill(newUsername);
    },
    async () => {
      expect(page.getByRole("main")).toContainText(newUsername);
    },
    email,
    "diner",
  );
});

test("update user email", async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await registerRandomUser(page, email);
  const newEmail = "newemail@jwt.com";
  await editProfileField(
    page,
    email,
    async () => {
      page.locator('input[type="email"]').fill(newEmail);
    },
    async () => {
      expect(page.getByRole("main")).toContainText(newEmail);
    },
    newEmail,
    "diner",
  );
});

test("update user password", async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await registerRandomUser(page, email);
  const newPassword = "fake_password";
  await editProfileField(
    page,
    email,
    async () => {
      page.locator("#password").fill(newPassword);
    },
    async () => {
      expect(page.getByTestId("profile-icon")).toBeVisible();
    },
    email,
    newPassword,
  );
});


// ADMIN LIST USERS FEATURE
test("display admin dashboard list of users", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "a@jwt.com", "b");
  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByRole('main')).toContainText('pizza diner');
  await expect(page.getByRole('main')).toContainText('Admin Tester');
  await expect(page.getByRole('main')).toContainText('Franchisee User');
  await expect(page.getByRole('row', { name: 'pizza diner d@jwt.com diner' }).getByRole('button')).toBeVisible();
});

test("filter admin dashboard list of users", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "a@jwt.com", "b");
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole('textbox', { name: 'Filter users' }).fill('pizza');
  await page.getByRole('cell', { name: 'pizza Submit' }).getByRole('button').click();
  await expect(page.getByRole('main')).toContainText('pizza diner');
  await expect(page.getByRole('main')).not.toContainText('Admin Tester');
  await expect(page.getByRole('main')).not.toContainText('Franchisee User');
});

// ADMIN DELETE USER FEATURE
test("delete user", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await loginSteps(page, "a@jwt.com", "b");
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole('row', { name: 'pizza diner d@jwt.com diner' }).getByRole('button').click();
  await expect(page.getByRole('heading', { name: 'Confirm Delete' })).toBeVisible();
  await page.locator('button').filter({ hasText: /^Delete$/ }).click();
  await expect(page.getByRole('main')).not.toContainText('pizza diner');
});