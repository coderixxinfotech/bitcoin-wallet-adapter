export declare const bwaStore: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<import("redux").EmptyObject & {
    notifications: import("./reducers/notificationReducers").NotificationsState;
    general: import("./reducers/generalReducer").GeneralState;
}, import("redux").AnyAction, (import("redux-thunk").ThunkMiddleware<any, import("redux").AnyAction, undefined> & {
    withExtraArgument<ExtraThunkArg, State = any, BasicAction extends import("redux").Action<any> = import("redux").AnyAction>(extraArgument: ExtraThunkArg): import("redux-thunk").ThunkMiddleware<State, BasicAction, ExtraThunkArg>;
})[]>;
export type RootState = ReturnType<typeof bwaStore.getState>;
export type AppDispatch = typeof bwaStore.dispatch;
