"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNotification = exports.addNotification = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    notifications: [],
};
const notificationsSlice = (0, toolkit_1.createSlice)({
    name: "notifications",
    initialState,
    reducers: {
        addNotification(state, action) {
            state.notifications.push(action.payload);
        },
        removeNotification(state, action) {
            state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
        },
    },
});
_a = notificationsSlice.actions, exports.addNotification = _a.addNotification, exports.removeNotification = _a.removeNotification;
exports.default = notificationsSlice.reducer;
