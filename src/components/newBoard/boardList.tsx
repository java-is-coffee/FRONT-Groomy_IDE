import React, { useEffect, useState } from "react";
import "../../styles/project/projectListContainer.css";
import "../../styles/board/board.css";
import BoardItem from "./boardItem";
import { ContentType } from "../../routes/home";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {
  BoardDetails,
  patchBoardList,
  patchContent,
  patchContentId,
  patchIsSeacrh,
  patchPage,
} from "../../redux/reducers/boardReducer";
import { FaClipboardQuestion } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";
import Paging from "./paging";
import styles from "./boardList.module.css";
import { searchBoardList } from "../../api/board/searchBoardList";
import useBoardHooks from "../../hooks/board/boardHook";
import SeachPaging from "./searchPaging";
// import { Pagination } from "@mui/material";

export enum SearchCompleted {
  All = "all",
  Completed = "completed",
  NoCompleted = "no-completed",
}

const BoardListContainer = ({
  onSelectContents,
}: {
  onSelectContents: (content: ContentType) => void;
}) => {
  const accessToken = localStorage.getItem("accessToken");
  const boardList = useSelector((state: RootState) => state.board.boardList);
  // const isEdited = useSelector((state: RootState) => state.board.isEdited);
  const isSearch = useSelector((state: RootState) => state.board.isSearch);
  const [searchData, setSearchData] = useState("");
  const [searchIsCompleted, setsearchIsCompleted] = useState(
    SearchCompleted.All
  );

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const dispatch = useDispatch();
  const boardHooks = useBoardHooks();

  useEffect(() => {
    console.log("보드 리스트 업데이트 ");
    const fetchBoardList = async () => {
      await boardHooks.updateBoardList(1);
    };
    if (!boardList) {
      fetchBoardList();
    }
  }, [accessToken, boardList, boardHooks]);

  //타겟 아이디가 존재한다 > 게시글 입장. 타겟 아이디가 없다. 새로운 게시글 작성
  const chageComponent = (event: React.MouseEvent<HTMLDivElement>) => {
    const targetId = event.currentTarget.id;

    if (targetId) {
      const fetchContentId = parseInt(targetId);
      dispatch(patchContentId(fetchContentId));
      boardHooks.updateCommentList(fetchContentId);

      onSelectContents(ContentType.BoardContent);
    }
    //타겟 id가 존재하지 않는다면 새로운 게시글 이라는뜻.
    else {
      dispatch(patchContent(null));
      onSelectContents(ContentType.BoardWrite);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputData = searchData.replace(" ", "+");

    const response = await searchBoardList(1, inputData, searchIsCompleted);
    if (response) {
      dispatch(patchBoardList(response));
      dispatch(patchIsSeacrh(true));
      dispatch(patchPage(null));
    }
  };

  const searchDataSet = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchData(event.currentTarget.value);
  };

  const handleSeacrhComplete = (event: React.MouseEvent<HTMLSpanElement>) => {
    const value = event.currentTarget.getAttribute("id");

    switch (value) {
      case SearchCompleted.All:
        setsearchIsCompleted(SearchCompleted.All);
        break;
      case SearchCompleted.Completed:
        setsearchIsCompleted(SearchCompleted.Completed);
        break;
      case SearchCompleted.NoCompleted:
        setsearchIsCompleted(SearchCompleted.NoCompleted);
        break;
      default:
        setsearchIsCompleted(SearchCompleted.All);
        break;
    }
  };

  //초기화 버튼
  const resetBoadList = () => {
    dispatch(patchBoardList(null));
    dispatch(patchIsSeacrh(false));
    dispatch(patchContent(null));
    dispatch(patchPage(null));
  };

  return (
    <div className="w-80 p-15 test box-border">
      <div className="board-top  line-bottom display-flex-space-between">
        <FaClipboardQuestion
          className="mr-15"
          size={25}
          onClick={resetBoadList}
        />
        질문 게시판
        <span className="float-right">
          <SlMagnifier
            size={25}
            onClick={() => setSearchModalOpen(!searchModalOpen)}
          />
        </span>
      </div>
      {/* 검색 파트 */}
      <div id="searchForm" className={searchModalOpen ? "" : "hidden"}>
        <form onSubmit={handleSubmit} className={styles["search-box"]}>
          <div>
            <span
              id="all"
              className={`${styles["copmpleted-select-box"]} ${
                styles[
                  searchIsCompleted === SearchCompleted.All ? "selected" : " "
                ]
              }`}
              onClick={handleSeacrhComplete}
            >
              전체
            </span>
            <span
              id="completed"
              className={`${styles["copmpleted-select-box"]} ${
                styles[
                  searchIsCompleted === SearchCompleted.Completed
                    ? "selected"
                    : " "
                ]
              }`}
              onClick={handleSeacrhComplete}
            >
              해결됨
            </span>
            <span
              id="no-completed"
              className={`${styles["copmpleted-select-box"]} ${
                styles[
                  searchIsCompleted === SearchCompleted.NoCompleted
                    ? "selected"
                    : " "
                ]
              }`}
              onClick={handleSeacrhComplete}
            >
              미해결
            </span>
          </div>

          <input
            style={{ width: "calc(1% * 98)" }}
            className="input-box mt-30"
            value={searchData}
            required
            onChange={searchDataSet}
            placeholder="작성자 / 제목 / 내용 과 관련된 검색어를 입력해주세요."
          />
          <button className={styles["search-btn"]} type="submit">
            검색
          </button>
        </form>
      </div>

      {/* 게시글 리스트 부분 */}
      {boardList &&
        boardList.map((item: BoardDetails) => (
          <div
            key={item.boardId}
            id={`${item.boardId}`}
            onClick={chageComponent}
          >
            <BoardItem key={item.boardId} BoardDetails={item} />
          </div>
        ))}

      {/* 글쓰기 버튼 */}
      <div className="board-writing-btn" onClick={chageComponent}>
        글쓰기
      </div>
      {isSearch ? (
        <div className="display-flex-justify-center">
          <SeachPaging
            searchData={searchData}
            searchIsCompleted={searchIsCompleted}
          />
        </div>
      ) : (
        <div className="display-flex-justify-center">
          <Paging />
        </div>
      )}
    </div>
  );
};
export default BoardListContainer;
