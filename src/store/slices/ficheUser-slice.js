import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ficheUserData: [
    // {
    // age: 0
    // bio: "dqsdqs"
    // idFiche: 820
    // job: "dqsdsq"
    // newFiche: "0"
    // nom: "DQSDQS"
    // photoProfilUrl: "http://localhost:3000/images/IMAGE-LOGO-CHAINE-YOUTUBE.jpg_1660553281845.jpg"
    // prenom: "Sddq"
    // userId: 791
    // }
  ],
  modification: false,
  confirmationModal: null,
  presenceIdFiche: {},
};

const ficheUserSlice = createSlice({
  name: "ficheUser",
  initialState,
  reducers: {
    getFicheUser(state, action) {
      state.ficheUserData = action.payload;
      //Si le tableau fiche utilisateur est vide-fiche est inexistante
      if (action.payload.length === 0) {
        state.modification = true;
      } else {
        state.modification = false;
      }
    },

    postFicheUser(state, action) {
      state.ficheUserData = action.payload;
      state.modification = false;
    },

    deleteAccount(state) {
      state.ficheUserData = [];
      state.confirmationModal = false;
      state.presenceIdFiche = {};
    },

    isModification(state, action) {
      state.modification = action.payload;
    }, 
    
    getIdFiche(state, action) {
      state.presenceIdFiche = action.payload;
    },

    putFicheUser(state, action) {
      // state.ficheUserData = action.payload;
      state.ficheUserData = {
        ...state.ficheUserData,
        ...action.payload
      }
    
      state.modification = false;
    },
    logout(state){
      state.ficheUserData = []
    }
  },
});

//export des actions
export const ficheUserActions = ficheUserSlice.actions;

//export le slice
export default ficheUserSlice;
