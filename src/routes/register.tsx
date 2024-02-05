import React from "react";
import RegisterComponent from '../components/register';

function register() {
  return <div>
     <RegisterComponent />
  </div>;
}

export default register;

/* 
이메일
비밀번호 (영문, 숫자, 특수문자 8 ~ 30)
비밀번호 확인
이름 (2 ~ 30)
닉네임 (2 ~ 30)

회원가입 (버튼)
이미 계정이 있으세요?  로그인(링크) 

*/
