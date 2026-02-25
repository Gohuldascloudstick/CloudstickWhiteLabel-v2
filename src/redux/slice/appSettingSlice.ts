import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../eventServices";



interface AppSettingState {
    loading: boolean;
    error: string | null;
}
const initialState: AppSettingState = {
    loading: false,
    error: null
}

export const changeAppPhpversion = createAsyncThunk(
    "appsetting/changeappphpversion",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/changephp/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || "unexpected error occured"
            );
        }

    }
)
export const changeWebStack = createAsyncThunk(
    "appsetting/changewebstack",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/changestack/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Unexpected error occured");
        }
    }
)

export const changeAppPublicPath = createAsyncThunk(
    "appsetting/changepublicpath",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/changepublicpath/websites/${webId}/servers/${serverId}/users/${user}`
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Unexpected error occured");
        }
    }
)

export const addNewDomain = createAsyncThunk(
    "appsetting/adddomain",
    async ({ data, ssl }: { data: any, ssl: string }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/adddomain/websites/${webId}/servers/${serverId}/users/${user}?require_ssl=${ssl}`
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Unexpected error occured");

        }
    }
)

export const removeDomain = createAsyncThunk(
    "appsetting/remverDomain",
    async ({ data, ssl }: { data: any, ssl: String }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/removedomain/websites/${webId}/servers/${serverId}/users/${user}?require_ssl=${ssl}`;
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Unexpected error occured");
        }
    }
)
export const changePhpConfig = createAsyncThunk(
    "appsetting/changephpconfig",
    async ({ data }: {  data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/changephpconfig/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Unexpected error occured");
        }
    }
)
export const changeNginxSettings = createAsyncThunk(
    "appsetting/changenginx",
    async ({ data }: { data: any}, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/changesecurity/websites/${webId}/servers/${serverId}/users/${user}`
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Unexpected error occured");
        }
    }
)
const appsettingsSlice = createSlice(
    {
        name: "appsetting",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(changeAppPhpversion.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(changeAppPhpversion.fulfilled, (state) => {
                    state.loading = false;
                    state.error = null;
                })
                .addCase(changeAppPhpversion.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string || "unexpected error"
                })
                .addCase(changeWebStack.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(changeWebStack.fulfilled, (state) => {
                    state.loading = false;
                    state.error = null;
                })
                .addCase(changeWebStack.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string || "unexpected error"
                })
                .addCase(changeAppPublicPath.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(changeAppPublicPath.fulfilled, (state) => {
                    state.loading = false;
                    state.error = null;
                })
                .addCase(changeAppPublicPath.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string || "unexpected error"
                })
                .addCase(addNewDomain.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(addNewDomain.fulfilled, (state) => {
                    state.loading = false;
                    state.error = null;
                })
                .addCase(addNewDomain.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string || "unexpected error"
                })
                .addCase(removeDomain.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(removeDomain.fulfilled, (state) => {
                    state.loading = false;
                    state.error = null;
                })
                .addCase(removeDomain.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string || "unexpected error "
                })
                .addCase(changePhpConfig.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(changePhpConfig.fulfilled, (state) => {
                    state.loading = false;
                    state.error = null;
                })
                .addCase(changePhpConfig.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string || "unexpected error "
                })
                .addCase(changeNginxSettings.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(changeNginxSettings.fulfilled, (state) => {
                    state.loading = false;
                    state.error = null;
                })
                .addCase(changeNginxSettings.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string || "unexpected error"
                })
        }
    }
)


export default appsettingsSlice.reducer;