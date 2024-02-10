"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const fa_1 = require("react-icons/fa");
const CustomButton = (_a) => {
    var { text = "Button", onClick = () => { }, border = "", disabled = false, className = "", icon: Icon = null, link = false, loading = false, href } = _a, props = __rest(_a, ["text", "onClick", "border", "disabled", "className", "icon", "link", "loading", "href"]);
    const defaultClasses = `bwa-bg-yellow-700 hover:bwa-bg-yellow-800`;
    const buttonClasses = `bwa-flex bwa-items-center bwa-justify-center bwa-px-4 bwa-py-2 bwa-rounded-md bwa-transition-all bwa-shadow-sm ${defaultClasses} ${className} ${border}`;
    if (link && href) {
        return (react_1.default.createElement("a", { href: href },
            react_1.default.createElement("button", Object.assign({ className: !className ? buttonClasses : className }, (disabled ? { "aria-disabled": true, tabIndex: -1 } : {}), props),
                Icon && react_1.default.createElement(Icon, { className: "bwa-mr-2" }),
                text)));
    }
    return (react_1.default.createElement("button", Object.assign({ onClick: onClick, className: !className ? buttonClasses : className, disabled: disabled }, (disabled ? { "aria-disabled": true, tabIndex: -1 } : {}), props), loading ? (react_1.default.createElement(fa_1.FaSpinner, { className: "bwa-mr-2 bwa-animate-spin" })) : (react_1.default.createElement(react_1.default.Fragment, null,
        text,
        Icon && react_1.default.createElement(Icon, { className: "bwa-ml-2" })))));
};
exports.default = CustomButton;
