import BoardList from "../newBoard/board/boardList";
import { ContentType } from "../../enum/mainOptionType";
import ProjectListContainer from "../project/projectListContainer";

import BoardContent from "../newBoard/board/boardContent";
import BoardWrite from "../newBoard/board/newBoardContent";
import InvitedProjectListContainer from "../project/invitedProjectLIstContainer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

interface MainContentProps {
  curContent: ContentType;
}

const MainContent: React.FC<MainContentProps> = () => {
  const mainOption = useSelector((state: RootState) => state.mainOption.option);

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
    default:
      return <ProjectListContainer />;
  }
};

export default MainContent;
