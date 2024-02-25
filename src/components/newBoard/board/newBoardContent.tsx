import React, { useState } from "react";
import { FaClipboard } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { NewBoard, postNewBoard } from "../../../api/board/postNewBoard";
import {
  UpdateBoard,
  updateBoardContent,
} from "../../../api/board/updateBoardContent";
import MDEditor from "@uiw/react-md-editor";
import {
  patchBoardList,
  patchCommentList,
  patchContent,
  patchCurrentPage,
  patchIsEdited,
} from "../../../redux/reducers/boardReducer";
import styled from "./newBoardContent.module.css";
import { FormControlLabel, FormGroup, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import useBoardHooks from "../../../hooks/board/boardHook";

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

  const boardHooks = useBoardHooks();

  const backList = () => {
    //수정 중이면 해당 게시글로
    if (isEdit) {
      dispatch(patchIsEdited(false));
      boardHooks.switchOption("content");
    } else {
      boardHooks.switchOption("list");
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
        dispatch(patchCommentList(null));
        dispatch(patchContent(response));
        boardHooks.switchOption("content");
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
        boardHooks.switchOption("content");
      }
    }
  };

  return (
    <div className={styled["write-container"]}>
      <div className={styled["header"]}>
        <FaClipboard style={{ marginRight: "15px" }} size={25} />
        질문 작성
      </div>

      <form
        style={{ marginTop: "30px" }}
        onSubmit={isEdit ? handleEdit : handleSubmit}
      >
        <div className={styled[`board-title`]} style={{ marginTop: "15px" }}>
          <div className={styled[`new-board-title`]}>
            <span>제목</span>
            <div>
              <FormGroup className={styled.checkBox} row>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={isAnony}
                      onChange={checkAnony}
                      name="anonymous"
                    />
                  }
                  label="익명"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={isCompleted}
                      onChange={checkCompleted}
                      name="completed"
                    />
                  }
                  label="해결"
                />
              </FormGroup>
            </div>
          </div>
          <TextField
            id="outlined-basic"
            label="제목을 입력하세요"
            variant="filled"
            size="small"
            type="text"
            color="info"
            className={styled.input}
            required
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={isEdit && savedContent ? savedContent.title : ""}
          />
        </div>

        <div className={styled[`board-content`]} style={{ marginTop: "15px" }}>
          <span className={styled["font-bold"]}>내용</span>
          <div className={styled[`md-editor`]}>
            <MDEditor
              height={500}
              value={content}
              preview="edit"
              onChange={(val: any) => setContent(val)}
            />
          </div>
          <div className={styled[`button-container`]}>
            <button className={styled.btn} type="submit">
              등록
            </button>
            <button
              className={styled[`btn-cancel`]}
              onClick={backList}
              type="button"
            >
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BoardWritePage;
