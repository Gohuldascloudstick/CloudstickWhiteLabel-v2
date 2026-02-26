// import { Cars } from "@/types/fleet";
import {  createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface serverdetails {
  name: string;
  ip4: string;
  provider: string;
  root_password: string;
}

interface CustomerState {
  serverInstalMessages: string[];
  webInstallMessage: string[];
  webDeleteMessage: string[]
  serevrdetails: serverdetails | null;
  errorMessageForUi: string;
  webErrorMessageForUi: string;
}

const initialState: CustomerState = {
  serverInstalMessages: [],
  webInstallMessage: [],
  webDeleteMessage: [],
  errorMessageForUi: "",
  webErrorMessageForUi: '',
  serevrdetails: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    addserverMessage: (state, action: PayloadAction<string>) => {
      console.log("====================================");
      console.log(action.payload);
      console.log("====================================");
      if (action.payload.includes("UIError")) {
        state.errorMessageForUi = action.payload;
      } else {
        state.serverInstalMessages.push(action.payload);
      }
    },
    addWebinstallMessage: (state, action: PayloadAction<string>) => {
      if (action.payload.includes("UIError")) {
        state.webErrorMessageForUi = action.payload.toLocaleLowerCase();
      } else {
        state.webInstallMessage.push(action.payload);
      }

    },

    addDeleteMessage: (state, action: PayloadAction<string>) => {

      state.webDeleteMessage.push(action.payload);


    },
    clearerrorMessageForUi: (state) => {
      state.errorMessageForUi = "";
    },
    ClearWebsiteDeletionLogs: (state) => {
      state.webDeleteMessage = [];
    },
    clearerrorMessageForUiWEB: (state) => {
      state.webErrorMessageForUi = "";
    },
    storeServerdatils: (state, action: PayloadAction<serverdetails>) => {
      state.serevrdetails = action.payload;
    },
    addUierrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessageForUi = action.payload;
    },
    removeServerDetails: (state) => {
      state.serevrdetails = null;
    },
    ClearServerInstaltionLogs: (state) => {
      state.serverInstalMessages = [];
    },
    ClearWebsiteInstaltionLogs: (state) => {
      state.webInstallMessage = [];
    },
  },
});

export const {
  addserverMessage,
  addWebinstallMessage,
  storeServerdatils,
  clearerrorMessageForUi,
  removeServerDetails,
  addUierrorMessage,
  ClearServerInstaltionLogs,
  ClearWebsiteInstaltionLogs,
  clearerrorMessageForUiWEB,
  addDeleteMessage,
  ClearWebsiteDeletionLogs,
} = customerSlice.actions;
export default customerSlice.reducer;
