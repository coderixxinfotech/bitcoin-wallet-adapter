/// <reference types="react" />
import { UserData } from "@stacks/auth";
export interface AppState {
    userData: UserData | null;
}
export declare const defaultState: () => AppState;
export declare const AppContext: import("react").Context<AppState>;
