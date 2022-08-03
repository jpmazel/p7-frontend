//REDUX TOOLKIT STORE 

import { configureStore } from "@reduxjs/toolkit";
import commentarySlice from "./slices/commentary-slice";
import ficheUserSlice from "./slices/ficheUser-slice";
import authentificationSlice from "./slices/authentification-slice";

const store = configureStore({
  reducer: {
    commentary: commentarySlice.reducer,
    ficheUser: ficheUserSlice.reducer,
    authentification: authentificationSlice.reducer,
  },
});

export default store;
