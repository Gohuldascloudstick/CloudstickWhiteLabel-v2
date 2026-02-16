import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../eventServices";
import type { Appdatabse, AppDbUser, Database, dbAssingedUser, Dbuser, UserInDb } from "../../utils/interfaces";


interface initialState {
  loading: boolean;
  dataBase: Database[];
  Db_User: Dbuser[];
  AppDb_User: AppDbUser[];
  Db_assimgedUsers: dbAssingedUser[]
  editUser: UserInDb | null,
  remoteAccess?: boolean
  AppDatabase: Appdatabse[]
}

const initialState: initialState = {
  loading: false,
  dataBase: [],
  Db_User: [],
  AppDb_User: [],
  Db_assimgedUsers: [],
  editUser: null,
  remoteAccess: false,
  AppDatabase: []
};

export const getPhpMyAdminLogin = createAsyncThunk(
  "database/getPhpMyAdminLogin",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/phpmyadmin/app-database/login/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (err: any) {

      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
);



export const getAPPDatabaselist = createAsyncThunk(
  "database/getAPPDatabaselist",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/appdatabase/websites/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
);



export const getAppDatabaseassineduserlist = createAsyncThunk(
  "database/getAppDatabaseassineduserlist",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/appdatabase/db-user/list/websites/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
);


export const getAppDatabaseUserLIst = createAsyncThunk(
  "database/getAppDatabaseUserLIst",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/appdbusers/websites/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
);



export const RemoteMySqlAccess = createAsyncThunk(
  "database/RemoteMySqlAccess",
  async ({ serverId, data }: { serverId: string, data: { remote_access: boolean } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const url = `/api/v2/mysql-access/remote/servers/${serverId}/users/${user.id}`;
      const response = await api.patchEvent(url, data)
      return response.data.message
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed");
    }
  }
)

export const FetchRemoteMySqlAccess = createAsyncThunk(
  "database/FetchRemoteMySqlAccess",
  async ({ serverId }: { serverId: string }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const url = `/api/v2/status/mysql/servers/${serverId}/users/${user.id}`;
      const response = await api.getEvents(url)
      return response.data.message
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed");
    }
  }
)




export const creatDatabase = createAsyncThunk(
  "database/createDataBase",
  async ({ data }: { data: { database: { db_name: string, db_collation: string }, db_user?: { db_user_name: string, password: string, privilleges: string, host: string } } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/appdatabase/websites/${webId}/servers/${serverId}/users/${user}`;
      const response = await api.postEvents(url, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed");
    }
  }
)

export const AsingDbuser = createAsyncThunk(
  "database/AsingDbuser",
  async ({ data }: { data: { database_id: number, db_user_id: number, privileges: string[], host: string } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/appdatabase/assignusers/websites/${webId}/servers/${serverId}/users/${user.id}`;
      const response = await api.postEvents(url, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed");
    }
  }
)

export const DeleteuserfromDb = createAsyncThunk(
  "database/DeleteuserfromDb",
  async ({ serverID, data, isAppDataBase, webid }: { serverID: string, isAppDataBase: boolean, webid: string, data: { database_id: number, db_user_id: number } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const url = isAppDataBase ? `/api/v2/appdatabase/removeuser/websites/${webid}/servers/${serverID}/users/${user.id}` : `/api/v2/database/removeuser/servers/${serverID}/users/${user.id}`
      const response = await api.patchEvent(url, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed");
    }
  }
)

export const AddPrivileges = createAsyncThunk(
  "database/AddPrivileges",
  async ({ serverID, data, isAppDataBase, webid }: { serverID: string, isAppDataBase: boolean, webid: string, data: { database_id: number, db_user_id: number, privileges: string[] } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const url = isAppDataBase ? `/api/v2/appdatabase/grantedprivilege/websites/${webid}/servers/${serverID}/users/${user.id}` : `/api/v2/database/grantedprivilege/servers/${serverID}/users/${user.id}`;
      const response = await api.patchEvent(url, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed");
    }
  }
)

export const RevokePrivilege = createAsyncThunk(
  "database/RevokePrivilege",
  async ({ serverID, data, isAppDataBase, webid }: { serverID: string, isAppDataBase: boolean, webid: string, data: { database_id: number, db_user_id: number, privileges: string[] } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const url = isAppDataBase ? `/api/v2/appdatabase/revokeprivilege/websites/${webid}/servers/${serverID}/users/${user.id}` : `/api/v2/database/revokeprivilege/servers/${serverID}/users/${user.id}`;
      const response = await api.patchEvent(url, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "failed");
    }
  }
)

export const DeleteDb = createAsyncThunk(
  "database/DeleteDb",
  async ({ Dbid }: { Dbid: number }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url =  `/api/v2/appdatabase/${Dbid}/websites/${webId}/servers/${serverId}/users/${user}` ;
      const response = await api.deleteEvents(url);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
);


export const ChnageDbUserPAssword = createAsyncThunk(
  "database/ChnageDbUserPAssword",
  async ({ userid, password }: { userid: number, password: string }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/appdbusers/${userid}/websites/${webId}/servers/${serverId}/users/${user}`
      const response = await api.patchEvent(url, { password })
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
)

export const DeleteDbuser = createAsyncThunk(
  "database/ChnageDbUserPAssword",
  async ({ dbuserid }: { dbuserid: number }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/appdbusers/${dbuserid}/websites/${webId}/servers/${serverId}/users/${user}`
      const response = await api.deleteEvents(url)
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
)


export const CreateDbuser = createAsyncThunk(
  "database/CreateDbuser",
  async ({ data }: { data: { db_user_name: string, password: string, host: 'localhost' | 'remote_host' } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("userId") || "null");
      const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
      const webId = JSON.parse(localStorage.getItem("webId") || "null")
      const url = `/api/v2/appdbusers/websites/${webId}/servers/${serverId}/users/${user}`
      const response = await api.postEvents(url, data)
      return response.data

    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
)


export const resetMySQLRootPassword = createAsyncThunk(
  "database/resetMySQLRootPassword",
  async ({ serverId, data }: { serverId: string; data: { password: string, confirm_password: string } }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const url = `/api/v2/mysql-password/servers/${serverId}/users/${user.id}`;
      const response = await api.patchEvent(url, data);
      return response.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "failed");
    }
  }
)



const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    EditUserPriv: (state, action) => {
      state.editUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAPPDatabaselist.fulfilled, (state, action) => {
        state.AppDatabase = action.payload.message.databases;
      })

      .addCase(getAppDatabaseUserLIst.fulfilled, (state, action) => {
        state.AppDb_User = action.payload.message.dbusers;
      })
      .addCase(getAppDatabaseassineduserlist.fulfilled, (state, action) => {
        state.Db_assimgedUsers = action.payload.message;
      })

      .addCase(RemoteMySqlAccess.fulfilled, (state, action) => {
        if (action.payload == 'Disable remote MySQL access successfully') {
          state.remoteAccess = false
        } else if (action.payload == 'Enable remote MySQL access successfully') {
          state.remoteAccess = true
        }
      })
      .addCase(FetchRemoteMySqlAccess.fulfilled, (state, action) => {
        state.remoteAccess = action.payload.status
      })
      ;
  },
});


export const { EditUserPriv } = databaseSlice.actions;
export default databaseSlice.reducer;
