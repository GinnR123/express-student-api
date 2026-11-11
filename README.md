# Student Directory Application

A student directory application built using React, Express, MongoDB Atlas, and JWT authentication.

The backend handles user registration, login, and protected API requests. The React frontend connects to the backend and allows users to register, log in, view the student list, and log out.

The backend also includes an authenticated image upload endpoint that stores files in Cloudinary (Lesson 7).

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

| Variable                | Purpose                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| `MONGO_URI`             | MongoDB Atlas connection string                                            |
| `JWT_SECRET`            | Secret key used to sign and verify JWTs                                    |
| `PORT`                  | Server port. Defaults to 3000 if not set.                                  |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (Lesson 7)                                           |
| `CLOUDINARY_API_KEY`    | Cloudinary API key (Lesson 7)                                              |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (Lesson 7). Keep it private and never commit `.env`. |

Start the backend:

```bash
node server.js
```

# Previous Lesson 5 – Authentication and Security Reflection

**1. Why is it dangerous to store passwords in plain text, and how does hashing prevent harm if the database is compromised?**

Storing passwords in plain text is dangerous because anyone who gets access to the database can see the users' actual passwords. If users use the same password on other websites, their other accounts could also be at risk. Hashing with `bcrypt` converts passwords into hashes, making it difficult for attackers to recover the original passwords. This helps protect users even if the database is compromised, although attackers may still try to guess weak passwords.

**2. Why does the login endpoint return the same error for "user not found" and "wrong password"?**

The login endpoint returns the same error message, such as "Invalid credentials," to prevent attackers from knowing whether an email address is registered in the system. If different messages were used, attackers could easily identify existing accounts. They could then target those accounts with phishing or password-guessing attacks. Using the same error message helps keep user information private and makes the login process more secure.

**3. What does the middleware do on every protected request, and why is it better than putting token-checking code inside every route handler?**

The authentication middleware checks if a request contains a valid JWT in the Authorization header using the Bearer token format. It verifies the token and rejects the request if the token is missing, invalid, or expired. If the token is valid, the request can continue to the route handler. Using middleware avoids repeating the same authentication code in every route, making the code cleaner, easier to maintain, and more consistent.

**4. What is one thing that could still go wrong in this system, and how would you address it in a real application?**

One possible problem is token theft, where an attacker gets another user's JWT and uses it to access protected routes. To reduce this risk, I would use HTTPS to protect data sent between the client and server. I would also keep the JWT secret strong and private and set an appropriate token expiration time. Finally, I would implement a secure way to renew or revoke tokens when needed to reduce the risk of unauthorized access.

# Frontend – React + Vite (Lesson 6)

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

# Screenshots – Frontend Assignment (Lesson 6)

Save the required screenshots in the `screenshots/` folder:

1. Login page – showing the login form.
2. Register page – showing the registration form.
3. Successful login – showing the Students page and student list.
4. Failed login – showing the login error message.
5. Protected route redirect – showing the redirect to `/login` when accessing `/students` while logged out.
6. Browser DevTools – showing the `/api/students` request with the `Authorization: Bearer <token>` header.

# Reflection Questions – Frontend Assignment (Lesson 6)

**1. Why do we store the token in localStorage? What is one security risk, and what is a more secure alternative?**

We use `localStorage` to keep the token even after refreshing or closing the browser, so the user does not have to log in again right away. However, one security risk is XSS (Cross-Site Scripting), where malicious JavaScript running on the page could access and steal the token. A more secure option is an `HttpOnly`, `Secure`, and `SameSite` cookie because JavaScript cannot directly access it, although this setup also requires CSRF protection and changes to the backend.

**2. What is the purpose of AuthContext? Why not just pass the token as a prop to each component?**

`AuthContext` keeps the authentication information, such as the user, token, login, logout, and authentication status, in one place. Without it, we would need to pass the token through multiple components just to reach the component that needs it, which is called prop drilling. Using context makes it easier for components like Login, Students, and ProtectedRoute to access the same authentication data and stay updated when it changes.

**3. What happens on the frontend when the JWT expires? Describe the user experience you would want to implement.**

When the JWT expires, the backend rejects the request and returns a 401 response. In this app, the Students page calls `logout()` to clear the token, and ProtectedRoute redirects the user to `/login`. For a better user experience, the app should display a message like "Your session has expired. Please log in again" and return the user to the page they were viewing after logging in.

**4. What is the difference between the backend's requireAuth middleware and the frontend's ProtectedRoute? Why do we need both?**

`requireAuth` works on the backend and checks whether the JWT is valid and has not expired before allowing access to protected data. On the other hand, `ProtectedRoute` works on the frontend and controls which pages the user can access based on their login status. However, frontend protection alone is not enough because users can bypass it using browser tools or by sending API requests directly. We need both so that ProtectedRoute handles page access while `requireAuth` protects the actual data on the server.

# File Uploads with Multer & Cloudinary (Lesson 7)

The backend accepts image uploads, sends them to Cloudinary, and returns the image URL. The upload route is protected by the same JWT middleware used in Lesson 5.

## Setup

Install the packages:

```bash
npm install multer cloudinary
```

Add the Cloudinary values from your dashboard to the backend `.env` file (see the table above).

## Files Added

| File                   | Purpose                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `config/cloudinary.js` | Configures the Cloudinary client from environment variables     |
| `middleware/upload.js` | Multer setup: memory storage, 5MB limit, image-only file filter |
| `routes/upload.js`     | `POST /api/upload` route that streams the file to Cloudinary    |

The route is registered in `server.js`:

```js
app.use("/api/upload", require("./routes/upload"));
```

An error-handling middleware at the end of `server.js` returns JSON errors for rejected uploads.

## Upload Endpoints

| Method   | Path                    | Description                                                   |
| -------- | ----------------------- | ------------------------------------------------------------- |
| `POST`   | `/api/upload`           | Upload one image (form field named `file`). Requires a token. |
| `DELETE` | `/api/upload/:publicId` | Stretch challenge: delete an image. Encode `/` as `%2F`.      |

Successful upload response:

```json
{
  "url": "https://res.cloudinary.com/.../lesson7_uploads/....png",
  "publicId": "lesson7_uploads/...."
}
```

## Tested Cases

| Test         | Result                               |
| ------------ | ------------------------------------ |
| Valid image  | `200` with `url` and `publicId`      |
| No token     | `401` "No token provided"            |
| Not an image | `500` "Only image files are allowed" |
| No file      | `400` "No file uploaded"             |

## Lesson 7 Screenshots

1. `screenshot1_upload_request.png` – Thunder Client request with the Authorization header and the returned `url`.
2. `screenshot2_cloudinary_folder.png` – Cloudinary Media Library showing the image in the `lesson7_uploads` folder.
3. `screenshot3_image_display.png` – The image loading in the browser from the returned URL.

## Reflection Question – Lesson 7

**Why do we use `memoryStorage` instead of `diskStorage` when uploading to Cloudinary?**

We use `memoryStorage` because the uploaded file only needs to exist long enough to be forwarded to Cloudinary. Multer keeps the file in RAM as a buffer, and we stream it directly to Cloudinary with `upload_stream`, so nothing is written to the server's disk. This avoids creating temporary files that would need to be cleaned up and works on hosting platforms with read-only or temporary file systems. The trade-off is memory usage, which is why the 5MB size limit is important.

# Lesson 8 – Data Modeling and Aggregation

This lesson extends the student directory API with courses and enrollments. Students and courses are connected through an `Enrollment` join collection. Each enrollment stores references to one student and one course, along with its status, grade, and enrollment date. A student's Cloudinary avatar URL and public ID are embedded in the Student document.

## Backend Files

| File | Purpose |
| --- | --- |
| `models/Course.js` | Course schema with a unique course code |
| `models/Enrollment.js` | Enrollment schema, references, and indexes |
| `routes/courses.js` | Authenticated course list and create endpoints |
| `routes/enrollments.js` | Enrollment endpoints; the GET route populates student and course fields |
| `routes/stats.js` | Course grade statistics using an aggregation pipeline |
| `scripts/seed.js` | Inserts or updates sample students, courses, and enrollments |

The Lesson 8 routes are registered in `server.js`:

```js
app.use("/api/courses", require("./routes/courses"));
app.use("/api/enrollments", require("./routes/enrollments"));
app.use("/api/stats", require("./routes/stats"));
```

## Run the Sample Data and API

Make sure the backend `.env` file has a working `MONGO_URI`, then run these commands from the backend project folder:

```bash
node scripts/seed.js
node server.js
```

The seed script uses upserts so rerunning it does not duplicate its sample student/course pairs. It writes to the configured MongoDB database. Keep `.env` private and do not commit it.

## Verify the Lesson 8 Endpoints

Both endpoints require a JWT. Log in using `POST /api/auth/login`, then send the token in this header:

```text
Authorization: Bearer <token>
```

| Method | Endpoint | Expected result |
| --- | --- | --- |
| `GET` | `/api/enrollments` | Enrollment records with populated `student` fields (`name`, `email`) and `course` fields (`title`, `code`, `credits`) |
| `GET` | `/api/stats/courses` | Up to five courses ranked by average grade, with `completedCount` and `highestGrade` |

With only the provided seed records, the averages are WEB101: 85, DB201: 84.3, and JS301: 90. Other existing enrollments for these courses can affect the results.

## Lesson 8 Screenshots

Save the two successful API response screenshots in `screenshots/`:

1. `lesson8_populate.png` – `GET /api/enrollments`, showing populated student and course details.
2. `lesson8_aggregation.png` – `GET /api/stats/courses`, showing the course statistics.

Do not include the bearer token in a screenshot. Submit the completed Data Model Design Document and the GitHub repository link as directed by the course instructions.
