import React, { useEffect } from "react";
import myStyle from "./myPageBoard.module.css";
import { LuClipboardEdit } from "react-icons/lu";
import getMyboard from "../../api/myPage/getMyboard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { BoardDetails } from "../../redux/reducers/boardReducer";
import { patchMyBoardList } from "../../redux/reducers/myPageReducer";

const SelfWritten = () => {
  const accessToken = localStorage.getItem("accessToken");

  const myboardList = useSelector(
    (state: RootState) => state.myPage.myBoardList
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken === null) {
      return;
    }
    const fetchMyboard = async () => {
      const response = await getMyboard(1);

      if (response) {
        dispatch(patchMyBoardList(response));
      }
    };
    if (myboardList === null) {
      fetchMyboard();
    }
  }, [accessToken, myboardList, dispatch]);

  return (
    <div>
      <div className={myStyle.top}>
        <LuClipboardEdit style={{ marginRight: "10px" }} />
        작성한 게시글
      </div>
      <div>
        {myboardList &&
          myboardList.map((item: BoardDetails) => (
            <div key={item.boardId} className={myStyle.item}>
              <div className={myStyle.item}>{item.title}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SelfWritten;
