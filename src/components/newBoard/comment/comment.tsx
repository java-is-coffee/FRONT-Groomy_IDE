import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { CommentDetail, newComment } from "../../../api/board/newComment";
import { BoardId, CommentDetails } from "../../../api/board/getCommentList";
import useBoardHooks from "../../../hooks/board/boardHook";
import CommentDropdown from "./commentDropdown";
import Reply from "./reply";
import { FaThumbsUp } from "react-icons/fa";
import { postHelpNumber } from "../../../api/board/comment/postHelpNumber";
import { patchComment } from "../../../redux/reducers/boardReducer";
import MDEditor from "@uiw/react-md-editor";
import styled from "./comment.module.css";
import { Button } from "@mui/material";

function Comment() {
  const [content, setContent] = useState<string | undefined>("");
  const boardHooks = useBoardHooks();

  const userInfo = useSelector((state: RootState) => state.member.member);
  const curId = useSelector((state: RootState) => state.board.contentId);

  const commentList = useSelector(
    (state: RootState) => state.board.commentList
  );

  const boardIdData: BoardId = {
    boardId: curId,
  };

  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

  const handleHelp = async (event: React.MouseEvent<SVGAElement>) => {
    event.preventDefault();
    const id = event.currentTarget.getAttribute("id");

    if (id && userInfo) {
      const intId = parseInt(id);
      const fixContent: CommentDetails | null = await postHelpNumber(
        intId,
        userInfo.memberId
      );
      if (fixContent === null) {
        alert("자신의 댓글은 추천 불가능 합니다.");
      } else {
        boardHooks.updateCommentList(curId);
        dispatch(patchComment(fixContent));
      }
    }
  };

  return (
    // 댓글 목록
    <div style={{ marginTop: "20px" }}>
      <form onSubmit={handleSubmit}>
        <div></div>
        <MDEditor
          height={200}
          value={content}
          preview="edit"
          onChange={(val) => setContent(val)}
        />
        <div style={{ marginTop: "15px", marginBottom: "30px" }}>
          <Button type="submit" variant="contained" style={{ float: "right" }}>
            댓글 달기
          </Button>
        </div>
      </form>
      {/* 댓글 출력 */}
      {commentList &&
        commentList.map((comment) => (
          <div
            key={comment.commentId}
            style={{ marginTop: "15px" }}
            className={` mt-15 ${
              comment.originComment ? `${styled.reply}` : " "
            } "`}
          >
            <hr />

            {/* 작성자 아이콘 & 관리 아이콘 */}
            <div className={styled["icon-box"]}>
              <div className={styled["flex"]}>
                <FaUserCircle size={24} />
                <h4 style={{ display: "inline", marginLeft: "15px" }}>
                  {comment.nickname}
                </h4>
              </div>

              {userInfo?.memberId === comment.memberId ? (
                <CommentDropdown comment={comment} />
              ) : null}
            </div>

            {comment.commentStatus === "DELETED" ? (
              " "
            ) : (
              <>
                <span style={{ float: "right" }}>{comment.helpNumber}</span>
                <FaThumbsUp
                  style={{ float: "right", marginRight: "15px" }}
                  onClick={handleHelp}
                  id={`${comment.commentId}`}
                />
              </>
            )}

            <MDEditor.Markdown
              style={{ padding: 15, backgroundColor: "unset" }}
              source={comment.content}
            />

            {comment.originComment === null ? (
              <Reply originComment={comment} />
            ) : (
              " "
            )}
          </div>
        ))}
    </div>
  );
}

export default Comment;
