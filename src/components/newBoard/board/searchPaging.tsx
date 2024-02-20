import React, { useEffect } from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { patchPageNumber } from "../../../api/board/patchPageNumber";
import {
  patchPage,
  patchCurrentPage,
  patchMaxPage,
  patchPageOffset,
  BoardDetails,
} from "../../../redux/reducers/boardReducer";
// import { getBoardList, PageNumber } from "../../api/board/getBoardList";
import { patchBoardList } from "../../../redux/reducers/boardReducer";
import { getSearchMax } from "../../../api/board/getSearchMax";
import { SearchCompleted } from "./boardList";
import { searchBoardList } from "../../../api/board/searchBoardList";
import styled from "./paging.module.css";

function SeachPaging({
  searchData,
  searchIsCompleted,
}: {
  searchData: string;
  searchIsCompleted: SearchCompleted;
}) {
  const pageList = useSelector((state: RootState) => state.board.page);
  const maxPage = useSelector((state: RootState) => state.board.maxPage);
  const pageOffset = useSelector((state: RootState) => state.board.pageOffset);
  // const isSearch = useSelector((state: RootState) => state.board.isSearch);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPageData = async () => {
      console.log("검색 페이징");
      try {
        const storedPages: number | null = await getSearchMax(
          searchData,
          searchIsCompleted
        );
        if (storedPages) {
          const tempList = setList(storedPages, 0);
          dispatch(patchPage(tempList));
          dispatch(patchCurrentPage(1));
          dispatch(patchMaxPage(storedPages));
          dispatch(patchPageOffset(0));
        }
      } catch (error) {
        console.log("api 에러");
      }
    };
    if (!pageList) {
      fetchPageData();
    }
  }, [accessToken, pageList, dispatch, searchData, searchIsCompleted]);

  const setList = (lastPage: number, start: number) => {
    const newList: number[] = [];
    for (let i = 1; i <= 5; i++) {
      if (i + start === lastPage + 1) break;
      newList.push(i + start);
    }
    return newList;
  };

  const movePage = async (e: React.MouseEvent<HTMLDivElement>) => {
    const page = parseInt(e.currentTarget.id);

    // const Page: PageNumber = {
    //   page: page,
    // };
    const storedBoard: BoardDetails[] | null = await searchBoardList(
      page,
      searchData,
      searchIsCompleted
    );
    if (storedBoard) {
      dispatch(patchBoardList(storedBoard));
      dispatch(patchCurrentPage(page));
    }
  };

  const backList = async () => {
    //이걸 해둔 이유는 만약 게시글이 삭제되었을 경우, 해당 max값이 변동됨을 감지해야하기 떄문.
    const storedPages: number | null = await patchPageNumber();
    if (storedPages) {
      dispatch(patchMaxPage(storedPages));
    }

    if (maxPage !== null && pageOffset !== null) {
      if (pageOffset - 5 < 0) return;
      else {
        const tempList = setList(maxPage, pageOffset - 5);
        dispatch(patchPage(tempList));
        dispatch(patchPageOffset(pageOffset - 5));
      }
    }
  };
  const frontList = async () => {
    //이걸 해둔 이유는 만약 게시글이 삭제되었을 경우, 해당 max값이 변동됨을 감지해야하기 떄문.
    const storedPages: number | null = await patchPageNumber();
    if (storedPages) {
      dispatch(patchMaxPage(storedPages));
    }

    if (maxPage !== null && pageOffset !== null) {
      if (pageOffset + 5 < maxPage) {
        const tempList = setList(maxPage, pageOffset + 5);
        console.log(tempList);
        dispatch(patchPage(tempList));
        dispatch(patchPageOffset(pageOffset + 5));
      }
    }
  };

  const fullBackList = () => {
    if (maxPage !== null && pageOffset !== null) {
      const tempList = setList(maxPage, 0);

      dispatch(patchPage(tempList));
      dispatch(patchPageOffset(0));
    }
  };

  const fullFrontList = () => {
    if (maxPage !== null && pageOffset !== null) {
      const max = Math.floor(maxPage / 5);
      const tempList = setList(maxPage, max * 5);
      if (tempList.length !== 0) {
        dispatch(patchPage(tempList));
        dispatch(patchPageOffset(max * 5));
      }
    }
  };

  return (
    <div className="display-flex-center">
      <MdKeyboardDoubleArrowLeft onClick={fullBackList} size={36} />
      <MdKeyboardArrowLeft
        onClick={backList}
        className={styled.page}
        size={36}
      />
      {pageList &&
        pageList.map((number) => (
          <div
            key={number}
            id={`${number}`}
            onClick={movePage}
            className={styled.page}
          >
            {number}
          </div>
        ))}

      {/* {pageList.map((number) => number)} */}
      <MdKeyboardArrowRight
        onClick={frontList}
        className={styled.page}
        size={36}
      />
      <MdKeyboardDoubleArrowRight onClick={fullFrontList} size={36} />
    </div>
  );
}

export default SeachPaging;
