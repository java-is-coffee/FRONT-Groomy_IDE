import React, { useEffect, useState } from "react";
import "../../styles/project/projectListContainer.css";
import "../../styles/board/board.css";
import "../../styles/board/boardDropBox.css";
import { ContentType } from "../../routes/home";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaThumbsUp } from "react-icons/fa";
import {
  patchBoardList,
  patchContent,
  patchIsEdited,
} from "../../redux/reducers/boardReducer";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Comment from "./comment/comment";
import { removeBoard } from "../../api/board/removeBoard";
import useBoardUpdate from "../../hooks/board/boardHook";
import { postHelpNumber } from "../../api/board/board/postHelpNumber";
import { FaBookmark } from "react-icons/fa";
import { postScrapToggle } from "../../api/board/board/postScrapToggle";
import MDEditor from "@uiw/react-md-editor";
// import { CiBookmarkPlus } from "react-icons/ci";

const BoardContent = ({
  onSelectContents,
}: {
  onSelectContents: (content: ContentType) => void;
}) => {
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
      onSelectContents(ContentType.BoardList);
    }
  };

  const handleEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    dispatch(patchIsEdited(true));
    onSelectContents(ContentType.BoardWrite);
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
        onSelectContents(ContentType.BoardList);
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
        alert("동일인은 추천 불가능 합니다.");
      } else {
        dispatch(patchContent(fixContent));
      }
    }
  };

  return (
    <div className="w-80 p-15 test box-border">
      <div className="relative flex-space-betwwen">
        <MdKeyboardArrowLeft
          className="hori-dot"
          size={48}
          onClick={backList}
        />
        {curContent && curContent.completed ? (
          <span className="board-item-completed-box">해결됨</span>
        ) : (
          <span className="board-item-completed-box">미해결</span>
        )}
        {checkOwner ? (
          <div className="float-right project-card-dropdown">
            <HiOutlineDotsHorizontal
              className="hori-dot"
              size={48}
              onClick={() => setBoardOptionCheck((prev) => !prev)}
            />
            <div
              className={`project-card-dropdown-menu ${
                boardOptionCheck ? " " : "hidden"
              }`}
            >
              <div className="dropdown-item" onClick={handleEdit}>
                Edit
              </div>
              <div className="dropdown-item" onClick={hadleDelete}>
                Delete
              </div>
            </div>
          </div>
        ) : null}
        <FaBookmark className="float-right" size={36} onClick={handleScrap} />
      </div>

      <h1>{curContent?.title}</h1>

      <div>
        {curContent?.nickname} | {curContent?.createdTime} | 조회수 :{" "}
        {curContent?.viewNumber}
      </div>
      <hr />

      {curContent ? (
        <MDEditor.Markdown
          style={{ padding: 30 }}
          source={curContent.content}
        />
      ) : (
        " "
      )}

      <h3 className="display-flex-justify-center display-flex-center">
        <FaThumbsUp size={36} className="mr-15" onClick={handleHelp} />
        도움됐어요! : {curContent?.helpNumber}
      </h3>
      <h5 className="display-flex-justify-center display-flex-center">
        스크랩 : {curContent?.scrapNumber}
      </h5>
      <h2>답변 {curContent?.commentNumber}</h2>
      <hr />
      <Comment />
    </div>
  );
};
export default BoardContent;
