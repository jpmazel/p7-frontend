//REDUX TOOLKIT STORE

import { configureStore} from "@reduxjs/toolkit";
import commentarySlice from "./slices/commentary-slice";

const store = configureStore({
  reducer: {
    commentary: commentarySlice.reducer,
  }
})

export default store
