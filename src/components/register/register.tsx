import React from 'react';
import "../../styles/register.css";

function Register() {

    // 폼  제출
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    // };

    return (  
        <div className="all">
            <div className="logo-position">
                <img src="icon/Logo.png" alt="구르미 로고" />
            </div>

            <div>
                <button type="button" className="oauth-login-btn"> 구글 로그인 </button>
            </div>

            <div className="register-component">

                <div className="line-separator">
                    <span className="line-left"></span>
                    <span className="or">or</span>
                    <span className="line-right"></span>
                </div>
                
                {/* <form onSubmit={handleSubmit}> */}
                <form action="">
                    <input
                    type="text"
                    name="emailId"
                    className="id-input"                        
                    placeholder="이메일을 입력하세요."
                    />
                    <input 
                    type="password" 
                    name="password" 
                    className="password-input"
                    placeholder="비밀번호를 입력하세요."
                    />
                    <input 
                    type="password" 
                    name="password_2"  
                    className="password-input_2"
                    placeholder="비밀번호를 다시 입력하세요."
                    />
                    <input 
                    type="text" 
                    name="name" 
                    className="name-input"
                    placeholder="이름을 입력하세요."
                    />
                    <input type="text" 
                    name="nickname" 
                    className="nickname-input"
                    placeholder="닉네임을 입력하세요."
                    />
                </form>
                        
            </div>

            <div>
                <button type="submit" className="register-btn">회원가입</button>
            </div>

            <div className="already">
                <div><span className="q">이미 계정이 있으세요?</span></div>
                <div><a href="/login" className="login">로그인</a></div>
            </div>

        </div>
    

    );
}


export default Register;