# FileManager Architecture & Flow Documentation

This document provides a detailed breakdown of the [FileManager](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#90-1283) component, its user interaction flows, and the underlying API communication.

## 1. Component Overview

The [FileManager](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#90-1283) ([src/components/WEBAPPComponets/FileManager/FileManager.tsx](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx)) is a robust file management interface built with `@heroui/react`. It supports directory navigation, file operations (CRUD), and advanced features like compression, extraction, and permission management.

### Key Technologies
- **UI Framework**: `@heroui/react` (Button, Card, Popover, Modal, Listbox, etc.)
- **State Management**: Redux Toolkit (via `useAppDispatch`, `useAppSelector`)
- **Icons**: `@iconify/react`
- **Animations**: `framer-motion`

---

## 2. Interaction Flow (Click Events)

The [FileManager](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#90-1283) responds to several types of user interactions:

### Single Click (`onClick`)
- **Action**: Selects a file or directory.
- **Logic**: Sets `selectedfile` state.
- **Visual**: Highlights the row/item with a background color (`bg-default-100`).
- **Context**: Used to prepare an item for further actions (e.g., clicking "Rename" in the sidebar/popover).

### Double Click (`onDoubleClick`)
- **Action**: Trigger primary navigation or viewing.
- **Logic**:
    - **Directory**: Calls `fetchfiles(item.path)` to navigate into the folder.
    - **File**: Opens the `FileEditor` in a new browser tab (`window.open`).
- **URL Pattern**: `/FileEditor?path={path}&name={name}&webid={webid}&serverId={id}`

### Right Click (`onContextMenu`)
- **Action**: Opens a context-sensitive action menu.
- **Logic**: 
    - **Desktop**: Opens a `Popover` with a `Listbox` containing actions (Rename, Copy, Cut, Delete, etc.).
    - **Mobile**: Triggers a central [Modal](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#383-415) in `action` mode, displaying the same options.

---

## 3. Operations & API Call Flow

All operations are handled via Redux Async Thunks defined in [FIlemanagerSlice.ts](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/redux/slice/FIlemanagerSlice.ts). 

### Common Parameters
Most API calls require:
- `webid`: The ID of the website.
- `serverId`: The ID of the server.
- `user_id`: Retrieved from `localStorage`.

### API Flow Table

| Action | Redux Thunk | API Endpoint (PATCH/POST) | Description |
| :--- | :--- | :--- | :--- |
| **Fetch Directory** | `getFileOrDirectory` | `POST /api/v2/files/details/...` | Loads children of a directory or file content. |
| **Delete** | `DeleteFile` | `PATCH /api/v2/files/delete/...` | Removes a file or directory. |
| **Rename** | [Rename](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#210-240) | `PATCH /api/v2/files/rename/...` | Changes the name of an item. |
| **Copy/Cut** | `Copyfile` | `PATCH /api/v2/files/copy/...` or `/move/...` | Moves or duplicates files. |
| **Permission** | `ChangePermissions`| `PATCH /api/v2/files/permission/...` | Updates CHMOD permissions (e.g., 755). |
| **Compress** | `CompressFile` | `PATCH /api/v2/files/compress/...` | Archives items into `.zip`, `.tar`, or `.gz`. |
| **Extract** | `ExtractFile` | `PATCH /api/v2/files/extract/...` | Unpacks archives into a folder. |
| **Create** | `CreateItem` | `POST /api/v2/files/...` | Creates an empty file or new folder. |
| **Upload** | `UploadFile` | `POST /api/v2/files/upload/...` | Uploads files using `multipart/form-data`. |
| **Save Edit** | `saveFileChange` | `PATCH /api/v2/files/update/...` | Saves changes made in the File Editor. |

---

## 4. Action-by-Action Flow Details

### Navigation: Entering a Folder
1. **User Action**: Double-click a folder row or name.
2. **Logic**: `onDoubleClick` -> [handleFolderClick(item)](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#164-167) -> `fetchfiles(item.path)`.
3. **Dispatch**: `dispatch(getFileOrDirectory({ serverId, webid, path }))`.
4. **API**: `POST /api/v2/files/details/...` with `{ path }`.
5. **State Update**: Redux `fulfilled` -> `state.TheFiles` is updated. `useEffect` in [FileManager](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#90-1283) detects change, sets `directoryPath`, and re-renders the list.

### Operation: Rename
1. **User Action**: Click "Rename" in context menu or double-click to edit (if enabled).
2. **Logic**: Sets `editnameMode(true)`. Opens Modal with `rename` mode.
3. **Input**: User enters `new_name`.
4. **Submit**: [handelRename()](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#210-240) -> `dispatch(Rename({ Webid, ServerId, data }))`.
5. **API**: `PATCH /api/v2/files/rename/...` with `{ path, name, new_name }`.
6. **State Update**: Redux `fulfilled` updates the specific item name in `state.TheFiles.children` to avoid a full refresh.

### Operation: Copy & Paste
1. **User Action**: Right-click item -> "Copy". 
2. **Logic**: [handeldCopy()](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#263-268) -> sets `copyitem` and `copyParentdir`. 
3. **User Action**: Navigate to target folder -> Right-click -> "Paste".
4. **Logic**: [handelPaste()](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#269-293) -> `dispatch(Copyfile({ webid, serverid, data: { path: copyParentdir, name, new_path: currentDir }, isCut: false }))`.
5. **API**: `PATCH /api/v2/files/copy/...`.
6. **Refresh**: Calls `fetchfiles(currentDir)` after success.

### Operation: Delete
1. **User Action**: Click "Delete" -> Confirm in Popover.
2. **Logic**: [handeldelte(item)](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#190-207) -> `dispatch(DeleteFile({ webID, serverId, data }))`.
3. **API**: `PATCH /api/v2/files/delete/...` with `{ path, name, is_dir }`.
4. **State Update**: Redux `fulfilled` filters out the deleted item from `state.TheFiles.children`.

### Operation: Upload
1. **User Action**: Click "Upload" -> Select files in `UploadModal`.
2. **Logic**: `UploadFile` thunk is dispatched with `FormData`.
3. **API**: `POST /api/v2/files/upload/...`.
4. **Result**: `UploadModal` shows progress; finishes on success.

---

## 5. Modal Management Logic

The [FileManager](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#90-1283) uses a single shared [Modal](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#383-415) with a dynamic `modalMode` state to render different sub-components:

```tsx
const getModalMode = () => {
    if (isExtarcyon) return 'extract';
    if (isnewfolder) return 'newfolder';
    if (iscompressOn) return 'compress';
    if (copyloader) return 'copying';
    if (editnameMode) return 'rename';
    if (IsperminionChange) return 'permission';
    if (IsDownLoading) return 'download';
    if (selectedItemModal) return 'action';
    return 'closed';
};
```

### Sub-Components
- `CompressFile`: Handles compression options.
- `Permissiions`: UI for toggling Read/Write/Execute bits.
- `CopyingFile`: Visual progress/status for copy operations.
- `NewF`: Input for new file/folder names.
- [Extract](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#316-321): Target directory selection for extraction.
- `UploadModal`: File drop-zone for uploads.
- `DownloadFile`: Handles the browser download trigger.

---

## 6. Data-to-UI Mapping (The Rendering Flow)

The rendering of the file list is reactive and follows a strict data-driven flow:

### 1. The API Response Structure
When `getFileOrDirectory` is called, the server returns a JSON object. The most critical part for the UI is the `message[0]` object, which matches the [FileItem](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#61-71) interface:

```typescript
interface FileItem {
    path: string;
    name: string;
    is_dir: boolean;
    children?: FileItem[]; // The list of files/folders inside this directory
    // ...other properties (size, permission, last_modified)
}
```

### 2. Redux State Syncing
- The `FileManagerSlice` captures this response in [extraReducers](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/redux/slice/FIlemanagerSlice.ts#418-464).
- `state.TheFiles` is updated with the `message[0]` object.
- Since [FileManager.tsx](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx) uses `useAppSelector` to watch `state.FileManger.TheFiles`, it automatically re-renders whenever the data changes.

### 3. Rendering the List (`children`)
The component calculates the current list of items to show:
```tsx
const currentFiles = Filemanagemnt?.children || [];
```

#### Desktop View (Table)
- The `currentFiles` array is mapped over to create `<tr>` elements.
- Each item's [name](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#210-240) is displayed with an icon determined by `getFileIcon(item)`.
- The `size` is formatted using [formatFileSize(item.size)](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/FileManager/FileManager.tsx#34-41).
- The `permission` and `last_modified` strings are displayed directly.

#### Mobile View (Grid)
- If the screen size is small (`md:hidden`), `currentFiles` is mapped to the `FileGridItem` component.
- This creates a grid of icons with labels, optimized for touch interaction.

### 4. Handling Empty States
If `currentFiles.length === 0`, the UI renders a fallback:
- "This directory is empty." (Displayed in both Table and Grid views).

---

## 7. Breadcrumb & Navigation Logic

- **Path State**: `directoryPath` tracks the current location.
- **Root Protection**: `maxbackroot` prevents users from navigating above the website's `public_path`.
- **Back Button**: Calculates the parent directory using `lastIndexOf('/')`.
- **Refresh**: Re-triggers `fetchfiles` with the current path to sync with the server.
