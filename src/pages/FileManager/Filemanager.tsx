import {
    Button, Card, Divider, Popover, PopoverContent, PopoverTrigger, Modal,
    ModalContent,
    ModalBody,
    useDisclosure,
    addToast,
    Input,
    Listbox,
    ListboxItem,
    Tooltip,
} from '@heroui/react'
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const formatDate = (isoString: string) => {
    try {
        // Use your preferred locale and options
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'N/A';
    }
};
interface FileItem {
    path: string;
    name: string;
    is_dir: boolean;
    last_modified: string;
    permission: string;
    size: number;
    children?: FileItem[];
    content?: string;
}

const isArchiveFile = (fileName: string): boolean => {
    // List of common archive extensions (case-insensitive)
    const archiveExtensions = [
        '.zip', '.rar', '.7z', '.tar', '.gz', '.tgz', '.bz2', '.tbz2', '.xz', '.txz', '.iso', '.dmg', '.jar'
    ];

    const lowerCaseFileName = fileName.toLowerCase();

    // Check if the file name ends with any of the archive extensions
    return archiveExtensions.some(ext => lowerCaseFileName.endsWith(ext));
};
import { Icon } from '@iconify/react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FileManagerItem } from '../../utils/interfaces';
import { Copyfile, DeleteFile, getFileOrDirectory, Rename } from '../../redux/slice/FIlemanagerSlice';
import FileGridItem from './FileGridItem';
import { getFileIcon } from '../../helpperFunctions/ConvertionFunction';
import { motion, AnimatePresence } from 'framer-motion';
import CompressFile from './CompressFile';
import NewF from './NewF';
import Extract from './Extract';
import DownloadFile from './DownloadFile';
import CopyingFile from './CopyingFile';
import Permissions from './Permissiions';
import UploadModal from './UploadModal';


const Filemanager = () => {


    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: Uploadopen, onOpen: uploadOnOpen, onOpenChange: UploadOnOpenChange } = useDisclosure();
    const websitedetail: any = useAppSelector((state: any) => state.website.selectedWebsite);
    const Filemanagemnt: FileItem | null = useAppSelector((state: any) => state.FileManger.TheFiles);
    const [directoryPath, setDirectoryPath] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(0);
    const [thepop, setThePop] = useState(0)
    const [deleteLoader, setDeleteLoader] = useState(false)
    const [seleletedfile, setSelectedfile] = useState<FileManagerItem | null>(null)
    const [selectedItemModal, setSelectedItemModal] = useState<FileManagerItem | null>(null)
    const [viewingFile, setViewingFile] = useState<FileItem | null>(null);
    const [renameLoader, setRenameLoader] = useState(false)
    const [copyloader, setCopyloader] = useState(false)
    const [isRightClick, setIsRightClick] = useState(false)
    const renameInputRef = useRef<HTMLInputElement>(null);
    const [rename, setRename] = useState('')
    const [new_name, SetNew_name] = useState('')
    const [editnameMode, setEDitnameMode] = useState(false)
    const [parentRightClick, setParentRightClick] = useState(false)
    const [copyitem, setCopyitem] = useState<FileManagerItem | null>(null)
    const [copyParentdir, setCopyParentdir] = useState('')
    const [copyComplete, setCopyComplete] = useState(false)
    const [isCut, SetIsCut] = useState(false)
    const [IsperminionChange, SetIsperminionChange] = useState(false)
    const [IsDownLoading, SetIsDownLoading] = useState(false)
    const [iscompressOn, SetIscompressOn] = useState(false)
    const [isExtarcyon, SetIsExtarcyon] = useState(false)

    //newfolder
    const [isnewfolder, SetIsnewfolder] = useState(false)
    const [isNewDir, setisNewDir] = useState(false)

    const id = JSON.parse(localStorage.getItem("serverId") || "null");
    const webid = JSON.parse(localStorage.getItem("webId") || "null")

    // Memoize server and website IDs
    const serverId = useMemo(() => id, [id]);
    const websiteId = useMemo(() => Number(webid), [webid]);
    const rootPath = useMemo(() => websitedetail?.website?.public_path || '/', [websitedetail]);
    const maxbackroot = useMemo(() => websitedetail?.website?.public_path.substring(0, directoryPath.lastIndexOf('/')) || '/', [websitedetail]);


    const fetchfiles = useCallback(async (path: string) => {
        setViewingFile(null);
        if (!serverId || !websiteId) return;
        try {
            await dispatch(getFileOrDirectory({ serverId, webid: websiteId, path })).unwrap();
        } catch (error) {
            console.error('Error fetching files:', error);

        }
    }, [dispatch, serverId, websiteId]);



    const handleFolderClick = (item: FileItem) => {
        fetchfiles(item.path);
    };

    const handleBack = () => {
        console.log(directoryPath, maxbackroot);

        if (viewingFile) {

            const parentPath = directoryPath.substring(0, directoryPath.lastIndexOf('/')) || '/';

            fetchfiles(parentPath);
        } else {

            const parentPath = directoryPath.substring(0, directoryPath.lastIndexOf('/')) || '/';
            fetchfiles(parentPath);
        }
    };

    const HandlemodalOpen = (file: FileManagerItem) => {
        setSelectedItemModal(file)
        setEDitnameMode(false)
        onOpen()
    }


    const handeldelte = async (item: FileManagerItem) => {
        setDeleteLoader(true)
        try {
            const data = {
                path: directoryPath,
                is_dir: item.is_dir,
                name: item.name
            }
            await dispatch(DeleteFile({ webID: webid, serverId, data })).unwrap()
            if (isOpen) onOpenChange()

        } catch (error: any) {
            addToast({ description: String(error) })
        } finally {
            setDeleteLoader(false)
        }
    }



    const handelRename = async () => {

        if (rename === new_name || new_name.trim() === '' && selectedItemModal) {
            setEDitnameMode(false);
            onOpenChange();
            return;
        }

        setRenameLoader(true);
        try {
            const data = {
                path: directoryPath,
                name: rename,
                new_name
            }
            await dispatch(Rename({ Webid: webid, ServerId: serverId, data })).unwrap()
            addToast({ description: `File/Directory renamed to ${new_name}`, color: "success" })

            setEDitnameMode(false);
            onOpenChange();

        } catch (error: any) {
            addToast({ description: String(error), color: "danger" })
        } finally {
            setRenameLoader(false)
            setRename('');
            SetNew_name('');
            setSelectedfile(null);
        }
    }


    const startRenameInModal = () => {
        if (selectedItemModal) {
            setRename(selectedItemModal.name);
            SetNew_name(selectedItemModal.name);
            if (isRightClick) {
                setEDitnameMode(false)
                onOpenChange()
            } else {

                setEDitnameMode(true);
            }
            // We do not close the modal here, we switch its content
        }
    }

    const cancelRenameInModal = () => {
        setEDitnameMode(false); // Switch back to action mode
        // Note: The modal remains open, allowing the user to select another action
    }


    const handeldCopy = () => {
        setCopyitem(selectedItemModal)
        setCopyParentdir(Filemanagemnt?.path ?? "")
        onOpenChange()
    };

    const handelPaste = async () => {
        setCopyloader(true)
        try {
            console.log('the sicut', isCut);

            const res = await dispatch(Copyfile({ webid: webid, serverid: id, data: { path: copyParentdir, name: copyitem?.name ?? "", new_path: Filemanagemnt?.path ?? "" }, isCut })).unwrap()
            await fetchfiles(Filemanagemnt?.path ?? "")


            setCopyComplete(true)
            addToast({ description: res.message, color: 'success' })

        } catch (error: any) {
            // setTimeout(() => {

            //     setCopyloader(false)
            // }, 2000);
            addToast({ description: String(error), color: 'danger' })
        } finally {
            // setTimeout(() => {
            //     setCopyloader(false)
            // }, 5000);
        }
    }
    const cancelCopy = () => {
        setCopyComplete(false)
        setCopyloader(false)
        setCopyitem(null)
        setCopyParentdir('')
        onOpenChange()
        SetIsCut(false)

    }
    const handelCompress = () => {
        SetIscompressOn(true)
    }
    const handelFolderAdd = () => {
        SetIsnewfolder(true)
        setisNewDir(true)

    }
    const handelFileAdd = () => {
        SetIsnewfolder(true)
        setisNewDir(false)
    }


    const handelExtract = () => {

        SetIsExtarcyon(true)

    }

    const handelChangePermission = () => {
        SetIsperminionChange(true)
    }


    useEffect(() => {
        if (rename && renameInputRef.current) {

            const timer = setTimeout(() => {
                renameInputRef.current?.focus();
                // Select the text for a good user experience
                renameInputRef.current?.select();
            }, 500);

            // Cleanup function to clear the timer if the component unmounts 
            // or the `rename` state changes before the timeout fires.
            return () => clearTimeout(timer);
        }
    }, [rename]);
    // 1. Initial Load: Fetch root path
    useEffect(() => {
        if (rootPath) {
            fetchfiles(rootPath);
        }
    }, [rootPath, fetchfiles]);

    // 2. Update Path/File View when Redux state changes
    useEffect(() => {
        if (Filemanagemnt) {
            if (Filemanagemnt.is_dir) {
                // If the fetched item is a directory, update the path
                setDirectoryPath(Filemanagemnt.path);
                setViewingFile(null);
            } else if (Filemanagemnt.content !== undefined) {
                // If the fetched item is a file with content, show the content viewer
                setDirectoryPath(Filemanagemnt.path); // Use file path in state to correctly calculate back button
                setViewingFile(Filemanagemnt);
            }
        } else {
            // Fallback for initial state or if fetch failed/returned null
            setDirectoryPath(rootPath);
            setViewingFile(null);
        }
    }, [Filemanagemnt, rootPath]);
    useEffect(() => {
        if (!isOpen) {
            setIsRightClick(false)
            setParentRightClick(false)
            setSelectedItemModal(null)
            setCopyComplete(false)
            setCopyloader(false)
            SetIscompressOn(false)
            SetIsperminionChange(false)
            SetIsExtarcyon(false)
            SetIsnewfolder(false)
            SetIsDownLoading(false)
        }
    }, [isOpen])

    // --- Modal Mode Determination Logic ---

    const getModalMode = () => {
        if (isExtarcyon) {
            return 'extract'
        }

        if (isnewfolder) {
            return 'newfolder'
        }
        if (iscompressOn) {
            return 'compress'
        }
        if (copyloader) {
            return 'copying';
        }
        if (editnameMode) {
            return 'rename';
        }
        if (IsperminionChange) {
            return 'permission'
        }
        if (IsDownLoading) {
            return 'download'
        }

        // This is the default action mode, also used for parent right-click actions
        if (selectedItemModal) {
            return 'action';
        }

        // Fallback
        return 'closed';
    };

    const modalMode = getModalMode();

    const currentFiles = Filemanagemnt?.children || [];



    if (!websitedetail) {
        return <div className="p-6 text-center">Loading Website Details...</div>;
    }
    return (
        <div className="p-6 bg-content1 h-full flex flex-col">
            {/* Header and Actions */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-xl font-semibold mb-1">File Manager</h3>
                <div className="flex items-center gap-2">
                    <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                        startContent={<Icon icon="lucide:upload" width={14} />}
                        onPress={uploadOnOpen}
                    >
                        Upload
                    </Button>
                    <Button
                        color="primary"
                        size="sm"
                        className="bg-gradient-light"
                        startContent={<Icon icon="lucide:file-plus" width={14} />}
                        onPress={() => {
                            console.log('the log');
                            // if (Rename) setRename('')
                            setRename('');
                            handelFileAdd()
                            setParentRightClick(true)
                            setSelectedfile(Filemanagemnt);
                            setSelectedItemModal(Filemanagemnt);
                            onOpen()
                        }}
                    >
                        New File
                    </Button>
                    <Button
                        color="primary"
                        size="sm"
                        className="bg-gradient-light"
                        startContent={<Icon icon="lucide:folder-plus" width={14} />}
                        onPress={() => {
                            console.log('the log');
                            // if (Rename) setRename('')
                            setRename('');
                            handelFolderAdd()
                            setParentRightClick(true)
                            setSelectedfile(Filemanagemnt);
                            setSelectedItemModal(Filemanagemnt);
                            onOpen()
                        }}
                    >
                        New Folder
                    </Button>
                </div>
            </div>

            {/* File Management Card */}

            <Card className="border border-default-200 dark:border-default-400 shadow-none flex-1 overflow-hidden flex flex-col mb-4 lg:max-h-[65vh] lg:min-h-[65vh] overflow-y-auto scrollbar-hide"

                onContextMenu={(e) => {
                    if (e.button === 2) {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsRightClick(true)
                        setParentRightClick(true)
                        setSelectedfile(Filemanagemnt);
                        setSelectedItemModal(Filemanagemnt);
                        setRename('')
                        onOpen();
                        setEDitnameMode(false);
                    }
                }}
            >
                {/* Navigation Bar */}
                <div className="p-3 border-b border-default-200 bg-default-50 dark:bg-default-300/80 flex items-center flex-wrap md:gap-2 ">
                    <div className="flex items-center md:gap-2">
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            isDisabled={maxbackroot == directoryPath}
                            onPress={handleBack}

                        >
                            <Icon icon="lucide:arrow-left" width={14} />
                        </Button>
                        <Tooltip content="Refresh" className='dark:bg-default-300'>
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={() => fetchfiles(viewingFile ? viewingFile.path : directoryPath)}
                            >
                                <Icon icon="lucide:refresh-cw" width={14} />
                            </Button>
                        </Tooltip>
                    </div>

                    {/* Path Display - Responsive Truncation */}
                    <div className="md:ml-4 bg-default-100 rounded-md flex items-center px-3 py-1 flex-1 min-w-0">
                        <Icon
                            icon="lucide:folder"
                            className="text-default-500 dark:text-default-800 mr-2 shrink-0"
                            width={14}
                        />
                        <span className="text-xs md:text-sm truncate" title={directoryPath}>
                            {directoryPath}
                        </span>
                    </div>
                </div>


                <div className="p-0 flex-1 overflow-auto bg-transparent">


                    <>
                        {/* 1. Mobile/Small Screen Grid View (default, hidden on md and up) */}
                        <div className="p-4 grid grid-cols-4 sm:grid-cols-5 md:hidden gap-4 bg-transparent">
                            {currentFiles.length === 0 ? (
                                <div className="col-span-4 sm:col-span-5 text-center p-6 text-default-500 dark:text-default-800">
                                    This directory is empty.
                                </div>
                            ) : (
                                currentFiles.map((item) => (
                                    <FileGridItem
                                        key={item.path}
                                        item={item}
                                        handleFolderClick={handleFolderClick}
                                        onOpen={HandlemodalOpen}
                                        editmode={editnameMode}
                                        handelRename={handelRename}
                                        SetNew_name={SetNew_name}
                                        new_name={new_name}
                                        selectedItem={selectedItemModal}
                                        webid={webid}
                                        id={id}


                                    />
                                ))
                            )}
                        </div>

                        {/* 2. Medium/Large Screen Table View (hidden on mobile, shown on md and up) */}
                        <div className="hidden md:block overflow-x-auto scrollbar-hide  bg-transparent pb-40">
                            <table className="w-full min-w-175  table-fixed scrollbar-hides">
                                <thead>
                                    <tr className="border-b border-default-200">
                                        <th className="text-left p-3 text-xs font-medium text-default-500 dark:text-default-800 w-2/5">
                                            NAME
                                        </th>
                                        <th className="text-left p-3 text-xs font-medium text-default-500 dark:text-default-800 w-1/5">
                                            SIZE
                                        </th>
                                        <th className="text-left p-3 text-xs font-medium text-default-500 dark:text-default-800 w-1/5 hidden sm:table-cell">
                                            PERMISSIONS
                                        </th>
                                        <th className="text-left p-3 text-xs font-medium text-default-500 dark:text-default-800 w-1/5 hidden md:table-cell">
                                            MODIFIED
                                        </th>
                                        <th className="text-left p-3 text-xs font-medium text-default-500 dark:text-default-800 w-25 shrink-0">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='scrollbar-hide '>
                                    {currentFiles.length === 0 ? (
                                        <tr className="text-center">
                                            <td colSpan={5} className="p-6 text-default-500 dark:text-default-800">
                                                This directory is empty.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentFiles.map((item, index) => (
                                            <tr
                                                key={item.path}
                                                className={`border-b border-default-100 cursor-pointer  transition-colors ${seleletedfile == item ? 'bg-default-100 hover:bg-default-100' : 'hover:bg-default-50 dark:hover:bg-content1/20'}`}
                                                onDoubleClick={(e) => {
                                                    e.preventDefault();
                                                    if (item.is_dir) {
                                                        //   const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                        // window.open(editorUrl, '_blank', 'noreferrer');

                                                        handleFolderClick(item);
                                                        setRename('')
                                                    } else {
                                                        const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                        window.open(editorUrl, '_blank', 'noreferrer');
                                                    }
                                                }
                                                }
                                                onClick={() => {
                                                    if (!seleletedfile || seleletedfile !== item) {
                                                        setSelectedfile(item)
                                                        setRename('')

                                                    }
                                                }}
                                                onContextMenu={(e) => {
                                                    if (e.button === 2) {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setIsRightClick(true)
                                                        setSelectedfile(item);
                                                        setSelectedItemModal(item);
                                                        setRename('')
                                                        onOpen();
                                                        setEDitnameMode(false);
                                                    }
                                                }}
                                            >
                                                {/* NAME - Clickable for navigation */}
                                                <td className="p-3 whitespace-nowrap overflow-hidden text-ellipsis"


                                                    onDoubleClick={(e) => {
                                                        e.preventDefault();

                                                        if (item.is_dir) {
                                                            //   const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                            // window.open(editorUrl, '_blank', 'noreferrer');

                                                            handleFolderClick(item);
                                                            setRename('')
                                                        } else {
                                                            const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                            window.open(editorUrl, '_blank', 'noreferrer');
                                                        }
                                                        ; setRename(''); setSelectedfile(null)
                                                    }}
                                                    onClick={(e) => {
                                                        e.preventDefault()

                                                        if (!seleletedfile || seleletedfile !== item) {
                                                            setSelectedfile(item)
                                                            setRename('')

                                                        }
                                                        //  else {
                                                        //     setRename(item.name)
                                                        //     SetNew_name(item.name)
                                                        //     setSelectedfile(null)
                                                        // }
                                                    }}>
                                                    {
                                                        rename == item.name ? (
                                                            // 1. IMPORTANT: Stop click propagation on the div wrapping the input.
                                                            <div
                                                                onClick={(e) => e.stopPropagation()}
                                                                className='py-1'
                                                            >
                                                                <input
                                                                    ref={renameInputRef} // Ref attached
                                                                    placeholder="Enter new name"
                                                                    value={new_name}
                                                                    // 2. Add onFocus to select text immediately upon gaining focus (redundant check for visibility)
                                                                    onFocus={(e) => e.target.select()}
                                                                    className='ring-1 ring-primary focus:ring-1 focus:dark:ring-primary-700 focus:border-none focus:outline-none dark:bg-default-100  p-1 rounded text-sm w-full'
                                                                    onChange={(e) => SetNew_name(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            renameInputRef.current?.blur();
                                                                        }
                                                                    }}
                                                                    onBlur={handelRename} // Rename logic on blur
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center">
                                                                <Icon
                                                                    icon={getFileIcon(item)}
                                                                    className={`mr-2 ${item.is_dir ? 'text-primary-500' : 'text-default-500 dark:text-default-800'}  ${isCut && copyitem === item ? 'opacity-10 dark:opacity-20' : 'opacity-100'} `}
                                                                    width={20}
                                                                />
                                                                <span className="text-sm font-medium hover:underline">
                                                                    {item.name}
                                                                </span>
                                                            </div>

                                                        )
                                                    }
                                                </td>

                                                {/* SIZE */}
                                                <td className="p-3 text-sm text-default-600 dark:text-default-800">
                                                    {formatFileSize(item.size)}
                                                </td>

                                                {/* PERMISSIONS (Hidden on XS) */}
                                                <td className="p-3 text-sm text-default-600 dark:text-default-800 hidden sm:table-cell">
                                                    {item.permission}
                                                </td>

                                                {/* MODIFIED (Hidden on SM) */}
                                                <td className="p-3 text-sm text-default-600 dark:text-default-800 hidden md:table-cell">
                                                    {formatDate(item.last_modified)}
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1">
                                                        <Popover
                                                            placement="bottom-end"
                                                            isOpen={thepop === index + 1}
                                                            onOpenChange={(open) => (open ? setThePop(index + 1) : setThePop(0))}
                                                            classNames={{
                                                                content: 'w-[180px] dark:bg-slate-900 py-2 rounded-lg border border-default-400 shadow-xl',
                                                            }}
                                                        >
                                                            <PopoverTrigger>
                                                                <Button isIconOnly size="sm" variant="light">
                                                                    <Icon icon="lucide:more-vertical" width={18} />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <Listbox
                                                                    aria-label="File Actions"
                                                                    className="p-0"
                                                                    disabledKeys={parentRightClick ? ['copy', 'cut',] : []}

                                                                    itemClasses={{
                                                                        base: "px-2  rounded-none h-9 text-sm data-[hover=true]:bg-default-100/70",
                                                                    }}
                                                                >
                                                                    {
                                                                        !parentRightClick ? (

                                                                            <ListboxItem
                                                                                key="rename"
                                                                                startContent={<Icon icon="lucide:folder-pen" width={14} />}
                                                                                onPress={() => {
                                                                                    setRename(item.name)
                                                                                    SetNew_name(item.name)
                                                                                    setThePop(0)
                                                                                }}
                                                                            >
                                                                                Rename
                                                                            </ListboxItem>
                                                                        ) : null

                                                                    }
                                                                    <ListboxItem
                                                                        key="rename"
                                                                        startContent={<Icon icon="lucide:external-link" width={14} />}
                                                                        onPress={() => {
                                                                            const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                                            window.open(editorUrl, '_blank', 'noreferrer');
                                                                        }}
                                                                    >
                                                                        Open In File Editor
                                                                    </ListboxItem>

                                                                    <ListboxItem
                                                                        key="copy"
                                                                        startContent={<Icon icon="lucide:copy" width={14} />}
                                                                        onPress={() => { setCopyParentdir(Filemanagemnt?.path ?? ""); setCopyitem(item); setThePop(0) }}

                                                                    >
                                                                        Copy
                                                                    </ListboxItem>

                                                                    <ListboxItem
                                                                        key="cut"
                                                                        startContent={<Icon icon="lucide:scissors" width={14} />}
                                                                        onPress={() => { setCopyParentdir(Filemanagemnt?.path ?? ""); setCopyitem(item); SetIsCut(true); setThePop(0) }}
                                                                    >
                                                                        Cut
                                                                    </ListboxItem>

                                                                    {/* Only show paste if an item is copied */}
                                                                    {copyitem && (
                                                                        <ListboxItem
                                                                            key="paste"
                                                                            startContent={<Icon icon="lucide:clipboard-paste" width={14} />}
                                                                            onPress={() => {
                                                                                setSelectedItemModal(item)
                                                                                onOpen()
                                                                                handelPaste()
                                                                                setThePop(0)
                                                                            }}
                                                                        >
                                                                            Paste
                                                                        </ListboxItem>
                                                                    )}

                                                                    {
                                                                        !isArchiveFile(item.name) &&


                                                                        <ListboxItem
                                                                            key="compress"
                                                                            startContent={<Icon icon="lucide:package" width={14} />}
                                                                            onPress={() => {
                                                                                setSelectedItemModal(item)
                                                                                SetIscompressOn(true)
                                                                                onOpen()
                                                                                setThePop(0)
                                                                            }}
                                                                        >
                                                                            Compress
                                                                        </ListboxItem>
                                                                    }

                                                                    {
                                                                        isArchiveFile(item.name) &&


                                                                        <ListboxItem
                                                                            key="extract"
                                                                            startContent={<Icon icon="lucide:package" width={14} />}
                                                                            onPress={() => {
                                                                                setSelectedItemModal(item)
                                                                                SetIsExtarcyon(true)
                                                                                onOpen()
                                                                                setThePop(0)
                                                                            }}
                                                                        >
                                                                            Extract
                                                                        </ListboxItem>
                                                                    }
                                                                    {
                                                                        !item.is_dir &&

                                                                        <ListboxItem
                                                                            key="download"
                                                                            startContent={<Icon icon="lucide:download" width={14} />}
                                                                            onPress={() => {
                                                                                setSelectedItemModal(item)
                                                                                SetIsDownLoading(true)
                                                                                onOpen()
                                                                                setThePop(0)
                                                                            }}
                                                                        >
                                                                            Download File
                                                                        </ListboxItem>
                                                                    }



                                                                    <ListboxItem
                                                                        key="permission"
                                                                        startContent={<Icon icon="lucide:key-round" width={14} />}
                                                                        onPress={() => {
                                                                            setSelectedItemModal(item)
                                                                            SetIsperminionChange(true)
                                                                            onOpen()
                                                                            setThePop(0)
                                                                        }}
                                                                    >
                                                                        Change Permission
                                                                    </ListboxItem>
                                                                </Listbox>


                                                                <Divider className="my-1" />
                                                                <Popover
                                                                    placement="left-start"
                                                                    isOpen={isPopoverOpen === index + 1}
                                                                    onOpenChange={(open) => {
                                                                        if (open) {
                                                                            setIsPopoverOpen(index + 1);
                                                                            // Reset checkbox when opening
                                                                        } else {
                                                                            setIsPopoverOpen(0);
                                                                        }
                                                                    }}
                                                                    isDismissable={false}
                                                                    classNames={{
                                                                        base: 'dark:bg-default-200 ',
                                                                        content: 'rounded-md dark:bg-default-100/80 border border-default-400 shadow-lg',
                                                                    }}
                                                                >
                                                                    <PopoverTrigger>
                                                                        <Button
                                                                            variant="light"
                                                                            size="sm"
                                                                            className="w-full justify-start text-red-500"
                                                                            startContent={<Icon icon="lucide:trash-2" width={16} className="text-red-500" />}
                                                                        >
                                                                            Delete {item.is_dir ? 'Folder' : 'File'}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="p-4 min-w-75 space-y-4 pt-4 rounded-md">
                                                                        <div className=' text-center flex flex-col items-center'>
                                                                            <Icon icon="lucide:alert-triangle" width={20} className="text-red-500 shrink-0 mt-0.5" />
                                                                            <p className="text-xs text-default-700 text-center text-wrap mt-1">
                                                                                Are you sure you want to delete <br /> <span className='font-semibold'>{item.name}?</span>
                                                                            </p>
                                                                        </div>



                                                                        <div className="flex justify-end gap-2 w-full">
                                                                            <Button variant="flat" size="sm" className="w-full" onPress={() => setIsPopoverOpen(0)}>
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                color="danger"
                                                                                size="sm"
                                                                                className="w-full"
                                                                                isLoading={deleteLoader}
                                                                                isDisabled={deleteLoader}
                                                                                onPress={() => {
                                                                                    handeldelte(item)// Reset state
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>

                </div>
            </Card>


            {
                isOpen && selectedItemModal &&


                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    placement='center'
                    hideCloseButton
                    // isDismissable={!copyloader}
                    className={`${modalMode !== 'action' ? '' : 'max-w-60!'} transition-all ease-in-out duration-300`}
                    classNames={{ base: 'p-0 border  dark:bg-slate-900 dark:border-default-400', wrapper: 'p-0 dark:bg-black/50', body: 'p-0 ' }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalBody className='p-4' >
                                    <AnimatePresence mode="wait">
                                        {(() => {
                                            switch (modalMode) {
                                                case 'compress':
                                                    return (
                                                        <CompressFile item={selectedItemModal} onClose={onOpenChange} parentPath={Filemanagemnt?.path ?? ""} />
                                                    )
                                                case 'permission':
                                                    return (
                                                        <Permissions item={selectedItemModal} onClose={onOpenChange} parentPath={Filemanagemnt?.path ?? ""} />
                                                    )
                                                case 'copying':
                                                    return (
                                                        /* --- NEW: Copying/Loading Mode --- */
                                                        <motion.div
                                                            key="copying-mode"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex flex-col items-center justify-center p-8 gap-4"
                                                        >
                                                            <CopyingFile copyitem={copyitem} destinationName={Filemanagemnt?.name ?? ""} isComplete={copyComplete} setCopyLoader={setCopyloader} retry={handelPaste} cancel={cancelCopy} />
                                                        </motion.div>
                                                    );

                                                case 'rename':
                                                    return (
                                                        /* --- Existing: Rename Mode --- */
                                                        <motion.div
                                                            key="rename-mode"
                                                            initial={{ opacity: 0, x: -50 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -50 }}
                                                            transition={{ duration: 0.2 }}
                                                            className='flex flex-col gap-4'
                                                        >
                                                            <h4 className='text-sm font-semibold text-center'>Rename {selectedItemModal?.is_dir ? 'Folder' : 'File'}</h4>
                                                            <div className='flex items-center justify-center '>
                                                                <motion.div
                                                                    initial={{ opacity: 0, x: -90 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{
                                                                        duration: 0.6,
                                                                        ease: [0.16, 1, 0.3, 1],
                                                                    }}
                                                                    className={selectedItemModal?.is_dir ? 'text-primary-500' : 'text-default-500'}
                                                                >
                                                                    <Icon icon={getFileIcon(selectedItemModal)} width={150} />
                                                                </motion.div>
                                                            </div>
                                                            <div className='px-6'>
                                                                <Input
                                                                    ref={renameInputRef}

                                                                    placeholder="Enter new name"
                                                                    value={new_name}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => SetNew_name(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' && !renameLoader) {
                                                                            handelRename();
                                                                        }
                                                                    }}
                                                                    isRequired
                                                                />
                                                            </div>
                                                            <div className="flex justify-end gap-2 mt-2  w-full">
                                                                <Button
                                                                    variant="flat"
                                                                    size="sm"
                                                                    onPress={cancelRenameInModal}
                                                                    isDisabled={renameLoader}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    isLoading={renameLoader}
                                                                    isDisabled={renameLoader || new_name.trim() === rename}
                                                                    onPress={handelRename}
                                                                >
                                                                    Save Name
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    );

                                                case 'newfolder':
                                                    return (
                                                        <NewF onClose={onOpenChange} parentPath={Filemanagemnt?.path ?? ""} is_dir={isNewDir} />
                                                    )


                                                case 'extract':
                                                    return (
                                                        <Extract item={selectedItemModal} onClose={onOpenChange} parentPath={Filemanagemnt?.path ?? ""} />
                                                    )
                                                case 'download':
                                                    return (
                                                        // <DownloadFile item={selectedItemModal} onClose={onOpenChange} setDownLoading={SetIsDownLoading} />
                                                        <DownloadFile path={selectedItemModal.path} name={selectedItemModal.name} onClose={onOpenChange} />
                                                    )

                                                case 'action':
                                                default:
                                                    return (
                                                        /* --- Existing: Action Mode --- */
                                                        <motion.div
                                                            key="action-mode"
                                                            initial={{ opacity: 0, x: -50 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 50 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex flex-col w-full py-4"
                                                        >
                                                            <Listbox
                                                                aria-label="File Actions"
                                                                className="p-0"
                                                                disabledKeys={parentRightClick ? ['copy', 'cut',] : []}

                                                                itemClasses={{
                                                                    base: "px-2  rounded-none h-9 text-sm data-[hover=true]:bg-default-100/70",
                                                                }}
                                                            >
                                                                {!parentRightClick ? (
                                                                    <ListboxItem
                                                                        key="rename"
                                                                        startContent={<Icon icon="lucide:folder-pen" width={14} />}
                                                                        onPress={startRenameInModal}
                                                                    >
                                                                        Rename
                                                                    </ListboxItem>
                                                                ) : null
                                                                }
                                                                <ListboxItem
                                                                    key="rename"
                                                                    startContent={<Icon icon="lucide:external-link" width={14} />}
                                                                    onPress={() => {
                                                                        const editorUrl = `/FileEditor?path=${encodeURIComponent(selectedItemModal.path)}&name=${encodeURIComponent(selectedItemModal.name)}&webid=${webid}&serverId=${id}`;
                                                                        window.open(editorUrl, '_blank', 'noreferrer');
                                                                    }}
                                                                >
                                                                    Open In File Editor
                                                                </ListboxItem>

                                                                <ListboxItem
                                                                    key="copy"
                                                                    startContent={<Icon icon="lucide:copy" width={14} />}
                                                                    onPress={() => { handeldCopy(); SetIsCut(false) }}

                                                                >
                                                                    Copy
                                                                </ListboxItem>

                                                                <ListboxItem
                                                                    key="cut"
                                                                    startContent={<Icon icon="lucide:scissors" width={14} />}
                                                                    onPress={() => {
                                                                        handeldCopy()
                                                                        SetIsCut(true)
                                                                    }}
                                                                >
                                                                    Cut
                                                                </ListboxItem>

                                                                {/* Only show paste if an item is copied */}
                                                                {copyitem && (
                                                                    <ListboxItem
                                                                        key="paste"
                                                                        startContent={<Icon icon="lucide:clipboard-paste" width={14} />}
                                                                        onPress={handelPaste}
                                                                    >
                                                                        Paste
                                                                    </ListboxItem>
                                                                )}
                                                                {!isArchiveFile(selectedItemModal.name) && !parentRightClick &&
                                                                    <ListboxItem
                                                                        key="compress"
                                                                        startContent={<Icon icon="lucide:package" width={14} />}
                                                                        onPress={handelCompress}
                                                                    >
                                                                        Compress
                                                                    </ListboxItem>
                                                                }


                                                                {isArchiveFile(selectedItemModal.name) &&
                                                                    <ListboxItem
                                                                        key="extract"
                                                                        startContent={<Icon icon="lucide:package" width={14} />}
                                                                        onPress={handelExtract}
                                                                    >
                                                                        Extract
                                                                    </ListboxItem>
                                                                }
                                                                {parentRightClick &&
                                                                    <ListboxItem
                                                                        key="Createfile"
                                                                        startContent={<Icon icon="lucide:file-plus" width={14} />}
                                                                        onPress={handelFileAdd}
                                                                    >
                                                                        Create File
                                                                    </ListboxItem>
                                                                }
                                                                {parentRightClick &&
                                                                    <ListboxItem
                                                                        key="Create"
                                                                        startContent={<Icon icon="lucide:folder" width={14} />}
                                                                        onPress={handelFolderAdd}
                                                                    >
                                                                        Create Folder
                                                                    </ListboxItem>
                                                                }
                                                                {
                                                                    !selectedItemModal.is_dir &&

                                                                    <ListboxItem
                                                                        key="download"
                                                                        startContent={<Icon icon="lucide:download" width={14} />}
                                                                        onPress={() => {

                                                                            SetIsDownLoading(true)

                                                                        }}
                                                                    >
                                                                        Download File
                                                                    </ListboxItem>
                                                                }
                                                                <ListboxItem
                                                                    key="permission"
                                                                    startContent={<Icon icon="lucide:key-round" width={14} />}
                                                                    onPress={handelChangePermission}
                                                                >
                                                                    Change Permission
                                                                </ListboxItem>
                                                            </Listbox>

                                                            {
                                                                !parentRightClick &&
                                                                <>

                                                                    <Divider className="my-1" />

                                                                    <Popover
                                                                        placement="bottom-end"
                                                                        isDismissable={false}
                                                                        classNames={{
                                                                            content: 'rounded-md dark:bg-default-100/80 border border-default-400 shadow-lg',
                                                                        }}
                                                                    >
                                                                        <PopoverTrigger>
                                                                            <Button
                                                                                variant="light"
                                                                                size="sm"
                                                                                className="w-full justify-start text-red-500 px-4 h-9 text-sm"
                                                                                startContent={<Icon icon="lucide:trash-2" width={16} className="text-red-500" />}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="p-4 min-w-75 space-y-4 pt-4 rounded-md">
                                                                            <div className=' text-center flex flex-col items-center'>
                                                                                <Icon icon="lucide:alert-triangle" width={20} className="text-red-500 shrink-0 mt-0.5" />
                                                                                <p className="text-xs text-default-700 text-center text-wrap mt-1">
                                                                                    Are you sure you want to delete <br /> <span className='font-semibold'>{selectedItemModal.name}?</span>
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex justify-end gap-2 w-full">
                                                                                <Button variant="flat" size="sm" className="w-full" onPress={() => onClose()}>
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button
                                                                                    color="danger"
                                                                                    size="sm"
                                                                                    className="w-full"
                                                                                    isLoading={deleteLoader}
                                                                                    isDisabled={deleteLoader}
                                                                                    onPress={() => {
                                                                                        handeldelte(selectedItemModal)
                                                                                    }}
                                                                                >
                                                                                    Delete
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </>
                                                            }

                                                        </motion.div>
                                                    );
                                            }
                                        })()}
                                    </AnimatePresence>

                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            }


            {Uploadopen &&
                <UploadModal isOpen={Uploadopen} onOpenChange={UploadOnOpenChange} currentPath={Filemanagemnt?.path ?? ""} />
            }






        </div>
    )
}

export default Filemanager