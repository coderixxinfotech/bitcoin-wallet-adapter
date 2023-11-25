"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const notificationReducers_1 = __importDefault(require("./reducers/notificationReducers"));
const generalReducer_1 = __importDefault(require("./reducers/generalReducer"));
const rootReducer = (0, toolkit_1.combineReducers)({
    notifications: notificationReducers_1.default,
    general: generalReducer_1.default,
});
exports.store = (0, toolkit_1.configureStore)({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: [redux_thunk_1.default],
});
