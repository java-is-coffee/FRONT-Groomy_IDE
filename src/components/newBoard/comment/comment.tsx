import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../../../styles/board/board.css";

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

function Comment() {
  const [content, setContent] = useState("");
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

  function onChangeContent(event: React.FormEvent<HTMLTextAreaElement>): void {
    setContent(event.currentTarget.value);
  }

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
        alert("동일인은 추천 불가능 합니다.");
      } else {
        boardHooks.updateCommentList(curId);
        dispatch(patchComment(fixContent));
      }
    }
  };

  return (
    // 댓글 목록
    <div className="">
      <form onSubmit={handleSubmit}>
        <textarea
          rows={3}
          className="comment-input"
          value={content}
          onChange={onChangeContent}
        ></textarea>
        <button type="submit">댓글 달기</button>
      </form>
      {/* 댓글 출력 */}
      {commentList &&
        commentList.map((comment) => (
          <div
            key={comment.commentId}
            className={`"comment-box mt-15 ${
              comment.originComment ? "reply" : " "
            } "`}
          >
            <hr />

            {/* 작성자 아이콘 & 관리 아이콘 */}
            <div className="display-flex-space-between relative">
              <div className="display-flex-center">
                <FaUserCircle size={24} />
                <h4 className="inline ml-15">{comment.nickname}</h4>
              </div>

              {userInfo?.memberId === comment.memberId ? (
                <CommentDropdown comment={comment} />
              ) : null}
            </div>

            {comment.commentStatus === "DELETED" ? (
              " "
            ) : (
              <>
                <span className="float-right">{comment.helpNumber}</span>
                <FaThumbsUp
                  className="float-right mr-15"
                  onClick={handleHelp}
                  id={`${comment.commentId}`}
                />
              </>
            )}

            <div className="comment-content">
              <div id={`${comment.commentId}comment`}>{comment.content}</div>
            </div>

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
