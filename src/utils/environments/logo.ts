import { IS_BIZCAP, IS_NEWCO } from "@/utils/environments/envHelper";

export const getLogoLight = () => {
  if (IS_BIZCAP) {
    return require("@/assets/images/logos/logo-bizcap.png");
  }
  if (IS_NEWCO) {
    return require("@/assets/images/logos/logo-newco.png");
  }
  return require("@/assets/images/logos/logo-test.png");
};

export const getLogoDark = () => {
  if (IS_BIZCAP) {
    return require("@/assets/images/logos/logo-bizcap-dark.png");
  }
  if (IS_NEWCO) {
    return require("@/assets/images/logos/logo-newco-dark.png");
  }
  return require("@/assets/images/logos/logo-test-dark.png");
};
