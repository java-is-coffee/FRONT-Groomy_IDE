import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/login";
import Register from "./routes/register";
import Home from "./routes/home";
import "./styles/style.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

/*
  route
   - 로그인 : /login
   - 회원가입 : /register
   - 메인 : /
   - 프로젝트 생성 : /project
   - 메인 코드 에디터 : /project/code/{projectId}
   - 채팅
      - 프로젝트: /chat/project/{chatId}
      - DM: /chat/dm/{memberId}
   - 게시판
      - 게시판 목록 : /board
      - 게시글 보기 : /board/{boardId}
      - 게시글 작성 : /board/new
      - 게시글 수정 : /board/edit/{boardId}
*/

/* 
 리덕스 구조
  store / state action 
  
  const counter = (state = initialState, action) => {
    console.log(action);
    switch(action.type) {
      case INCREMENT:
        return { 
          number: state.number + action.diff
        };
      case DECREMENT:
        return { 
          number: state.number - 1
        };
      default:
        return state;
    }
  }

  // 스토어를 만들 땐 createStore 에 리듀서 함수를 넣어서 호출합니다.
  const { createStore } = Redux;
  const store = createStore(counter);


*/
