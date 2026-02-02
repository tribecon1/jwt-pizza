import { Page } from "@playwright/test";
import { Role, User } from "../src/service/pizzaService";
import { expect } from "playwright-test-coverage";

export async function basicInit(page: Page, initRoute: string = "/") {
  let loggedInUser: User | undefined;
  const userDatabase: Record<string, User> = {
    "d@jwt.com": {
      id: "3",
      name: "pizza diner",
      email: "d@jwt.com",
      password: "a",
      roles: [{ role: Role.Diner }],
    },
    "a@jwt.com": {
      id: "4",
      name: "Admin Tester",
      email: "a@jwt.com",
      password: "b",
      roles: [{ role: Role.Admin }],
    },
    "f@jwt.com": {
      id: "5",
      name: "Franchisee User",
      email: "f@jwt.com",
      password: "c",
      roles: [{ role: Role.Diner }, { objectId: "1", role: Role.Franchisee }],
    },
  };

  // Authorize login for the given user
  await page.route("*/**/api/auth", async (route) => {
    const req = route.request();
    const method = req.method();

    if (method === "PUT") {
      const loginReq = req.postDataJSON();
      const user = userDatabase[loginReq.email];
      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: "Unauthorized" } });
        return;
      }
      loggedInUser = userDatabase[loginReq.email];
      const loginRes = {
        user: loggedInUser,
        token: "abcdef",
      };
      expect(route.request().method()).toBe("PUT");
      await route.fulfill({ json: loginRes });
    } else if (method === "DELETE") {
      const logoutRes = {
        message: "logout successful",
      };
      expect(method).toBe("DELETE");
      await route.fulfill({ json: logoutRes });
    } else if (method === "POST") {
      const postReq = req.postDataJSON();
      loggedInUser = {
        id: "6",
        name: postReq.name,
        email: postReq.email,
        password: postReq.password,
        roles: [{ role: Role.Diner }]
      };

      userDatabase[loggedInUser.email!] = loggedInUser;

      const registerRes = {
        user: loggedInUser,
        token: "def456"
      };
      await route.fulfill({ json: registerRes });
    }
  });

  // Return the currently logged in user
  await page.route("*/**/api/user/me", async (route) => {
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: loggedInUser });
  });

  await page.route("*/**/api/user/*", async (route) => {
    const req = route.request();
    const method = req.method();

    if (method === "PUT"){
      const updateUserReq = req.postDataJSON();
      const oldEmail = loggedInUser!.email!;

      // Update the user object
      const updatedUser = { ...loggedInUser, ...updateUserReq };

      // If the request didn't include a password (undefined) 
      if (!updateUserReq.password) {
        updatedUser.password = loggedInUser!.password;
      }

      loggedInUser = updatedUser;

      if (oldEmail !== updatedUser.email) {
        delete userDatabase[oldEmail];
      }
      userDatabase[updatedUser.email] = updatedUser;
      await route.fulfill({ json: { user: loggedInUser, token: "def456" } });
    }
  });

  // A standard menu
  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight",
      },
      {
        id: 2,
        title: "Pepperoni",
        image: "pizza2.png",
        price: 0.0042,
        description: "Spicy treat",
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });

  await page.route(/\/api\/franchise\/\d+$/, async (route) => {
    const method = route.request().method();

    // Actual GET
    if (method === "GET") {
      const franchiseResponse = [
        {
          id: 1,
          name: "pizzaPocket",
          admins: [{ id: 5, name: "Franchisee User", email: "f@jwt.com" }],
          stores: [{ id: 1, name: "SLC", totalRevenue: 0 }],
        },
      ];

      await route.fulfill({
        status: 200,
        json: franchiseResponse,
      });
    }
  });

  await page.route(/\/api\/franchise\/\d+\/store$/, async (route) => {
    const method = route.request().method();

    // Actual GET
    if (method === "POST") {
      const createStoreRes = {
        id: 2,
        franchiseId: 1,
        name: "TempBro",
      };

      await route.fulfill({
        status: 200,
        json: createStoreRes,
      });
    }
  });

  // Standard franchises and stores
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    const franchiseRes = {
      franchises: [
        {
          id: 2,
          name: "LotaPizza",
          stores: [
            { id: 4, name: "Lehi" },
            { id: 5, name: "Springville" },
            { id: 6, name: "American Fork" },
          ],
        },
        { id: 3, name: "PizzaCorp", stores: [{ id: 7, name: "Spanish Fork" }] },
        { id: 4, name: "topSpot", stores: [] },
      ],
    };
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  // Order a pizza.
  await page.route("*/**/api/order", async (route) => {
    const req = route.request();
    const method = req.method();

    if (method === "POST") {
      const orderReq = req.postDataJSON();
      const orderRes = {
        order: { ...orderReq, id: 23 },
        jwt: "eyJpYXQ",
      };
      expect(route.request().method()).toBe("POST");
      await route.fulfill({ json: orderRes });
    } else if (method === "GET") {
      const getRes = {
        dinerId: 2,
        orders: [
          {
            id: 1,
            franchiseId: 1,
            storeId: 1,
            date: "2026-01-27T04:25:10.000Z",
            items: [
              {
                id: 1,
                menuId: 2,
                description: "Pepperoni",
                price: 0.0042,
              },
            ],
          },
        ],
        page: 1,
      };
      expect(method).toBe("GET");
      await route.fulfill({ json: getRes });
    }
  });

  await page.goto(initRoute);
}

export async function fillUserFields(page: Page, email: string, password: string){
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill(email);
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill(password);
}

export async function loginSteps(page: Page, email: string, password: string) {
  await fillUserFields(page, email, password);
  await page.getByRole("button", { name: "Login" }).click();
}
