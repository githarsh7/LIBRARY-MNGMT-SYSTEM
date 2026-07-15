const { books, members, borrowRecords, getNextBorrowId } = require('../data/store');
const { getMissingFields, parseId } = require('../utils/validate');

// POST /api/library/borrow/:bookId
const borrowBook = (req, res) => {
  const bookId = parseId(req.params.bookId);
  if (bookId === null) {
    return res.status(400).json({ success: false, message: 'Invalid bookId' });
  }

  const { memberId, borrowDate, returnDate } = req.body;

  const missing = getMissingFields(req.body, ['memberId', 'borrowDate', 'returnDate']);
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required field(s): ${missing.join(', ')}`
    });
  }

  const parsedMemberId = parseId(memberId);
  if (parsedMemberId === null) {
    return res.status(400).json({ success: false, message: 'Invalid memberId' });
  }

  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: `Book with id ${bookId} not found` });
  }

  const member = members.find(m => m.id === parsedMemberId);
  if (!member) {
    return res.status(404).json({ success: false, message: `Member with id ${parsedMemberId} not found` });
  }

  if (book.availableCopies <= 0) {
    return res.status(409).json({ success: false, message: `No copies available for "${book.title}"` });
  }

  book.availableCopies -= 1;

  const newRecord = {
    id: getNextBorrowId(),
    bookId,
    memberId: parsedMemberId,
    borrowDate: String(borrowDate),
    returnDate: String(returnDate),
    status: 'borrowed'
  };

  borrowRecords.push(newRecord);

  return res.status(201).json({ success: true, data: newRecord });
};

// PUT /api/library/return/:borrowId
const returnBook = (req, res) => {
  const borrowId = parseId(req.params.borrowId);
  if (borrowId === null) {
    return res.status(400).json({ success: false, message: 'Invalid borrowId' });
  }

  const record = borrowRecords.find(r => r.id === borrowId);
  if (!record) {
    return res.status(404).json({ success: false, message: `Borrow record with id ${borrowId} not found` });
  }

  if (record.status === 'returned') {
    return res.status(409).json({ success: false, message: 'This book has already been returned' });
  }

  const book = books.find(b => b.id === record.bookId);

  record.status = 'returned';
  if (book) {
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
  }

  return res.status(200).json({ success: true, data: record });
};

// GET /api/library/borrowed
const getAllBorrowed = (req, res) => {
  const result = borrowRecords.map(record => {
    const book = books.find(b => b.id === record.bookId);
    const member = members.find(m => m.id === record.memberId);

    return {
      borrowId: record.id,
      bookTitle: book ? book.title : 'Unknown Book',
      memberName: member ? member.name : 'Unknown Member',
      borrowDate: record.borrowDate,
      returnDate: record.returnDate,
      returnStatus: record.status
    };
  });

  return res.status(200).json(result);
};

module.exports = { borrowBook, returnBook, getAllBorrowed };
