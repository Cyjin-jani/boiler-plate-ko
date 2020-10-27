
import React, { useState } from "react";
import { useDispatch } from "react-redux"; //리덕스 사용을 위해 axios대신 dispatch를 이용
import { loginUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";

function LoginPage(props) {
  //리덕스 액션을 보내기 위해 dispatch를 사용.
  const dispatch = useDispatch();

  //state 관리를 통해 아래 html의 input태그들의 value를 바꿔줄 수 있음.
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    //state변경
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    //state변경
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    //디스패치에 액션을 보냄.
    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        //리액트에서 페이지 이동시키는 경우 아래와 같이 push를 사용.
        props.history.push("/");
      } else {
        alert("로그인 error");
        // 초기화 해버림.
        // setEmail("");
        // setPassword("");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        {/* 타이핑 시 onChange를 통해 value를 바꿀 수 있게 됨. */}
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>PassWord</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default withRouter(LoginPage);
