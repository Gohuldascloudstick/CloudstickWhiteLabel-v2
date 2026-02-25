// store/slices/zoneSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../eventServices";
import type { Server, ServerDetails, ServerStats } from "../../utils/interfaces";

interface initialStatetype {
  serverList: Server[];
  loading: boolean;
  error: string | null;
  manualurl: string;
  serverStats: Record<string, ServerStats>;
  selectedServer: ServerDetails | null;
  transfer: any;
  ServerLog: { logs: string[], total_count: number };
  rebootingServer: string[]

}

const initialState: initialStatetype = {
  serverList: [],
  loading: false,
  manualurl: "",
  serverStats: {},
  selectedServer: null,
  error: null,
  transfer: null,
  ServerLog: { logs: [], total_count: 0 },
  rebootingServer: []


};

// Async       Thunks for API calls
export const getServer = createAsyncThunk(
  "server/getserverlist",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const url = `/api/v2/serverslist/byuser/users/${user}`;
      const response = await api.getEvents(url);
      const data = await response.data;

      return data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Servers fetch failed");
      }
      return rejectWithValue(error);
    }
  }
);

export const getServerDetails = createAsyncThunk(
  "server/getServerDetails",
  async (id: string, { rejectWithValue }) => {
    try {
     const user = JSON.parse(localStorage.getItem("userId") || "null");
      const url = `/api/v2/details/servers/${id}/users/${user}`;
      const response = await api.getEvents(url);
      const data = await response.data;

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Servers fetch failed");
      }
      return rejectWithValue(error);
    }
  }
);

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    clearmanualurl: (state) => {
      state.manualurl = "";
    },

    clearServerStatById(state, action: PayloadAction<string>) {
      delete state.serverStats[action.payload];
    },
    addRebootingServer(state, action: PayloadAction<string>) {

      if (!state.rebootingServer) {
        state.rebootingServer = [];
      }


      if (!state.rebootingServer.includes(action.payload)) {
        state.rebootingServer.push(action.payload);
      }
    },
    removeRebootingServer(state, action: PayloadAction<string>) {
      state.rebootingServer = state.rebootingServer?.filter(
        (uuid) => uuid !== action.payload
      );
    }

  },
  extraReducers: (builder) => {
    // Fetch Verticals
    builder
      .addCase(getServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getServer.fulfilled, (state, action) => {
        state.serverList = action.payload.servers;
        state.loading = false;
      })

      .addCase(getServer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getServerDetails.fulfilled, (state, action) => {
        state.selectedServer = action.payload;
        state.loading = false;
      })








  },
});

export const { clearmanualurl, clearServerStatById, addRebootingServer, removeRebootingServer } = serverSlice.actions;
export default serverSlice.reducer;
