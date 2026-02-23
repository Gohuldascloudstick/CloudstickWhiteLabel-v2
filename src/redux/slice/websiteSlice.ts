import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../eventServices";
import type { WebisteDetails } from "../../utils/interfaces";



interface initialStatetype {
  loading: boolean;
  error: string | null;
  phpversion: [];
  selectedWebsite: WebisteDetails | null;

}

const initialState: initialStatetype = {
  loading: false,
  error: null,
  phpversion: [],
  selectedWebsite: null,

};
export const getWebDetails = createAsyncThunk(
  "website/getDetails",
  async (_, { rejectWithValue }) => {
    try {

      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const webappType = localStorage.getItem("webappType") || "null"
      const url = `/api/v2/${webappType}/details/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Integration update failed");
    }
  }
);

export const Updatepasword = createAsyncThunk(
  "systemuser/Updatepasword",
  async ({ data }: { data: { password: string, confirm_password: string } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const systemuserId = localStorage.getItem("systemuserId");
      const url = `/api/v2/systemuser/${systemuserId}/servers/${serverId}/users/${user}`;
      const response = await api.patchEvent(url, data);
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed");
    }

  }
)
export const getPhpVersions = createAsyncThunk(
  "easyphp/getphpversions",
  async ({ serverId }: { serverId: number }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const url = `/api/v2/php-versions/servers/${serverId}/users/${user.id}`;
      const response = await api.getEvents(url);
      return response.data
    }
    catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "unexpected error occured"
      );
    }
  }
)




















const WebsiteSLice = createSlice({
  name: "website",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getWebDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getWebDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedWebsite = action.payload.message;
      })
      .addCase(getWebDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "unexpected error occured"
      })
      .addCase(getPhpVersions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhpVersions.fulfilled, (state, action) => {
        state.loading = false;
        state.phpversion = action.payload.message;
        state.error = null;
      })
      .addCase(getPhpVersions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "unexpected error occured";
      })









      ;
  },
});




export default WebsiteSLice.reducer;
