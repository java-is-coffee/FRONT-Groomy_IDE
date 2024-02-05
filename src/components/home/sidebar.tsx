import { VscProject } from "react-icons/vsc";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import "../../styles/home/sidebar.css";
import { useNavigate } from "react-router-dom";

interface UserInfo {
  memberId: number;
  email: string;
  name: string;
  nickname: string;
  helpNumber: number;
  role: string;
}

type SidebarProps = {
  onChange: (newState: boolean) => void;
  sideClose: boolean;
  userInfo: UserInfo | null;
};

const Sidebar: React.FC<SidebarProps> = ({ onChange, sideClose, userInfo }) => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="close-button" onClick={() => onChange(!sideClose)}>
        <MdOutlineKeyboardDoubleArrowLeft size={"32px"} />
      </div>
      <div className="side-list">
        <div
          className="user-container"
          onClick={() => {
            userInfo ? navigate("/user") : navigate("/login");
          }}
        >
          {userInfo ? (
            <div className="user-panel">
              <span className="name">{userInfo.name}</span>
              <span className="email">{userInfo.email}</span>
            </div>
          ) : (
            <div className="user-panel">
              <span className="name">로그인이 필요합니다</span>
              <span className="email">로그인</span>
            </div>
          )}
        </div>
        <div className="nav-menu">
          <div className="menu">
            <div className="menu-container">
              <div className="icon">
                <VscProject size={"32px"} />
              </div>
              <span>프로젝트</span>
            </div>
          </div>
          <div
            className="menu"
            onClick={() => {
              navigate("/board");
            }}
          >
            <div className="menu-container">
              <div className="icon">
                <FaWpforms size={"32px"} />
              </div>
              <span>질문게시판</span>
            </div>
          </div>
        </div>
      </div>
      <div className="menu-container"></div>
    </div>
  );
};
export default Sidebar;
