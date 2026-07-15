# 📚 Library Management API

A Library Management API built with **Node.js** and **Express.js**. All data is stored
in local, in-memory JavaScript arrays — no database is used. Data resets whenever the
server restarts.

## Tech Stack

- Node.js
- Express.js
- No database (MongoDB, MySQL, PostgreSQL, Firebase are all intentionally absent)

## Project Structure

```
library-api/
├── server.js                     # Entry point — starts the HTTP server
├── package.json
├── src/
│   ├── app.js                    # Express app setup, route mounting, middleware
│   ├── data/
│   │   └── store.js              # In-memory arrays: books, members, borrowRecords
│   ├── controllers/
│   │   ├── bookController.js     # Add / list books
│   │   ├── memberController.js   # Register / list members
│   │   └── borrowController.js   # Borrow / return / list borrow records
│   ├── routes/
│   │   ├── bookRoutes.js
│   │   ├── memberRoutes.js
│   │   └── borrowRoutes.js
│   ├── middleware/
│   │   └── errorHandlers.js      # 404 handler + global error handler
│   └── utils/
│       └── validate.js           # Shared validation helpers
```

## Setup Instructions

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the server**

   ```bash
   npm start
   ```

   Or, for auto-restart on file changes (Node 18.11+):

   ```bash
   npm run dev
   ```

3. The API will be running at:

   ```
   http://localhost:3000
   ```

   You can change the port with the `PORT` environment variable:

   ```bash
   PORT=4000 npm start
   ```

4. Visiting `GET /` returns a list of all available endpoints — useful as a quick
   health check.

## API Documentation

All endpoints are prefixed with `/api/library`. All responses are JSON.

---

### 1. Add a New Book

`POST /api/library/books`

**Request body**

| Field        | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| title        | String | ✅       | Name of the book          |
| author       | String | ✅       | Author's name             |
| category     | String | ✅       | Book category             |
| totalCopies  | Number | ✅       | Total number of copies    |

**Example request**

```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "category": "Self Help",
  "totalCopies": 5
}
```

**Success response — `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Atomic Habits",
    "author": "James Clear",
    "category": "Self Help",
    "totalCopies": 5,
    "availableCopies": 5
  }
}
```

**Errors**
- `400` — missing required field(s), or `totalCopies` is not a non-negative integer.

---

### 2. Register a New Member

`POST /api/library/members`

**Request body**

| Field  | Type   | Required | Description   |
|--------|--------|----------|---------------|
| name   | String | ✅       | Member name   |
| email  | String | ✅       | Member email  |
| phone  | String | ✅       | Phone number  |

**Example request**

```json
{
  "name": "John",
  "email": "john@gmail.com",
  "phone": "9876543210"
}
```

**Success response — `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@gmail.com",
    "phone": "9876543210"
  }
}
```

**Errors**
- `400` — missing required field(s), or invalid email format.

---

### 3. Borrow a Book

`POST /api/library/borrow/:bookId`

**URL parameter**

| Parameter | Description            |
|-----------|-------------------------|
| bookId    | ID of the book to borrow |

**Request body**

| Field       | Type   | Required | Description            |
|-------------|--------|----------|-------------------------|
| memberId    | Number | ✅       | Member borrowing the book |
| borrowDate  | String | ✅       | Borrow date             |
| returnDate  | String | ✅       | Expected return date    |

**Example request**

```json
{
  "memberId": 1,
  "borrowDate": "2026-07-05",
  "returnDate": "2026-07-12"
}
```

**Success response — `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookId": 1,
    "memberId": 1,
    "borrowDate": "2026-07-05",
    "returnDate": "2026-07-12",
    "status": "borrowed"
  }
}
```

**Errors**
- `400` — invalid `bookId`/`memberId`, or missing required field(s).
- `404` — book not found, or member not found.
- `409` — no copies available for this book.

---

### 4. Return a Book

`PUT /api/library/return/:borrowId`

**URL parameter**

| Parameter | Description       |
|-----------|--------------------|
| borrowId  | Borrow record ID   |

No request body required.

**Success response — `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookId": 1,
    "memberId": 1,
    "borrowDate": "2026-07-05",
    "returnDate": "2026-07-12",
    "status": "returned"
  }
}
```

**Errors**
- `400` — invalid `borrowId`.
- `404` — borrow record not found.
- `409` — book has already been returned.

---

### 5. Get All Books

`GET /api/library/books`

**Success response — `200 OK`**

```json
[
  {
    "id": 1,
    "title": "Atomic Habits",
    "author": "James Clear",
    "category": "Self Help",
    "totalCopies": 5,
    "availableCopies": 4
  }
]
```

---

### 6. Get All Borrowed Books

`GET /api/library/borrowed`

**Success response — `200 OK`**

```json
[
  {
    "borrowId": 1,
    "bookTitle": "Atomic Habits",
    "memberName": "John",
    "borrowDate": "2026-07-05",
    "returnDate": "2026-07-12",
    "returnStatus": "borrowed"
  }
]
```

---

### 7. Get All Members

`GET /api/library/members`

**Success response — `200 OK`**

```json
[
  {
    "id": 1,
    "name": "John",
    "email": "john@gmail.com",
    "phone": "9876543210"
  }
]
```

---

## Validation & Error Handling Summary

| Scenario                     | Status Code |
|-------------------------------|--------------|
| Missing required fields       | 400          |
| Invalid ID (non-numeric/param) | 400         |
| Book not found                | 404          |
| Member not found              | 404          |
| Borrow record not found       | 404          |
| No copies available           | 409          |
| Book already returned         | 409          |
| Unknown route                 | 404          |
| Unexpected server error       | 500          |

## Testing with Postman

1. Import the base URL `http://localhost:3000` into Postman (or create a new
   collection pointing at it).
2. Set `Content-Type: application/json` on all `POST`/`PUT` requests with a body.
3. Suggested test flow:
   1. `POST /api/library/books` — add a book.
   2. `POST /api/library/members` — register a member.
   3. `POST /api/library/borrow/:bookId` — borrow the book using the member's ID.
   4. `GET /api/library/books` — confirm `availableCopies` decreased.
   5. `GET /api/library/borrowed` — see the active borrow record.
   6. `PUT /api/library/return/:borrowId` — return the book.
   7. `GET /api/library/books` — confirm `availableCopies` is restored.
