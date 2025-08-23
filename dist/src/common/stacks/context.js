"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContext = exports.defaultState = void 0;
const react_1 = require("react");
const auth_1 = require("@stacks/auth");
const defaultState = () => {
    const appConfig = new auth_1.AppConfig(["store_write"], process.env.NEXT_PUBLIC_DOMAIN);
    const userSession = new auth_1.UserSession({ appConfig });
    if (userSession.isUserSignedIn()) {
        return {
            userData: userSession.loadUserData(),
        };
    }
    return { userData: null };
};
exports.defaultState = defaultState;
exports.AppContext = (0, react_1.createContext)((0, exports.defaultState)());
