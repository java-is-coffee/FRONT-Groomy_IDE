import React from "react";

import { FaRegThumbsUp } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { FaRegCommentDots } from "react-icons/fa";
import { BoardDetails } from "../../../redux/reducers/boardReducer";
import styled from "./boardItem.module.css";

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
    <div className={styled["board-item"]} id={`${BoardDetails.boardId}`}>
      <div style={{ marginTop: "15px" }}>
        {BoardDetails.completed ? (
          <span className={styled["completed-box"]}>해결됨</span>
        ) : (
          <span className={styled["completed-box"]}>미해결</span>
        )}
        <span>{BoardDetails.title}</span>
      </div>

      {/* 내용  */}
      <div className={styled["board-item-content"]}>
        {deleteTag(BoardDetails.content)}
      </div>

      {/* 멤버 아이디 */}
      <div>
        <span>{BoardDetails.nickname}</span>
        <div className={styled.right}>
          <span className={styled["bottom-icon"]}>
            <FaRegThumbsUp />
            <span className={styled["bottom-icon-number"]}>
              {BoardDetails.helpNumber}
            </span>
          </span>

          {/* 도움, 댓글 갯수  */}
          <span className={styled["bottom-icon"]}>
            <GrView />
            <span className={styled["bottom-icon-number"]}>
              {BoardDetails.viewNumber}
            </span>
          </span>
          <span className={styled["bottom-icon"]}>
            <FaRegCommentDots />
            <span className={styled["bottom-icon-number"]}>
              {BoardDetails.commentNumber}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default BoardItem;
