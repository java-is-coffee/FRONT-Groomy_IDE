import React, { useEffect, useState } from "react";
import BoardItem from "./boardItem";
import { ContentType } from "../../../enum/mainOptionType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import {
  BoardDetails,
  patchBoardList,
  patchContent,
  patchContentId,
  patchIsSeacrh,
  patchPage,
} from "../../../redux/reducers/boardReducer";
import { FaClipboardQuestion } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";
import Paging from "./paging";
import styled from "./boardList.module.css";
import { searchBoardList } from "../../../api/board/searchBoardList";
import useBoardHooks from "../../../hooks/board/boardHook";
import SeachPaging from "./searchPaging";
import { setIdeOption } from "../../../redux/reducers/ide/ideOptionReducer";
import IdeOptionType from "../../../enum/ideOptionType";
import { setMainOption } from "../../../redux/reducers/mainpageReducer";

export enum SearchCompleted {
  All = "all",
  Completed = "completed",
  NoCompleted = "no-completed",
}

const BoardListContainer = () => {
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

      dispatch(setIdeOption(IdeOptionType.BoardContent));
      dispatch(setMainOption(ContentType.BoardContent));
    }
    //타겟 id가 존재하지 않는다면 새로운 게시글 이라는뜻.
    else {
      dispatch(patchContent(null));
      dispatch(setIdeOption(IdeOptionType.BoardWrite));
      dispatch(setMainOption(ContentType.BoardWrite));
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
    if (response === null) {
      dispatch(patchBoardList([]));
      return (
        <>
          <div>검색 결과가 없습니다.</div>
        </>
      );
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
    <div className={styled["list-container"]}>
      <div className={styled["header"]}>
        <FaClipboardQuestion
          className="mr-15"
          size={25}
          onClick={resetBoadList}
        />
        질문 게시판
        <span>
          <SlMagnifier
            size={25}
            onClick={() => setSearchModalOpen(!searchModalOpen)}
          />
        </span>
      </div>
      {/* 검색 파트 */}
      <div
        id="searchForm"
        className={searchModalOpen ? "" : `${styled.hidden}`}
      >
        <form onSubmit={handleSubmit} className={styled["search-box"]}>
          <div>
            <span
              id="all"
              className={`${styled["copmpleted-select-box"]} ${
                styled[
                  searchIsCompleted === SearchCompleted.All ? "selected" : " "
                ]
              }`}
              onClick={handleSeacrhComplete}
            >
              전체
            </span>
            <span
              id="completed"
              className={`${styled["copmpleted-select-box"]} ${
                styled[
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
              className={`${styled["copmpleted-select-box"]} ${
                styled[
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
            className={styled.input}
            value={searchData}
            required
            onChange={searchDataSet}
            placeholder="작성자 / 제목 / 내용 과 관련된 검색어를 입력해주세요."
          />
          <button className={styled["search-btn"]} type="submit">
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
      <div className={styled["writing-btn"]} onClick={chageComponent}>
        글쓰기
      </div>
      {isSearch ? (
        <div className={styled["paging"]}>
          <SeachPaging
            searchData={searchData}
            searchIsCompleted={searchIsCompleted}
          />
        </div>
      ) : (
        <div className={styled["paging"]}>
          <Paging />
        </div>
      )}
    </div>
  );
};
export default BoardListContainer;
