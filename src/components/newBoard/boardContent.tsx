import React from "react";
import "../../styles/project/projectListContainer.css";
import "../../styles/board/board.css";
import { ContentType } from "../../routes/home";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { PageNumber, patchBoardList } from "../../api/board/patchBoardList";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BoardDetails } from "../../api/board/patchBoardContent";
import { patchBoard } from "../../redux/reducers/boardReducer";
import Comment from "./comment";

const BoardContent = ({
  onSelectContents,
}: {
  onSelectContents: (content: ContentType) => void;
}) => {
  const curId = useSelector((state: RootState) => state.board.contentId);
  const curContent = useSelector((state: RootState) => state.board.content);
  const beforePageIndex = useSelector(
    (state: RootState) => state.board.currentPage
  );

  const dispatch = useDispatch();

  const fetchBoardListData = async () => {
    try {
      const Page: PageNumber = {
        page: beforePageIndex,
      };
      const storedBoard: BoardDetails[] | null = await patchBoardList(Page);
      if (storedBoard) {
        dispatch(patchBoard(storedBoard));
      }
    } catch (error) {
      console.log("api 에러");
    }
  };

  const backList = () => {
    console.log(curId + "현재 페이지");
    fetchBoardListData();
    onSelectContents(ContentType.BoardList);
  };

  return (
    <div className="w-50 p-15 test box-border">
      <div>
        <MdKeyboardArrowLeft size={48} onClick={backList} />
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
