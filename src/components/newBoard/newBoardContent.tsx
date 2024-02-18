import React, { useState } from "react";
import "../../styles/board/board.css";
import { FaClipboard } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { NewBoard, postNewBoard } from "../../api/board/postNewBoard";
import {
  UpdateBoard,
  updateBoardContent,
} from "../../api/board/updateBoardContent";
import { ContentType } from "../../routes/home";
import {
  patchBoardList,
  patchContent,
  patchCurrentPage,
} from "../../redux/reducers/boardReducer";

function BoardWritePage({
  onSelectContents,
}: {
  onSelectContents: (content: ContentType) => void;
}) {
  const savedContent = useSelector((state: RootState) => state.board.content);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
      onSelectContents(ContentType.BoardContent);
    }
    //수정이 아니다 > 새로운 게시글 > 바로 게시글 리스트로
    onSelectContents(ContentType.BoardList);
  };

  function onChangeContent(event: React.FormEvent<HTMLTextAreaElement>): void {
    const value = event.currentTarget.value;
    setContent(value);
  }

  function checkCompleted(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.checked;
    console.log(value);
    setIsCompleted(value);
  }

  function checkAnony(event: React.FormEvent<HTMLInputElement>): void {
    const value = event.currentTarget.checked;
    setIsAnony(value);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
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
        onSelectContents(ContentType.BoardContent);
      }
    }
  };
  const dispatch = useDispatch();

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //중간 삼항연산자는 onChange가 동작안했을 경우. 해당 내용은 수정되지 않았기에 이전 내용을 가져와야함.
    if (user && savedContent) {
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
      if (response) dispatch(patchContent(response));
      onSelectContents(ContentType.BoardContent);
    }
  };

  //수정 중일 경우
  if (isEdit && savedContent) {
    return (
      <div className="w-80 p-15 test box-border">
        <div className="board-top  line-bottom display-flex-start">
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
                className="input-box"
                required
                onChange={onChangeTitle}
                defaultValue={savedContent.title}
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

  //새로운 게시글 작성
  return (
    <div className="w-80 p-15 test box-border">
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
          <button className="mr-15 board-write-btn bg-white" onClick={backList}>
            취소
          </button>
          <button className="board-write-btn bg-sub-color" type="submit">
            작성
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardWritePage;

//https://leego.tistory.com/entry/React-%EC%97%90%EB%94%94%ED%84%B0%EB%A1%9C-TOAST-UI-Editor-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0
//토스트ui
