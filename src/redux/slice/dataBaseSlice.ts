import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../eventServices";




interface initialStatetype {
  loading: boolean;
  zoneCurrentpage: number;
  RecordCurrentPAge:number;
  TotalRecord:number;
  totalZone: number;
  zoneLoading:boolean,
  temproryDomain : string
}

const initialState: initialStatetype = {
  loading: false,
  zoneCurrentpage: 1,
  totalZone: 0,
  zoneLoading:false,
  RecordCurrentPAge:1,
  TotalRecord:0,
  temproryDomain:''
};

export const createNewZone = createAsyncThunk(
  "dns/addNEwZone",
  async (
    {
      data,
      account_label,
    }: {
      account_label: string;
      data: { name: string; type: string; jump_start: boolean };
    },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const url = `/api/v2/createzone/users/${user.id}?account_label=${account_label}`;
      const response = await api.postEvents(url, data);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(
        error.response?.data?.error || "ununexpected error occurred Try again"
      );
    }
  }
);

const dnsSlice = createSlice({
  name: "dns",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewZone.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewZone.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createNewZone.rejected, (state) => {
        state.loading = false;
      })
      
  },
});


export default dnsSlice.reducer;
