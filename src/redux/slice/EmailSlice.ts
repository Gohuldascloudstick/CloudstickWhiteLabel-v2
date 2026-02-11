import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import type { Email, Emailconfig, } from "../../utils/interfaces";
import { api } from "../eventServices";

interface initialStatetype {
    loading: boolean;
    error: string | null;
    email: Email[];
    forward_email: string[];
    records: {
        a: Emailconfig | null;
        mx: Emailconfig | null;
        spf: Emailconfig | null;
        dkim: Emailconfig | null;
        dmarc: Emailconfig | null;
    };
}
const initialState: initialStatetype = {
    loading: false,
    error: null,
    email: [],
    forward_email: [],
    records: {
        a: null,
        mx: null,
        spf: null,
        dkim: null,
        dmarc: null,
    },
}

export const createEmailAccount = createAsyncThunk(
    "email/createemail",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/email/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.respnse?.data?.error || "unexpected error occured"
            )

        }
    }
)
export const getEmailList = createAsyncThunk(
    "email/getemails",
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/email/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.getEvents(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.respnse?.data?.error || "unexpected error occured"
            )

        }
    }
)
export const deleteEmail = createAsyncThunk(
    "email/deleteemail",
    async ({ name }: {name: string }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/email/websites/${webId}/servers/${serverId}/users/${user}?name=${name}`;
            const response = await api.deleteEvents(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || "Unexpected error occured"
            )

        }

    }
)

export const changeEmailPassword = createAsyncThunk(
    "email/changeemailpassword",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/email/password/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || "Unexpected error occured"
            )
        }
    }
)

export const updateQuota = createAsyncThunk(
    "email/changequota",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/email/quota/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || "Unexpected error occured"
            )
        }
    }
)

export const forwardEmail = createAsyncThunk(
    "email/forwardemail",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/email/forward/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || "Unexpected error occured"
            )
        }
    }
)

export const getForwardEmail = createAsyncThunk(
    "email/getforwardlist",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/email/forward/list/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(

                error.response?.data?.error || "Unexpected error occured"
            )
        }
    }
)
export const DeleteForwardEmail = createAsyncThunk(
    "email/deleteforwardemail",
    async ({ forwardemail, name }: { forwardemail: string, name: string }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            const url = `/api/v2/email/forward/websites/${webId}/servers/${serverId}/users/${user}?forwardemail=${forwardemail}&name=${name}`;
            const response = await api.deleteEvents(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || "Unexpected error occured"
            )
        }
    }
)
export const getConfig = createAsyncThunk(
    "email,getconfigforemail",
    async ({ webId, serverId }: { webId: number, serverId: number }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            const url = `/api/v2/email/configure/websites/${webId}/servers/${serverId}/users/${user.id}`;
            const response = await api.getEvents(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || "Unexpected error occured"
            )
        }
    }

)
export const setConfig = createAsyncThunk(
    "email/setconfigurationforemail",
    async ({ webId, serverId, label, data }: { webId: number, serverId: number, label: string, data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            const url = `/api/v2/email/setconfig/websites/${webId}/servers/${serverId}/users/${user.id}?account_label=${label}`;
            const response = await api.postEvents(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || "Unexpected error occured"
            )
        }
    }
)
const EmailSlice = createSlice({
    name: "email",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createEmailAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmailAccount.fulfilled, (state) => {
                state.loading = false;
                state.error = null;

            })
            .addCase(createEmailAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "unexpectd error occured";
            })
            .addCase(getEmailList.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(getEmailList.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.email = action.payload.data;
            })
            .addCase(getEmailList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "unexpected error occured";
            })
            .addCase(deleteEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEmail.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Unexpected error occured"
            })
            .addCase(changeEmailPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeEmailPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(changeEmailPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Unexpected error occured"
            })
            .addCase(updateQuota.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuota.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateQuota.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Unexpected error occured"
            })
            .addCase(forwardEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forwardEmail.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(forwardEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Unexpected error occured"
            })
            .addCase(getForwardEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getForwardEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.forward_email = action.payload.data;
            })
            .addCase(getForwardEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Unexpected error occured"
            })
            .addCase(DeleteForwardEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DeleteForwardEmail.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(DeleteForwardEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Unexpected error occured"
            })
            .addCase(getConfig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getConfig.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.records.a = action.payload.data["A Record"];
                state.records.mx = action.payload.data["MX Record"];
                state.records.spf = action.payload.data["SPF Record"];
                state.records.dkim = action.payload.data["DKIM Record"];
                state.records.dmarc = action.payload.data["DMARC Record"];
            })
            .addCase(getConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Unexpected error occured";
            })
            .addCase(setConfig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setConfig.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(setConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Unexpected error occured "
            })
    }
}
)
export default EmailSlice.reducer