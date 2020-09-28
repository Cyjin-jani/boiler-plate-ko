const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증처리를 하는 곳

  //client 쿠키에서 token을 가져 온다.
  let token = req.cookies.x_auth;

  //토큰을 복호화 한 뒤, 유저아이디를 가지고 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    //유저가 없으면 인증 no!
    if (!user) return res.json({ isAuth: false, error: true });

    //유저가 있으면 인증 okay
    req.token = token;
    req.user = user;
    next(); //next가 없으면 미들웨어에서 갇혀버림.
  });
};

module.exports = { auth };
