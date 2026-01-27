import { Page } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { Role, User } from '../src/service/pizzaService';

async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = { 
    'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'a', roles: [{ role: Role.Diner }] },
    'a@jwt.com': { id: '4', name: 'Admin Tester', email: 'a@jwt.com', password: 'b', roles: [{ role: Role.Admin }] }
  };

  // Authorize login for the given user
  await page.route('*/**/api/auth', async (route) => {
    const req = route.request();
    const method = req.method();

    if (method === "PUT"){
      const loginReq = req.postDataJSON();
      const user = validUsers[loginReq.email];
      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
        return;
      }
      loggedInUser = validUsers[loginReq.email];
      const loginRes = {
        user: loggedInUser,
        token: 'abcdef',
      };
      expect(route.request().method()).toBe('PUT');
      await route.fulfill({ json: loginRes });
    } else if (method === "DELETE") {
      const logoutRes = {
        message: 'logout successful'
      };
      expect(method).toBe('DELETE');
      await route.fulfill({json: logoutRes});
    }

    
  });

  // Return the currently logged in user
  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
  });

  // A standard menu
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      {
        id: 1,
        title: 'Veggie',
        image: 'pizza1.png',
        price: 0.0038,
        description: 'A garden of delight',
      },
      {
        id: 2,
        title: 'Pepperoni',
        image: 'pizza2.png',
        price: 0.0042,
        description: 'Spicy treat',
      },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  // Standard franchises and stores
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    const franchiseRes = {
      franchises: [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ],
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  // Order a pizza.
  await page.route('*/**/api/order', async (route) => {
    const req = route.request();
    const method = req.method();

    if (method === "POST") {
      const orderReq = req.postDataJSON();
      const orderRes = {
        order: { ...orderReq, id: 23 },
        jwt: 'eyJpYXQ',
      };
      expect(route.request().method()).toBe('POST');
      await route.fulfill({ json: orderRes });
    } else if (method === "GET") {
    const getRes = {
      "dinerId": 2,
      "orders": [
          {
            "id": 1,
            "franchiseId": 1,
            "storeId": 1,
            "date": "2026-01-27T04:25:10.000Z",
            "items": [
              {
                  "id": 1,
                  "menuId": 2,
                  "description": "Pepperoni",
                  "price": 0.0042
              },
            ]
          }
      ],
      "page": 1
    }
    expect(method).toBe('GET');
    await route.fulfill({ json: getRes });
    }
  });

  await page.goto('/');
}

async function loginSteps(page: Page, email: string, password: string) {
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(email);
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
}

test('login', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('purchase with login', async ({ page }) => {
  await basicInit(page);

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await loginSteps(page, 'd@jwt.com', 'a');

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('view diner dashboard', async ({page}) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await loginSteps(page, 'd@jwt.com', 'a');
  await page.getByTestId("profile-icon").click();
  await expect(page.locator('tbody')).toContainText('0.004 ₿');
});

test('view admin dashboard', async ({page}) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await loginSteps(page, 'a@jwt.com', 'b');
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('table')).toContainText('LotaPizza');
  await page.getByRole('cell', { name: 'PizzaCorp' }).click();
  await expect(page.getByRole('table')).toContainText('PizzaCorp');
  await expect(page.getByRole('table')).toContainText('topSpot');
  await expect(page.getByRole('table')).toContainText('Lehi');
});

test('logout', async ({page}) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await loginSteps(page, 'd@jwt.com', 'a');
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});

test('view docs page', async ({page}) => {
    await page.goto('/docs');
    await expect(page.getByText('JWT Pizza API')).toBeVisible();
    await expect(page.getByRole('main')).toContainText('[POST] /api/auth');
});


test('visit \'About\' page', async ({page}) => {
  await page.goto('/');
  
  // Go to order page
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('The secret sauce');
});

test('visit \'History\' page', async ({page}) => {
  await page.goto('/');
  
  // Go to order page
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByRole('main')).toContainText('Mama Rucci, my my');
});