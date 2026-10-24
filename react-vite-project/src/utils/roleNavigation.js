export const getNavigationPath = (role) => {
  switch (role) {
    case "ROLE_EMPRUNTEUR":
      return "/emprunteur";
    case "ROLE_PREPOSE":
      return "/prepose";
    case "ROLE_GESTIONNAIRE":
      return "/gestionnaire";
    default:
      return "/";
  }
};
