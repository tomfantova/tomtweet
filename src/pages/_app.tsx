import { type AppType } from "next/app";
import { api } from "../utils/api";
import "../styles/globals.css";

import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import user from "../reducers/user";
import tweets from "../reducers/tweets";

import { ToastProvider } from "react-toast-notifications";

const reducers = combineReducers({ user, tweets });
const persistConfig = {
  key: "tomtweet",
  storage,
  blacklist: ["tweets"],
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
          <Component {...pageProps} />
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
};

export default api.withTRPC(MyApp);
