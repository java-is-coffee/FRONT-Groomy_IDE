import React, { useState } from "react";
import { removeComment } from "../../../api/board/comment/removeComment";
import { BoardId, CommentDetails } from "../../../api/board/getCommentList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { patchComment } from "../../../redux/reducers/boardReducer";
import useBoardHooks from "../../../hooks/board/boardHook";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import CommentEditModal from "./commentEditModal";

function CommentDropdown({ comment }: { comment: CommentDetails }) {
  const curId = useSelector((state: RootState) => state.board.contentId);
  const boardIdData: BoardId = {
    boardId: curId,
  };

  const dispatch = useDispatch();
  const boardHooks = useBoardHooks();
  //const [commentIsEdit, setcommentIsEdit] = useState(false);

  const [isDropdown, setIsDropdown] = useState(false);
  const [commentIsEdit, setCommentIsEdit] = useState(false);

  //s누르는 순간 편집할 커멘트 정보가 업데이트됨
  const handleEdit = (comment: CommentDetails) => {
    if (commentIsEdit === false) {
      console.log("수정 시작");
      setCommentIsEdit(true);
      dispatch(patchComment(comment));
      console.log(commentIsEdit);
    } else {
      console.log("왜안됨");
      setCommentIsEdit(false);
      // dispatch(patchComment(comment));
      // setcommentEdit(true);
    }
  };

  const hadleDelete = async (comment: CommentDetails) => {
    if (!window.confirm("댓글을 삭제 하시겠습니까?")) {
    } else {
      if (comment) {
        await removeComment(comment.commentId);
        if (boardIdData.boardId) {
          boardHooks.updateBoardDetail(boardIdData.boardId);
          boardHooks.updateCommentList(boardIdData.boardId);
        }
      }
    }
  };

  const handleDropdown = () => {
    if (isDropdown === false) setIsDropdown(true);
    else setIsDropdown(false);
  };

  const handleOut = () => {
    console.log("떠나");
    setIsDropdown(false);
  };

  return (
    <div>
      <div className="float-right project-card-dropdown">
        <HiOutlineDotsHorizontal
          className="hori-dot"
          size={24}
          onClick={handleDropdown}
          onBlur={handleOut}
        />
        {isDropdown ? (
          <div
            id={`${comment.commentId}drop`}
            className="project-card-dropdown-menu "
          >
            <div className="dropdown-item" onClick={() => handleEdit(comment)}>
              Edit
            </div>
            <div className="dropdown-item" onClick={() => hadleDelete(comment)}>
              Delete
            </div>
          </div>
        ) : (
          " "
        )}
      </div>
      {commentIsEdit ? (
        <CommentEditModal setcommentEdit={setCommentIsEdit} />
      ) : null}
    </div>
  );
}

export default CommentDropdown;
