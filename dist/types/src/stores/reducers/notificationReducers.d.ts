export interface Notification {
    id: number;
    message: string;
    open: boolean;
    severity: "success" | "error" | "warning" | "info";
}
export interface NotificationsState {
    notifications: Notification[];
}
export declare const addNotification: import("@reduxjs/toolkit").ActionCreatorWithPayload<Notification, "notifications/addNotification">, removeNotification: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "notifications/removeNotification">;
declare const _default: import("redux").Reducer<NotificationsState>;
export default _default;
