if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// Imports
let express = require("express");
let app = express();
let expressLayouts = require("express-ejs-layouts");
let path = require("path");

let indexRouter = require("./routes/index");
let authorsRouter = require("./routes/authors");
let booksRouter = require("./routes/books");

let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let methodOverride = require("method-override");
const book = require("./modules/book");

// MongoDB Config
mongoose.connect(process.env.DATABASE_URL);
let db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected To MONGOOSE"));

// Seting the Dirctorise and
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

// Uses
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(methodOverride("_method"));

//File Pond

// Serve static files from the node_modules directory for FilePond
app.use(
  "/filepond",
  express.static(path.join(__dirname, "node_modules/filepond/dist"))
);

// Useing Routes
app.use("/", indexRouter);
app.use("/authors", authorsRouter);
app.use("/books", booksRouter);

// Listning
app.listen(process.env.PORT || 3000);
