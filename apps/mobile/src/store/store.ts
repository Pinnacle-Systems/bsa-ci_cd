import { configureStore } from "@reduxjs/toolkit";
import openTabs from "@Redux/features/opentabs";
import dueDaysReducer from '@Redux/Slices/dueDaysSlice';
import tableData from "@Redux/Slices/insuranceDataSlice";
import { poRegister, commonMast, supplier, poData, misDashboardService, ordManagement, UsersApi } from '@Redux/service';
import { setupListeners } from '@reduxjs/toolkit/query';
import UserDetails from "@Redux/Slices/UserDetails";
import inpuHandler from "@Redux/Slices/inputsHandler";
import PermissionEntry from "@Redux/service/permission";
import NotificationRTk from "@Redux/service/Notification";
import LeaveData from "@Redux/service/Leave";
import AdvanceData from "@Redux/service/Advance";
import { createLogger } from 'redux-logger';
import RoleOnSevices from "@Redux/service/RoleOn";
import OndutyRTk from "@Redux/service/Onduty";
import AttendanceRTk from "@Redux/service/AttendanceRtk";

// Define logger BEFORE using it in configureStore
const logger = createLogger({
  collapsed: (getState, action, logEntry) => !logEntry.error,
  predicate: () => __DEV__, // Only log in development
  duration: true,
  timestamp: true,
  colors: {
    title: () => '#0f0',
    prevState: () => '#9E9E9E',
    action: () => '#03A9F4',
    nextState: () => '#4CAF50',
    error: () => '#F20404',
  }
});


export const store = configureStore({
  reducer: {
    openTabs,
    [poRegister.reducerPath]: poRegister.reducer,
    [commonMast.reducerPath]: commonMast.reducer,
    [supplier.reducerPath]: supplier.reducer,
    [poData.reducerPath]: poData.reducer,
    [misDashboardService.reducerPath]: misDashboardService.reducer,
    [ordManagement.reducerPath]: ordManagement.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,
    [PermissionEntry.reducerPath]: PermissionEntry.reducer,
    [NotificationRTk.reducerPath]: NotificationRTk.reducer,
    [LeaveData.reducerPath]: LeaveData.reducer,
    [AdvanceData.reducerPath]: AdvanceData.reducer,
    [RoleOnSevices.reducerPath]:RoleOnSevices.reducer,
    [OndutyRTk.reducerPath]:OndutyRTk.reducer,
  [AttendanceRTk.reducerPath]:AttendanceRTk.reducer,
    dueDays: dueDaysReducer,
    tableData: tableData,
    UserDetails: UserDetails,
    Input: inpuHandler
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat([
        poRegister.middleware,
        commonMast.middleware,
        supplier.middleware,
        poData.middleware,
        misDashboardService.middleware,
        ordManagement.middleware,
        UsersApi.middleware,
        PermissionEntry.middleware,
        NotificationRTk.middleware,
        LeaveData.middleware,
        AdvanceData?.middleware,
        RoleOnSevices.middleware,
        OndutyRTk.middleware,
        AttendanceRTk.middleware,
        ...(__DEV__ ? [logger] : []) // Only add logger in development
      ]),
      
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;