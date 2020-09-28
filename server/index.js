const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//bodyparser가 클라이언트 단의 정보들을 서버에서 분석해서 가져올 수 있도록 해줌.
//application/x-www-form-urlencoded 이렇게 생긴 데이터를 분석해서 가져올 수 있도록 해줌.
app.use(bodyParser.urlencoded({ extended: true }));
//json타입의 데이터를 가져올 수 있게 해줌.
app.use(bodyParser.json());
//쿠키사용
app.use(cookieParser());

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

app.get("/api/hello", (req, res) => {
  res.send("안녕하십니까아아아아");
});

app.post("/api/users/register", (req, res) => {
  //회원가입 시 필요한 정보들을 clientdㅔ서 가져오면,
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body); //req.body 안에는 json형식으로 들어있음 (bodyparser를 통해 이미 변환완료)

  //mongoDB 유저 저장 되도록.
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스 안에서 있는지 확인하기.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    //요청한 이메일이 DB안에 있다면, 비밀번호가 맞는지 확인하기.

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }
      //비밀번호까지 맞다면 해당 유저를 위한 토큰을 생성.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. (일단 쿠키에 저장해보자.)
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//endpoint로 가기 전에 미들웨어 auth에서 중간처리 이후 콜백함수를 부름.
app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 authenication이 true 라는 것.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, //admin이 1, 일반사용자 0
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
