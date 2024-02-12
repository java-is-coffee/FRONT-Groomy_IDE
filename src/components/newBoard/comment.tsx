import React, { useCallback, useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../../styles/board/board.css";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { CommentDetail, newComment } from "../../api/board/newComment";
import {
  patchCommentList,
  CommentDetails,
  BoardId,
} from "../../api/board/patchCommentList";
import { patchComment } from "../../redux/reducers/boardReducer";

interface CommentInfo {
  commentId: number;
  content: string;
  nickname: string;
  helpNumber: number;
  createdTime: string;
  originComment: number | null;
  memberId: number;
}

interface RequestDTO {
  commentDetail: CommentDetail;
  boardId: number;
}

const baseUrl =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/";

const accessToken = localStorage.getItem("accessToken");

function Comment() {
  const [commentId, setCommentId] = useState(0);
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [helpNumber, setHelpNumber] = useState(0);
  const [createdTime, setCreatedTime] = useState("");
  const [originComment, setOriginComment] = useState(null);
  const [memberId, setMemberId] = useState(0);
  const [writeReply, setWriteReply] = useState(false);

  const user = useSelector((state: RootState) => state.member.member);
  const savedBoardId = useSelector((state: RootState) => state.board.contentId);

  const savedCommentList = useSelector(
    (state: RootState) => state.board.commentList
  );

  const commentList = useSelector(
    (state: RootState) => state.board.commentList
  );

  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (savedBoardId !== null && user?.nickname && user.memberId) {
      const comment: CommentDetail = {
        boardId: savedBoardId,
        content: content,
        nickname: user.nickname,
        originComment: null,
        memberId: user.memberId,
      };
      await newComment(comment);
    }
  };

  useEffect(() => {
    console.log("test");
    const fetchcommentList = async () => {
      try {
        const boardIdData: BoardId = {
          boardId: savedBoardId,
        };
        if (savedBoardId) {
          const commentListData = await patchCommentList(boardIdData);
          if (commentListData) {
            dispatch(patchComment(commentListData));
          }
        }
      } catch (error) {}
    };
    if (!commentList) {
      fetchcommentList();
    }
  }, [accessToken, commentList, dispatch, handleSubmit]);

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
            <div className="display-flex-space-between">
              <div className="display-flex-center">
                <FaUserCircle size={24} />
                <h4 className="inline ml-15">{data.nickname}</h4>
              </div>

              <div className="float-right display-flex-center">
                <HiOutlineDotsHorizontal size={24} />
              </div>
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
