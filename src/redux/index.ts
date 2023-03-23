import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import rootReducer from "./rootReducer";
import { rebrickableApi } from "./services/rebrickable/rebrickable.web";
import { PERSIST, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 512 },
      serializableCheck: {
        ignoredActions: [PERSIST],
        warnAfter: 128,
      },
    }).concat(rebrickableApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useReduxDispatch = (): AppDispatch => useDispatch<AppDispatch>();
