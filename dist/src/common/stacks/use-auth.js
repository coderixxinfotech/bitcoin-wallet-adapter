"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
const react_1 = __importStar(require("react"));
const context_1 = require("./context");
const auth_1 = require("@stacks/auth");
function useAuth(customAuthOptions) {
    var _a, _b;
    const [state, setState] = react_1.default.useState((0, context_1.defaultState)());
    const [authResponse, setAuthResponse] = react_1.default.useState("");
    const [appPrivateKey, setAppPrivateKey] = react_1.default.useState("");
    const appConfig = (0, react_1.useMemo)(() => new auth_1.AppConfig(["store_write", "publish_data"], process.env.NEXT_PUBLIC_DOMAIN), []);
    const userSession = (0, react_1.useMemo)(() => new auth_1.UserSession({ appConfig }), [appConfig]);
    const handleSignOut = (0, react_1.useCallback)(() => {
        userSession.signUserOut();
        setState({ userData: null });
    }, [userSession]);
    const handleRedirectAuth = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        if (userSession.isSignInPending()) {
            const userData = yield userSession.handlePendingSignIn();
            setState({ userData });
            setAppPrivateKey(userData.appPrivateKey);
        }
        else if (userSession.isUserSignedIn()) {
            setAppPrivateKey(userSession.loadUserData().appPrivateKey);
        }
    }), [userSession]);
    const onFinish = (0, react_1.useCallback)(({ userSession, authResponse, }) => {
        // console.log({ userSession, authResponse });
        const userData = userSession.loadUserData();
        setAppPrivateKey(userSession.loadUserData().appPrivateKey);
        setAuthResponse(authResponse);
        setState({ userData });
    }, []);
    const onCancel = (0, react_1.useCallback)(() => {
        console.log("popup closed!");
    }, []);
    (0, react_1.useEffect)(() => {
        void handleRedirectAuth();
        if (userSession.isUserSignedIn() && !state.userData) {
            const userData = userSession.loadUserData();
            setState({ userData });
        }
    }, [handleRedirectAuth, userSession, state]);
    const authOptions = {
        manifestPath: (customAuthOptions === null || customAuthOptions === void 0 ? void 0 : customAuthOptions.manifestPath) || "/static/manifest.json",
        redirectTo: (customAuthOptions === null || customAuthOptions === void 0 ? void 0 : customAuthOptions.redirectTo) || "/",
        userSession,
        onFinish,
        onCancel,
        appDetails: {
            name: ((_a = customAuthOptions === null || customAuthOptions === void 0 ? void 0 : customAuthOptions.appDetails) === null || _a === void 0 ? void 0 : _a.name) || "OrdinalNovus",
            icon: ((_b = customAuthOptions === null || customAuthOptions === void 0 ? void 0 : customAuthOptions.appDetails) === null || _b === void 0 ? void 0 : _b.icon) ||
                "https://ordinalnovus.com/logo_default.png",
        },
    };
    return {
        authOptions,
        state,
        authResponse,
        appPrivateKey,
        handleSignOut,
    };
}
exports.useAuth = useAuth;
