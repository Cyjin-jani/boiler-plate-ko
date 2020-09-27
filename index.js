const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

const config = require("./config/key");

const { User } = require("./models/User");

//bodyparser가 클라이언트 단의 정보들을 서버에서 분석해서 가져올 수 있도록 해줌.
//application/x-www-form-urlencoded 이렇게 생긴 데이터를 분석해서 가져올 수 있도록 해줌.
app.use(bodyParser.urlencoded({ extended: true }));
//json타입의 데이터를 가져올 수 있게 해줌.
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World! ~~ 안녕하세요!!!"));

app.post("/register", (req, res) => {
  //회원가입 시 필요한 정보들을 clientdㅔ서 가져오면,
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body); //req.body 안에는 json형식으로 들어있음 (bodyparser를 통해 이미 변환완료)

  //mongoDB 유저 저장 되도록.
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
