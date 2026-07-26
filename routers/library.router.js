const express = require('express');
const router = express.Router();

const {
  addBook,
  addMember,
  borrowBook,
  returnBook,
  getAllBooks,
  getAllBorrowedBooks,
  getAllMembers
} = require('../controllers/library.controller');

// Books
router.post('/books', addBook);
router.get('/books', getAllBooks);

// Members
router.post('/members', addMember);
router.get('/members', getAllMembers);

// Borrow / Return
router.post('/borrow/:bookId', borrowBook);
router.put('/return/:borrowId', returnBook);

// Borrowed records
router.get('/borrowed', getAllBorrowedBooks);

module.exports = router;
