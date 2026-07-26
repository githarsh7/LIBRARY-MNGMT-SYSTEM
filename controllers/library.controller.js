// ------------------------------
// In-Memory Data Storage
// ------------------------------
let books = [];
let members = [];
let borrowRecords = [];

let bookIdCounter = 1;
let memberIdCounter = 1;
let borrowIdCounter = 1;

// ==============================
// 1. ADD A NEW BOOK
// POST /api/library/books
// ==============================
const addBook = (req, res) => {
  try {
    const { title, author, category, totalCopies } = req.body;

    // Validation
    if (!title || !author || !category || totalCopies === undefined) {
      return res.status(400).json({
        success: false,
        message: 'title, author, category and totalCopies are required fields'
      });
    }

    if (typeof totalCopies !== 'number' || totalCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'totalCopies must be a positive number'
      });
    }

    const newBook = {
      id: bookIdCounter++,
      title,
      author,
      category,
      totalCopies,
      availableCopies: totalCopies
    };

    books.push(newBook);

    return res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: newBook
    });
  } catch (error) {
    console.error('Error in addBook:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while adding the book'
    });
  }
};

// ==============================
// 2. REGISTER A NEW MEMBER
// POST /api/library/members
// ==============================
const addMember = (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'name, email and phone are required fields'
      });
    }

    // Basic email uniqueness check
    const existingMember = members.find((m) => m.email === email);
    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: 'A member with this email already exists'
      });
    }

    const newMember = {
      id: memberIdCounter++,
      name,
      email,
      phone
    };

    members.push(newMember);

    return res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      data: newMember
    });
  } catch (error) {
    console.error('Error in addMember:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while registering the member'
    });
  }
};

// ==============================
// 3. BORROW A BOOK
// POST /api/library/borrow/:bookId
// ==============================
const borrowBook = (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const { memberId, borrowDate, returnDate } = req.body;

    if (isNaN(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID'
      });
    }

    if (!memberId || !borrowDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'memberId, borrowDate and returnDate are required fields'
      });
    }

    // Find book
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID ${bookId} not found`
      });
    }

    // Find member
    const member = members.find((m) => m.id === Number(memberId));
    if (!member) {
      return res.status(404).json({
        success: false,
        message: `Member with ID ${memberId} not found`
      });
    }

    // Check availability
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: `No available copies for the book "${book.title}"`
      });
    }

    // Decrease available copies
    book.availableCopies -= 1;

    const newBorrowRecord = {
      id: borrowIdCounter++,
      bookId: book.id,
      memberId: member.id,
      borrowDate,
      returnDate,
      status: 'borrowed'
    };

    borrowRecords.push(newBorrowRecord);

    return res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: newBorrowRecord
    });
  } catch (error) {
    console.error('Error in borrowBook:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while borrowing the book'
    });
  }
};

// ==============================
// 4. RETURN A BOOK
// PUT /api/library/return/:borrowId
// ==============================
const returnBook = (req, res) => {
  try {
    const borrowId = parseInt(req.params.borrowId);

    if (isNaN(borrowId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid borrow record ID'
      });
    }

    const record = borrowRecords.find((r) => r.id === borrowId);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Borrow record with ID ${borrowId} not found`
      });
    }

    if (record.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'This book has already been returned'
      });
    }

    // Update status
    record.status = 'returned';

    // Increase available copies of the book
    const book = books.find((b) => b.id === record.bookId);
    if (book) {
      book.availableCopies += 1;
    }

    return res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: record
    });
  } catch (error) {
    console.error('Error in returnBook:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while returning the book'
    });
  }
};

// ==============================
// 5. GET ALL BOOKS
// GET /api/library/books
// ==============================
const getAllBooks = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching books'
    });
  }
};

// ==============================
// 6. GET ALL BORROWED RECORDS
// GET /api/library/borrowed
// ==============================
const getAllBorrowedBooks = (req, res) => {
  try {
    const detailedRecords = borrowRecords.map((record) => {
      const book = books.find((b) => b.id === record.bookId);
      const member = members.find((m) => m.id === record.memberId);

      return {
        borrowId: record.id,
        bookTitle: book ? book.title : 'Unknown Book',
        memberName: member ? member.name : 'Unknown Member',
        borrowDate: record.borrowDate,
        returnDate: record.returnDate,
        returnStatus: record.status
      };
    });

    return res.status(200).json({
      success: true,
      count: detailedRecords.length,
      data: detailedRecords
    });
  } catch (error) {
    console.error('Error in getAllBorrowedBooks:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching borrowed records'
    });
  }
};

// ==============================
// 7. GET ALL MEMBERS
// GET /api/library/members
// ==============================
const getAllMembers = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Error in getAllMembers:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching members'
    });
  }
};

module.exports = {
  addBook,
  addMember,
  borrowBook,
  returnBook,
  getAllBooks,
  getAllBorrowedBooks,
  getAllMembers
};
