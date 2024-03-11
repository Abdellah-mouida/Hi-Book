let mongoose = require("mongoose");
const Book = require("./book");

let authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// authorSchema.pre("deleteOne", async function (next) {
//   try {
//     const books = await Book.find({ author: this.id });

//     if (books.length > 0) {
//       next(new Error("This Author still has Book, You Can't Remove it"));
//     } else {
//       next();
//     }
//   } catch (err) {
//     next(err);
//   }
// });

authorSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function (next) {
    try {
      const books = await Book.find({ author: this.getQuery()._id });

      if (books.length > 0) {
        next(new Error("This Author still has Book, You Can't Remove it"));
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("Author", authorSchema);
