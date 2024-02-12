import BoardList from "../newBoard/boardList";
import { ContentType } from "../../routes/home";
import ProjectListContainer from "../project/projectListContainer";
import BoardContent from "../newBoard/boardContent";

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
    default:
      return <ProjectListContainer />;
  }
};

export default MainContent;
