const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const { getClothingItem } = require("./controllers/clothingItems");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");
const {
  validateUserBody,
  validateUserLogIn,
} = require("./middlewares/validation");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());

app.post("/signup", validateUserBody, createUser);
app.post("/signin", validateUserLogIn, login);
app.get("/items", getClothingItem);

app.use(auth);

app.use(requestLogger);

app.use("/", mainRouter);

app.use(errorLogger);

//celebrate error handler
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
