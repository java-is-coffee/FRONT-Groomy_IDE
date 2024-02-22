import { VscProject } from "react-icons/vsc";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMemberInfo } from "../../api/auth/getMemberInfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { ContentType } from "../../enum/mainOptionType";
import { IoIosLogOut } from "react-icons/io";
import { ConnectWithoutContact } from "@mui/icons-material";
import { setMember } from "../../redux/reducers/memberReducer";

import sideBarStyles from "./sidebar.module.css";
import { setMainOption } from "../../redux/reducers/mainpageReducer";

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
    const sidebar = document.querySelector(
      `.${sideBarStyles[`sidebar-menu`]}`
    ) as HTMLElement;
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

    if (target === "project") dispatch(setMainOption(ContentType.ProjectList));
    if (target === "invited-project")
      dispatch(setMainOption(ContentType.InvitedProjectList));
    if (target === "board") dispatch(setMainOption(ContentType.BoardList));
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
    <div className={sideBarStyles[`sidebar-menu`]}>
      <div className={sideBarStyles[`button-container`]}>
        <div
          className={sideBarStyles[`close-button`]}
          onClick={() => onChange(!sideClose)}
        >
          <MdOutlineKeyboardDoubleArrowLeft size={"32px"} />
        </div>
      </div>
      <div className={sideBarStyles[`side-list`]}>
        <div
          className={sideBarStyles[`user-container`]}
          onClick={() => {
            member ? navigate("/user") : navigate("/login");
          }}
        >
          {member ? (
            <div className={sideBarStyles[`user-panel`]}>
              <span className={sideBarStyles.name}>{member.name}</span>
              <span className={sideBarStyles.email}>{member.email}</span>
            </div>
          ) : (
            <div className={sideBarStyles[`user-panel`]}>
              <span className={sideBarStyles.name}>로그인이 필요합니다</span>
            </div>
          )}
        </div>
        <div className={sideBarStyles[`nav-menu`]}>
          <div
            className={sideBarStyles.menu}
            id="project"
            onClick={handleMainContent}
          >
            <div className={sideBarStyles[`menu-container`]}>
              <div className={sideBarStyles.icon}>
                <VscProject size={"32px"} />
              </div>
              <span>프로젝트</span>
            </div>
          </div>
          <div
            className={sideBarStyles.menu}
            id="invited-project"
            onClick={handleMainContent}
          >
            <div className={sideBarStyles[`menu-container`]}>
              <div className={sideBarStyles.icon}>
                <ConnectWithoutContact />
              </div>
              <span>프로젝트 초대</span>
            </div>
          </div>
          <div
            className={sideBarStyles.menu}
            id="board"
            onClick={handleMainContent}
          >
            <div className={sideBarStyles[`menu-container`]}>
              <div className="icon">
                <FaWpforms size={"32px"} />
              </div>
              <span>질문게시판</span>
            </div>
          </div>
        </div>
      </div>
      <div className={sideBarStyles[`menu-container`]}>
        <div className={sideBarStyles[`icon float-right`]}>
          <IoIosLogOut size={"32px"} onClick={logOut} />
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
