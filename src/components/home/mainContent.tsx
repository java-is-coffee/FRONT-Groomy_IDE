import { ContentType } from "../../routes/home";
import ChatComponents from "../chat/ChatComponentModal";
import ProjectListContainer from "../project/projectListContainer";

interface MainContentProps {
  curContent: ContentType;
}

const MainContent: React.FC<MainContentProps> = ({ curContent }) => {
  switch (curContent) {
    case ContentType.ProjectList:
      return <ProjectListContainer />;
    case ContentType.Chat:
      return <ChatComponents projectId={""} token={""} />
    default:
      return <ProjectListContainer />;
  }
};

export default MainContent;
