const { books, getNextBookId } = require('../data/store');
const { getMissingFields } = require('../utils/validate');

// POST /api/library/books
const addBook = (req, res) => {
  const { title, author, category, totalCopies } = req.body;

  const missing = getMissingFields(req.body, ['title', 'author', 'category', 'totalCopies']);
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required field(s): ${missing.join(', ')}`
    });
  }

  if (typeof totalCopies !== 'number' || !Number.isInteger(totalCopies) || totalCopies < 0) {
    return res.status(400).json({
      success: false,
      message: 'totalCopies must be a non-negative integer'
    });
  }

  const newBook = {
    id: getNextBookId(),
    title: String(title),
    author: String(author),
    category: String(category),
    totalCopies,
    availableCopies: totalCopies
  };

  books.push(newBook);

  return res.status(201).json({ success: true, data: newBook });
};

// GET /api/library/books
const getAllBooks = (req, res) => {
  return res.status(200).json(books);
};

module.exports = { addBook, getAllBooks };
