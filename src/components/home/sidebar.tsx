import { VscProject } from "react-icons/vsc";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMemberInfo } from "../../api/auth/getMemberInfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { ContentType } from "../../enum/mainOptionType";
import { IoIosLogOut } from "react-icons/io";
import { ConnectWithoutContact } from "@mui/icons-material";
import { setMember } from "../../redux/reducers/memberReducer";
import { setMainOption } from "../../redux/reducers/mainpageReducer";
// import mainOption from "../../redux/reducers/mainpageReducer";
import sideBarStyles from "./sidebar.module.css";
import { setMainOption } from "../../redux/reducers/mainpageReducer";

type SidebarProps = {
  onChange: (newState: boolean) => void;
  sideClose: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ onChange, sideClose }) => {
  // member 정보 저장용 state
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const member = useSelector((state: RootState) => state.member.member);
  const dispatch = useDispatch();
  const [topPosition, setTopPosition] = useState(0);

  // const mainOption = useSelector((state: RootState) => state.mainOption.option);

  //sidebar 스크롤 따라가게 하기
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setTopPosition(position);
    };

    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 인라인 스타일 대신 CSS 클래스를 토글하는 방식을 사용할 수도 있습니다.
  const sidebarStyle = {
    top: `${topPosition}px`,
  };

  // main contents handler
  const handleMainContent = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget.id;
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

  // main contents handler
  const handleMainContent = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget.id;
    console.log(target);

    // if (target === "project") onSelectContents(ContentType.ProjectList);
    // if (target === "invited-project")
    //   onSelectContents(ContentType.InvitedProjectList);
    // if (target === "board") onSelectContents(ContentType.BoardList);

    if (target === "project") dispatch(setMainOption(ContentType.ProjectList));
    if (target === "invited-project")
      dispatch(setMainOption(ContentType.InvitedProjectList));
    if (target === "board") dispatch(setMainOption(ContentType.BoardList));
  };

  return (
    <div className={sideBarStyles[`sidebar-menu`]} style={sidebarStyle}>
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
