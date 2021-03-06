const express = require("express"); //express 사용.
const app = express();
const port = 5000; //백엔드 서버 포트 번호.
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); //쿠키를 사용하기 위해 쿠키파서 라이브러리 사용.
const config = require("./config/key");
const { auth } = require("./middleware/auth"); //미들웨어. (유저 권한 확인)
const { User } = require("./models/User");

/*  bodyparser의 옵션을 주는 부분 start */

//bodyparser가 클라이언트 단의 정보들(json, buffer, string, URL encoded Data 등)을 서버에서 분석해서 가져올 수 있도록 해줌.
//application/x-www-form-urlencoded 이렇게 생긴 데이터를 분석해서 가져올 수 있도록 해줌.
app.use(bodyParser.urlencoded({ extended: true }));
//json타입의 데이터를 가져올 수 있게 해줌.
app.use(bodyParser.json());

/*  bodyparser의 옵션을 주는 부분 end */

//쿠키사용
app.use(cookieParser());

//몽구스를 이용하여 몽고디비에 접속하기.
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World! ~~ 안녕하세요!!!"));

//LandingPage에서 axios로 보냄.
app.get("/api/hello", (req, res) => {
  res.send("안녕하십니까아아아아");
});

app.post("/api/users/register", (req, res) => {
  //회원가입 시 필요한 정보들을 client에서 가져오면,
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body); //req.body 안에는 json형식으로 들어있음 (bodyparser를 통해 이미 변환완료)

  //mongoDB의 save메서드. (insert라고 보면 됨) 유저 저장 되도록.
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일정보가 데이터베이스 안에서 있는지 확인하기.
  User.findOne({ email: req.body.email }, (err, user) => {
    //유저가 있는지 존재여부 확인 후 없으면 message를 리턴.
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    
    //요청한 이메일이 DB안에 있다면 (즉, 유저가 존재하는 경우), 비밀번호가 맞는지 확인하기.
    user.comparePassword(req.body.password, (err, isMatch) => {
      //비밀번호가 틀린 경우.
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }
      //비밀번호까지 맞다면 해당 유저를 위한 토큰을 생성.
      user.generateToken((err, user) => {
        //에러가 있는 경우
        if (err) return res.status(400).send(err);
        //토큰을 저장한다. (일단 쿠키에 저장해보자. 로컬스토리지에도 가능.)
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
  //아래 정보는 미들웨어 auth에서 
  //req에 유저정보와 토큰의 정보를 넣어두었음으로 req.user, req.token 이런식으로 사용이 가능함.
  
  //여기까지 미들웨어를 통과해 왔다는 얘기는 authenication이 true 라는 것.
  //통과를 못하고 에러가 난 경우 미들웨어에서 빠져나가게 되고 이쪽으로 들어오지 못함!
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

//로그아웃 라우터.
//로그아웃처리는?
//로그아웃할 때 해당 유저의 DB안에 저장된 토큰정보를 지워준다.
//토큰이 DB에 없다면, 클라이언트에서 가져온 토큰이랑 맞지 않게 되서 로그인 기능이 풀려버림.
app.get("/api/users/logout", auth, (req, res) => { //로그인 된 상태에서 로그아웃 하므로 auth 미들웨어를 넣어주어야 한다.

  //유저를 찾아서 토큰 데이터 업데이트 (삭제)함. 
  //미들웨어에서 req.user 정보를 보내기 때문에 아래처럼 아이디를 받아올 수 있음.
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    //에러가 난 경우.
    if (err) return res.json({ success: false, err });
    //성공적으로 로그아웃 한 경우.
    return res.status(200).send({ success: true });
  });
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
