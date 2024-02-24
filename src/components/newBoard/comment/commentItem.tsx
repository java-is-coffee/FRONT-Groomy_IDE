import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";
import { FaThumbsUp } from "react-icons/fa6";
import styled from "./comment.module.css";
import useRankHooks from "../../../hooks/userRank";
import { CommentDetails } from "../../../api/board/getCommentList";
import { RootState } from "../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import CommentDropdown from "./commentDropdown";
import { postHelpNumber } from "../../../api/board/comment/postHelpNumber";
import { patchComment } from "../../../redux/reducers/boardReducer";
import useBoardHooks from "../../../hooks/board/boardHook";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { UpdateComent, updateComment } from "../../../api/board/updateComment";

const CommentItem = ({ comment }: { comment: CommentDetails }) => {
  const userRankHook = useRankHooks();
  const boardHooks = useBoardHooks();
  const userInfo = useSelector((state: RootState) => state.member.member);
  const curId = useSelector((state: RootState) => state.board.contentId);
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState<string | undefined>(comment.content);

  const dispatch = useDispatch();

  const handleHelp = async (event: React.MouseEvent<SVGAElement>) => {
    const id = event.currentTarget.getAttribute("id");
    if (id && userInfo) {
      const intId = parseInt(id!);

      if (intId === comment.commentId) {
        toast.error("자신의 댓글은 추천 불가능합니다.");
        return;
      }

      const fixContent: CommentDetails | null = await postHelpNumber(
        intId,
        userInfo.memberId
      );

      boardHooks.updateCommentList(curId);
      dispatch(patchComment(fixContent));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (content === "") {
      toast.error("댓글을 입력해주세요 ㅠㅠ");
      return;
    }

    if (content && userInfo?.nickname) {
      const editComment: UpdateComent = {
        nickname: userInfo.nickname,
        content: content,
      };

      const response = await updateComment(editComment, comment.commentId);

      if (response) {
        toast.success("수정 완료");
        boardHooks.updateBoardDetail(comment.boardId);
        boardHooks.updateCommentList(comment.boardId);
        setIsEdit(false);
      } else {
        toast.error("에러 발생 다시 시도해주세요.");
      }
    }
  };

  return (
    <div>
      {/* 작성자 아이콘 & 관리 아이콘 */}
      <div className={styled["icon-box"]}>
        <div className={styled["flex"]}>
          <img
            style={{ width: "40px", marginRight: "5px" }}
            src={`icon/rankIcon/${userRankHook.getUserRank(
              comment.memberHelpNumber
            )}.png`}
            alt="유저 등급"
          />
          <h4 className={styled.nickname}>{comment.nickname}</h4>
          {comment.commentStatus !== "DELETED" ? (
            <span>{boardHooks.dateFormat(comment.createdTime)}</span>
          ) : (
            " "
          )}
        </div>

        {userInfo?.memberId === comment.memberId ? (
          <CommentDropdown
            comment={comment}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
          />
        ) : null}
      </div>

      {comment.commentStatus === "DELETED" ? (
        " "
      ) : (
        <>
          <div className={styled.interactionStats}>
            <div className={styled.iconContainer}>
              <FaThumbsUp
                size={"14px"}
                onClick={handleHelp}
                id={`${comment.commentId}`}
              />
            </div>
            {comment.helpNumber}
          </div>
        </>
      )}

      {!isEdit ? (
        <MDEditor.Markdown
          style={{ padding: 15, backgroundColor: "unset" }}
          source={comment.content}
        />
      ) : (
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
            <Button
              type="submit"
              variant="contained"
              style={{ float: "right", marginTop: "10px" }}
            >
              답변 달기
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CommentItem;
