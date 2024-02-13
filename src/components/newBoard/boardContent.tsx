import React from "react";
import "../../styles/project/projectListContainer.css";
import "../../styles/board/board.css";
import "../../styles/board/boardDropBox.css";
import { ContentType } from "../../routes/home";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { PageNumber, patchBoardList } from "../../api/board/patchBoardList";
import { MdKeyboardArrowLeft } from "react-icons/md";
import {
  BoardDetails,
  patchBoard,
  patchIsEdited,
} from "../../redux/reducers/boardReducer";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Comment from "./comment";
import { removeBoard } from "../../api/board/removeBoard";

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

  const dispatch = useDispatch();

  //이전 화면으로 돌아갈때 필요한 정보 가져오기
  const fetchBoardListData = async () => {
    try {
      const Page: PageNumber = {
        page: beforePageIndex,
      };
      console.log("콘텐츠 내용에서 패치하기");
      const storedBoard: BoardDetails[] | null = await patchBoardList(Page);
      console.log(storedBoard);
      if (storedBoard) {
        dispatch(patchBoard(storedBoard));
      }
    } catch (error) {
      console.log("api 에러");
    }
  };

  const backList = () => {
    fetchBoardListData();
    onSelectContents(ContentType.BoardList);
  };

  const handleEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log(curContent);
    dispatch(patchIsEdited(true));
    onSelectContents(ContentType.BoardWrite);
  };

  const hadleDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (curContent) {
      removeBoard(curContent?.boardId);
      fetchBoardListData();
      onSelectContents(ContentType.BoardList);
    }
  };

  return (
    <div className="w-50 p-15 test box-border">
      <div className="relative">
        <MdKeyboardArrowLeft
          className="hori-dot"
          size={48}
          onClick={backList}
        />
        {checkOwner ? (
          <div className="float-right project-card-dropdown">
            <HiOutlineDotsHorizontal className="hori-dot" size={48} />
            <div className="project-card-dropdown-menu">
              <div className="dropdown-item" onClick={handleEdit}>
                Edit
              </div>
              <div className="dropdown-item" onClick={hadleDelete}>
                Delete
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <h1>{curContent?.title}</h1>

      <div>
        {curContent?.nickname} | {curContent?.createdTime} | 조회수 :{" "}
        {curContent?.viewNumber}
      </div>
      <hr />

      <div className="board-content-content">{curContent?.content}</div>
      <h2>답변 {curContent?.commentNumber}</h2>
      <hr />
      <Comment />
    </div>
  );
};
export default BoardContent;
