import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./store/authContext";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>

      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>

    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
