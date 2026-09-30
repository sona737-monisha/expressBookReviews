const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const PORT = process.env.PORT || 5000;
const BOOKS_API_URL = `http://localhost:${PORT}/internal/books`;

// Internal books endpoint
public_users.get("/internal/books", (req, res) => {
  return res.status(200).json(books);
});

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User registered successfully"
  });
});

// Get all books using Axios + async/await
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API_URL);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch books"
    });
  }
});

// Get book by ISBN using Axios + async/await
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API_URL);
    const isbn = req.params.isbn;
    const book = response.data[isbn];

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch book"
    });
  }
});

// Get books by author using Axios + async/await
public_users.get("/author/:author", async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API_URL);
    const author = req.params.author;

    const result = Object.values(response.data).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "No books found for this author"
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to search books by author"
    });
  }
});

// Get books by title using Axios + async/await
public_users.get("/title/:title", async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API_URL);
    const title = req.params.title;

    const result = Object.values(response.data).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "No books found with this title"
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to search books by title"
    });
  }
});

// Get book review using Axios + async/await
public_users.get("/review/:isbn", async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API_URL);
    const isbn = req.params.isbn;
    const book = response.data[isbn];

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(book.reviews);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch review"
    });
  }
});

module.exports.general = public_users;