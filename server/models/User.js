const mongoose = require("mongoose");

const bcrypt = require("bcrypt"); //비밀번호의 암호화 저장을 위함.
//여기서 소금은 소금을 치다라는 뜻의 소금인데, 패스워드를 보호하기 위해 특별한 값(소금)을 추가한다는 의미이다.
const saltRounds = 10; //salt가 몇 글자인지 정해줌. 
//jsonWebToken을 활용하여 토큰을 생성 및 관리.
const jwt = require("jsonwebtoken");

//model과 Schema 생성
//model은 스키마를 감싸주는 역할을 함.
//스키마는 모델의 정보들을 하나하나 지정해 줄 수 있는 것.
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //space를 없애주는 역할을 함. (ex. abc de@naver.com인 경우 abcde@nave.com가 되도록.)
    unique: 1, //똑같은 email은 쓰지 못하도록 유니크 설정. (아이디 역할을 하기 때문)
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: { //관리자 및 일반유저 구분 칼럼
    type: Number,
    default: 0, //0은 일반유저, 1은 관리자
  },
  image: String, //object사용 안함. image경로가 들어가기 때문.
  token: { //유효성 판단
    type: String,
  },
  tokenExp: { //토큰 사용 기간
    type: Number,
  },
});

//비밀번호 암호화를 위해 index.js의 register에 있는 save()메소드가 실행되기 전에 미리 해야하는 액션.
userSchema.pre("save", function (next) {
  var user = this;
  //비밀번호를 변경하는 경우에만 암호화가 필요하다. 아래 조건을 추가하지 않으면 save가 일어날 때마다 이미 암호화 된 암호를 변경해버릴 수 있음. (새로 회원가입 하는 경우에도 아래 조건을 충족함.)
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킴

    //salt를 생성한다. (10글자의 salt사용)
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); //에러가 난 경우.
      //해싱을 통해 암호화 함. (원래 기존의 비밀번호, 생성한 소금이 필요함)
      bcrypt.hash(user.password, salt, function (err, hash) { //여기 콜백함수의 hash는 암호화 된 비번임.
        //에러가 난 경우
        if (err) return next(err);
        //성공한 경우, 해싱된 암호를 기존 user모델의 password에 대신 넣어준다. (이거시 암호화!)
        user.password = hash;
        //모든 해야 할 일이 끝나면 next를 이용하여 다음 단계로 넘어간다. (여기서는 이제 save()로 비로소 넘어감.)
        next();
      });
    });
  //비밀번호가 변경되지 않은 경우.
  } else {
    //이 부분을 해주지 않으면 pre에서 머물게 되고 save로 넘어가지 못함.
    next();
  }
});

//비밀번호 검사하는 메서드 만듦. (index.js의 로그인 시 사용함.)
userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567  암호화된 비밀번호 $2b$10$IIVyl/3fwAaeZ6BZny57cev.X7.dCZIXx6HKRnWvaSmW/ZloMuVAa
  //암호화 된 암호는 복호화가 불가하다. 그래서 plainpassword를 암호화를 해서 두 암호가 같은 지 비교해야 함.
  //이럴 때 사용하는 메서드가 bcrypt의 compare메서드.
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) { //this.password가 암호화되어 저장되어 있는 패스워드.
    //비번이 맞지 않은 경우.
    if (err) return cb(err);
    //암호화 된 것과 비교한 값을 전달. (err => null, isMatch => true)
    cb(null, isMatch);
  });
};

//토큰 생성하는 메서드 만듦.
userSchema.methods.generateToken = function (cb) {
  var user = this;

  //jsonwebtoken의 sign이라는 메소드를 이용해서 token을 생성하기. (useuser._id + secretToken = token)
  //나중에 secretToken을 넣으면 user._id가 구해져서 나오게 됨.
  var token = jwt.sign(user._id.toHexString(), "secretToken"); //plain Object로 만들기 위해 toHexString.

  //유저의 토큰 field에 넣어준다.
  user.token = token;

  user.save(function (err, user) {
    if (err) return cb(err); //error가 있으면 콜백함수에 에러를 전달
    //유저가 정상적으로 저장된 경우엔 에러에 null을, 그리고 user정보를 보냄.
    cb(null, user);
  });
};

//auth 미들웨어에서 사용되는 메서드.
userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  //토큰을 decode(복호화) 한다.
  //user._id + 'secretToken'을 이용해서 만들었으므로, 가운데에는 secretToken이 들어감.
  jwt.verify(token, "secretToken", function (err, decoded) { //복호화된 유저id가 decoded에 들어감.
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
    //findOne -> mongoDB의 메서드임. (유저 아이디와 토큰으로 해당 유저를 찾음.)
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      //에러가 있다면 콜백으로 에러를 전달.
      if (err) return cb(err);
      //에러가 없다면 찾은 유저 정보를 전달함.
      cb(null, user);
    });
  });
};

//스키마를 모델로 감싸줌. parameter로 모델의 이름과 스키마를 넣음.
const User = mongoose.model("User", userSchema);
//다른 곳에서 사용 가능하도록 export 해줌.
module.exports = { User };
