const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10; //salt 가 몇 글자인지 정해줌.

const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567  암호화된 비밀번호 $2b$10$IIVyl/3fwAaeZ6BZny57cev.X7.dCZIXx6HKRnWvaSmW/ZloMuVAa
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  //jsonwebtoken을 이용해서 token을 생성하기. (userID + token)
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;

  user.save(function (err, user) {
    if (err) return cb(err); //error가 있으면 콜백함수에 에러를 전달
    cb(null, user);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
