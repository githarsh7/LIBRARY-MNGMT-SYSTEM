const express = require('express');
const router = express.Router();
const { borrowBook, returnBook, getAllBorrowed } = require('../controllers/borrowController');

router.post('/borrow/:bookId', borrowBook);
router.put('/return/:borrowId', returnBook);
router.get('/borrowed', getAllBorrowed);

module.exports = router;
