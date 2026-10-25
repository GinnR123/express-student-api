# Authentication and Security Reflection

## 1. Why is it dangerous to store passwords in plain text, and how does hashing prevent harm if the database is compromised?

Storing passwords in plain text is dangerous because anyone who gets access to the database can see the users' actual passwords. If users use the same password on other websites, their other accounts could also be at risk. Hashing with `bcrypt` converts passwords into hashes, making it difficult for attackers to recover the original passwords. This helps protect users even if the database is compromised, although attackers may still try to guess weak passwords.

## 2. Why does the login endpoint return the same error for "user not found" and "wrong password"?

The login endpoint returns the same error message, such as "Invalid credentials," to prevent attackers from knowing whether an email address is registered in the system. If different messages were used, attackers could easily identify existing accounts. They could then target those accounts with phishing or password-guessing attacks. Using the same error message helps keep user information private and makes the login process more secure.

## 3. What does the middleware do on every protected request, and why is it better than putting token-checking code inside every route handler?

The authentication middleware checks if a request contains a valid JWT in the Authorization header using the Bearer token format. It verifies the token and rejects the request if the token is missing, invalid, or expired. If the token is valid, the request can continue to the route handler. Using middleware avoids repeating the same authentication code in every route, making the code cleaner, easier to maintain, and more consistent.

## 4. What is one thing that could still go wrong in this system, and how would you address it in a real application?

One possible problem is token theft, where an attacker gets another user's JWT and uses it to access protected routes. To reduce this risk, I would use HTTPS to protect data sent between the client and server. I would also keep the JWT secret strong and private and set an appropriate token expiration time. Finally, I would implement a secure way to renew or revoke tokens when needed to reduce the risk of unauthorized access.
