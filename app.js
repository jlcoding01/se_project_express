const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");

const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const { getClothingItem } = require("./controllers/clothingItems");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");
const {
  validateUserBody,
  validateUserLogIn,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);
app.post("/signup", validateUserBody, createUser);
app.post("/signin", validateUserLogIn, login);
app.get("/items", getClothingItem);

app.use(auth);

app.use("/", mainRouter);

app.use(errorLogger);

// celebrate error handler
app.use(errors());
// centralized handler
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connect to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
