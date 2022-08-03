import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  onNewComment: false,
  onUpdateDeleteComment: 0,
  modificationComment: {
    buttonSend: false,
    isUpdating: false,
    commentToEdit: 0,
  },
};
const commentarySlice = createSlice({
  name: "commentary",
  initialState,
  reducers: {
    getComments(state, action) {
      state.comments = action.payload.results;
    },
    postCommentary(state) {
      state.onNewComment = !state.onNewComment;
    },
    deleteCommentary(state, action) {     
      const idComment = action.payload
      const datas = state.comments

      const results = datas.filter((data) => data.id_comments_user !== idComment)      
      state.comments = results;

      //pour actualiser le badge des commentaire
      state.onUpdateDeleteComment = idComment
    },
    putCommentary(state, action) {
      state.modificationComment.buttonSend = false;
      state.modificationComment.isUpdating = false;
      
      //Pour mettre à jour le state redux après la modification du message du commentaire
      const idComment = action.payload.idComment;
      const message = action.payload.messageTextarea.comments_user_message;
      const datas = state.comments;

      const results = datas.filter(
        (data) => data.id_comments_user === idComment
      );

      results[0].comments_user_message = message;
    },
    boutonSend(state, action) {      
      state.modificationComment.buttonSend = action.payload;
    },
    modificationComment(state, action) {    
      state.modificationComment = action.payload;
    },
    clearStateCommentary(state, action){
     state.comments = []
    }
  },
});

//export l'action
export const commentaryActions = commentarySlice.actions;

//export du slice
export default commentarySlice;
