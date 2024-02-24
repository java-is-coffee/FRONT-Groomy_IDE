import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { CommentDetail, newComment } from "../../../api/board/newComment";
import { BoardId } from "../../../api/board/getCommentList";
import useBoardHooks from "../../../hooks/board/boardHook";
import Reply from "./reply";

import MDEditor from "@uiw/react-md-editor";
import styled from "./comment.module.css";
import { Button } from "@mui/material";

import { toast } from "react-toastify";

import CommentItem from "./commentItem";

function Comment() {
  const [content, setContent] = useState<string | undefined>("");
  const boardHooks = useBoardHooks();

  const userInfo = useSelector((state: RootState) => state.member.member);
  const curId = useSelector((state: RootState) => state.board.contentId);
  const boardData = useSelector((state: RootState) => state.board.content);

  const commentList = useSelector(
    (state: RootState) => state.board.commentList
  );

  const boardIdData: BoardId = {
    boardId: curId,
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (content === "") {
      toast.error("댓글을 입력해주세요.");
      return;
    }

    if (curId !== null && userInfo?.nickname && userInfo.memberId) {
      const comment: CommentDetail = {
        boardId: curId,
        content: content,
        nickname: userInfo.nickname,
        originComment: null,
        memberId: userInfo.memberId,
      };

      await newComment(comment);

      if (boardIdData.boardId) {
        boardHooks.updateBoardDetail(boardIdData.boardId);
        boardHooks.updateCommentList(boardIdData.boardId);
        setContent("");
      }
    }
  };

  return (
    // 댓글 목록
    <div style={{ marginTop: "20px" }}>
      <form onSubmit={handleSubmit}>
        <MDEditor
          height={200}
          value={content}
          preview="edit"
          onChange={(val) => setContent(val)}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "8vh",
          }}
        >
          <h3>답변 : {boardData?.commentNumber} </h3>
          <Button
            type="submit"
            variant="contained"
            style={{ float: "right", marginTop: "10px" }}
          >
            답변 달기
          </Button>
        </div>
      </form>

      <div>
        <hr />
        {commentList &&
          commentList.map((comment) => (
            <div
              key={comment.commentId}
              style={{ marginTop: "15px", borderBottom: "4px solid #d9d9d9" }}
              className={` ${
                comment.originComment ? `${styled.reply}` : " "
              } "`}
            >
              <CommentItem comment={comment} />

              {comment.originComment === null ? (
                <Reply originComment={comment} />
              ) : (
                " "
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Comment;
