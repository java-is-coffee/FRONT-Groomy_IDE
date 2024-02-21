import { VscProject } from "react-icons/vsc";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import "../../styles/home/sidebar.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMemberInfo } from "../../api/auth/getMemberInfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { ContentType } from "../../routes/home";

import { IoIosLogOut } from "react-icons/io";
import { ConnectWithoutContact } from "@mui/icons-material";
import { setMember } from "../../redux/reducers/memberReducer";


type SidebarProps = {
  onSelectContents: (content: ContentType) => void;
  onChange: (newState: boolean) => void;
  sideClose: boolean;
};



const Sidebar: React.FC<SidebarProps> = ({
  onSelectContents,
  onChange,
  sideClose,
}) => {
  // member 정보 저장용 state
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const member = useSelector((state: RootState) => state.member.member);
  const dispatch = useDispatch();

  //sidebar 스크롤 따라가게 하기
  window.addEventListener("scroll", function () {
    const sidebar = document.querySelector(".sidebar-menu") as HTMLElement;
    if (sidebar) {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      const topPosition = scrollPosition;
      if (topPosition > 0) {
        sidebar.style.top = `${topPosition}px`;
      } else {
        sidebar.style.top = `0px`;
      }
    }
  });

  // main contents handler
  const handleMainContent = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget.id;
    console.log(target);
    if (target === "project") onSelectContents(ContentType.ProjectList);
    if (target === "chat") onSelectContents(ContentType.Chat);
    if (target === "project") onSelectContents(ContentType.ProjectList);
    if (target === "invited-project")
      onSelectContents(ContentType.InvitedProjectList);
    if (target === "board") onSelectContents(ContentType.BoardList);
  };

  //로그아웃 버튼
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  // member 정보 불러오기
  useEffect(() => {
    const fetchMemberData = async () => {
      const hasMemberInfo = await getMemberInfo();
      if (hasMemberInfo) {
        dispatch(setMember(hasMemberInfo));
      } else {
        console.log("정보 불러오기 오류");
      }
    };

    if (!member) {
      fetchMemberData();
    }
    console.log(member);
  }, [accessToken, dispatch, member]);

  

  return (
    <div className="sidebar-menu">
      <div className="button-container">
        <div className="close-button" onClick={() => onChange(!sideClose)}>
          <MdOutlineKeyboardDoubleArrowLeft size={"32px"} />
        </div>
      </div>
      <div className="side-list">
        <div
          className="user-container"
          onClick={() => {
            member ? navigate("/user") : navigate("/login");
          }}
        >
          {member ? (
            <div className="user-panel">
              <span className="name">{member.name}</span>
              <span className="email">{member.email}</span>
            </div>
          ) : (
            <div className="user-panel">
              <span className="name">로그인이 필요합니다</span>
            </div>
          )}
        </div>
        
        {/* 프로젝트 */}
        <div className="nav-menu">
          <div className="menu" id="project" onClick={handleMainContent}>
            <div className="menu-container">
              <div className="icon">
                <VscProject size={"32px"} />
              </div>
              <span>프로젝트</span>
            </div>
          </div>
          <div
            className="menu"
            id="invited-project"
            onClick={handleMainContent}
          >
            <div className="menu-container">
              <div className="icon">
                <ConnectWithoutContact />
              </div>
              <span>프로젝트 초대</span>
            </div>
          </div>
          <div className="menu" id="board" onClick={handleMainContent}>
            <div className="menu-container">
              <div className="icon">
                <FaWpforms size={"32px"} />
              </div>
              <span>질문게시판</span>
            </div>
          </div>
          
          {/* 채팅 */}
          <div className="menu" id="chat" onClick={handleMainContent}>
            <div className="menu-container" id="chat">
              <div className="icon">
                <IoIosChatbubbles size={"32px"} />
              </div>
              <span>채팅</span>
            </div>
          </div>
        </div>
      </div>
      <div className="menu-container">
        <div className="icon float-right">
          <IoIosLogOut size={"32px"} onClick={logOut} />
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
