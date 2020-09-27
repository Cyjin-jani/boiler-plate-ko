const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://yjcho:abcd1234@boilerplate.ch3np.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected."))
  .catch((err) => console.log(err));

// mongodb+srv://yjcho:<password>@boilerplate.ch3np.mongodb.net/<dbname>?retryWrites=true&w=majority

app.get("/", (req, res) => res.send("Hello World! ~~ 안녕하세요"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
