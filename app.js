const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const { getClothingItem } = require("./controllers/clothingItems");
const auth = require("./middlewares/auth");
const cors = require("cors");

const app = express();

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());

app.post("/signup", createUser);
app.post("/signin", login);
app.get("/items", getClothingItem);

app.use(auth);

app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connect to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
