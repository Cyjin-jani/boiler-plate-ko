import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./types";

//LoginPage.js에서 보낸 파라미터가 dataToSubmit으로 들어옴.(이메일, 비밀번호)
export function loginUser(dataToSubmit) {
  const request = axios
    .post("/api/users/login", dataToSubmit)
    .then((response) => response.data); //서버에서 받은 response.data를 request에 저장함.

  return { //리듀서에 넘겨주어야 함. 타입과 response를 넣어준다.
    type: LOGIN_USER,
    payload: request,
  };
}
//회원가입 용 액션
export function registerUser(dataToSubmit) {
  const request = axios
    .post("/api/users/register", dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}
export function auth() {
  const request = axios
    .get("/api/users/auth")
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}
