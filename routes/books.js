let express = require("express");
let router = express.Router();
let Author = require("./../modules/author");
let Book = require("./../modules/book");
let path = require("path");
let fs = require("fs");
// let uploadPath = path.join("public", Book.coverImageBasePath);

let imageMimeType = ["image/jpeg", "image/png", "image/gif"];

router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title && req.query.title !== "") {
    query.regex("title", req.query.title);
  }
  if (req.query.publisedBefore && req.query.publisedBefore !== "") {
    query.lte("publishDate", req.query.publisedBefore);
  }
  if (req.query.publisedAfter && req.query.publisedAfter !== "") {
    query.lte("publishDate", req.query.publisedAfter);
  }
  try {
    let books = await query.exec();
    res.render("books/index", { books: books, searchOption: req.query });
  } catch (err) {
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  renderFormPage("new", res, new Book());
});

router.post("/", async (req, res) => {
  let book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });
  saveCover(book, req.body.cover);
  try {
    let newBook = await book.save();
    res.redirect("/books");
  } catch (err) {
    renderFormPage("new", res, book, true, err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    let book = await Book.findById(req.params.id).populate("author").exec();
    res.render("books/show", { book: book });
  } catch (err) {
    res.redirect("/");
  }
});
router.get("/:id/edit", async (req, res) => {
  let book = await Book.findById(req.params.id);
  renderFormPage("edit", res, book);
});

router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = req.body.publishDate;
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    if (req.body.cover !== null && req.body.cover !== "") {
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect("/books/" + req.params.id);
  } catch (err) {
    renderFormPage(
      "new",
      res,
      book,
      true,
      "Error Updating This book , Unkwon Error ??!!"
    );
  }
});

router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await Book.findOneAndDelete({ _id: req.params.id });
    res.redirect("/books/");
  } catch (err) {
    res.render("/books/show", {
      book: book,
      errMessage: "Couldn't Delete this Book , Try  Again !",
    });
  }
});

// Functions
async function renderFormPage(form, res, book, hasErr = false, err) {
  try {
    let authors = await Author.find({});
    let params = { book: book, authors: authors };
    if (hasErr) params.errMessage = `${err}`;
    res.render(`books/${form}`, params);
  } catch (error) {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncode) {
  if (coverEncode === null) return;
  let cover = JSON.parse(coverEncode);
  if (cover !== null && imageMimeType.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
