import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";
import {Form, Input, Button} from 'antd'

function RegisterPage(props) {
  //리덕스를 쓰기 위한 디스패치 사용.
  const dispatch = useDispatch();

  //state 관리. (이메일, 이름, 비번 및 비번확인)
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  //회원가입
  const onSubmitHandler = (event) => {
    event.preventDefault();

    //회원가입 입력 폼 전송 전, 비밀번호 확인
    if (Password !== ConfirmPassword) {
      return alert("비밀번호가 다릅니다. 같은 비밀번호를 입력해주세요.");
    }

    let body = {
      email: Email,
      password: Password,
      name: Name,
    };
    //리덕스 사용 (registeruser라는 액션을 날려줌.)
    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        props.history.push("/login");
      } else {
        alert("Failed to signUp");
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
      <Form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        {/* <label>Email</label> */}
        <Form.Item
          name="email"
          label="E-mail"
          rules={[{type: 'email', message: '유효한 이메일이 아닙니다.'},{required: true, message:'이메일을 입력해 주세요.'}]}
        >
          <Input />
        </Form.Item>
        <Input type="email" value={Email} onChange={onEmailHandler} />
        {/* <label>Name</label> */}
        <Input type="text" value={Name} onChange={onNameHandler} />
        {/* <label>PassWord</label> */}
        <Input type="password" value={Password} onChange={onPasswordHandler} />
        {/* <label>Confirm PassWord</label> */}
        <Input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />
        <br />
        <Button type="submit" >회원가입</Button>
      </Form>
    </div>
  );
}

export default withRouter(RegisterPage);
