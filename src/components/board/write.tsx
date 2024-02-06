import React, { useState } from "react";
import "../../styles/board/board.css";
import { FaClipboard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../../routes/boardWrite";
import axios from "axios";

interface BoardContent {
  memberId: number | undefined;
  nickname: string | undefined;
  title: string;
  content: string;
  completed: boolean;
}

interface WriteDTO {
  data: BoardContent;
}

const baseUrl =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/board/write";

const accessToken = localStorage.getItem("accessToken");

function Write({ userInfo }: { userInfo: UserInfo | null }) {
  const navigate = useNavigate();
  const goList = () => {
    navigate("/board");
  };

  const [title, setTitle] = useState("");
  //const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnony, setIsAnony] = useState(false);

  function onChangeTitle(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.value;
    setTitle(value);
  }

  // function onChangeTag(event: React.FormEvent<HTMLInputElement>): void {
  //   const value = event.currentTarget.value;
  //   setTag(value);
  // }

  function onChangeContent(event: React.FormEvent<HTMLTextAreaElement>): void {
    const value = event.currentTarget.value;
    setContent(value);
  }

  function checkCompleted(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.checked;
    setIsCompleted(value);
  }

  function checkAnony(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.checked;
    setIsAnony(value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputData: BoardContent = {
      memberId: userInfo?.memberId,
      nickname: isAnony ? "익명" : userInfo?.nickname,
      title: title,
      content: content,
      completed: isCompleted,
    };

    if (inputData.memberId === undefined) {
      alert("로그인 하셔야 합니다");
      return;
    }

    const requestDTO: WriteDTO = {
      data: inputData,
    };

    try {
      const response = await axios.post(baseUrl, requestDTO, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) goList();
    } catch (error) {}
  };

  return (
    <div className="w-50 p-15 test box-border">
      <div className="board-top  line-bottom display-flex-start">
        <FaClipboard className="mr-15" size={25} />
        질문 작성
      </div>

      <form className="mt-30" onSubmit={handleSubmit}>
        <div className="mt-15">
          <span className="font-bold">제목</span>
          <span className="float-right">
            <input type="checkbox" name="anonymous" onChange={checkAnony} />
            <span>익명 선택</span>
          </span>
          <span className="float-right mr-15">
            <input type="checkbox" name="completed" onChange={checkCompleted} />
            <span>해결</span>
          </span>
          <div className="mt-15">
            <input
              type="text"
              name="title"
              className="input-box"
              required
              onChange={onChangeTitle}
            />
          </div>
        </div>

        <div className="mt-15">
          <span className="font-bold">태그</span>
          <div className="mt-15">
            <input
              type="text"
              name="tag"
              className="input-box"
              required
              //onChange={onChangeTag}
            />
          </div>
        </div>

        <div className="mt-15">
          <span className="font-bold">내용</span>
          <div className="mt-15">
            <textarea
              required
              name="content"
              className="input-box board-write-content"
              rows={20}
              onChange={onChangeContent}
            />
          </div>
        </div>

        <div className="float-right mr-15">
          <button className="mr-15 board-write-btn bg-white" onClick={goList}>
            취소
          </button>
          <button className="board-write-btn bg-sub-color">작성</button>
        </div>
      </form>
    </div>
  );
}

export default Write;
// 제목 우측에 익명 체크 표시 제목인풋 태그 태그인풋 내용 내용인풋 취소
// 확인 버튼
