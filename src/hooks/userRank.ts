import { UserRank } from "../enum/userRank";

const useRankHooks = () => {
  const getRank = (userHelpNumber: number): UserRank | null => {
    if (userHelpNumber >= 0 && userHelpNumber <= 4) return UserRank.Level0;
    if (userHelpNumber >= 5 && userHelpNumber <= 20) return UserRank.Level1;
    if (userHelpNumber >= 21 && userHelpNumber <= 30) return UserRank.Level2;
    if (userHelpNumber >= 31 && userHelpNumber <= 40) return UserRank.Level3;
    if (userHelpNumber >= 41 && userHelpNumber <= 50) return UserRank.Level4;
    if (userHelpNumber >= 51 && userHelpNumber <= 60) return UserRank.Level5;
    if (userHelpNumber >= 61 && userHelpNumber <= 70) return UserRank.Level6;
    if (userHelpNumber >= 71 && userHelpNumber <= 80) return UserRank.Level7;
    if (userHelpNumber >= 81 && userHelpNumber <= 90) return UserRank.Level8;
    if (userHelpNumber >= 91 && userHelpNumber <= 100) return UserRank.Level9;
    if (userHelpNumber >= 100) return UserRank.Level10;

    return null;
  };

  const getUserRank = (helpNumber: number): UserRank | null => {
    const icon = getRank(helpNumber);

    return icon;
  };

  return { getRank, getUserRank };
};

export default useRankHooks;
