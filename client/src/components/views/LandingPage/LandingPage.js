import React, { useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

function LandingPage(props) {
  
  useEffect(() => {
    //해당 페이지에 들어오면 작동. (componentdidmount라고 보면 됨.)
    //서버에 get request를 보냄. 돌아온 response를 console에 출력.
    axios.get("/api/hello").then((response) => {
      console.log(response);
    });
  }, []);

  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      console.log(response);
      if (response.data.success) {
        props.history.push("/login");
      } else {
        alert("로그아웃 실패!");
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
      {" "}
      <h2>시작 페이지</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default withRouter(LandingPage);



//리액트 HOOKS

// class component는
// - 더 많은 기능 제공
// - 더 긴 코드
// - 더 복잡한 코드
// - 느린 퍼포먼스

// Functional component인 Hooks(16.8버젼이후 등장)는
// - 더 적은 기능
// - 더 짧은 코드
// - 더 간단한 코드
// - 빠른 퍼포먼스
//실제로 권장되는 방식임.

// class => HOOKS
// componentDidMount => useEffect를 사용!
// constructor로 state이용 => useState 이용!


