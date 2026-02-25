import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import type { DnsRecord, Provider, Zone } from "../../utils/interfaces";
import { api } from "../eventServices";

interface initialStatetype {
  loading: boolean;
  cloudflare: Provider[];
  ZoneLIst: Zone[];
  dnsRecord: DnsRecord[];
  zoneCurrentpage: number;
  RecordCurrentPAge: number;
  TotalRecord: number;
  totalZone: number;
  zoneLoading: boolean,
  temproryDomain: string
}

const initialState: initialStatetype = {
  loading: false,
  cloudflare: [],
  ZoneLIst: [],
  dnsRecord: [],
  zoneCurrentpage: 1,
  totalZone: 0,
  zoneLoading: false,
  RecordCurrentPAge: 1,
  TotalRecord: 0,
  temproryDomain: ''
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
      const user = JSON.parse(localStorage.getItem("userId") || "null");

      const url = `/api/v2/createzone/users/${user}?account_label=${account_label}`;
      const response = await api.postEvents(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "ununexpected error occurred Try again"
      );
    }
  }
);

export const getCloudflareAccounts = createAsyncThunk(
  "dns/getCloudflareAccount",
  async (search: string, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");

      const url = !search
        ? `api/v2/listcloudflareproviders/users/${user}`
        : `api/v2/listcloudflareproviders/users/${user}?search=${search}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Integration update failed"
      );
    }
  }
);

export const getZoneList = createAsyncThunk(
  "dns/getZoneList",
  async (
    { account_label, search, page }: { account_label: string; search: string, page: number },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const queryParams = new URLSearchParams();
      queryParams.append("account_label", account_label);
      queryParams.append("page", page.toString());
      queryParams.append("limit", "50");
      if (search) queryParams.append("search", search);

      const baseurl = `/api/v2/listzones/users/${user}`;
      const url = `${baseurl}?${queryParams.toString()}`;

      const response = await api.getEvents(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Integration update failed"
      );
    }
  }
);

export const DeleteZone = createAsyncThunk(
  "dns/deleteZone",
  async (
    { account_label, zoneid }: { account_label: string; zoneid: string },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const url = `/api/v2/deletezone/${zoneid}/users/${user.id}?account_label=${account_label}`;
      const response = await api.deleteEvents(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Zone Deletion failed"
      );
    }
  }
);

export const listDnsRecord = createAsyncThunk(
  "dns/listDNSRecord",
  async (
    {
      account_label,
      zone,
      type,
      search,
      page
    }: { account_label: string; zone: string; type: string; search: string, page: number, },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const queryParams = new URLSearchParams();
      queryParams.append("account_label", account_label);
      queryParams.append("zone", zone);
      queryParams.append("page", page.toString())

      queryParams.append("limit", '10')
      if (type) queryParams.append("type", type);
      if (search) queryParams.append("search", search);

      const baseUrl = `/api/v2/listdnsrecords/users/${user.id}`;
      const url = `${baseUrl}?${queryParams.toString()}`;

      const response = await api.getEvents(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "unexpeted error occured"
      );
    }
  }
);

export const createDnsrecord = createAsyncThunk(
  "dns/createDnsrecord",
  async (
    {
      account_label,
      data,
      zone,
    }: { account_label: string; data: any; zone: string },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const url = `/api/v2/dnsrecords/users/${user.id}?account_label=${account_label}&zone=${zone}`;
      const response = await api.postEvents(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "unexpeted error occured"
      );
    }
  }
);

export const deleteDNSRecord = createAsyncThunk(
  "dns/DeleteDNSRecord",
  async (
    {
      account_label,
      zone,
      id,
      search,
      type,
    }: {
      account_label: string;
      zone: string;
      id: string;
      search: string;
      type: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const queryParams = new URLSearchParams();
      queryParams.append("account_label", account_label);
      queryParams.append("zone", zone);

      if (type) queryParams.append("type", type);
      if (search) queryParams.append("search", search);
      const baseUrl = `/api/v2/deletednsrecord/${id}/users/${user.id}`;
      const url = `${baseUrl}?${queryParams.toString()}`;

      console.log("====================================");
      console.log(url);
      console.log("====================================");
      const response = await api.deleteEvents(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "unexpeted error occured"
      );
    }
  }
);

export const editDnsRecord = createAsyncThunk(
  "dns/editdnsRecord",
  async (
    {
      data,
      account_label,
      zone,
      id,
    }: { data: any; account_label: string; id: string; zone: string },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const url = `/api/v2/updatednsrecord/${id}/users/${user.id}?account_label=${account_label}&zone=${zone}`;
      const response = await api.putEvent(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "unexpeted error occured"
      );
    }
  }
);

export const SetTemproryDomain = createAsyncThunk(
  "dns/SEtTemproryDomain",
  async ({ account_label, zone }: { account_label: number, zone: string }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const url = `/api/v2/temprory/domain/users/${user.id}?account_label=${account_label}&zone=${zone}`
      const response = await api.patchEvent(url, {})
      return response.data

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "unexpeted error occured"
      );
    }
  }
)

export const getTemproryDomain = createAsyncThunk(
  "dns/getTemproryDomain",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const url = `/api/v2/temprory/domain/users/${user.id}`
      const response = await api.getEvents(url)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "unexpeted error occured"
      );
    }
  }
)

const dnsSlice = createSlice({
  name: "dns",
  initialState,
  reducers: {
    removeThezone: (state, action: PayloadAction<string>) => {
      state.ZoneLIst = state.ZoneLIst.filter(
        (item) => item.id !== action.payload
      );
    },
    removeTheRecord: (state) => {
      state.dnsRecord = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCloudflareAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCloudflareAccounts.fulfilled, (state, action) => {
        state.cloudflare = action.payload.providers;
        state.loading = false;
      })
      .addCase(getCloudflareAccounts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getZoneList.pending, (state) => {
        state.ZoneLIst = [];
        state.zoneLoading = true
      })
      .addCase(getZoneList.fulfilled, (state, action) => {
        state.ZoneLIst = action.payload.message.result;
        state.zoneCurrentpage = action.payload.message.result_info.page;
        state.totalZone = action.payload.message.result_info.total_page;
        state.zoneLoading = false
      })

      .addCase(listDnsRecord.fulfilled, (state, action) => {
        if (action.payload.message.result_info.page == 1) {
          state.dnsRecord = action.payload.message.result;
        } else {
          state.dnsRecord.push(...action.payload.message.result)
        }
        state.TotalRecord = action.payload.message.result_info.total_count
        state.RecordCurrentPAge = action.payload.message.result_info.page

      })
      .addCase(deleteDNSRecord.fulfilled, (state, action) => {
        state.dnsRecord = action.payload.message.result;
      })
      .addCase(getTemproryDomain.fulfilled, (state, action) => {
        state.temproryDomain = action.payload.domain
      });
  },
});

export const { removeThezone, removeTheRecord } = dnsSlice.actions;
export default dnsSlice.reducer;
