import { flag } from "flags/next";

export const incognitoFlag = flag<boolean>({
  key: "incognito-mode",
  description: "Feature flag to enable incognito mode",
  defaultValue: false,
  decide() {
    return true;
  },
});
