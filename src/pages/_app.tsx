import { type AppType } from "next/app";
import { api } from "../utils/api";
import "../styles/globals.css";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "../reducers/user";

import { ToastProvider } from "react-toast-notifications";

const store = configureStore({
  reducer: { user },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
        <Component {...pageProps} />
      </ToastProvider>
    </Provider>
  );
};

export default api.withTRPC(MyApp);
