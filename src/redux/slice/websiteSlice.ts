import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../eventServices";
import type { WebisteDetails } from "../../utils/interfaces";



interface LogState {
  logs: string[];
  total_count: number;
}

interface initialStatetype {
  loading: boolean;
  error: string | null;
  phpversion: [];
  selectedWebsite: WebisteDetails | null;
  nginxLog: LogState;
  nginxErrolog: LogState;
  apchelog: LogState;
  apcheErrolog: LogState;
}

const initialState: initialStatetype = {
  loading: false,
  error: null,
  phpversion: [],
  selectedWebsite: null,
  nginxLog: { logs: [], total_count: 0 },
  nginxErrolog: { logs: [], total_count: 0 },
  apchelog: { logs: [], total_count: 0 },
  apcheErrolog: { logs: [], total_count: 0 },
};

// Helper to get common URL parameters
const getCommonParams = () => {
  const userId = import.meta.env.VITE_userId;
  const serverId = import.meta.env.VITE_serverId;
  const webId = import.meta.env.VITE_webId;
  return { userId, serverId, webId };
};
export const getWebDetails = createAsyncThunk(
  "website/getDetails",
  async (_, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const webappType = localStorage.getItem("webappType") || "null"
      const url = `/api/v2/${webappType}/details/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Integration update failed");
    }
  }
);

export const getNginxLog = createAsyncThunk(
  'website/getNginxLog',
  async ({ scroll_count, log }: { scroll_count: number, log: 'access' | 'error' }, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/nginx-logs/websites/${webId}/servers/${serverId}/users/${userId}?scroll_count=${scroll_count}&log=${log}`
      const response = await api.getEvents(url)
      return { data: response.data, logType: log };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch NGINX logs");
    }
  }
);

export const getApacheLog = createAsyncThunk(
  'website/getApacheLog',
  async ({ scroll_count, log }: { scroll_count: number, log: 'access' | 'error' }, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/apache-logs/websites/${webId}/servers/${serverId}/users/${userId}?scroll_count=${scroll_count}&log=${log}`
      const response = await api.getEvents(url)
      return { data: response.data, logType: log };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch Apache logs");
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
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const url = `/api/v2/php-versions/servers/${serverId}/users/${user}`;
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
export const magicLink = createAsyncThunk(
  "website/magiclink",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverid = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/magiclink/servers/${serverid}/users/${user}?wid=${webId}`
      const response = await api.postEvents(url, {})
      return response.data.message
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Magic link Creation Failed");
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

      // NGINX Logs
      .addCase(getNginxLog.fulfilled, (state, action) => {
        const { data, logType } = action.payload;
        const target = logType === 'access' ? 'nginxLog' : 'nginxErrolog';
        if (data.scroll_count === 1) {
          state[target] = {
            logs: data.message.logs,
            total_count: data.message.total_count
          };
        } else {
          state[target].logs = [...state[target].logs, ...data.message.logs];
          state[target].total_count = data.message.total_count;
        }
      })

      // Apache Logs
      .addCase(getApacheLog.fulfilled, (state, action) => {
        const { data, logType } = action.payload;
        const target = logType === 'access' ? 'apchelog' : 'apcheErrolog';
        if (data.scroll_count === 1) {
          state[target] = {
            logs: data.message.logs,
            total_count: data.message.total_count
          };
        } else {
          state[target].logs = [...state[target].logs, ...data.message.logs];
          state[target].total_count = data.message.total_count;
        }
      })









      ;
  },
});




export default WebsiteSLice.reducer;
