import { useNavigate } from "react-router-dom";

function useLoginHooks() {
  const navigate = useNavigate();

  const goMain = () => {
    navigate("/");
  };

  const goRegister = () => {
    navigate("/register");
  };

  const goResetPassword = () => {
    navigate("/resetPassword");
  };

  return { goMain, goRegister, goResetPassword };
}

export default useLoginHooks;
