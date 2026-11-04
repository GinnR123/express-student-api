# Student Directory Application

A student directory application built using React, Express, MongoDB Atlas, and JWT authentication.

The backend handles user registration, login, and protected API requests. The React frontend connects to the backend and allows users to register, log in, view the student list, and log out.

# Backend (Lesson 5)

The backend uses Express and MongoDB Atlas to manage student records and user authentication. JWT is used to protect routes that require a logged-in user.

## Prerequisites

- Node.js 18 or later
- MongoDB Atlas account
- The Lesson 5 backend project

## Backend Setup

Install the CORS package if it is not already installed:

```bash
npm install cors
```

In `server.js`, configure CORS to allow requests from the React frontend:

```js
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173" }));
```

The backend `.env` file should contain:

| Variable     | Purpose                                   |
| ------------ | ----------------------------------------- |
| `MONGO_URI`  | MongoDB Atlas connection string           |
| `JWT_SECRET` | Secret key used to sign and verify JWTs   |
| `PORT`       | Server port. Defaults to 3000 if not set. |

Start the backend:

```bash
node server.js
```

# Frontend (React + Vite)

The frontend connects to the Lesson 5 backend and provides an interface for user authentication and viewing student records.

Users can register, log in, view the student list (only when logged in), and log out.

## Frontend Setup

Open the frontend project folder in VS Code and install the required packages:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application at:

`http://localhost:5173`

## Environment Variables

No environment variables are required by default. The API URL is set to:

`http://localhost:3000`

To use a different API URL, create a `.env` file in the frontend project folder:

```env
VITE_API_URL=http://localhost:3000
```

## Application Routes

| Path        | Access                                     |
| ----------- | ------------------------------------------ |
| `/login`    | Public – anyone can access                 |
| `/register` | Public – anyone can access                 |
| `/students` | Protected – requires a valid token         |
| `/`         | Redirects based on the user's login status |

# Screenshots

Save the required screenshots in the `screenshots/` folder:

1. Login page – showing the login form.
2. Register page – showing the registration form.
3. Successful login – showing the Students page and student list.
4. Failed login – showing the login error message.
5. Protected route redirect – showing the redirect to `/login` when accessing `/students` while logged out.
6. Browser DevTools – showing the `/api/students` request with the `Authorization: Bearer <token>` header.

# Reflection Questions – Frontend Assignment

**1. Why do we store the token in localStorage? What is one security risk, and what is a more secure alternative?**

We use `localStorage` to keep the token even after refreshing or closing the browser, so the user does not have to log in again right away. However, one security risk is XSS (Cross-Site Scripting), where malicious JavaScript running on the page could access and steal the token. A more secure option is an `HttpOnly`, `Secure`, and `SameSite` cookie because JavaScript cannot directly access it, although this setup also requires CSRF protection and changes to the backend.

**2. What is the purpose of AuthContext? Why not just pass the token as a prop to each component?**

`AuthContext` keeps the authentication information, such as the user, token, login, logout, and authentication status, in one place. Without it, we would need to pass the token through multiple components just to reach the component that needs it, which is called prop drilling. Using context makes it easier for components like Login, Students, and ProtectedRoute to access the same authentication data and stay updated when it changes.

**3. What happens on the frontend when the JWT expires? Describe the user experience you would want to implement.**

When the JWT expires, the backend rejects the request and returns a 401 response. In this app, the Students page calls `logout()` to clear the token, and ProtectedRoute redirects the user to `/login`. For a better user experience, the app should display a message like "Your session has expired. Please log in again" and return the user to the page they were viewing after logging in.

**4. What is the difference between the backend's requireAuth middleware and the frontend's ProtectedRoute? Why do we need both?**

`requireAuth` works on the backend and checks whether the JWT is valid and has not expired before allowing access to protected data. On the other hand, `ProtectedRoute` works on the frontend and controls which pages the user can access based on their login status. However, frontend protection alone is not enough because users can bypass it using browser tools or by sending API requests directly. We need both so that ProtectedRoute handles page access while `requireAuth` protects the actual data on the server.

# Previous Lesson 5 – Authentication and Security Reflection

**1. Why is it dangerous to store passwords in plain text, and how does hashing prevent harm if the database is compromised?**

Storing passwords in plain text is dangerous because anyone who gets access to the database can see the users' actual passwords. If users use the same password on other websites, their other accounts could also be at risk. Hashing with `bcrypt` converts passwords into hashes, making it difficult for attackers to recover the original passwords. This helps protect users even if the database is compromised, although attackers may still try to guess weak passwords.

**2. Why does the login endpoint return the same error for "user not found" and "wrong password"?**

The login endpoint returns the same error message, such as "Invalid credentials," to prevent attackers from knowing whether an email address is registered in the system. If different messages were used, attackers could easily identify existing accounts. They could then target those accounts with phishing or password-guessing attacks. Using the same error message helps keep user information private and makes the login process more secure.

**3. What does the middleware do on every protected request, and why is it better than putting token-checking code inside every route handler?**

The authentication middleware checks if a request contains a valid JWT in the Authorization header using the Bearer token format. It verifies the token and rejects the request if the token is missing, invalid, or expired. If the token is valid, the request can continue to the route handler. Using middleware avoids repeating the same authentication code in every route, making the code cleaner, easier to maintain, and more consistent.

**4. What is one thing that could still go wrong in this system, and how would you address it in a real application?**

One possible problem is token theft, where an attacker gets another user's JWT and uses it to access protected routes. To reduce this risk, I would use HTTPS to protect data sent between the client and server. I would also keep the JWT secret strong and private and set an appropriate token expiration time. Finally, I would implement a secure way to renew or revoke tokens when needed to reduce the risk of unauthorized access.
