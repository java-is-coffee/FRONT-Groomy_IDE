import React, { useEffect } from "react";
import myStyle from "./myPageBoard.module.css";
import { LuClipboardEdit } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { BoardDetails } from "../../redux/reducers/boardReducer";
import { patchScrappedList } from "../../redux/reducers/myPageReducer";
import { ListItemButton, ListItemText } from "@mui/material";
import getScrappedBoard from "../../api/myPage/getScrappedBoard";

const ScrappedBoard = () => {
  const accessToken = localStorage.getItem("accessToken");

  const scrappedBoardList = useSelector(
    (state: RootState) => state.myPage.scrappedBoardList
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken === null) {
      return;
    }
    const fetchMyboard = async () => {
      const response = await getScrappedBoard(1);

      if (response) {
        dispatch(patchScrappedList(response));
      }
    };
    if (scrappedBoardList === null) {
      fetchMyboard();
    }
  }, [accessToken, scrappedBoardList, dispatch]);

  return (
    <div>
      <div className={myStyle.top}>
        <LuClipboardEdit style={{ marginRight: "10px" }} />
        스크랩한 게시글
      </div>
      <div>
        {scrappedBoardList &&
          scrappedBoardList.map((item: BoardDetails) => (
            <div key={item.boardId} className={myStyle.item}>
              <ListItemButton>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ScrappedBoard;
