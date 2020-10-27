//hoc : higher order component
//컴포넌트 안에 다른 컴포넌트를 가지는 function

import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { _applyPlugins } from "mongoose";

//여기서 해당 유저가 해당 페이지에 들어갈 자격이 되는 지를 알아낸 후에
//자격이 된다면 SpecificComponent에 가게 해주고 아니라면 다른 페이지로 보내버린다.
//ex. logged in component => 로그인 한 유저만 들어올 수 있는 컴포넌트

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    //option 파라미터 값 설명
    //null => 아무나 출입이 가능한 페이지
    //true => 로그인한 유저만 출입이 가능한 페이지
    //false => 로그인한 유저는 출입 불가능한 페이지

    //db백엔드에서 유저 정보를 불러옴. auth 액션 사용.
    useEffect(() => {
      dispatch(auth()).then((response) => {
        // console.log(response);

        //로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          //로그인 하지 않은 상태에서 로그인한 유저만 가능한 페이지로 이동하려고 할 경우, 로그인 페이지로 강제이동.
          if (option) {
            props.history.push("/login");
          }
        } else {
          //로그인한 상태
          //어드민이 아닌 유저가 어드민라우터 true인 채로 들어가려고 할 경우도 막아줌.
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            //이미 로그인 한 유저가 출입 불가능한 페이지에 들어가려고 할 때(로그인, 회원가입 페이지 등)
            if (option === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}



//Redux에 대하여.

// 리덕스란? 
// predictable state container for JS apps.
// 상태관리 라이브러리이다.

/*
React에서는...

Props 
- properties의 줄임말
- 컴포넌트 간의 소통방식
- 위에서부터 아래로만 보냄 (부모컴포넌트가 자식컴포넌트에게 props 물려줌)
- 부모컴포넌트에서 자식에게 props를 내려주면 props가 바뀌지 않음, 바꾸려면 부모에서 다시 바꿔서 다시 내려줘야 함
ex)
<Childcomponent message={message} /> => 여기서 message가 props이다

State
- 컴포넌트 안에서 데이터를 교환하거나 전달할 경우 state을 사용
- 컴포넌트 안에서 변화가 가능함
- state가 변하면 re-render 됨

ex) state = {
    message: 'hi',
    name: ''
}
*/
/*
redux가 없으면 컴포넌트 하나하나 타고 올라가고 내려가고 하는 식으로 데이터를 전달해야 함
하지만 redux는 store라는 곳에 데이터를 저장해두고, 한번에 뿌려줄 수 있다

Redux Data Flow 
(strict Unidirectional data flow) : 단일 방향으로 이동

Action -> Reducer -> Store -> (Subscribe)-> React Component ->(Dispatch(action))-> Action


- Action: 무엇이 일어나는지를 설명하는 plain object이다.
ex)
{type: 'ADD_TODO', text: 'Read the redux docs'} //text를 todolist에 add했다는 상태를 알려줌.


- Reducer: 어떻게 어플리케이션의 state가 변했는지 설명하는 function이다.

ex)  (previousState, action) => nextState
previousState와 action Object를 받은 후에 nextState를 return 한다!

- store: 어플리케이션의 전체적인 state를 감싸주는 역할. store를 통해 state를 관리할 수 있게 됨


redux 사용을 위한 dependency들

1. redux
2. react-redux
redux 미들웨어들 (redux를 잘 쓸 수 있도록 도와주는 역할)
3. redux-promise
4. redux-thunk

store에서는 원래 action을 받을 때 plain object의 형태를 받아서 관리했으나,
항상 plain object만 받는 게 아닌, Promise형태나, Function형태를 받아야 할 때도 있다!
일반적으로는 plain Object만 받을 수 있도록 되어있으므로,
3. redux-promise
4. redux-thunk
를 통해서 plainObject가 아닌 promise나 function을 받을 수 있도록 해준다!

redux-thunk: dispatch에게 어떻게 function을 action으로써 받거나 대처할 수 있는지 알려줌.
redux-promise: dispatch에게 어떻게 promise를 action으로써 받거나 대처할 수 있는지 알려줌.


*/