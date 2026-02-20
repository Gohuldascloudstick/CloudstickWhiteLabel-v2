import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CronJob, SystemUser } from "../../utils/interfaces";
import { api } from "../eventServices";



interface initialStatetype {
  loading: boolean;
  ServerCrons: CronJob[];
  VendorBinary: string[];
  SystemUser: SystemUser[];
  editCron: CronJob | null;
  AppCrons: CronJob[];
}


const initialState: initialStatetype = {
  loading: false,
  ServerCrons: [],
  VendorBinary: [],
  SystemUser: [],
  editCron: null,
  AppCrons: [],

};



export const getAppCron = createAsyncThunk(
  "cron-job/getAppCron",
  async (_, { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/cron/websites/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.getEvents(url);
      return response.data;

    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed")

    }
  }
);
export const UpdateServerCorn = createAsyncThunk(
  "cron-job/UpdateServerCorn",
  async ({ data, cornid }: { cornid: number, data: { user_name: string, label: string, binary: string, path: string, schedule: string } }, { rejectWithValue }) => {

    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const url = `/api/v2/cron/${cornid}/servers/${serverId}/users/${user}`;
      const response = await api.patchEvent(url, data)
      return response.data

    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
)
export const removeServerCron = createAsyncThunk(
  "cron-job/removeServerCron",
  async ({ CronID }: { CronID: number }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const url = `/api/v2/cron/${CronID}/servers/${serverId}/users/${user}`;
      const response = await api.deleteEvents(url);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
)

export const createAppCron = createAsyncThunk(
  "cron-job/createAppCron",
  async ({ data }: { data: { user_name: string, label: string, binary: string, path: string, schedule: string } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/cron/websites/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.postEvents(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed");

    }


  }
)

export const getVendor_binary = createAsyncThunk(
  "cron-job/getVendorBinary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getEvents('/api/v2/vendor-binary  ')
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
);


export const getSysytemUser = createAsyncThunk(
  "cron_job/getSysytemUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");

      const url = `/api/v2/systemuser/servers/${serverId}/users/${user}`;
      const response = await api.getEvents(url)
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
)


const cronjobSlice = createSlice({
  name: "cron-job",
  initialState,
  reducers: {
    editJob: (state, action) => {
      state.editCron = action.payload
    },
    clearedit: (state) => {
      state.editCron = null
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAppCron.fulfilled, (state, action) => {
        state.AppCrons = action.payload.data;
      })
      .addCase(getAppCron.rejected, (state) => {
        state.AppCrons = [];
      })
      .addCase(getVendor_binary.fulfilled, (state, action) => {
        state.VendorBinary = action.payload.data
      })
      .addCase(getSysytemUser.fulfilled, (state, action) => {
        state.SystemUser = action.payload.message.SystemUsers
      })
      .addCase(getSysytemUser.rejected, (state) => {
        state.SystemUser = []
      })
      ;

  },
});

export const { editJob, clearedit } = cronjobSlice.actions
export default cronjobSlice.reducer;
