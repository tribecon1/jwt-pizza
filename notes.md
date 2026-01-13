# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |  home.jsx          |  none             |   none       |
| Register new user<br/>(t@jwt.com, pw: test)         |    register.jsx    |  POST /api/auth   |   `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`<br/>`INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)`           |
| Login new user<br/>(t@jwt.com, pw: test)            |       login.tsx             |   PUT /api/auth                |    `SELECT * FROM user WHERE email=?`<br/> `SELECT * FROM userRole WHERE userId=?`<br/> `INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token`          |
| Order pizza                                         |         menu.tsx, payment.tsx           |  GET /api/order/menu<br/>GET /api/franchise?page=0&limit=10&name=*<br/>GET /api/user/me<br/>POST /api/order                |   `SELECT * FROM menu`<br/>`SELECT id, name FROM franchise WHERE name LIKE ? LIMIT ${limit + 1} OFFSET ${offset}`<br/>(conditionally)`SELECT id, name FROM store WHERE franchiseId=?`<br/>(conditionally)`SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee'`<br/>(conditionally)`SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id`           |
| Verify pizza                                        |   delivery.tsx                 |     POST {pizzaFactoryUrl}/api/order/verify              |     none         |
| View profile page                                   |     dinerDashboard.tsx               |   GET /api/order                |    `SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT ${offset},${config.db.listPerPage}`<br/>`SELECT id, menuId, description, price FROM orderItem WHERE orderId=?`          |
| View franchise<br/>(as diner)                       |                    |                   |              |
| Logout                                              |                    |                   |              |
| View About page                                     |                    |                   |              |
| View History page                                   |                    |                   |              |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |                    |                   |              |
| View franchise<br/>(as franchisee)                  |                    |                   |              |
| Create a store                                      |                    |                   |              |
| Close a store                                       |                    |                   |              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |                    |                   |              |
| View Admin page                                     |                    |                   |              |
| Create a franchise for t@jwt.com                    |                    |                   |              |
| Close the franchise for t@jwt.com                   |                    |                   |              |
