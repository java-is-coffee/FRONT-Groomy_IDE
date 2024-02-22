import React, { useEffect, useState } from "react";

import { ContentType } from "../../../enum/mainOptionType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaThumbsUp } from "react-icons/fa";
import {
  patchBoardList,
  patchContent,
  patchIsEdited,
} from "../../../redux/reducers/boardReducer";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Comment from "../comment/comment";
import { removeBoard } from "../../../api/board/removeBoard";
import useBoardUpdate from "../../../hooks/board/boardHook";
import { postHelpNumber } from "../../../api/board/board/postHelpNumber";
import { postScrapToggle } from "../../../api/board/board/postScrapToggle";
import MDEditor from "@uiw/react-md-editor";
import { CiBookmarkPlus } from "react-icons/ci";
import { CiBookmarkMinus } from "react-icons/ci";
import styled from "./boardContent.module.css";
import { setIdeOption } from "../../../redux/reducers/ide/ideOptionReducer";
import IdeOptionType from "../../../enum/ideOptionType";
import { setMainOption } from "../../../redux/reducers/mainpageReducer";

const BoardContent = () => {
  const curContent = useSelector((state: RootState) => state.board.content);
  const userInfo = useSelector((state: RootState) => state.member.member);
  const beforePageIndex = useSelector(
    (state: RootState) => state.board.currentPage
  );
  const checkOwner = userInfo?.memberId === curContent?.memberId;

  const boardIds = useSelector((state: RootState) => state.board.contentId);
  const boardHooks = useBoardUpdate();

  const [boardOptionCheck, setBoardOptionCheck] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBoardData = async (id: number) => {
      await boardHooks.updateBoardDetail(id);
    };
    if (curContent === null && boardIds) {
      fetchBoardData(boardIds);
    }
  }, [dispatch, curContent, boardIds, boardHooks]);

  //컨텐츠 비우기
  const backList = () => {
    if (beforePageIndex) {
      boardHooks.updateBoardList(beforePageIndex);
      dispatch(patchContent(null));
      dispatch(setIdeOption(IdeOptionType.BoardList));
      dispatch(setMainOption(ContentType.BoardList));
    }
  };

  const handleEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    dispatch(patchIsEdited(true));
    dispatch(setIdeOption(IdeOptionType.BoardWrite));
    dispatch(setMainOption(ContentType.BoardWrite));
  };

  const hadleDelete = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!window.confirm("게시글을 삭제 하시겠습니까?")) {
      alert("게시글 삭제가 취소 되었습니다.");
    } else {
      if (curContent) {
        await removeBoard(curContent.boardId);
        dispatch(patchContent(null));
        dispatch(patchBoardList(null));
      }
    }
  };

  const handleScrap = async (event: React.MouseEvent<SVGAElement>) => {
    event.preventDefault();
    if (curContent) {
      const result = await postScrapToggle(curContent.boardId);
      if (result) {
        dispatch(patchContent(result));
      }
    }
  };

  const handleHelp = async (event: React.MouseEvent<SVGAElement>) => {
    event.preventDefault();
    if (curContent && userInfo) {
      const fixContent = await postHelpNumber(
        curContent.boardId,
        userInfo.memberId
      );
      if (fixContent === null) {
        alert("자신의 게시글은 추천 불가능 합니다.");
      } else {
        dispatch(patchContent(fixContent));
      }
    }
  };

  function dateFormat(date: string | undefined): string {
    if (date) {
      let editDate = date.substring(0, 19);
      let sliceDate = editDate.split("T");

      const result = sliceDate[0] + " " + sliceDate[1];
      return result;
    }
    return "null";
  }

  return (
    <div className={styled["content-container"]}>
      <div className={styled.top}>
        <MdKeyboardArrowLeft
          className={styled.dot}
          size={48}
          onClick={backList}
        />
        {curContent && curContent.completed ? (
          <span className={styled["completed-box"]}>해결됨</span>
        ) : (
          <span className={styled["completed-box"]}>미해결</span>
        )}
        {checkOwner ? (
          <div className={styled["dropdown"]}>
            <HiOutlineDotsHorizontal
              className={styled.dot}
              size={48}
              onClick={() => setBoardOptionCheck((prev) => !prev)}
            />
            <div
              className={`${styled["dropdown-menu"]} ${
                boardOptionCheck ? " " : `${styled["hidden"]}`
              }`}
            >
              <div className={styled["dropdown-item"]} onClick={handleEdit}>
                Edit
              </div>
              <div className={styled["dropdown-item"]} onClick={hadleDelete}>
                Delete
              </div>
            </div>
          </div>
        ) : curContent?.memberScrapped ? (
          <CiBookmarkMinus size={48} onClick={handleScrap} />
        ) : (
          <CiBookmarkPlus size={48} onClick={handleScrap} />
        )}
      </div>

      <h1>{curContent?.title}</h1>

      <div>
        {curContent?.nickname} | {dateFormat(curContent?.createdTime)} | 조회수
        : {curContent?.viewNumber}
      </div>
      <hr />

      {curContent ? (
        <MDEditor.Markdown
          style={{ padding: 30, backgroundColor: "unset" }}
          source={curContent.content}
        />
      ) : (
        " "
      )}

      <h3 className={styled["help-container"]}>
        <FaThumbsUp
          size={36}
          style={{ marginRight: "15px" }}
          onClick={handleHelp}
        />
        도움됐어요! : {curContent?.helpNumber}
      </h3>
      <h5 className={styled["help-container"]}>
        스크랩 : {curContent?.scrapNumber}
      </h5>
      <h2>답변 {curContent?.commentNumber}</h2>
      <hr />
      <Comment />
    </div>
  );
};
export default BoardContent;