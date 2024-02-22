import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import newProjectModalStyles from "./newProjectModal.module.css";
import { toast } from "react-toastify";
import { closeInviteProjectModal } from "../../../redux/reducers/modalReducer";
import { IoMdClose } from "react-icons/io";
import MemberSearchDropdown from "../dropdown/memberSearchDropdown";
import { getProjectMemberList } from "../../../api/member/getProjectMemberList";
import { IMember } from "../../../api/member/imemberDTO";
import { deleteProjectMember } from "../../../api/member/deleteProjectMember";
import { postInviteMembers } from "../../../api/member/postInviteMembers";

const InviteProjectDetailsModal = () => {
  const inviteProjectDetails = useSelector(
    (state: RootState) => state.modalState.inviteProjectDetails
  );
  const dispatch = useDispatch();

  const [groupMembers, setGroupMembers] = useState<IMember[]>([]);
  const [storedMembers, setStoredMembers] = useState<IMember[]>([]);

  useEffect(() => {
    if (inviteProjectDetails) {
      (async () => {
        const storedMembers: IMember[] | null = await getProjectMemberList(
          inviteProjectDetails.projectId
        );
        if (storedMembers) {
          setGroupMembers(storedMembers);
          setStoredMembers(storedMembers);
        }
      })();
    }
  }, [inviteProjectDetails]);

  const handleInviteMembers = async () => {
    const projectMemberIds: number[] = groupMembers.map(
      (member) => member.memberId
    );
    if (inviteProjectDetails) {
      try {
        const result = await postInviteMembers(
          inviteProjectDetails?.projectId,
          projectMemberIds
        );
        if (result) {
          dispatch(closeInviteProjectModal());
        } else {
          toast.error("접근 권한이 없습니다.");
        }
      } catch (error) {
        toast.error("추가중 오류 발생 다시 시도해주세요");
      }
      dispatch(closeInviteProjectModal());
    } else {
      toast.error("세션이 만료되었습니다. 새로고침해주세요");
    }
  };

  const addProjectMember = (member: IMember) => {
    setGroupMembers((prev: IMember[]) => {
      return [...prev, member];
    });
  };

  const removeProjectMember = async (removeMember: IMember) => {
    if (removeMember && inviteProjectDetails) {
      if (storedMembers.includes(removeMember)) {
        try {
          const removeResult = await deleteProjectMember(
            inviteProjectDetails.projectId,
            removeMember.memberId
          );
          if (removeResult) {
            setGroupMembers((prev) =>
              prev.filter((member) => member.memberId !== removeMember.memberId)
            );
          } else {
            toast.error("권한이 없습니다.");
          }
        } catch (error) {
          toast.error("멤버를 제거하는 중 오류가 발생했습니다.");
        }
      } else {
        setGroupMembers((prev) =>
          prev.filter((member) => member.memberId !== removeMember.memberId)
        );
      }
    }
  };

  const handleRemoveMember = (removeMember: IMember) => {
    removeProjectMember(removeMember);
  };

  if (!inviteProjectDetails) return null;
  return (
    <div className={newProjectModalStyles[`modal-overlay`]}>
      <div
        className={newProjectModalStyles[`invite-modal-content`]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={newProjectModalStyles[`modal-header`]}>
          <span>프로젝트 초대하기</span>
          <div
            className={newProjectModalStyles[`modal-close-button`]}
            onClick={() => dispatch(closeInviteProjectModal())}
          >
            <RxCross1 width={"32px"} />
          </div>
        </div>
        <div
          className={newProjectModalStyles[`new-project-form`]}
          onSubmit={() => false}
        >
          <span>{inviteProjectDetails?.projectName}</span>
          <p>{inviteProjectDetails?.description}</p>
          <label className={newProjectModalStyles[`modal-dropdown`]}></label>
          <div className={newProjectModalStyles[`member-dropdown`]}>
            <MemberSearchDropdown
              groupMembers={groupMembers}
              onAddMember={addProjectMember}
            />
            <div className={newProjectModalStyles[`members-selected`]}>
              {groupMembers.map((member) => (
                <div
                  key={member.memberId}
                  id={member.memberId.toString()}
                  className={newProjectModalStyles[`group-member`]}
                >
                  <span key={member.memberId}>{member.nickname}</span>
                  <div
                    className={newProjectModalStyles[`member-remove-icons`]}
                    onClick={() => handleRemoveMember(member)}
                  >
                    <IoMdClose size="13px" style={{ cursor: "pointer" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className={newProjectModalStyles[`modal-button`]}
            onClick={handleInviteMembers}
          >
            초대하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteProjectDetailsModal;
