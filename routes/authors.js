let express = require("express");
let router = express.Router();

let Author = require("../modules/author");
const Book = require("../modules/book");
router.get("/", async (req, res) => {
  let searchOption = {};
  if (req.query.name !== null && req.query.name !== "") {
    searchOption.name = new RegExp(req.query.name, "i");
  }
  try {
    let authors = await Author.find(searchOption);
    res.render("authors/index", {
      authors: authors,
      searchOption: req.query.name,
    });
  } catch (err) {
    res.redirect("/");
  }
});
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

router.post("/", async (req, res) => {
  let author = new Author({ name: req.body.name });
  try {
    let newAuthor = await author.save();
    res.redirect("authors/" + author.id);
  } catch {
    res.render("authors/new", {
      author: author,
      errMessage: "Uknown Error, Please Try again!!",
    });
  }
});

router.get("/:id", async (req, res) => {
  let author = await Author.findById(req.params.id);
  let hisBooks = await Book.find({ author: req.params.id });
  res.render("authors/show", { author: author, books: hisBooks });
});
router.get("/:id/edit", async (req, res) => {
  let author = await Author.findById(req.params.id);
  res.render("authors/edit", { author: author });
});

router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect("/authors/" + author.id);
  } catch {
    if (author === null) res.redirect("/");
    else
      res.render("/authors/edit", {
        author: author,
        errMessage: "Uknown Error, Please Try again!!",
      });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Author.findOneAndDelete({ _id: req.params.id });
    res.redirect("/authors");
  } catch (err) {
    console.log("Failed ==> ", err);
    res.redirect("/authors/" + req.params.id);
  }
});

module.exports = router;
