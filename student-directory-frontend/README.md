# Student Directory Frontend

React (Vite) frontend for the Lesson 5 Express + MongoDB Atlas + JWT backend.
Users can register, log in, view the student list (logged-in only), and log out.

## Prerequisites

- Node.js 18+
- The Lesson 5 backend running on `http://localhost:3000` and connected to MongoDB Atlas

## Setup

### 1. Backend (Lesson 5 project)

```bash
npm install cors
```

In `server.js`:

```js
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173" }));
```

The backend `.env` needs:

| Variable     | Purpose                              |
| ------------ | ------------------------------------ |
| `MONGO_URI`  | MongoDB Atlas connection string      |
| `JWT_SECRET` | Secret used to sign and verify JWTs  |
| `PORT`       | Optional, defaults to 3000           |

Start it:

```bash
node server.js
```

### 2. Frontend (this project)

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Environment variables: none are required. The API URL defaults to
`http://localhost:3000`. To change it, create a `.env` file with:

```
VITE_API_URL=http://localhost:3000
```

## Routes

| Path        | Access                       |
| ----------- | ---------------------------- |
| `/login`    | Public                       |
| `/register` | Public                       |
| `/students` | Protected (requires a token) |
| `/`         | Redirects based on auth      |

## Reflection Questions

**1. Why do we store the token in localStorage? What is one security risk, and what is a more secure alternative?**

localStorage keeps the token after the page is refreshed or the browser is closed, so the user stays logged in, and it is simple to read back when attaching the `Authorization` header. The main risk is XSS: any malicious script that runs on the page can read localStorage and steal the token. A more secure alternative is to store the JWT in an `HttpOnly`, `Secure`, `SameSite` cookie, which JavaScript cannot read, though that approach needs CSRF protection and backend changes.

**2. What is the purpose of AuthContext? Why not pass the token as a prop to each component?**

AuthContext holds the auth state (user, token, login, logout, isAuthenticated) in one place and makes it available to any component through `useAuth()`. Passing the token as a prop would mean threading it through every component between the root and the component that needs it (prop drilling), which is verbose and error-prone. With context, components such as Login, Students, and ProtectedRoute read the same state and stay in sync when it changes.

**3. What happens on the frontend when the JWT expires? What user experience would you want?**

In this app the token is valid for 1 hour. When the API returns 401 for an expired token, the Students page calls `logout()`, which clears the token, and ProtectedRoute redirects to `/login`. On page load the app also checks the token's expiry and discards it if it has expired. A better experience would show a message like "Your session expired, please log in again", and send the user back to the page they were on after they log in.

**4. What is the difference between the backend's requireAuth middleware and the frontend's ProtectedRoute? Why do we need both?**

`requireAuth` runs on the server and verifies the JWT signature and expiry before returning protected data, so it is the real security boundary. `ProtectedRoute` only decides which page the browser shows, to give users a good experience, and anyone can bypass client code with DevTools or by calling the API directly. We need both: ProtectedRoute for navigation and UX, and requireAuth so that data is never exposed to someone without a valid token.
