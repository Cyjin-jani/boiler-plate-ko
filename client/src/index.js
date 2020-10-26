import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//리덕스에서 제공하는 provider를 통해 컴포넌트를 redux와 연결시킨다.
import { Provider } from "react-redux";
import "antd/dist/antd.css";
//미들웨어 적용과 스토어를 만들기 위해 아래 2개를 가져옴.
import { applyMiddleware, createStore } from "redux";
//리덕스 미들웨어 2개
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
//리듀서 임포트.
import Reducer from "./_reducers";

//리덕스 미들웨어를 사용하여 promise나 function형태의 action도 받을 수 있도록 한다.
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

ReactDOM.render(
  //application을 Provider를 통해 redux와 연결한다.
  //안에 위에서 미들웨어를 사용하여 만든 store를 넣어주어야 함.
  //스토어 안에는 reducer를 넣어주어야 한다.
  <Provider
    store={createStoreWithMiddleware(
      Reducer,
      //아래는 redux extension을 사용하기 위함. (chrome앱에서)
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
