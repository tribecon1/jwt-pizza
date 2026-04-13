# CS 329 Deliverable #12: Penetration Testing
Assigned Peers: Jordan Parr and Bentley Bigelow

04/11/26

## Jordan's Self-Inflicted Penetration Tests:

### 1. Login Enumeration Probe

| Item           | Result                                                                                                                                                                                                                                                                                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 13, 2026                                                                                                                                                                                                                                                                                                                                                       |
| Target         | pizza.pizzafrodobaggins.click                                                                                                                                                                                                                                                                                                                                        |
| Classification | Identification and Authentication Failures                                                                                                                                                                                                                                                                                                                           |
| Severity       | 0                                                                                                                                                                                                                                                                                                                                                                    |
| Description    | Used Burp Suite Intruder to test multiple email values against the authentication endpoint using the same incorrect password. Tested values included valid-format and fake accounts. All requests returned HTTP 404 with identical response lengths and similar timings, indicating no obvious user enumeration through these response differences during this test. |
| Images         | ![Attack 1](../attack1.png)                                                                                                                                                                                                                                                                                                                                          |
| Corrections    | None required based on this test. Continue using consistent responses for authentication failures and consider rate limiting repeated login attempts.                                                                                                                                                                                                                |

---

### 2. Input Validation / Injection Probe

| Item           | Result                                                                                                                                                                                                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 13, 2026                                                                                                                                                                                                                                                                                                                                                        |
| Target         | pizza.pizzafrodobaggins.click                                                                                                                                                                                                                                                                                                                                         |
| Classification | Injection                                                                                                                                                                                                                                                                                                                                                             |
| Severity       | 0                                                                                                                                                                                                                                                                                                                                                                     |
| Description    | Used Burp Suite Intruder to send malformed and suspicious values in the email field of the authentication request, including invalid formats, oversized input, script tags, and SQL-style strings. All requests returned HTTP 404 with identical response lengths and no visible errors, indicating the application handled these probes consistently during testing. |
| Images         | ![Attack 2](../attack2.png)                                                                                                                                                                                                                                                                                                                                           |
| Corrections    | None required based on this test. Continue validating inputs server-side and returning generic error responses.                                                                                                                                                                                                                                                       |

---

### 3. Password Mutation Probe

| Item           | Result                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Date           | April 13, 2026                                                                                                                                                                                                                                                                                                                                                                                               |
| Target         | pizza.pizzafrodobaggins.click                                                                                                                                                                                                                                                                                                                                                                                |
| Classification | Input Validation                                                                                                                                                                                                                                                                                                                                                                                             |
| Severity       | 0                                                                                                                                                                                                                                                                                                                                                                                                            |
| Description    | Used Burp Suite Intruder to modify the password field with unexpected values including empty input, null, objects, arrays, numeric values, oversized strings, script payloads, and SQL-style strings. The valid baseline request returned HTTP 200, while malformed variants consistently returned HTTP 404 with uniform response sizes, indicating unexpected password inputs were rejected during testing. |
| Images         | ![Attack 3](../attack3.png)                                                                                                                                                                                                                                                                                                                                                                                  |
| Corrections    | None required based on this test. Continue strict server-side validation and consistent error handling.                                                                                                                                                                                                                                                                                                      |

---

### 4. Unauthorized Access Probe

| Item           | Result                                                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 13, 2026                                                                                                                                                                                                        |
| Target         | pizza.pizzafrodobaggins.click                                                                                                                                                                                         |
| Classification | Broken Access Control                                                                                                                                                                                                 |
| Severity       | 0                                                                                                                                                                                                                     |
| Description    | Used Burp Suite Intruder to request a protected API endpoint without valid authentication. All requests returned HTTP 401 with identical response lengths, indicating unauthorized access was blocked during testing. |
| Images         | ![Attack 4](../attack4.png)                                                                                                                                                                                           |
| Corrections    | None required based on this test. Continue enforcing authentication checks on protected routes.                                                                                                                       |

---

### 5. Error Handling and Malformed Authentication Payload Probe

| Item           | Result                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Date           | April 13, 2026                                                                                                                                                                                                                                                                                                                                                                                                           |
| Target         | pizza.pizzafrodobaggins.click                                                                                                                                                                                                                                                                                                                                                                                            |
| Classification | Security Misconfiguration                                                                                                                                                                                                                                                                                                                                                                                                |
| Severity       | 0                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Description    | Used Burp Suite Intruder to submit malformed values in the authentication request, including broken characters, partial JSON fragments, null values, script payloads, and oversized strings. The valid baseline request returned HTTP 200, while malformed values consistently returned HTTP 404 with uniform response lengths. No stack traces, internal paths, or sensitive debug details were exposed during testing. |
| Images         | ![Attack 5](../attack5.png)                                                                                                                                                                                                                                                                                                                                                                                              |
| Corrections    | None required based on this test. Continue returning generic errors and suppressing internal exception details.                                                                                                                                                                                                                                                                                                          |

---



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

### 1. Login Enumeration Probe

| Item           | Result                                                                                                                                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 13, 2026                                                                                                                                                                                                                                                                                                      |
| Target         | pizza.bentleybigelow.click                                                                                                                                                                                                                                                                                          |
| Classification | Identification and Authentication Failures                                                                                                                                                                                                                                                                          |
| Severity       | 0                                                                                                                                                                                                                                                                                                                   |
| Description    | Used Burp Suite Intruder to test multiple account values against the authentication endpoint using the same incorrect password. All tested values returned HTTP 403 with identical response lengths and similar response times, indicating no obvious user enumeration through response differences during testing. |
| Images         | ![Peer Attack 1](../peerattack1.png)                                                                                                                                                                                                                                                                                |
| Corrections    | None required based on this test. Continue using consistent authentication failure responses and consider rate limiting repeated login attempts.                                                                                                                                                                    |

---

### 2. Input Validation and Injection Probe

| Item           | Result                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 13, 2026                                                                                                                                                                                                                                                                                                                                                                  |
| Target         | pizza.bentleybigelow.click                                                                                                                                                                                                                                                                                                                                                      |
| Classification | Injection                                                                                                                                                                                                                                                                                                                                                                       |
| Severity       | 0                                                                                                                                                                                                                                                                                                                                                                               |
| Description    | Used Burp Suite Intruder to submit malformed and suspicious values in the email field of the authentication request, including invalid formats, script-style input, SQL-style strings, and oversized values. All requests returned HTTP 403 with identical response lengths and no visible errors, indicating the application handled these probes consistently during testing. |
| Images         | ![Peer Attack 2](../peerattack2.png)                                                                                                                                                                                                                                                                                                                                            |
| Corrections    | None required based on this test. Continue validating inputs server-side and returning generic authentication errors.                                                                                                                                                                                                                                                           |

---

### 3. Password Mutation Probe

| Item           | Result                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 13, 2026                                                                                                                                                                                                                                                                                                                                                                                                   |
| Target         | pizza.bentleybigelow.click                                                                                                                                                                                                                                                                                                                                                                                       |
| Classification | Input Validation                                                                                                                                                                                                                                                                                                                                                                                                 |
| Severity       | 0                                                                                                                                                                                                                                                                                                                                                                                                                |
| Description    | Used Burp Suite Intruder to modify the password field with unexpected values including empty input, null, objects, arrays, numeric values, script-style input, oversized strings, and SQL-style strings. The valid baseline credential returned HTTP 200, while malformed values consistently returned HTTP 403 with uniform response sizes, indicating unexpected password inputs were rejected during testing. |
| Images         | ![Peer Attack 3](../peerattack3.png)                                                                                                                                                                                                                                                                                                                                                                             |
| Corrections    | None required based on this test. Continue strict validation and generic authentication responses.                                                                                                                                                                                                                                                                                                               |

---

### 4. Unauthorized Access Probe

| Item           | Result                                                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 13, 2026                                                                                                                                                                                                        |
| Target         | pizza.bentleybigelow.click                                                                                                                                                                                            |
| Classification | Broken Access Control                                                                                                                                                                                                 |
| Severity       | 0                                                                                                                                                                                                                     |
| Description    | Used Burp Suite Intruder to request a protected API endpoint without valid authentication. All requests returned HTTP 401 with identical response lengths, indicating unauthorized access was blocked during testing. |
| Images         | ![Peer Attack 4](../peerattack4.png)                                                                                                                                                                                  |
| Corrections    | None required based on this test. Continue enforcing authentication checks on protected routes.                                                                                                                       |

---

### 5. Error Handling Probe

| Item           | Result                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Date           | April 13, 2026                                                                                                                                                                                                                                                                                                                                                                                         |
| Target         | https://pizza-service.bentleybigelow.click                                                                                                                                                                                                                                                                                                                                                             |
| Classification | Security Misconfiguration                                                                                                                                                                                                                                                                                                                                                                              |
| Severity       | 0                                                                                                                                                                                                                                                                                                                                                                                                      |
| Description    | Used Burp Suite Intruder to submit malformed values in the authentication request, including broken characters, partial JSON fragments, null values, and script-style input. The valid baseline request returned HTTP 200, while malformed values consistently returned HTTP 403 with uniform response sizes. No stack traces, internal paths, or sensitive debug details were exposed during testing. |
| Images         | ![Peer Attack 5](../peerattack5.png)                                                                                                                                                                                                                                                                                                                                                                   |
| Corrections    | None required based on this test. Continue returning generic errors and suppressing internal exception details.                                                                                                                                                                                                                                                                                        |

---


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

* Consistent authentication responses reduce account enumeration risk.
* Strong authorization checks are critical for destructive actions.
* Generic error handling helps prevent information leakage.
* Input validation reduces injection and malformed request risks.
* JWT signatures must always be validated server-side.
* Don't assume that a security pattern applied to one section of code/routes is applied everywhere (franchise routes missing auth protection)
* SQL injection is an easy thing to prepare against and a horrible thing if not done
* It is impressive the free tools that exist to perform pen testing against your own application and others to ensure it's robust