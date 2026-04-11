# CS 329 Deliverable #12: Penetration Testing
Assigned Peers: Jordan Parr and Bentley Bigelow
04/11/26


## Bentley's Self-Inflicted Penetration Tests:

### 1. Login brute force / auth stress

| Item           | Result |
| -------------- | ------ |
| Date           | April 11, 2026 |
| Target         | https://pizza-service.bentleybigelow.click |
| Classification | Identification and Authentication Failures |
| Severity       | 1 |
| Description    | Repeated wrong-password logins were used to identify auth behavior and account discovery by using a real email and a fake email. With a real user email and wrong password, responses were `403` at steady, consistent intervals. With a non-existent email and wrong password, responses were `404` at the same steady pattern. Different status codes allow an attacker to tell registered emails from fake ones. |
| Images         | ![Brute force account detection](/public/BigelowSelfAttack1.jpg) |
| Corrections    | Return a single generic outcome of `403` with an “incorrect credentials” message whether the email exists or not so attackers can't differentiate between real and nonexistent accounts. I will also add rate limiting by IP (for this project as an in-memory data structure, but prod-level would be an Upstash Redis instance) so brute-force attempts cannot continue unbounded. |

---

### 2. next