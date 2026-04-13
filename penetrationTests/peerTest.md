# CS 329 Deliverable #12: Penetration Testing
Assigned Peers: Jordan Parr and Bentley Bigelow

04/11/26

## Jordan's Self-Inflicted Penetration Tests:




## Bentley's Self-Inflicted Penetration Tests:

### 1. Login brute force / auth stress

| Item           | Result |
| -------------- | ------ |
| Date           | April 11, 2026 |
| Target         | https://pizza-service.bentleybigelow.click |
| Classification | Identification and Authentication Failures |
| Severity       | 1 |
| Description    | Repeated wrong-password logins were used to identify auth behavior and account discovery by using a real email and a fake email. With a real user email and wrong password, responses were `403` at steady, consistent intervals. With a non-existent email and wrong password, responses were `404` at the same steady pattern. Different status codes allow an attacker to tell registered emails from fake ones. |
| Images         | ![Brute force account detection](/public/BigelowSelfAttack1.png) |
| Corrections    | Return a single generic outcome of `403` with an “incorrect credentials” message whether the email exists or not so attackers can't differentiate between real and nonexistent accounts. I will also add rate limiting by IP (for this project as an in-memory data structure, but prod-level would be an Upstash Redis instance) so brute-force attempts cannot continue unbounded. |

---

### 2. Injection probes on list `name` query parameters

| Item           | Result |
| -------------- | ------ |
| Date           | April 11, 2026 |
| Target         | https://pizza-service.bentleybigelow.click |
| Classification | Injection |
| Severity       | 0 |
| Description    | Crafted SQL-style strings were sent in the `name` parameter on `GET /api/user` with unique characters and boolean fragments to see if the input is concatenated into queries or commands, causing errors, extra rows, etc., both without an auth token and with. Every attempt returned only `{"message":"unauthorized"}` with no database errors or unexpected rows. |
| Images         | ![Injection probe results](/public/BigelowSelfAttack2.png) |
| Corrections    | None needed, inputs are parameterized before use! |

---

### 3. Broken access control (admin lists and cross-user delete)

| Item           | Result |
| -------------- | ------ |
| Date           | April 11, 2026 |
| Target         | https://pizza-service.bentleybigelow.click |
| Classification | Broken Access Control |
| Severity       | 0 |
| Description    | Tried to see if a non-admin user could perform admin-related actions. `GET /api/user?page=0&limit=10&name=*` with no `Authorization` header returned `401` with `{"message":"unauthorized"}`. The same listing request with a valid auth token returned `403` and the same JSON body. `DELETE /api/user/4` with that auth token also returned `403` and `{"message":"unauthorized"}`. No admin listing or cross-user delete went through. |
| Images         | ![Broken access control probe](/public/BigelowSelfAttack3.png) |
| Corrections    | None needed, non-admins are prevented from performing admin functions! |

---

### 4. JWT tampering / privilege probe

| Item           | Result |
| -------------- | ------ |
| Date           | April 11, 2026 |
| Target         | https://pizza-service.bentleybigelow.click |
| Classification | Cryptographic Failures |
| Severity       | 0 |
| Description    | Decoded a diner/non-admin JWT, changed `roles` in the payload to `[{"role":"admin"}]`, re-encoded the header and payload, and reused the original signature so the MAC no longer matches the modified body (a forged token). Sent it as `Authorization: Bearer` on `GET /api/user?page=0&limit=10&name=*` and `DELETE /api/user/4`. The APIs returned `401` with `{"message":"unauthorized"}`showing the server did not trust the elevated `roles` claim, validated in the admin dashboard. The attack failed to turn a non-admin JWT into an admin-capable session. |
| Images         | ![JWT tampering probe](/public/BigelowSelfAttack4.png) |
| Corrections    | None needed, tampered tokens are rejected and privileges cannot be escalated by editing the payload alone. |

---

### 5. Diner deletes a franchise

| Item           | Result |
| -------------- | ------ |
| Date           | April 11, 2026 |
| Target         | https://pizza-service.bentleybigelow.click |
| Classification | Broken Access Control |
| Severity       | 3 |
| Description    | Diner/non-admin/non-franchisee was still able to delete any franchise by id (either found in a network response or guessed). Using the diner's auth token and calling `DELETE $BASE/api/franchise/<targetId>`, the service answered `200` with `{"message":"franchise deleted"}`, so the franchise (and related stores/roles per the app’s cascade logic) actually went away, representing a loss of data in the available locations, revenue, etc. |
| Images         | ![Diner franchise delete](/public/BigelowSelfAttack5.png) |
| Corrections    | Right before `deleteFranchise` hits the database, enforce the same checks as other sensitive routes: require `Role.Admin` or require that the authenticated user’s id shows up in that franchise’s admins list (franchise owner path). |

---



## Jordan's Penetration Tests on Bentley's JWT Pizza:



## Bentley's Penetration Tests on Jordan's JWT Pizza:

### 1. Broken access control: horizontal privilege escalation

| Item           | Result |
| -------------- | ------ |
| Date           | April 13, 2026 |
| Target         | https://pizza-service.pizzafrodobaggins.click |
| Classification | Broken Access Control |
| Severity       | 1 |
| Description    | I authenticated as UserB (`userb@jwt.com`) and validated the token against `GET /api/user/me` (`200`, id `11`). I then authenticated as UserA (`usera@jwt.com`) and validated `GET /api/user/me` (`200`, id `10`). With UserA's JWT, I attempted a horizontal privilege escalation by calling `PUT /api/user/11` and submitting UserB profile values to overwrite another user's account (`{\"name\":\"pwned-by-userA\",\"email\":\"userb@jwt.com\",\"password\":\"b\"}`). The server correctly denied the change with `403` and `{\"message\":\"unauthorized\"}`, so cross-user account takeover was not possible in this test. |
| Images         | ![Attempt at horizontal action](/public/BigelowExtAttack1.png) |
| Corrections    | Authorization checks are correctly blocking cross-user updates, just remove stack traces from the error |

---

### 2. Diner deletes a franchise

| Item           | Result |
| -------------- | ------ |
| Date           | April 13, 2026 |
| Target         | https://pizza-service.pizzafrodobaggins.click |
| Classification | Broken Access Control |
| Severity       | 3 |
| Description    | Same vulnerability as my self pen test #5: a plain diner was able to delete a franchise by id. I logged in as UserA (`usera@jwt.com`) with `PUT /api/auth`, grabbed the JWT, then called `DELETE $BASE/api/franchise/1` with `Authorization: Bearer $A_TOKEN`. The service returned `200` with `{"message":"franchise deleted"}`, so a non-admin, non-franchisee user could remove a franchise (and related stores/roles per the app’s cascade logic), i.e. vertical privilege abuse and data loss. |
| Images         | ![Diner franchise delete on Jordan](/public/BigelowExtAttack2.png) |
| Corrections    | Right before `deleteFranchise` hits the database, enforce the same checks as other sensitive routes to require `Role.Admin` or require that the authenticated user’s id appears in that franchise’s admins list (franchise owner path). |

---

### 3. Injection probe: database / query manipulation (SQL-style payloads)

| Item           | Result |
| -------------- | ------ |
| Date           | April 13, 2026 |
| Target         | https://pizza-service.pizzafrodobaggins.click |
| Classification | Injection |
| Severity       | 0 |
| Description    | I probed login and franchise search with SQL-looking strings to see if input was concatenated into queries or could drop tables. On `PUT /api/auth`, I sent `{\"email\":\"' OR 1=1 --\",\"password\":\"x\"}` and a long stylized unicode email; both returned `404` with `{\"message\":\"unauthorized\"}`. On `GET /api/franchise` with `name` set to `\"; DROP TABLE user; --` (via `--data-urlencode`), the response was `200` with `{\"franchises\":[],\"more\":false}`—no `500`, no SQL error text, and the app still worked afterward, so the `user` table was not dropped. |
| Images         | ![Injection attempt](/public/BigelowExtAttack3.png) |
| Corrections    | None needed for the attempted endpoints/DB queries! |

---

### 4. Stored XSS attempt on profile name

| Item           | Result |
| -------------- | ------ |
| Date           | April 13, 2026 |
| Target         | https://pizza-service.pizzafrodobaggins.click |
| Classification | Injection |
| Severity       | 0 |
| Description    | I logged in as UserA (`usera@jwt.com`), then `PUT /api/user/10` with `{\"name\":\"<img src=x onerror=alert(1)>\",\"email\":\"usera@jwt.com\",\"password\":\"a\"}` and my bearer token. The API returned `200` and echoed the name as a literal string in JSON. On the frontend profile page, the name showed as plain text (`<img src=x onerror=alert(1)>`) and no browser alert fired—so the text was not executed as HTML/JS in the browser when viewing the user. |
| Images         | ![Stored XSS probe on profile](/public/BigelowExtAttack4.png) |
| Corrections    | None needed, just always ensure that they are cast to explicit strings. |

---

### 5. JWT tampering / privilege probe

| Item           | Result |
| -------------- | ------ |
| Date           | April 13, 2026 |
| Target         | https://pizza-service.pizzafrodobaggins.click |
| Classification | Cryptographic Failures |
| Severity       | 0 |
| Description    | Same test pattern as my self pen test #4: I logged in as UserA (`usera@jwt.com`) and decoded the JWT payload, then changed `roles` from diner to `[{\"role\":\"admin\"}]`, re-encoded header/payload, and reused the original signature to create a forged/tampered token. I sent that token to an admin-only listing route (`GET /api/user?page=0&limit=10&name=*`). The service returned `401` with `{\"message\":\"unauthorized\"}`, so the server did not trust the edited payload and the privilege escalation attempt failed. |
| Images         | ![JWT tampering probe on Jordan](/public/BigelowExtAttack5.png) |
| Corrections    | None needed, tampered JWTs are rejected and users are unable to escalate themselves to higher roles/priveleges. |

---

## Summary of Learnings:

