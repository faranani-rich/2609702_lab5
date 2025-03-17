// index.js

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory store for books
let books = [];

// GET /whoami
// Returns an object with your student number.
// (Replace "2609702" with your actual student number if needed.)
app.get('/whoami', (req, res) => {
  res.json({ studentNumber: "2609702" });
});

// GET /books
// Returns a list of all books.
app.get('/books', (req, res) => {
  res.json(books);
});

// GET /books/:id
// Returns details of a specific book.
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

// POST /books
// Adds a new book to the collection.
app.post('/books', (req, res) => {
  const { id, title, details } = req.body;
  
  // Validate that all required fields are provided
  if (!id || !title || !details || !Array.isArray(details)) {
    return res.status(400).json({ error: 'Missing required book details' });
  }
  
  // Optional: Check if book with the same id already exists
  if (books.find(b => b.id === id)) {
    return res.status(400).json({ error: 'Book with this id already exists' });
  }
  
  const newBook = { id, title, details };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id
// Updates an existing book's information.
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  const { title, details } = req.body;
  // Validate the update fields
  if (!title || !details || !Array.isArray(details)) {
    return res.status(400).json({ error: 'Missing required book details' });
  }
  
  // Update the book (ignoring id update to preserve consistency)
  book.title = title;
  book.details = details;
  
  res.json(book);
});

// DELETE /books/:id
// Deletes a book from the collection.
app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  // Remove the book from the array
  books.splice(index, 1);
  res.json({ message: 'Book deleted successfully' });
});

// POST /books/:id/details
// Adds a detail (author, genre, publicationYear) to a book.
app.post('/books/:id/details', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  const { id, author, genre, publicationYear } = req.body;
  // Validate that all required detail fields are provided
  if (!id || !author || !genre || publicationYear === undefined) {
    return res.status(400).json({ error: 'Missing required detail fields' });
  }
  
  // Optional: Check if detail with the same id already exists in the book
  if (book.details.find(d => d.id === id)) {
    return res.status(400).json({ error: 'Detail with this id already exists for this book' });
  }
  
  const newDetail = { id, author, genre, publicationYear };
  book.details.push(newDetail);
  
  res.status(201).json(newDetail);
});

// DELETE /books/:id/details/:detailId
// Removes a detail from a book.
app.delete('/books/:id/details/:detailId', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  const detailIndex = book.details.findIndex(d => d.id === req.params.detailId);
  if (detailIndex === -1) {
    return res.status(404).json({ error: 'Detail not found' });
  }
  
  // Remove the detail from the array
  book.details.splice(detailIndex, 1);
  res.json({ message: 'Detail deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
