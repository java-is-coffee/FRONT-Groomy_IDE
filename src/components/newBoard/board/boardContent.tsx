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
import { setBackLog } from "../../../redux/reducers/myPageReducer";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { TfiCommentAlt } from "react-icons/tfi";

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
  const isBack = useSelector((state: RootState) => state.myPage.isBack);

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
    if (isBack) {
      dispatch(patchContent(null));
      dispatch(setMainOption(ContentType.MyPage));
      dispatch(setBackLog(!isBack));
    }
  };

  const handleEdit = (event: React.MouseEvent) => {
    dispatch(patchIsEdited(true));
    dispatch(setIdeOption(IdeOptionType.BoardWrite));
    dispatch(setMainOption(ContentType.BoardWrite));
  };

  const hadleDelete = async (event: React.MouseEvent) => {
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
    <div className={styled.boardContentContainer}>
      <div className={styled.option}>
        <MdKeyboardArrowLeft
          className={styled.iconButton}
          size={"28px"}
          onClick={backList}
        />
        {checkOwner ? (
          <div className={styled.editDropdownContainer}>
            <HiOutlineDotsHorizontal
              className={styled.iconButton}
              size={"28px"}
              onClick={() => setBoardOptionCheck((prev) => !prev)}
            />
            <div
              className={`${styled.editDropdownMenu} ${
                boardOptionCheck
                  ? styled.dropdownMenuVisible
                  : styled.dropdownMenuHidden
              }`}
            >
              <button onClick={handleEdit}>EDIT</button>
              <button onClick={hadleDelete}>DELETE</button>
            </div>
          </div>
        ) : curContent?.memberScrapped ? (
          <CiBookmarkMinus size={"28px"} onClick={handleScrap} />
        ) : (
          <CiBookmarkPlus size={"28px"} onClick={handleScrap} />
        )}
      </div>
      <div className={styled.headerSection}>
        <div className={styled.contentHeader}>
          <span className={styled.boardTitle}>{curContent?.title}</span>
          {curContent && curContent.completed ? (
            <span
              className={styled.statusBadge}
              style={{ backgroundColor: "green", color: "white" }}
            >
              해결됨
            </span>
          ) : (
            <span
              className={styled.statusBadge}
              style={{ backgroundColor: "tomato", color: "white" }}
            >
              미해결
            </span>
          )}
        </div>
      </div>
      <div className={styled.postMetadata}>
        <span className={styled.nickname}>{curContent?.nickname}</span>
        <span className={styled.separator}></span>
        <span className={styled.createdTime}>
          {dateFormat(curContent?.createdTime)}
        </span>
        <span className={styled.Separator}></span>
        <span className={styled.viewNumber}>
          조회수: {curContent?.viewNumber}
        </span>
        <span className={styled.comment}>
          답변: {curContent?.commentNumber}
        </span>
      </div>
      {curContent && (
        <MDEditor.Markdown
          style={{
            padding: "7px",
            marginTop: "20px",
            backgroundColor: "unset",
            color: "black",
          }}
          source={curContent.content}
        />
      )}
      <div className={styled.optionBtn}>
        <div className={styled.interactionStats}>
          <div className={styled.iconContainer}>
            <FaThumbsUp size={"14px"} onClick={handleHelp} />
          </div>
          {curContent?.helpNumber}
        </div>
        <div className={styled.interactionStats}>
          <div>
            <MdOutlineBookmarkAdd size={"18px"} onClick={handleScrap} />
          </div>
          {curContent?.scrapNumber}
        </div>
        <div className={styled.interactionStats}>
          <div>
            <TfiCommentAlt size={"14px"} />
          </div>
          {curContent?.commentNumber}
        </div>
      </div>
      <Comment />
    </div>
  );
};
export default BoardContent;
