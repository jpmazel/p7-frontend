import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ficheUserData: [
    // {
      // job(pin):"developpeur web"
      // bio(pin):"developpeur web"
      // age(pin):12
      // nom(pin):"DOE"
      // photoProfilUrl(pin):"http://localhost:3000/images/4K_logo_png.png_1659505273443.png"
      // prenom(pin):"John"
      // userId(pin):759
      // idFiche(pin):797
      // newFiche(pin):"1"
    // },
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
      //si tableau fiche utilisateur vide-fiche inexistante
      if (action.payload.length === 0) {
        state.modification = true;
      } else {
        state.modification = false;
      }
    },
    postFicherUser(state, action) {     
      state.ficheUserData = { ...action.payload.dataUpdateFormData };
      state.modification = false;
    },

    putFicheUser(state, action) {    
      if(!action.payload){
        state.modification = false;
        return
      }

      state.ficheUserData = {
        ...state.ficheUserData,
        ...action.payload.dataUpdateFormData,
      };      

      state.modification = false;
    },
    deleteAccount(state, action) {
      state.ficheUserData = [];
      state.confirmationModal = false;
      state.presenceIdFiche = {};
     
    },

    isModification(state) {
      state.modification = true;
    },

    getIdFiche(state, action) {     
      state.presenceIdFiche = action.payload;
    },
  },
});

//export des actions
export const ficheUserActions = ficheUserSlice.actions;

//export de ficheUserSlice
export default ficheUserSlice;
