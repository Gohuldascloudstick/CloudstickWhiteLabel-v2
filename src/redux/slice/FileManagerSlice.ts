import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../eventServices";
import type { FileManagerItem } from "../../utils/interfaces";

interface FileManagerState {
  TheFiles: FileManagerItem | null;
  loading: boolean;
  error: string | null;
  currentPath: string;
  selectedFile: FileManagerItem | null;
  copyItem: FileManagerItem | null;
  copyParentDir: string | null;
  isCut: boolean;
  fileContent: string | null;
  contentLoading: boolean;
    TheCopyError: string,
}

const initialState: FileManagerState = {
  TheFiles: null,
  loading: false,
  error: null,
  currentPath: "",
  selectedFile: null,
  copyItem: null,
  copyParentDir: null,
  isCut: false,
  fileContent: null,
  contentLoading: false,
    TheCopyError: "",
};

// Helper to get common URL parameters
const getCommonParams = () => {
  const userId = import.meta.env.VITE_userId;
  const serverId = import.meta.env.VITE_serverId;
  const webId = import.meta.env.VITE_webId;
  return { userId, serverId, webId };
};

export const getFileOrDirectory = createAsyncThunk(
  "fileManager/getFileOrDirectory",
  async (path: string, { rejectWithValue }) => {
    try {
      console.log('yes calling');
      
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/files/details/websites/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.postEvents(url, { path });
      return { data: response.data.message[0], path };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to list files");
    }
  }
);

export const Rename = createAsyncThunk(
  "fileManager/Rename",
  async ({ path, name, new_name }: { path: string; name: string; new_name: string }, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/files/rename/websites/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.patchEvent(url, { path, name, new_name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to rename item");
    }
  }
);

export const DeleteFile = createAsyncThunk(
  "fileManager/DeleteFile",
  async ({ path, name, is_dir }: { path: string; name: string; is_dir: boolean }, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/files/delete/websites/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.patchEvent(url, { path, name, is_dir });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete item");
    }
  }
);

export const Copyfile = createAsyncThunk(
  "fileManager/Copyfile",
  async ({ data, isCut }: { data: any; isCut: boolean }, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const action = isCut ? "move" : "copy";
      const url = `/api/v2/files/${action}/websites/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.patchEvent(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || `Failed to ${isCut ? 'move' : 'copy'} item`);
    }
  }
);

export const ChangePermissions = createAsyncThunk(
  "fileManager/ChangePermissions",
  async (data: { path: string; name: string; permissions: string; permissionstring: string }, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/files/permission/websites/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.patchEvent(url, { path: data.path, name: data.name, permissions: data.permissions });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update permissions");
    }
  }
);



export const CompressFile = createAsyncThunk(
  "FileManager/CompressFile",
  async (
    {
      data,
      action,
    }: {

      action: "gzip" | "zip" | "tar";
      data: { path: string; name: string; new_path: string };
    },
    { rejectWithValue }
  ) => {
    try {
    const { userId, serverId, webId } = getCommonParams();
      const response = await api.patchEvent(
        `/api/v2/files/compress/websites/${webId}/servers/${serverId}/users/${userId}?action=${action}`,
        data
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error || "Failed to compress file");
    }
  }
);





export const ExtractFile = createAsyncThunk(
  "fileManager/ExtractFile",
  async (data: { path: string; name: string; new_path: string }, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/files/extract/websites/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.patchEvent(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to extract file");
    }
  }
);

export const getfileforextart = createAsyncThunk(
  "FileManager/getfileforextart",
  async (
    {
   
      path,
    }: { path: string },
    { rejectWithValue }
  ) => {
    try {
      const { userId ,serverId, webId } = getCommonParams();
      const res = await api.postEvents(
        `/api/v2/files/details/websites/${webId}/servers/${serverId}/users/${userId}`,
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
   
      path,
    }: {  path: string },
    { rejectWithValue }
  ) => {
    try {
  const { userId, serverId, webId } = getCommonParams();
      const res = await api.postEvents(
        `/api/v2/files/details/websites/${webId}/servers/${serverId}/users/${userId}`,
        { path }
      );
      return res.data.message[0];
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error);
    }
  }
);




export const CreateItem = createAsyncThunk(
  "fileManager/CreateItem",
  async (data: any, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/files/websites/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.postEvents(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create item");
    }
  }
);

export const UploadFile = createAsyncThunk(
  "fileManager/UploadFile",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/files/upload/websites/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.postEvents(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to upload file");
    }
  }
);

export const saveFileChange = createAsyncThunk(
  "fileManager/saveFileChange",
  async (data: { path: string; name: string; content: string }, { rejectWithValue }) => {
    try {
      const { userId, serverId, webId } = getCommonParams();
      const url = `/api/v2/files/update/websites/${webId}/servers/${serverId}/users/${userId}`;
      const response = await api.patchEvent(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to save file changes");
    }
  }
);

const fileManagerSlice = createSlice({
  name: "fileManager",
  initialState,
  reducers: {
    setDirectoryPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<FileManagerItem | null>) => {
      state.selectedFile = action.payload;
    },
    setCopyItem: (state, action: PayloadAction<{ item: FileManagerItem; parentDir: string; isCut: boolean } | null>) => {
      if (action.payload) {
        state.copyItem = action.payload.item;
        state.copyParentDir = action.payload.parentDir;
        state.isCut = action.payload.isCut;
      } else {
        state.copyItem = null;
        state.copyParentDir = null;
        state.isCut = false;
      }
    },
    clearFileContent: (state) => {
      state.fileContent = null;
    },
     
    ClearEroor: (state) => {
      state.TheCopyError = "";
    
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFileOrDirectory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileOrDirectory.fulfilled, (state, action) => {
        state.loading = false;
        state.TheFiles = action.payload.data;
        state.currentPath = action.payload.path;
      })
      .addCase(getFileOrDirectory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(Rename.fulfilled, (state, action) => {
        const { name, new_name } = action.meta.arg;
        if (state.TheFiles && state.TheFiles.children) {
         state.TheFiles = {
          ...state.TheFiles,
          children: state.TheFiles.children.map((item) =>
            item.name == name ? { ...item, name: new_name } : item
          ),}
        };
      })
         .addCase(Copyfile.pending, (state) => {
        state.TheCopyError = "";
      })
 .addCase(DeleteFile.fulfilled, (state, action) => {
        const { name } = action.meta.arg;
        if (state.TheFiles && state.TheFiles.children) {
        state.TheFiles = {
          ...state.TheFiles,
          children: state.TheFiles.children.filter(
            (item) => item.name !== name
          ),
        };}
      })
      .addCase(Copyfile.rejected, (state, action) => {
        state.TheCopyError = action.payload as string;
      })
      .addCase(ChangePermissions.fulfilled, (state, action) => {
        const { name ,permissionstring } = action.meta.arg;
        if (state.TheFiles && state.TheFiles.children) {
          state.TheFiles = {
            ...state.TheFiles,
            children: state.TheFiles.children.map((item) =>
              item.name == name
                ? { ...item, permission: permissionstring }
                : item
            ),
          };
        }
      });
  },
});

export const { setDirectoryPath, setSelectedFile, setCopyItem, clearFileContent , ClearEroor } = fileManagerSlice.actions;
export default fileManagerSlice.reducer;
