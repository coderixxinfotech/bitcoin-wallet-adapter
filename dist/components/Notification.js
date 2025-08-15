"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const notificationReducers_1 = require("../stores/reducers/notificationReducers");
const react_1 = __importDefault(require("react"));
const Notification = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const notifications = (0, react_redux_1.useSelector)((state) => state.notifications.notifications);
    const handleCloseNotification = (id) => {
        dispatch((0, notificationReducers_1.removeNotification)(id));
    };
    return (react_1.default.createElement(react_1.default.Fragment, null, notifications.map((notification) => (react_1.default.createElement(material_1.Snackbar, { key: notification.id, anchorOrigin: { vertical: "bottom", horizontal: "left" }, open: notification.open, autoHideDuration: 6000, onClose: () => handleCloseNotification(notification.id), sx: {
            // Ensure notifications appear above all other components
            zIndex: 10000,
            "& .MuiSnackbarContent-root": {
                backgroundColor: notification.severity === "success"
                    ? "#43a047"
                    : notification.severity === "error"
                        ? "#d32f2f"
                        : notification.severity === "warning"
                            ? "#ffa000"
                            : notification.severity === "info"
                                ? "#5c5e5e"
                                : "#2979ff",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                // Additional styling for better visibility
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
            },
        } },
        react_1.default.createElement(material_1.SnackbarContent, { message: notification.message }))))));
};
exports.default = Notification;
