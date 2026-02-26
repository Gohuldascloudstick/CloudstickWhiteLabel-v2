import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Plugin, WordPressManagerVersion, WordPressUSer, wpDebug, wpPlugincount, WpURLS, wpUsercount } from "../../utils/interfaces";
import { api } from "../eventServices";


interface CreateUserPayload {
 
  user_name: string;
  email: string;
  role: string;
  password: string;
  
}

interface initialStatetype {
  loading: boolean;
  wordpressUSer: WordPressUSer[];
  wordpressPlugins: Plugin[];
  pliginLoader: boolean;
  wordPressManagerVersion: WordPressManagerVersion;
  WPversionLoader: boolean;
  WpURLS?: WpURLS;
  WpUrlLoader?: boolean;
  WpPLuginCount?: wpPlugincount;
  wPUserCountLoader: boolean;
  wpUserCount: wpUsercount;
  wpPlugincountLoader: boolean;
  wpMAIntance: boolean;
  wpmaintanceLoader: boolean;
  wpsearch_index_enabled: boolean;
  wpSearch_index_enabled_loader: boolean;
  wpDebug: wpDebug;
  wpdebug_loader: boolean;
}

const initialState: initialStatetype = {
  loading: false,
  wordpressUSer: [],
  wordpressPlugins: [],
  pliginLoader: false,
  wordPressManagerVersion: {
    current_version: "0.00.00",
    update_available: false,
    auto_update_major: false,
    auto_update_minor: false,
  },
  WPversionLoader: false,
  WpURLS: { home_url: "", public_path: "", site_url: "" },
  WpUrlLoader: false,
  wpPlugincountLoader: false,
  WpPLuginCount: { active_plugins: 0, total_plugins: 0 },
  wPUserCountLoader: false,
  wpUserCount: { active_users: 0, total_users: 0 },
  wpMAIntance: false,
  wpmaintanceLoader: false,
  wpsearch_index_enabled: false,
  wpSearch_index_enabled_loader: false,
  wpDebug: {
    debug_enabled: false,
    debug_log: false,
    debug_display: false,
    debug_log_path: "",
    config_file_path: "",
    log_exists: false,
    log_size: 0,
    recent_logs: [],
    public_path: "",
  },
  wpdebug_loader: false,
};

export const getWorpressUser = createAsyncThunk(
  "wordPressManager/getWorpressUser",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const queryParams = new URLSearchParams();
      const url = `/api/v2/wordpress/wpusers/${webId}/servers/${serverId}/users/${user}`;
      const baseurl = `${url}?${queryParams.toString()}`;

      const response = await api.getEvents(baseurl);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Unexpected Error Occured"
      );
    }
  }
);
export const createWordPressUser = createAsyncThunk(
  "wordPressManager/createWordPressUser",
  async (
    {
      user_name,
      email,
      role,
      password,  
    }: CreateUserPayload,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/wpusers/${webId}/servers/${serverId}/users/${user}`;

      await api.postEvents(url, {
        user_name: user_name.trim().split(" ").join(""),
        email: email.trim(),
        role,
        password: password.trim(),
      });
      return webId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create user"
      );
    }
  }
);

export const UpdateWordpressUser = createAsyncThunk(
  "wordPressManager/UpdateWordpressUser",
  async (
    {
      id,
      data,
    }: { id: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/wpusers/${webId}/${id}/servers/${serverId}/users/${user}`;
      await api.patchEvent(url, data);
      return webId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create user"
      );
    }
  }
);

export const dleteWordpressUser = createAsyncThunk(
  "wordPressManager/dleteWordpressUser",
  async (
    { id }: { id: string },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/wpusers/${webId}/${id}/servers/${serverId}/users/${user}`;
      await api.deleteEvents(url);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Unexpected Error Occured"
      );
    }
  }
);

export const getWordPressPlugins = createAsyncThunk(
  "wordPressManager/getWordPressPlugins",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const queryParams = new URLSearchParams();
      const url = `/api/v2/wordpress/wpusers/${webId}/plugins/servers/${serverId}/users/${user}`;
      const baseurl = `${url}?${queryParams.toString()}`;
      const response = await api.getEvents(baseurl);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Unexpected Error Occured"
      );
    }
  }
);

export const handlePluginAction = createAsyncThunk(
  "wordPressManager/handlePluginAction",
  async (
    {
      action,
      plugin_name,
    }: {
      action: string;
      plugin_name: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/wpusers/${webId}/plugins/servers/${serverId}/users/${user}?action=${action}`;
      const response = await api.patchEvent(url, { plugin_name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Unexpected Error Occured"
      );
    }
  }
);

export const getWordPressManagerVersions = createAsyncThunk(
  "wordPressManager/getWordPressManagerVersions",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/version/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Unexpected Error Occured"
      );
    }
  }
);

export const handleWPversionActions = createAsyncThunk(
  "wordPressManager/handleWPversionActions",
  async (
    {
      action,
    }: {
      action: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")

      const url = `/api/v2/wordpress/manager/version/${webId}/servers/${serverId}/users/${user}?type=${action}`;

      const response = await api.patchEvent(url, {});

      console.log(response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Unexpected Error Occured"
      );
    }
  }
);

export const getWpUrls = createAsyncThunk(
  "wordPressManager/getWpUrls",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/urls/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Unexpected Error Occured"
      );
    }
  }
);
export const UpdateWP_URls = createAsyncThunk(
  "wordPressManager/UpdateWP_URls",
  async (
    {
      data,
    }: { data: any },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/urls/${webId}/servers/${serverId}/users/${user}`;
      await api.patchEvent(url, data);
      return webId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update url"
      );
    }
  }
);

export const getUSerCounts = createAsyncThunk(
  "wordPressManager/getUSerCounts",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/users/count/${webId}/servers/${serverId}/users/${user}`;
      const result = await api.getEvents(url);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update url"
      );
    }
  }
);
export const getWPPluginCount = createAsyncThunk(
  "wordPressManager/getWPPluginCount",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/plugins/count/${webId}/servers/${serverId}/users/${user}`;
      const result = await api.getEvents(url);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update url"
      );
    }
  }
);

export const getWpdebug = createAsyncThunk(
  "wordPressManager/getWpdebug",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/debug/${webId}/servers/${serverId}/users/${user}`;
      const result = await api.getEvents(url);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update url"
      );
    }
  }
);

export const getWpMaintance = createAsyncThunk(
  "wordPressManager/getWpMaintance",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/maintanance/${webId}/servers/${serverId}/users/${user}`;
      const result = await api.getEvents(url);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update url"
      );
    }
  }
);

export const updateWpMaintance = createAsyncThunk(
  "wordPressManager/updateWpMaintance",
  async (
    {
      toggle,
    }: { toggle: boolean },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/maintanance/${webId}/servers/${serverId}/users/${user}`;
      const result = await api.patchEvent(url, { maintanance_enabled: toggle });
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update url"
      );
    }
  }
);

export const getWpindex = createAsyncThunk(
  "wordPressManager/getWpindex",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/searchindex/${webId}/servers/${serverId}/users/${user}`;
      const result = await api.getEvents(url);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update url"
      );
    }
  }
);

export const updatesearchIndex = createAsyncThunk(
  "wordPressManager/updatesearchIndex",
  async (
    {
      toggle,
    }: { toggle: boolean },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/searchindex/${webId}/servers/${serverId}/users/${user}`;
      const result = await api.patchEvent(url, {
        search_index_enabled: toggle,
      });
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update url"
      );
    }
  }
);

export const updateDebug = createAsyncThunk(
  "wordPressManager/updateDegub",
  async (
    {
      data,
    }: { data: any },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/wordpress/manager/debug/${webId}/servers/${serverId}/users/${user}`;
      const result = await api.patchEvent(url, data);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update url"
      );
    }
  }
);

const WordPresManagerSLice = createSlice({
  name: "wordPressManager",
  initialState,
  reducers: {
    clearWordPressManagerState: (state) => {
      state.wordpressPlugins = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWorpressUser.fulfilled, (state, action) => {
        state.wordpressUSer = action.payload.message;
      })
      .addCase(dleteWordpressUser.fulfilled, (state, action) => {
        state.wordpressUSer = state.wordpressUSer.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(getWordPressPlugins.pending, (state) => {
        state.pliginLoader = true;
      })
      .addCase(getWordPressPlugins.rejected, (state) => {
        state.pliginLoader = false;
      })
      .addCase(getWordPressPlugins.fulfilled, (state, action) => {
        state.pliginLoader = false;
        state.wordpressPlugins = action.payload.message;
      })
      .addCase(getWordPressManagerVersions.pending, (state) => {
        state.WPversionLoader = true;
      })
      .addCase(getWordPressManagerVersions.rejected, (state) => {
        state.WPversionLoader = false;
      })
      .addCase(getWordPressManagerVersions.fulfilled, (state, action) => {
        state.WPversionLoader = false;
        state.wordPressManagerVersion = action.payload.message;
      })
      .addCase(getWpUrls.pending, (state) => {
        state.WpUrlLoader = true;
      })
      .addCase(getWpUrls.rejected, (state) => {
        state.WpUrlLoader = false;
      })
      .addCase(getWpUrls.fulfilled, (state, action) => {
        state.WpUrlLoader = false;
        state.WpURLS = action.payload.message;
      })
      .addCase(getUSerCounts.pending, (state) => {
        state.wPUserCountLoader = true;
      })
      .addCase(getUSerCounts.rejected, (state) => {
        state.wPUserCountLoader = false;
        state.wpUserCount = { active_users: 0, total_users: 0 };
      })
      .addCase(getUSerCounts.fulfilled, (state, action) => {
        state.wPUserCountLoader = false;
        state.wpUserCount = action.payload.message;
      })
      .addCase(getWPPluginCount.pending, (state) => {
        state.wpPlugincountLoader = true;
      })
      .addCase(getWPPluginCount.fulfilled, (state, action) => {
        state.wpPlugincountLoader = false;
        state.WpPLuginCount = action.payload.message;
      })
      .addCase(getWPPluginCount.rejected, (state) => {
        state.wpPlugincountLoader = false;
        state.WpPLuginCount = { active_plugins: 0, total_plugins: 0 };
      })
      .addCase(getWpMaintance.pending, (state) => {
        state.wpmaintanceLoader = true;
      })
      .addCase(getWpMaintance.fulfilled, (state, action) => {
        state.wpmaintanceLoader = false;
        state.wpMAIntance = action.payload.message.maintanance_enabled;
      })
      .addCase(getWpMaintance.rejected, (state) => {
        state.wpmaintanceLoader = false;
        state.WpPLuginCount = { active_plugins: 0, total_plugins: 0 };
      })
      .addCase(updateWpMaintance.fulfilled, (state) => {
        state.wpMAIntance = !state.wpMAIntance;
      })
      .addCase(getWpindex.pending, (state) => {
        state.wpSearch_index_enabled_loader = true;
      })
      .addCase(getWpindex.fulfilled, (state, action) => {
        state.wpSearch_index_enabled_loader = false;
        state.wpsearch_index_enabled =
          action.payload.message.search_index_enabled;
      })
      .addCase(getWpindex.rejected, (state) => {
        state.wpSearch_index_enabled_loader = false;
      })
      .addCase(updatesearchIndex.fulfilled, (state) => {
        state.wpsearch_index_enabled = !state.wpsearch_index_enabled;
      })
      .addCase(getWpdebug.pending, (state) => {
        state.wpdebug_loader = true;
      })
      .addCase(getWpdebug.fulfilled, (state, action) => {
        state.wpdebug_loader = false;
        state.wpDebug =
          action.payload.message;
      })
      .addCase(getWpdebug.rejected, (state) => {
        state.wpdebug_loader = false;
      })

      ;
  },
});

export const { clearWordPressManagerState } = WordPresManagerSLice.actions;
export default WordPresManagerSLice.reducer;
