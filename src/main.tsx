import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux";
import { persistStore } from "redux-persist";
import { App } from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { createTheme, ThemeProvider } from "@mui/material";

let persistor = persistStore(store);
const rootElement = document.getElementById("root");

export const themeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "rgb(220, 0, 78)",
    },
    background: {
      default: "#fff",
      paper: "#fff",
    },
  },
};
const theme = createTheme(themeOptions);

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
