//스토어가 있는데, 그 안에 여러가지 리듀서가 존재할 수 있다. 
//(리듀서 안에서 하는 일: 어떻게 state가 변하는지 보여주고 마지막으로 변화된 값을 리턴함)
//유저 리듀서, 커맨트 리듀서 등등.. 역할에 따라 여러개 존재함
//combineReducer라는 걸 이용하여 RootReducer에서 하나로 합쳐 준다.

import { combineReducers } from "redux";
import user from "./user_reducer";

const rootReducer = combineReducers({
  user,
  //여기에 다른 리듀서가 생기면 추가해줘야 함.
});

export default rootReducer;
