import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../eventServices";

interface EditCertificate {
    brotli_enabled?: boolean;
    access?: string;
    tls_version?: string;
    cipher_suite?: string;
}

interface initialState {
  
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    IsEditing: EditCertificate | null,
    isCustomRenew: boolean,
}

const initialState: initialState = {
   
    status: 'idle',
    error: null,
    IsEditing: null,
    isCustomRenew: false
};

export const createFreeSslHttp = createAsyncThunk(
    "sslManager/createFreeSslHttp",
    async ({ data }: { data: { authorisation: string, access: string, brotli_enabled: boolean } }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            if (!user) return rejectWithValue("User not logged in or ID missing");
            const url = `/api/v2/ssl/free-certificate/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to create free SSL (HTTP)");
        }
    }
);


export const createFreeSslDns = createAsyncThunk(
    "sslManager/createFreeSslDns",
    async ({ data }: { data: { authorisation: string, access: string, thirdparty_provider: string, account_label: string, brotli_enabled: boolean } }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            if (!user) return rejectWithValue("User not logged in or ID missing");
            const url = `/api/v2/ssl/free-certificate/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;
        } catch (error: any) {
            console.log('=================sssssssssssssssssssssssssssssssssssssssssssssssssss===================');
            console.log(error.response?.data?.error);
            console.log('====================================');
            return rejectWithValue(error.response?.data?.error || "Failed to create free SSL (DNS)");
        }
    }
);


export const uploadCustomSsl = createAsyncThunk(
    "sslManager/uploadCustomSsl",
    async ({ data }: { data: { private_key: string, certificate: string, brotli_enabled: boolean, access: string } }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            if (!user) return rejectWithValue("User not logged in or ID missing");
            const url = `/api/v2/ssl/custom-certificate/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to upload custom SSL");
        }
    }
);


export const updateSslSettings = createAsyncThunk(
    "sslManager/updateSslSettings",
    async ({ data }: { data: { brotli_enabled?: boolean, access?: string, tls_version?: string, cipher_suite?: string } }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            if (!user) return rejectWithValue("User not logged in or ID missing");
            const url = `/api/v2/ssl/update-certificate-settings/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.patchEvent(url, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to update SSL settings");
        }
    }
);


export const deleteSslCertificate = createAsyncThunk(
    "sslManager/deleteSslCertificate",
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            if (!user) return rejectWithValue("User not logged in or ID missing");
            const url = `/api/v2/ssl/remove-certificate/websites/${webId}/servers/${serverId}/users/${user}`;
            await api.deleteEvents(url);
            return webId; // Return the websiteId to identify the deleted certificate
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to delete SSL certificate");
        }
    }
);


export const renewFreeSsl = createAsyncThunk(
    "sslManager/renewFreeSsl",
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            if (!user) return rejectWithValue("User not logged in or ID missing");
            const url = `/api/v2/ssl/free-certificate/renew/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, {});
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to renew free SSL certificate");
        }
    }
);


export const renewCustomSsl = createAsyncThunk(
    "sslManager/renewCustomSsl",
    async ({ payload }: { payload: { private_key: string, certificate: string } }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const webId = JSON.parse(localStorage.getItem("webId") || "null")
            if (!user) return rejectWithValue("User not logged in or ID missing");
            const url = `/api/v2/ssl/custom-certificate/renew/websites/${webId}/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to renew free SSL certificate");
        }
    }
)


export const CreateServerFreeSslHttp = createAsyncThunk(
    "hostname/createfreeserversslhttp",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const url = `/api/v2/hostname/ssl/free-certificate/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to create free SSL (HTTP)");
        }
    }
)
export const RenewServerFreeSsl = createAsyncThunk(
    "hostname/renewserverfreessl",
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");

            const url = `/api/v2/hostname/ssl/free-certificate/renew/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, {});
            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to renew free SSL certificate");
        }
    }
)
export const uploadServerCustomSsl = createAsyncThunk(
    "hostname/uploadservercustomssl",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const url = `/api/v2/hostname/ssl/custom-certificate/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to upload custom SSL");
        }
    }
)
export const RenewServerCustomSsl = createAsyncThunk(
    "hostname/renewservercustomssl",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const url = `/api/v2/hostname/ssl/custom-certificate/renew/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to renew custom SSL ");
        }
    }
)
export const UpdateServerSslSettings = createAsyncThunk(
    "hostname/updateserversslsettings",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");

            const url = `/api/v2/hostname/ssl/update-certificate-settings/servers/${serverId}/users/${user}`;
            const response = await api.patchEvent(url, data);
            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to update SSL settings");
        }
    }
)
export const DeleteServerSsl = createAsyncThunk(
    "hostname/deleteserverssl",
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const url = `/api/v2/hostname/ssl/remove-certificate/servers/${serverId}/users/${user}`;
            const response = await api.deleteEvents(url);
            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to Delete SSL Certificate");
        }
    }
)
export const createServerFreeSslDns = createAsyncThunk(
    "hostname/createfreeserverssldns",
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem("userId") || "null");
            const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
            const url = `/api/v2/hostname/ssl/free-certificate/servers/${serverId}/users/${user}`;
            const response = await api.postEvents(url, data);
            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to create free SSL (DNS)");
        }
    }
)

const SLLMangerSlice = createSlice({
    name: 'sslManager',
    initialState,
    reducers: {
        // You can add reducers here if needed for synchronous state updates
        setEditMode: (state, action: PayloadAction<EditCertificate>) => {
            state.IsEditing = action.payload
        },
        clearEditMode: (state) => {
            state.IsEditing = null
        },
        setCustomREnew: (state, action: PayloadAction<boolean>) => {
            state.isCustomRenew = action.payload
        },

    },
    extraReducers: (builder) => {
        // Generic handling for pending, fulfilled, and rejected states
        builder
            .addCase(createFreeSslHttp.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createFreeSslHttp.fulfilled, (state) => {
                state.status = 'succeeded';
                // state.sslCertificate = action.payload.data; // Assuming payload contains the new cert data
            })
            .addCase(createFreeSslHttp.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // ... add similar cases for other thunks ...
            .addCase(deleteSslCertificate.fulfilled, (state) => {
                state.status = 'succeeded';
                // Logic to remove the certificate from state, e.g., if you had a list of certificates
                // state.sslCertificates = state.sslCertificates.filter(cert => cert.websiteId !== action.payload);
            })
            // You can add other thunk handlers here following the pattern
            .addMatcher(
                (action) => action.type.endsWith('/pending') && action.type.startsWith('sslManager/'),
                (state) => {
                    state.status = 'loading';
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected') && action.type.startsWith('sslManager/'),
                (state) => {
                    state.status = 'failed';
                    // state.error = action.payload as string;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled') && action.type.startsWith('sslManager/') && action.type !== deleteSslCertificate.fulfilled.type,
                (state) => {
                    state.status = 'succeeded';
                }
            );

    }
});


export const { setEditMode, clearEditMode, setCustomREnew } = SLLMangerSlice.actions;
export default SLLMangerSlice.reducer;