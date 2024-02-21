import { useNavigate } from "react-router-dom";

function useRegisterHooks() {
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };

  const emailCheck = (email: string): boolean => {
    const emailReggex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    return emailReggex.test(email);
  };

  return { emailCheck, goLogin };
}

export default useRegisterHooks;
