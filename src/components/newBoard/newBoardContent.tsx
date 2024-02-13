import React, { useState } from "react";
import "../../styles/board/board.css";
import { FaClipboard } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { NewBoard, postNewBoard } from "../../api/board/postNewBoard";
import {
  UpdateBoard,
  updateBoardContent,
} from "../../api/board/updateBoardContent";
import { ContentType } from "../../routes/home";

function BoardWritePage({
  onSelectContents,
}: {
  onSelectContents: (content: ContentType) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const user = useSelector((state: RootState) => state.member.member);
  const isEdit = useSelector((state: RootState) => state.board.isEdited);
  const savedContent = useSelector((state: RootState) => state.board.content);

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

  // function checkAnony(event: React.FormEvent<HTMLInputElement>): void {
  //   const value = event.currentTarget.checked;

  // }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user?.nickname && user.memberId) {
      const requestDTO: NewBoard = {
        memberId: user.memberId,
        nickname: user.nickname,
        title: title,
        content: content,
        completed: isCompleted,
      };

      await postNewBoard(requestDTO);
      onSelectContents(ContentType.BoardList);
    }
  };

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user?.nickname && user.memberId && savedContent) {
      const requestDTO: UpdateBoard = {
        memberId: user.memberId,
        nickname: user.nickname,
        title: title,
        content: content,
        completed: isCompleted,
      };
      console.log(savedContent.boardId);

      await updateBoardContent(requestDTO, savedContent.boardId);
    }
  };

  if (isEdit && savedContent) {
    return (
      <div className="w-50 p-15 test box-border">
        <div className="board-top  line-bottom display-flex-start">
          <FaClipboard className="mr-15" size={25} />
          질문 작성
        </div>

        <form className="mt-30" onSubmit={handleEdit}>
          <div className="mt-15">
            <span className="font-bold">제목</span>
            <span className="float-right">
              <input type="checkbox" name="anonymous" />
              <span>익명 선택</span>
            </span>
            <span className="float-right mr-15">
              <input
                type="checkbox"
                name="completed"
                onChange={checkCompleted}
              />
              <span>해결</span>
            </span>
            <div className="mt-15">
              <input
                type="text"
                name="title"
                className="input-box"
                required
                onChange={onChangeTitle}
                defaultValue={savedContent.title}
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
                defaultValue={savedContent.content}
              />
            </div>
          </div>

          <div className="float-right mr-15">
            <button className="mr-15 board-write-btn bg-white">취소</button>
            <button className="board-write-btn bg-sub-color" type="submit">
              작성
            </button>
          </div>
        </form>
      </div>
    );
  }

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
            <input type="checkbox" name="anonymous" />
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
          <button className="mr-15 board-write-btn bg-white">취소</button>
          <button className="board-write-btn bg-sub-color" type="submit">
            작성
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardWritePage;
