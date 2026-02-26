import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Subdomain } from "../../utils/interfaces";
import { api } from "../eventServices";
interface SubdomainState {

    loading: boolean;
    error: string | null;
    websites: Subdomain[];
}

const initialState: SubdomainState = {
    loading: false,
    error: null,
    websites: []
}

export const getSubdomain = createAsyncThunk(
    "subdomain/getsubdomain",
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/list/website-subdomains/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.getEvents(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)
export const createSubdomainFreeSslHttp = createAsyncThunk(
    "sslManager/createFreeSslHttp",
    async ({ websiteId, data }: { websiteId: string,  data: { authorisation: string, access: string, brotli_enabled: boolean } }, { rejectWithValue }) => {
        try {
             const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const url = `/api/v2/ssl/free-certificate/website-subdomian/${websiteId}/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to create free SSL (HTTP)");
        }
    }
);

const SubdomainSlice = createSlice(
    {
        name: "subdomain",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getSubdomain.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(getSubdomain.fulfilled, (state, action) => {
                    state.loading = false;
                    state.error = null;
                    state.websites = action.payload.message.Websites
                })
                .addCase(getSubdomain.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string | "Unexpected error occured "

                })
                .addCase(createSubdomainFreeSslHttp.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(createSubdomainFreeSslHttp.fulfilled, (state) => {
                    state.loading = false;
                    state.error = null;
                })
                .addCase(createSubdomainFreeSslHttp.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string | "Unexpected error occured"

                })
        }
    }
)
export default SubdomainSlice.reducer