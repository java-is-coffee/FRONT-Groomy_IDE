import BoardList from "../newBoard/boardList";
import { ContentType } from "../../routes/home";
import ProjectListContainer from "../project/projectListContainer";
import BoardContent from "../newBoard/boardContent";
import NewBoardPage from "../newBoard/newBoardContent";

interface MainContentProps {
  curContent: ContentType;
  onSelectContents: (content: ContentType) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  curContent,
  onSelectContents,
}) => {
  switch (curContent) {
    case ContentType.ProjectList:
      return <ProjectListContainer />;
    case ContentType.BoardList:
      return <BoardList onSelectContents={onSelectContents} />;
    case ContentType.BoardContent:
      return <BoardContent onSelectContents={onSelectContents} />;
    case ContentType.BoardWrite:
      return <NewBoardPage />;
    default:
      return <ProjectListContainer />;
  }
};

export default MainContent;
