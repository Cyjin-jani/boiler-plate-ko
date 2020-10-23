//auth는 왜 만드는가?
//1. 페이지권한제어: 페이지 이동 때 마다 로그인 되어 있는지 안되어있는지, 페이지에 들어갈 수 있는 유저인지, 관리자 유저인지 등을 체크함.
//2. 유저권한제어: 글을 쓸 때나 지울때 같은 경우, 권한이 있는지 체크를 하기 위함.

const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증처리를 하는 곳

  //client 쿠키에서 token을 가져 온다.
  let token = req.cookies.x_auth; //cookie-parser를 이용한 것.

  //유저 모델에 메서드를 만들어서 토큰을 복호화 한 뒤, 유저아이디를 가지고 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    //유저가 없으면 인증실패한 것! (유저가 없어서 클라이언트 쪽에 아래 json의 내용을 보냄.)
    if (!user) return res.json({ isAuth: false, error: true });

    //유저가 있으면 인증 okay
    //유저와 토큰 정보를 index.js의 auth라우터에서 활용하여 쓰기 위해서 req에 토큰과 유저정보를 넣어준다. 
    req.token = token;
    req.user = user;
    next(); //next가 없으면 미들웨어에서 갇혀버림.
  });
};

module.exports = { auth };
