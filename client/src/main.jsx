import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { StoreProvider } from "./core/store/Provider.jsx";
import store from "./core/store/store.js";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
