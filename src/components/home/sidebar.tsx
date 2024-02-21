import { VscProject } from "react-icons/vsc";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import styles from "../../styles/home/sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMemberInfo } from "../../api/auth/getMemberInfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { addMember } from "../../redux/reducers/memberReducer";
import { ContentType } from "../../routes/home";

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
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    const topPosition = scrollPosition;
    if (topPosition > 0) {
      sidebar.style.top = `${topPosition}px`;
    } else {
      sidebar.style.top = `0px`;
    }
  });

  // main contents handler
  const handleMainContent = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget.id;
    console.log(target);

    if (target === "project") onSelectContents(ContentType.ProjectList);
    if (target === "board") onSelectContents(ContentType.BoardList);
  };

  // member 정보 불러오기
  useEffect(() => {
    const fetchMemberData = async () => {
      const hasMemberInfo = await getMemberInfo();
      console.log(hasMemberInfo);
      if (hasMemberInfo) {
        dispatch(addMember(hasMemberInfo));
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
    <div className={styles["sidebar-menu"]}>
      <div className={styles["button-container"]}>
        <div className={styles["close-button"]} onClick={() => onChange(!sideClose)}>
          <MdOutlineKeyboardDoubleArrowLeft size={"32px"} />
        </div>
      </div>
      <div className={styles["side-list"]}>
        <div
          className={styles["user-container"]}
          onClick={() => {
            member ? navigate("/user") : navigate("/login");
          }}
        >
          {member ? (
            <div className={styles["user-panel"]}>
              <span className={styles.name}>{member.name}</span>
              <span className={styles.email}>{member.email}</span>
            </div>
          ) : (
            <div className={styles["user-panel"]}>
              <span className={styles.name}>로그인이 필요합니다</span>
            </div>
          )}
        </div>
        <div className={styles["nav-menu"]}>
          <div className={styles.menu} id="project" onClick={handleMainContent}>
            <div className={styles["menu-container"]}>
              <div className={styles.icon}>
                <VscProject size={"32px"} />
              </div>
              <span>프로젝트</span>
            </div>
          </div>
          <div className={styles.menu} id="board" onClick={handleMainContent}>
            <div className={styles["menu-container"]}>
              <div className={styles.icon}>
                <FaWpforms size={"32px"} />
              </div>
              <span>질문게시판</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["menu-container"]}></div>
    </div>
  );
};
export default Sidebar;
