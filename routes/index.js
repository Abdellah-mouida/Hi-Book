let express = require("express");
let router = express.Router();
let Book = require("../modules/book");
router.get("/", async (req, res) => {
  let books;
  try {
    books = await Book.find().sort({ createdAt: "desc" }).limit(100).exec();
  } catch (err) {
    books = [];
  }
  res.render("index", { books: books });
});

module.exports = router;
