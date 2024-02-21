import React, { useEffect } from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { patchPageNumber } from "../../api/board/patchPageNumber";
import {
  patchPage,
  patchCurrentPage,
  patchMaxPage,
  patchPageOffset,
  BoardDetails,
} from "../../redux/reducers/boardReducer";
import { patchBoardList, PageNumber } from "../../api/board/patchBoardList";
import { patchBoard } from "../../redux/reducers/boardReducer";
import styles from "../../styles/board/board.module.css";

function Paging() {
  const pageList = useSelector((state: RootState) => state.board.page);
  const maxPage = useSelector((state: RootState) => state.board.maxPage);
  const pageOffset = useSelector((state: RootState) => state.board.pageOffset);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const storedPages: number | null = await patchPageNumber();
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
  }, [accessToken, pageList, dispatch]);

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
    try {
      const Page: PageNumber = {
        page: page,
      };
      const storedBoard: BoardDetails[] | null = await patchBoardList(Page);
      if (storedBoard) {
        dispatch(patchBoard(storedBoard));
        dispatch(patchCurrentPage(page));
      }
    } catch (error) {
      console.log("api 에러");
    }
  };

  const backList = () => {
    if (maxPage !== null && pageOffset !== null) {
      if (pageOffset - 5 < 0) return;
      else {
        const tempList = setList(maxPage, pageOffset - 5);
        dispatch(patchPage(tempList));
        dispatch(patchPageOffset(pageOffset - 5));
      }
    }
  };
  const frontList = () => {
    if (maxPage !== null && pageOffset !== null) {
      if (pageOffset + 5 <= maxPage) {
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
      dispatch(patchPage(tempList));
      dispatch(patchPageOffset(max * 5));
    }
  };

  return (
    <div className={styles["display-flex-center"]}>
      <MdKeyboardDoubleArrowLeft onClick={fullBackList} size={36} />
      <MdKeyboardArrowLeft
        onClick={backList}
        className={styles["board-page"]}
        size={36}
      />
      {pageList &&
        pageList.map((number) => (
          <div
            key={number}
            id={`${number}`}
            onClick={movePage}
            className={styles["board-page"]}
          >
            {number}
          </div>
        ))}

      {/* {pageList.map((number) => number)} */}
      <MdKeyboardArrowRight
        onClick={frontList}
        className={styles["board-page"]}
        size={36}
      />
      <MdKeyboardDoubleArrowRight onClick={fullFrontList} size={36} />
    </div>
  );
}

export default Paging;
