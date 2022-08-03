import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataResponse: {
    userId: localStorage.getItem("userId"),
    token: localStorage.getItem("token"),
    admin: Number(localStorage.getItem("admin")),
  },
  isLoggedIn: false,
  errorFetch: null,
  accountCreate: false,
  isLoading: false,
};

const authentificationSlice = createSlice({
  name: "authentification",
  initialState,
  reducers: {
    postLogin(state, action) {
      state.dataResponse = action.payload;
      state.isLoading = false;

      localStorage.setItem("token", state.dataResponse.token);
      localStorage.setItem("userId", state.dataResponse.userId);
      localStorage.setItem("admin", state.dataResponse.admin);

      if (state.dataResponse.token) {
        state.isLoggedIn = true;
      }

      if (action.payload) {
        state.accountCreate = true;
      }
    },
    localStorageAuth(state, action) {
      if (localStorage.getItem("token")) {
        state.dataResponse.userId = localStorage.getItem("userId");
        state.dataResponse.token = localStorage.getItem("token");
        state.dataResponse.admin = Number(localStorage.getItem("admin"));
        state.isLoggedIn = true;
      }
    },
    logout(state) {
      state.dataResponse = {
        userId: null,
        token: null,
        admin: null,
      };
      localStorage.clear();

      state.isLoggedIn = false;
    },
    errorFetch(state, action) {
      state.errorFetch = action.payload;
    },
    resetErrorFetch(state) {
      state.errorFetch = null;
      state.isLoading = false;
    },
    accountCreate(state, action) {
      state.accountCreate = action.payload;
    },
    isLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

//export des actions / reducers
export const authentificationActions = authentificationSlice.actions;

//export du slice
export default authentificationSlice;
