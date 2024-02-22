import React from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import navStyles from "./nav.module.css";
import { useDispatch } from "react-redux";
import { openNewProjectModal } from "../../redux/reducers/modalReducer";
interface NavProps {
  onChange: (change: boolean) => void;
  sideClose: boolean;
}

const Nav: React.FC<NavProps> = ({ onChange, sideClose }) => {
  const dispatch = useDispatch();
  return (
    <div className={navStyles[`menu-bar`]}>
      <div
        className={`${navStyles[`sidebar-button`]} ${
          sideClose ? navStyles.close : ""
        }`}
        onClick={() => onChange(!sideClose)}
      >
        <MdKeyboardDoubleArrowRight size={"32px"} />
      </div>
      <div>
        <button
          className={navStyles[`new-project`]}
          onClick={() => dispatch(openNewProjectModal())}
        >
          <span>NEW PROJECT</span>
          <GoPlus size={"20px"} />
        </button>
      </div>
    </div>
  );
};
export default Nav;
