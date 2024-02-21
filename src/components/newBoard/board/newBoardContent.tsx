import React, { useState } from "react";
import "../../../styles/board/board.css";
import { FaClipboard } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { NewBoard, postNewBoard } from "../../../api/board/postNewBoard";
import "react-quill/dist/quill.snow.css";
import MDEditor from "@uiw/react-md-editor";
import {
  UpdateBoard,
  updateBoardContent,
} from "../../../api/board/updateBoardContent";
import { ContentType } from "../../../enum/mainOptionType";
import {
  patchBoardList,
  patchContent,
  patchCurrentPage,
  patchIsEdited,
} from "../../../redux/reducers/boardReducer";
import styled from "./newBoardContent.module.css";
import IdeOptionType from "../../../enum/ideOptionType";
import { setIdeOption } from "../../../redux/reducers/ide/ideOptionReducer";
import { setMainOption } from "../../../redux/reducers/mainpageReducer";

function BoardWritePage() {
  const savedContent = useSelector((state: RootState) => state.board.content);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>(
    savedContent ? savedContent.content : ""
  );
  const [isCompleted, setIsCompleted] = useState(
    savedContent?.completed ? true : false
  );
  const [isAnony, setIsAnony] = useState(
    savedContent?.nickname === "익명" ? true : false
  );
  const user = useSelector((state: RootState) => state.member.member);
  const isEdit = useSelector((state: RootState) => state.board.isEdited);

  function onChangeTitle(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.value;
    setTitle(value);
  }

  const backList = () => {
    //수정 중이면 해당 게시글로
    if (isEdit) {
      dispatch(patchIsEdited(false));
      dispatch(setIdeOption(IdeOptionType.BoardContent));
      dispatch(setMainOption(ContentType.BoardContent));
    } else {
      dispatch(setIdeOption(IdeOptionType.BoardList));
      dispatch(setMainOption(ContentType.BoardList));
    }
  };

  function checkCompleted(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.checked;
    console.log(isEdit + "수정");
    console.log(value);
    setIsCompleted(value);
  }

  function checkAnony(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.checked;
    setIsAnony(value);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user && content) {
      const requestDTO: NewBoard = {
        memberId: user.memberId,
        nickname: isAnony ? "익명" : user.nickname,
        title: title,
        content: content,
        completed: isCompleted,
      };

      const response = await postNewBoard(requestDTO);
      if (response) {
        dispatch(patchCurrentPage(1));
        dispatch(patchBoardList(null));
        dispatch(patchContent(response));
        dispatch(setIdeOption(IdeOptionType.BoardList));
        dispatch(setMainOption(ContentType.BoardList));
        // onSelectContents(ContentType.BoardContent);
      }
    }
  };
  const dispatch = useDispatch();

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //중간 삼항연산자는 onChange가 동작안했을 경우. 해당 내용은 수정되지 않았기에 이전 내용을 가져와야함.
    if (user && savedContent && content) {
      const requestDTO: UpdateBoard = {
        memberId: user.memberId,
        nickname: isAnony ? "익명" : user.nickname,
        title: title === "" ? savedContent.title : title,
        content: content === "" ? savedContent.content : content,
        completed: isCompleted,
      };
      console.log(savedContent.boardId);

      const response = await updateBoardContent(
        requestDTO,
        savedContent.boardId
      );
      if (response) {
        dispatch(patchContent(response));
        dispatch(setIdeOption(IdeOptionType.BoardContent));
        dispatch(setMainOption(ContentType.BoardContent));
      }
    }
  };

  //수정 중일 경우
  if (isEdit && savedContent) {
    return (
      <div className={styled["write-container"]}>
        <div className={styled["header"]}>
          <FaClipboard className="mr-15" size={25} />
          질문 작성
        </div>

        <form className="mt-30" onSubmit={handleEdit}>
          <div className="mt-15">
            <span className="font-bold">제목</span>
            <span className="float-right">
              <input
                type="checkbox"
                name="anonymous"
                onChange={checkAnony}
                checked={isAnony}
              />
              <span>익명 선택</span>
            </span>
            <span className="float-right mr-15">
              <input
                type="checkbox"
                name="completed"
                checked={isCompleted}
                onChange={checkCompleted}
              />
              <span>해결</span>
            </span>
            <div className="mt-15">
              <input
                type="text"
                name="title"
                className={styled.input}
                required
                onChange={onChangeTitle}
                defaultValue={savedContent.title}
              />
            </div>
          </div>

          <div className="mt-15">
            <span className="font-bold">내용</span>
            <div className="float-right mr-15">
              <button className={styled.btn} onClick={backList}>
                취소
              </button>
              <button className={styled.btn} type="submit">
                작성
              </button>
            </div>
            <div className="mt-15">
              <MDEditor
                height={500}
                value={content}
                preview="edit"
                onChange={(val) => setContent(val)}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }

  //새로운 게시글 작성
  return (
    <div className={styled["write-container"]}>
      <div className={styled["header"]}>
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
              className={styled.input}
              required
              onChange={onChangeTitle}
            />
          </div>
        </div>

        <div className="mt-15">
          <span className="font-bold">내용</span>
          <div className="float-right mr-15">
            <button className={styled.btn} onClick={backList}>
              취소
            </button>
            <button className={styled.btn} type="submit">
              작성
            </button>
          </div>
          <div className="mt-15">
            <MDEditor
              height={500}
              value={content}
              preview="edit"
              onChange={(val) => setContent(val)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default BoardWritePage;
