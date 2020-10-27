//유저 리듀서

//타입 가져오기
import { AUTH_USER, LOGIN_USER, REGISTER_USER } from "../_actions/types";
//파라미터: previousState, action을 넣어주어야 함.
export default function (state = {}, action) {
  //다른 타입이 올 때마다 다른 처리를 해주어야 하므로 switch문을 사용하여 분기처리.
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload }; //spread operator사용.
      break;
    case REGISTER_USER:
      return { ...state, register: action.payload };
      break;
    case AUTH_USER:
      return { ...state, userData: action.payload };
      break;

    default:
      return state;
  }
}
