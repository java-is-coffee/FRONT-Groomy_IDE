import BoardList from "../newBoard/board/boardList";
import { ContentType } from "../../enum/mainOptionType";
import ProjectListContainer from "../project/projectListContainer";

import BoardContent from "../newBoard/board/boardContent";
import BoardWrite from "../newBoard/board/newBoardContent";
import InvitedProjectListContainer from "../project/invitedProjectLIstContainer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import MyPageContainer from "../mypage/myPageContainer";
import MyPageResetPassword from "../mypage/myPageResetPassword";
import BoardOption from "../../enum/boardOptionType";
import { setOption } from "../../redux/reducers/boardReducer";

const MainContent: React.FC = () => {
  const mainOption = useSelector((state: RootState) => state.mainOption.option);
  const dispatch = useDispatch();
  dispatch(setOption(BoardOption.MainPage));

  switch (mainOption) {
    case ContentType.ProjectList:
      return <ProjectListContainer />;
    case ContentType.InvitedProjectList:
      return <InvitedProjectListContainer />;
    case ContentType.BoardList:
      return <BoardList />;
    case ContentType.BoardContent:
      return <BoardContent />;
    case ContentType.BoardWrite:
      return <BoardWrite />;
    case ContentType.MyPage:
      return <MyPageContainer />;
    case ContentType.MyPageResetPassword:
      return <MyPageResetPassword />;
    default:
      return <ProjectListContainer />;
  }
};

export default MainContent;
