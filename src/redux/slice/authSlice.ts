import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../eventServices";

interface BusinessDetails {
    brand_name: string;
    primary_logo: string;
    secondary_logo: string;
    theme_color: string;
}

interface AuthState {
    user: any | null;
    businessDetails: BusinessDetails | null;
    loading: boolean;
    error: string | null;
}

const storedBusinessDetails = localStorage.getItem("businessDetails");
const initialState: AuthState = {
    user: null,
    businessDetails: storedBusinessDetails ? JSON.parse(storedBusinessDetails) : null,
    loading: false,
    error: null,
};

const getCommonParams = () => {
    const userId = import.meta.env.VITE_userId;
    const serverId = import.meta.env.VITE_serverId;
    return { userId, serverId };
};

export const login = createAsyncThunk(
    "auth/login",
    async (payload: any, { rejectWithValue }) => {
        try {
            const { userId, serverId } = getCommonParams();
            const url = `/api/v2/whitelabel/servers/${serverId}/users/${userId}`;
            const response = await api.postEvents(url, payload);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Login failed");
        }
    }
);

export const getBusinessDetails = createAsyncThunk(
    "auth/getBusinessDetails",
    async (_, { rejectWithValue }) => {
        try {
            const { userId } = getCommonParams();
            const url = `/api/v2/business_setup/details/users/${userId}`;
            const response = await api.getEvents(url);
            return response.data.response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch business details");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("token");
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Business Details
            .addCase(getBusinessDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBusinessDetails.fulfilled, (state, action: PayloadAction<BusinessDetails>) => {
                state.loading = false;
                state.businessDetails = action.payload;
                localStorage.setItem("businessDetails", JSON.stringify(action.payload));
            })
            .addCase(getBusinessDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
