import { createContext, FC } from "react";
import { UserSession, AppConfig, UserData } from "@stacks/auth";

export interface AppState {
  userData: UserData | null;
}

export const defaultState = (): AppState => {
  const appConfig = new AppConfig(
    ["store_write"],
    process.env.NEXT_PUBLIC_DOMAIN
  );
  const userSession = new UserSession({ appConfig });

  if (userSession.isUserSignedIn()) {
    return {
      userData: userSession.loadUserData(),
    };
  }
  return { userData: null };
};

export const AppContext = createContext<AppState>(defaultState());
