import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { FileManagerItem } from "../../utils/interfaces";
import { api } from "../eventServices";


const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    return null;
  }
};

interface initialstateProp {
  TheFiels: FileManagerItem;
  TheCopyError: string;
  TheNginxFile: string[];
  TheNginxPath: string;
}

const initialState = {
  TheFiles: null,
  TheCopyError: "",
  TheNginxFile: [],
  TheNginxPath: "",
};

export const getFileOrDirectory = createAsyncThunk(
  "FileManager/GetDirectory",
  async (
    {
      serverId,
      webid,
      path,
    }: { serverId: string; webid: number; path: string },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const res = await api.postEvents(
        `/api/v2/files/details/websites/${webid}/servers/${serverId}/users/${user_id}`,
        { path }
      );
      return res.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);
export const getfileforextart = createAsyncThunk(
  "FileManager/getfileforextart",
  async (
    {
      serverId,
      webid,
      path,
    }: { serverId: string; webid: number; path: string },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const res = await api.postEvents(
        `/api/v2/files/details/websites/${webid}/servers/${serverId}/users/${user_id}`,
        { path }
      );
      return res.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);
export const getfileFOlder = createAsyncThunk(
  "FileManager/getfileFOlder",
  async (
    {
      serverId,
      webid,
      path,
    }: { serverId: string; webid: number; path: string },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const res = await api.postEvents(
        `/api/v2/files/details/websites/${webid}/servers/${serverId}/users/${user_id}`,
        { path }
      );
      return res.data.message[0];
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);
export const DeleteFile = createAsyncThunk(
  "FileManager/DeleteFile",
  async (
    {
      webID,
      serverId,
      data,
    }: {
      webID: string;
      serverId: string;
      data: { path: string; name: string; is_dir: boolean };
    },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const res = await api.patchEvent(
        `/api/v2/files/delete/websites/${webID}/servers/${serverId}/users/${user_id}`,
        data
      );
      return res.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const Rename = createAsyncThunk(
  "FileManager/Rename",
  async (
    {
      Webid,
      ServerId,
      data,
    }: {
      Webid: string;
      ServerId: string;
      data: { path: string; name: string; new_name: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.patchEvent(
        `/api/v2/files/rename/websites/${Webid}/servers/${ServerId}/users/${user_id}`,
        data
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const Copyfile = createAsyncThunk(
  "FileManager/Copy",
  async (
    {
      webid,
      serverid,
      data,
      isCut,
    }: {
      webid: string;
      serverid: string;
      isCut: boolean;
      data: { path: string; name: string; new_path: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.patchEvent(
        `/api/v2/files/${
          isCut ? "move" : "copy"
        }/websites/${webid}/servers/${serverid}/users/${user_id}`,
        data
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const ChangePermissions = createAsyncThunk(
  "FileManager/ChangePermissions",
  async (
    {
      webid,
      serverid,
      data,
      permisionstring,
    }: {
      webid: string;
      serverid: string;
      permisionstring: string;
      data: { path: string; name: string; permissions: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.patchEvent(
        `api/v2/files/permission/websites/${webid}/servers/${serverid}/users/${user_id}`,
        data
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const CompressFile = createAsyncThunk(
  "FileManager/CompressFile",
  async (
    {
      webid,
      serverid,
      data,
      action,
    }: {
      webid: string;
      serverid: string;
      action: "gzip" | "zip" | "tar";
      data: { path: string; name: string; new_path: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.patchEvent(
        `/api/v2/files/compress/websites/${webid}/servers/${serverid}/users/${user_id}?action=${action}`,
        data
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const ExtractFile = createAsyncThunk(
  "FileManager/ExtractFile",
  async (
    {
      webid,
      serverid,
      data,
    }: {
      webid: string;
      serverid: string;
      data: { path: string; name: string; new_path: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.patchEvent(
        `/api/v2/files/extract/websites/${webid}/servers/${serverid}/users/${user_id}`,
        data
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const CreateItem = createAsyncThunk(
  "FileManager/CreateItem",
  async (
    {
      webid,
      serverid,
      data,
    }: {
      webid: string;
      serverid: string;
      data: { path: string; name: string; content: string; is_dir: boolean };
    },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.postEvents(
        `/api/v2/files/websites/${webid}/servers/${serverid}/users/${user_id}`,
        data
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const UploadFile = createAsyncThunk(
  "FileManager/UploadFile",
  async (
    {
      webid,
      serverid,
      data,
    }: { webid: string; serverid: string; data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.postEvents(
        `/api/v2/files/upload/websites/${webid}/servers/${serverid}/users/${user_id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const saveFileChange = createAsyncThunk(
  "FileManager/saveFileChange",
  async (
    {
      webid,
      serverid,
      data,
    }: {
      webid: string;
      serverid: string;
      data: { path: string; name: string; content: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.patchEvent(
        `/api/v2/files/update/websites/${webid}/servers/${serverid}/users/${user_id}`,
        data
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const GetNginsFilesNameAndPath = createAsyncThunk(
  "FileManager/GetNginsFilesNameAndPath",
  async (
    { serverid, webid }: { serverid: string; webid: string },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.getEvents(
        `/api/v2/nginx/websites/${webid}/servers/${serverid}/users/${user_id}`
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const NginxFileUpdate = createAsyncThunk(
  "FileManager/NginxFileUpdate",
  async (
    {
      serverid,
      webid,
      data,
    }: {
      serverid: string;
      webid: string;
      data: { name: string; content: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const user_id = getUserId();
      const response = await api.patchEvent(
        `api/v2/nginx/websites/${webid}/servers/${serverid}/users/${user_id}`,
        data
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const NginxFileRestore =createAsyncThunk(
    "FileManager/NginxFileRestore",
    async ({serverId,webId,data}:{serverId:string,webId:string ,data:{name:string}},{rejectWithValue})=>{
        try {
            const user_id = getUserId();
            const response = await api.patchEvent(
              `/api/v2/nginx/restore/websites/${webId}/servers/${serverId}/users/${user_id}`,
              data
            );

            console.log('the slcie ',response.data);
            
            return response.data.message;
        } catch (error:any) {
             return rejectWithValue(error.response?.data?.error);
        }

    }
)

const FileManagerSlice = createSlice({
  name: "FileManagent",
  initialState,
  reducers: {
    ClearEroor: (state) => {
      state.TheCopyError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFileOrDirectory.fulfilled, (state, action) => {
        state.TheFiles = action.payload.message[0];
      })
      .addCase(DeleteFile.fulfilled, (state, action) => {
        const { data } = action.meta.arg;
        state.TheFiles = {
          ...state.TheFiles,
          children: state.TheFiles.children.filter(
            (item) => item.name !== data.name
          ),
        };
      })
      .addCase(Rename.fulfilled, (state, action) => {
        const { data } = action.meta.arg;
        state.TheFiles = {
          ...state.TheFiles,
          children: state.TheFiles.children.map((item) =>
            item.name == data.name ? { ...item, name: data.new_name } : item
          ),
        };
      })
      .addCase(Copyfile.pending, (state, action) => {
        state.TheCopyError = "";
      })

      .addCase(Copyfile.rejected, (state, action) => {
        state.TheCopyError = action.payload as string;
      })
      .addCase(ChangePermissions.fulfilled, (state, action) => {
        const { data, permisionstring } = action.meta.arg;
        state.TheFiles = {
          ...state.TheFiles,
          children: state.TheFiles.children.map((item) =>
            item.name == data.name
              ? { ...item, permission: permisionstring }
              : item
          ),
        };
      })
      .addCase(GetNginsFilesNameAndPath.fulfilled, (state, action) => {
        state.TheNginxFile = action.payload.message.files;
        state.TheNginxPath = action.payload.message.path;
      });
  },
});

export const { ClearEroor } = FileManagerSlice.actions;
export default FileManagerSlice.reducer;
