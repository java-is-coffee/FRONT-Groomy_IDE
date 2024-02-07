import { ContentType } from "../../routes/home";
import ProjectListContainer from "../project/projectListContainer";

interface MainContentProps {
  curContent: ContentType;
}

const MainContent: React.FC<MainContentProps> = ({ curContent }) => {
  switch (curContent) {
    case ContentType.ProjectList:
      return <ProjectListContainer />;
    default:
      return <ProjectListContainer />;
  }
};

export default MainContent;
