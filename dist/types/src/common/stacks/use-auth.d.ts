import { AppState } from "./context";
import { AuthOptions } from "@stacks/connect";
import { AuthOptionsArgs } from "../../types";
export declare function useAuth(customAuthOptions?: AuthOptionsArgs): {
    authOptions: AuthOptions;
    state: AppState;
    authResponse: string;
    appPrivateKey: string;
    handleSignOut: () => void;
};
