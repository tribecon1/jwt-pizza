import { test, expect } from "playwright-test-coverage";
import { editProfileField, registerRandomUser } from "./test-helper-methods";

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
test("display for admin user list of users table", async ({ page }) => {
  
});