# 📚 Library Management API

A simple **Library Management System API** built using **Node.js** and **Express.js**, with all data stored in local in-memory JavaScript arrays (no database used).

---

## 🚀 Tech Stack
- Node.js
- Express.js
- cors
- dotenv
- nodemon (dev dependency)

> ❌ No database (MongoDB, MySQL, PostgreSQL, Firebase, etc.) is used. All data resets when the server restarts.

---

## 📂 Folder Structure
```
library-management-api/
├── controllers/
│   └── library.controller.js
├── routers/
│   └── library.router.js
├── index.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

1. **Extract the zip file** and open the folder in your terminal / code editor.

2. **Install dependencies**
   ```bash
   npm install
   ```

3. A `.env` file is already included in the root directory:
   ```
   PORT=5000
   ```
   You can change the port number if needed.

4. **Run the server**

   Development mode (auto-restarts on file changes using nodemon):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

5. Server will start at:
   ```
   http://localhost:5000
   ```

6. Visit the root route to confirm it's running:
   ```
   GET http://localhost:5000/
   ```
   Response:
   ```json
   {
     "success": true,
     "message": "Library Management API is running 🚀"
   }
   ```

---

## 📚 API Endpoints

Base URL: `http://localhost:5000/api/library`

| # | Method | Endpoint              | Description               |
|---|--------|------------------------|----------------------------|
| 1 | POST   | `/books`               | Add a new book            |
| 2 | POST   | `/members`             | Register a new member     |
| 3 | POST   | `/borrow/:bookId`      | Borrow a book              |
| 4 | PUT    | `/return/:borrowId`    | Return a book               |
| 5 | GET    | `/books`               | Get all books               |
| 6 | GET    | `/borrowed`            | Get all borrowed records   |
| 7 | GET    | `/members`             | Get all members             |

---

### 1. Add a New Book
**POST** `/api/library/books`

**Request Body:**
```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "category": "Self Help",
  "totalCopies": 5
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Book added successfully",
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

**Error Response (400) — Missing fields:**
```json
{
  "success": false,
  "message": "title, author, category and totalCopies are required fields"
}
```

---

### 2. Register a New Member
**POST** `/api/library/members`

**Request Body:**
```json
{
  "name": "John",
  "email": "john@gmail.com",
  "phone": "9876543210"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Member registered successfully",
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@gmail.com",
    "phone": "9876543210"
  }
}
```

**Error Response (409) — Duplicate email:**
```json
{
  "success": false,
  "message": "A member with this email already exists"
}
```

---

### 3. Borrow a Book
**POST** `/api/library/borrow/:bookId`

**URL Parameter:**
| Parameter | Description             |
|-----------|---------------------------|
| bookId    | ID of the book to borrow |

**Request Body:**
```json
{
  "memberId": 1,
  "borrowDate": "2026-07-05",
  "returnDate": "2026-07-12"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
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

**Possible Errors:**
| Status | Message                                          |
|--------|---------------------------------------------------|
| 400    | Invalid book ID                                    |
| 400    | memberId, borrowDate and returnDate are required   |
| 404    | Book with ID x not found                           |
| 404    | Member with ID x not found                         |
| 400    | No available copies for the book "..."             |

---

### 4. Return a Book
**PUT** `/api/library/return/:borrowId`

**URL Parameter:**
| Parameter | Description        |
|-----------|----------------------|
| borrowId  | Borrow Record ID     |

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Book returned successfully",
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

**Possible Errors:**
| Status | Message                              |
|--------|----------------------------------------|
| 400    | Invalid borrow record ID               |
| 404    | Borrow record with ID x not found     |
| 400    | This book has already been returned   |

---

### 5. Get All Books
**GET** `/api/library/books`

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Atomic Habits",
      "author": "James Clear",
      "category": "Self Help",
      "totalCopies": 5,
      "availableCopies": 4
    }
  ]
}
```

---

### 6. Get All Borrowed Books
**GET** `/api/library/borrowed`

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "borrowId": 1,
      "bookTitle": "Atomic Habits",
      "memberName": "John",
      "borrowDate": "2026-07-05",
      "returnDate": "2026-07-12",
      "returnStatus": "borrowed"
    }
  ]
}
```

---

### 7. Get All Members
**GET** `/api/library/members`

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "name": "John",
      "email": "john@gmail.com",
      "phone": "9876543210"
    }
  ]
}
```

---

## ✅ Validation & Error Handling

| Case                        | Status Code | Example Message                                 |
|------------------------------|--------------|---------------------------------------------------|
| Missing required fields      | 400          | "field(s) are required"                          |
| Invalid ID (non-numeric)     | 400          | "Invalid ... ID"                                   |
| Book not found                | 404          | "Book with ID x not found"                        |
| Member not found              | 404          | "Member with ID x not found"                      |
| Borrow record not found       | 404          | "Borrow record with ID x not found"               |
| No copies available            | 400          | "No available copies for the book ..."            |
| Book already returned         | 400          | "This book has already been returned"             |
| Duplicate member email         | 409          | "A member with this email already exists"         |
| Unexpected server error        | 500          | "Something went wrong while ..."                  |
| Unknown route                  | 404          | "Route not found"                                  |

All controller functions are wrapped in `try/catch` blocks, so any unexpected runtime error returns a clean `500` JSON response instead of crashing the server.

---

## 🧪 Testing with Postman / cURL

Example using cURL:

```bash
# Add a book
curl -X POST http://localhost:5000/api/library/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Atomic Habits","author":"James Clear","category":"Self Help","totalCopies":5}'

# Register a member
curl -X POST http://localhost:5000/api/library/members \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@gmail.com","phone":"9876543210"}'

# Borrow a book
curl -X POST http://localhost:5000/api/library/borrow/1 \
  -H "Content-Type: application/json" \
  -d '{"memberId":1,"borrowDate":"2026-07-05","returnDate":"2026-07-12"}'

# Return a book
curl -X PUT http://localhost:5000/api/library/return/1

# Get all books
curl http://localhost:5000/api/library/books

# Get all borrowed records
curl http://localhost:5000/api/library/borrowed

# Get all members
curl http://localhost:5000/api/library/members
```

You can also import these routes into **Postman** by manually creating requests for each endpoint listed above.

---

## 📌 Notes
- All data is stored **in memory** (local JS arrays) and resets whenever the server restarts.
- IDs are auto-incremented integers, starting from 1.
- No authentication is implemented — this is a basic CRUD-style demo API.

---

## 🧑‍💻 Concepts Demonstrated
- Express.js Routing
- REST API Design
- Route Parameters & Request Body Handling
- HTTP Methods (GET, POST, PUT)
- Array Operations (`push`, `find`, `findIndex`, `filter`, `map`)
- JavaScript Objects
- Data Validation
- Proper HTTP Status Codes
- JSON Responses
- Error Handling with try/catch
