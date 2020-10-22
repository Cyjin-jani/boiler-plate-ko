// 배포용과 개발용을 나누어서 키를 전달한다.
// (배포용은 아직 키가 없음. => dev.js에서 키 값을 전달하게 됨.)

//환경변수에 production(배포용)이라고 되어있는 경우.
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  //개발용인 경우 (process.env.NODE_ENV === 'development')
  module.exports = require("./dev");
}
