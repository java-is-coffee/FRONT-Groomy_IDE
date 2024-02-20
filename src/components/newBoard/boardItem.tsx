import React from "react";

import "../../styles/board/board.css";
// import styles from "./boardList.module.css";
import { FaRegThumbsUp } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { FaRegCommentDots } from "react-icons/fa";
import { BoardDetails } from "../../redux/reducers/boardReducer";

type boardProps = {
  BoardDetails: BoardDetails;
};

const deleteTag = (origin: string): string => {
  const extractTextPattern = /(<([^>]+)>)/gi;

  const fixContent = origin.replace(extractTextPattern, "");
  return fixContent;
};

const BoardItem: React.FC<boardProps> = ({ BoardDetails }) => {
  return (
    // 게시글 상단 미해결 과 제목
    <div className="board-item box-border p-15" id={`${BoardDetails.boardId}`}>
      <div className="board-item-top mt-15">
        {BoardDetails.completed ? (
          <span className="board-item-completed-box">해결됨</span>
        ) : (
          <span className="board-item-completed-box">미해결</span>
        )}
        <span>{BoardDetails.title}</span>
      </div>

      {/* 내용  */}
      <div className="board-item-content">
        {deleteTag(BoardDetails.content)}
      </div>

      {/* 멤버 아이디 */}
      <div className="board-item-bottom">
        <span className="board-item-user-name">{BoardDetails.nickname}</span>
        <div className="float-right">
          <span className="board-item-bottom-icon">
            <FaRegThumbsUp />
            <span className="board-item-bottom-icon-number">
              {BoardDetails.helpNumber}
            </span>
          </span>

          {/* 도움, 댓글 갯수  */}
          <span className="board-item-bottom-icon">
            <GrView />
            <span className="board-item-bottom-icon-number">
              {BoardDetails.viewNumber}
            </span>
          </span>
          <span className="board-item-bottom-icon">
            <FaRegCommentDots />
            <span className="board-item-bottom-icon-number">
              {BoardDetails.commentNumber}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default BoardItem;
