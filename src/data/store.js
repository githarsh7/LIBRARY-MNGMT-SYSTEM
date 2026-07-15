// In-memory data storage.
// Data only persists while the server process is running.

const books = [];
const members = [];
const borrowRecords = [];

let nextBookId = 1;
let nextMemberId = 1;
let nextBorrowId = 1;

const getNextBookId = () => nextBookId++;
const getNextMemberId = () => nextMemberId++;
const getNextBorrowId = () => nextBorrowId++;

module.exports = {
  books,
  members,
  borrowRecords,
  getNextBookId,
  getNextMemberId,
  getNextBorrowId
};
