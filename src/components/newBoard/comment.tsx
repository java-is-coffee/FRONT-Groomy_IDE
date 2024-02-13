import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../../styles/board/board.css";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { CommentDetail, newComment } from "../../api/board/newComment";
import { patchCommentList, BoardId } from "../../api/board/patchCommentList";
import { patchComment, patchContent } from "../../redux/reducers/boardReducer";
import { patchBoardContent } from "../../api/board/patchBoardContent";

function Comment() {
  const [content, setContent] = useState("");

  const [writeReply, setWriteReply] = useState(false);

  const userInfo = useSelector((state: RootState) => state.member.member);
  const curId = useSelector((state: RootState) => state.board.contentId);

  const commentList = useSelector(
    (state: RootState) => state.board.commentList
  );

  const boardIdData: BoardId = {
    boardId: curId,
  };

  const dispatch = useDispatch();

  const handleEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log(event.currentTarget);
  };

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
      const commentListData = await patchCommentList(boardIdData);
      const newBoardData = await patchBoardContent(boardIdData);
      if (commentListData && newBoardData) {
        dispatch(patchComment(commentListData));
        dispatch(patchContent(newBoardData));
      }
    }
  };

  function onChangeContent(event: React.FormEvent<HTMLTextAreaElement>): void {
    const value = event.currentTarget.value;
    setContent(value);
  }

  return (
    // 댓글 목록
    <div className="">
      <form onSubmit={handleSubmit}>
        <textarea
          rows={3}
          className="comment-input"
          onChange={onChangeContent}
        ></textarea>
        <button type="submit">댓글 달기</button>
      </form>
      {/* 댓글 출력 */}
      {commentList &&
        commentList.map((data) => (
          <div key={data.commentId} className="comment-box mt-15">
            <hr />

            {/* 작성자 아이콘 & 관리 아이콘 */}
            <div className="display-flex-space-between relative">
              <div className="display-flex-center">
                <FaUserCircle size={24} />
                <h4 className="inline ml-15">{data.nickname}</h4>
              </div>

              {userInfo?.memberId === data.memberId ? (
                <div>
                  <div className="float-right project-card-dropdown">
                    <HiOutlineDotsHorizontal className="hori-dot" size={24} />
                    <div className="project-card-dropdown-menu">
                      <div
                        className="dropdown-item"
                        id={`${data.commentId}Edit`}
                        onClick={handleEdit}
                      >
                        Edit
                      </div>
                      <div className="dropdown-item">Delete</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="comment-content">{data.content}</div>
            <div className="display-flex-row-reverse ">
              <button
                id={`${data.commentId}`}
                onClick={() => setWriteReply(!writeReply)}
              >
                대댓글 작성
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Comment;
