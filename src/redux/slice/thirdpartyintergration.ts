import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import type { IntegrationCredential } from "../../utils/interfaces";
import { api } from "../eventServices";

interface ThirdPartyIntegrationState {
  data: any;
  loading: boolean;
  error: string | null;
  intergrationLilst: IntegrationCredential[];
}

const initialState: ThirdPartyIntegrationState = {
  data: null,
  loading: false,
  error: null,
  intergrationLilst: [],
};

export const fetchThirdPartyData = createAsyncThunk(
  "thirdPartyIntegration/fetchData",
  async (_, { rejectWithValue }) => {
    try {
       const user = JSON.parse(localStorage.getItem("userId") || "null");
      const url = `/api/v2/thirdpartyintegrations/users/${user.id}`;
      const response = await api.getEvents(url);

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addthirdPartyIntegration = createAsyncThunk(
  "thirdpartyIntegration/addIntegration",
  async (
    data: {
      label: string;
      username: string;
      secret_key: string;
      service: string;
    },
    { rejectWithValue }
  ) => {
    try {
       const user = JSON.parse(localStorage.getItem("userId") || "null");
      const url = `/api/v2/thirdpartyintegrations/users/${user.id}`;
      const response = await api.postEvents(url, data);
      console.log("====================================");
      console.log("response", response.data);
      console.log("====================================");
      return response.data;
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error || "Integration failed");
    }
  }
);

export const delteIntegration = createAsyncThunk(
  "thirdpartyIntegration/deleteIntegration",
  async (id: number, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");

      const url = `/api/v2/thirdpartyintegrations/${id}/users/${user.id}`;
      const response = await api.deleteEvents(url);
      return response.data;
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error || "Integration failed");
    }
  }
);

export const updateIntegration = createAsyncThunk(
  "thirdpartyIntegration/updateIntegration",
  async ({id,data}:{id:number, data:any}, { rejectWithValue }) => {
    try {
       const user = JSON.parse(localStorage.getItem("userId") || "null");
   const url = `/api/v2/thirdpartyintegrations/${id}/users/${user.id}`;
   const response = await api.patchEvent(url,data)
   return response.data
    } catch (error:any) {
         return rejectWithValue(error.response?.data?.error || "Integration update failed");
    }
  }
);

const thirdPartyIntegrationSlice = createSlice({
  name: "thirdPartyIntegration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThirdPartyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchThirdPartyData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.intergrationLilst = action.payload.providers;
        }
      )
      .addCase(fetchThirdPartyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default thirdPartyIntegrationSlice.reducer;
