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
import { Icon } from '@iconify/react/dist/iconify.js'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { Copyfile, DeleteFile, getFileOrDirectory, Rename, setSelectedFile, setCopyItem } from '../../redux/slice/FileManagerSlice'
import type { FileManagerItem } from '../../utils/interfaces'
import { getFileIcon, formatStorage, findDurationLabel } from '../../helpperFunctions/ConvertionFunction'

import FileGridItem from './FileGridItem'
import CopyingFile from './CopyingFile'
import Permissiions from './Permissiions'
import CompressFile from './CompressFile'
import Extract from './Extract'
import NewF from './NewF'
import DownloadFile from './DownloadFile'
import UploadModal from './UploadModal'
import { getWebDetails } from '../../redux/slice/websiteSlice'

const isArchiveFile = (fileName: string): boolean => {
    const archiveExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.tgz', '.bz2', '.tbz2', '.xz', '.txz', '.iso', '.dmg', '.jar'];
    return archiveExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};


const FileManager = () => {
    const { webid, id } = useParams();
    const dispatch = useAppDispatch();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: Uploadopen, onOpen: uploadOnOpen, onOpenChange: UploadOnOpenChange } = useDisclosure();

    // Assuming websitedetail has website.public_path
    const websitedetail = useAppSelector((state: any) => state.auth.WebsiteDetails);

    useEffect(() => {
        console.log('the website detail', websitedetail);

    }, [websitedetail])

    // Assuming Filemanagemnt is of type FileManagerItem | null
    const { TheFiles, copyItem, copyParentDir, isCut: isCutState } = useAppSelector((state: any) => state.fileManager);

    // State to display the current path in the UI
    const [directoryPath, setDirectoryPath] = useState('');
    const [selectedItemModal, setSelectedItemModal] = useState<FileManagerItem | null>(null);
    const [viewingFile, setViewingFile] = useState<FileManagerItem | null>(null);

    const [renamingItemNameLoader, setRenamingItemNameLoader] = useState(false)
    const [copyloader, setCopyloader] = useState(false)
    const [deleteLoader, setDeleteLoader] = useState(false)
    const [isRightClick, setIsRightClick] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(0);
    const [thepop, setThePop] = useState(0)

    // Rename
    const renamingItemNameInputRef = useRef<HTMLInputElement>(null);
    const [renamingItemName, setRenamingItemName] = useState('')
    const [new_name, SetNew_name] = useState('')
    const [editnameMode, setEDitnameMode] = useState(false)
    const [parentRightClick, setParentRightClick] = useState(false)
    const [copyComplete, setCopyComplete] = useState(false)

    //permi
    const [IsperminionChange, SetIsperminionChange] = useState(false)
    const [IsDownLoading, SetIsDownLoading] = useState(false)

    //compress
    const [iscompressOn, SetIscompressOn] = useState(false)
    const [isExtarcyon, SetIsExtarcyon] = useState(false)

    //newfolder
    const [isnewfolder, SetIsnewfolder] = useState(false)
    const [isNewDir, setisNewDir] = useState(false)


    const rootPath = useMemo(() => websitedetail.public_path || '/', [websitedetail]);
    const maxbackroot = useMemo(() => websitedetail.public_path.substring(0, directoryPath.lastIndexOf('/')) || '/', [websitedetail]);




    const fetchfiles = async (path: string) => {
        setViewingFile(null);

        try {
            await dispatch(getFileOrDirectory(path)).unwrap();
        } catch (error) {
            console.error('Error fetching files:', error);

        }
    };



    const handleFolderClick = (item: FileManagerItem) => {
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
            await dispatch(DeleteFile({ path: directoryPath, is_dir: item.is_dir, name: item.name })).unwrap()
            if (isOpen) onOpenChange()

        } catch (error) {
            // addToast({ description: error })
        } finally {
            setDeleteLoader(false)
        }
    }



    const handelRename = async () => {

        if (renamingItemName === new_name || new_name.trim() === '' && selectedItemModal) {
            setEDitnameMode(false);
            onOpenChange();
            return;
        }

        setRenamingItemNameLoader(true);
        try {

            await dispatch(Rename({ path: directoryPath, name: renamingItemName, new_name })).unwrap()
            addToast({ description: `File/Directory renamingItemNamed to ${new_name}`, color: "success" })

            setEDitnameMode(false);
            onOpenChange();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            addToast({ description: errorMessage, color: "danger" })
        } finally {
            setRenamingItemNameLoader(false)
            setRenamingItemName('');
            SetNew_name('');
            dispatch(setSelectedFile(null));
        }
    }


    const startRenameInModal = () => {
        if (selectedItemModal) {
            setRenamingItemName(selectedItemModal.name);
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


    const handeldCopy = (isCut: boolean = false) => {
        if (selectedItemModal) {
            dispatch(setCopyItem({ item: selectedItemModal, parentDir: directoryPath, isCut }));
        }
        onOpenChange()
    };

    const handelPaste = async () => {
        setCopyloader(true)
        try {
            console.log('the sicut', isCutState);

            if (!TheFiles || !copyItem) {
                addToast({ description: 'File manager data not loaded or no item to copy', color: 'danger' })
                return;
            }

            const res = await dispatch(Copyfile({ data: { path: copyParentDir, name: copyItem.name, new_path: directoryPath }, isCut: isCutState })).unwrap()
            await fetchfiles(directoryPath)


            setCopyComplete(true)
            addToast({ description: res.message, color: 'success' })

        } catch (error) {
            // setTimeout(() => {

            //     setCopyloader(false)
            // }, 2000);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            addToast({ description: errorMessage, color: "danger" })
        } finally {
            // setTimeout(() => {
            //     setCopyloader(false)
            // }, 5000);
        }
    }
    const cancelCopy = () => {
        setCopyComplete(false)
        setCopyloader(false)
        dispatch(setCopyItem(null));
        onOpenChange()
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
        if (renamingItemName && renamingItemNameInputRef.current) {

            const timer = setTimeout(() => {
                renamingItemNameInputRef.current?.focus();
                // Select the text for a good user experience
                renamingItemNameInputRef.current?.select();
            }, 500);

            // Cleanup function to clear the timer if the component unmounts 
            // or the `renamingItemName` state changes before the timeout fires.
            return () => clearTimeout(timer);
        }
    }, [renamingItemName]);
    // 1. Initial Load: Fetch root path
    useEffect(() => {

        {
            websitedetail?.public_path &&
                fetchfiles(websitedetail?.public_path);
        }


    }, [websitedetail]);

    // useEffect(() => {
    //     fetchWebDetails()
    // }, [])
    // 2. Update Path/File View when Redux state changes
    useEffect(() => {
        if (TheFiles) {
            if (TheFiles.is_dir) {
                // If the fetched item is a directory, update the path
                setDirectoryPath(TheFiles.path);
                setViewingFile(null);
            } else if (TheFiles.content !== undefined) {
                // If the fetched item is a file with content, show the content viewer
                setDirectoryPath(TheFiles.path); // Use file path in state to correctly calculate back button
                setViewingFile(TheFiles);
            }
        } else {
            // Fallback for initial state or if fetch failed/returned null
            setDirectoryPath(rootPath);
            setViewingFile(null);
        }
    }, [TheFiles, rootPath]);
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
            return 'renamingItemName';
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

    const currentFiles = TheFiles?.children || [];



    // if (!websitedetail) {
    //     return <div className="p-6 text-center">Loading Website Details...</div>;
    // }



    return (
        <div className="p-6  h-full flex flex-col">

            <div>
                <p className="text-xl md:text-3xl font-light">Welcome to
                    <span className="ml-2 font-bold text-teal-600">File Manager</span>
                </p>
            </div>
            {/* Header and Actions */}
            <div className="flex items-center justify-end mt-6 mb-4 flex-wrap gap-2">

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

                        startContent={<Icon icon="lucide:file-plus" width={14} />}
                        onPress={() => {
                            console.log('the log');
                            if (renamingItemName) setRenamingItemName('')
                            handelFileAdd()
                            setParentRightClick(true)
                            dispatch(setSelectedFile(TheFiles));
                            setSelectedItemModal(TheFiles);
                            onOpen()
                        }}
                    >
                        New File
                    </Button>
                    <Button
                        color="primary"
                        size="sm"

                        startContent={<Icon icon="lucide:folder-plus" width={14} />}
                        onPress={() => {
                            console.log('the log');
                            if (renamingItemName) setRenamingItemName('')
                            handelFolderAdd()
                            setParentRightClick(true)
                            dispatch(setSelectedFile(TheFiles));
                            setSelectedItemModal(TheFiles);
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
                        dispatch(setSelectedFile(TheFiles));
                        setSelectedItemModal(TheFiles);
                        setRenamingItemName('')
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
                                currentFiles.map((item: FileManagerItem) => (
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
                                        currentFiles.map((item: FileManagerItem, index: number) => (
                                            <tr
                                                key={item.path}
                                                className={`border-b border-default-100 cursor-pointer  transition-colors hover:bg-default-50 dark:hover:bg-content1/20`}
                                                onDoubleClick={(e) => {
                                                    e.preventDefault();
                                                    if (item.is_dir) {
                                                        //   const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                        // window.open(editorUrl, '_blank', 'noreferrer');

                                                        handleFolderClick(item);
                                                        setRenamingItemName('')
                                                    } else {
                                                        const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                        window.open(editorUrl, '_blank', 'noreferrer');
                                                    }
                                                }
                                                }
                                                onClick={() => {

                                                    dispatch(setSelectedFile(item))
                                                    setRenamingItemName('')


                                                }}
                                                onContextMenu={(e) => {
                                                    if (e.button === 2) {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setIsRightClick(true)
                                                        dispatch(setSelectedFile(item));
                                                        setSelectedItemModal(item);
                                                        setRenamingItemName('')
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
                                                            setRenamingItemName('')
                                                        } else {
                                                            const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                            window.open(editorUrl, '_blank', 'noreferrer');
                                                        }
                                                        ; setRenamingItemName(''); dispatch(setSelectedFile(null))
                                                    }}
                                                    onClick={(e) => {
                                                        e.preventDefault()


                                                        dispatch(setSelectedFile(item))
                                                        setRenamingItemName('')


                                                        //  else {
                                                        //     setRenamingItemName(item.name)
                                                        //     SetNew_name(item.name)
                                                        //     setSelectedfile(null)
                                                        // }
                                                    }}>
                                                    {
                                                        renamingItemName == item.name ? (
                                                            // 1. IMPORTANT: Stop click propagation on the div wrapping the input.
                                                            <div
                                                                onClick={(e) => e.stopPropagation()}
                                                                className='py-1'
                                                            >
                                                                <input
                                                                    ref={renamingItemNameInputRef} // Ref attached
                                                                    placeholder="Enter new name"
                                                                    value={new_name}
                                                                    // 2. Add onFocus to select text immediately upon gaining focus (redundant check for visibility)
                                                                    onFocus={(e) => e.target.select()}
                                                                    className='ring-1 ring-primary focus:ring-1 focus:dark:ring-primary-700 focus:border-none focus:outline-none dark:bg-default-100  p-1 rounded text-sm w-full'
                                                                    onChange={(e) => SetNew_name(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            renamingItemNameInputRef.current?.blur();
                                                                        }
                                                                    }}
                                                                    onBlur={handelRename} // Rename logic on blur
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center">
                                                                <Icon
                                                                    icon={getFileIcon(item)}
                                                                    className={`mr-2 ${item.is_dir ? 'text-primary-500' : 'text-default-500 dark:text-default-800'}  ${isCutState && copyItem === item ? 'opacity-10 dark:opacity-20' : 'opacity-100'} `}
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
                                                    {formatStorage(item.size, 'B')}
                                                </td>

                                                {/* PERMISSIONS (Hidden on XS) */}
                                                <td className="p-3 text-sm text-default-600 dark:text-default-800 hidden sm:table-cell">
                                                    {item.permission}
                                                </td>

                                                {/* MODIFIED (Hidden on SM) */}
                                                <td className="p-3 text-sm text-default-600 dark:text-default-800 hidden md:table-cell">
                                                    {findDurationLabel(item.last_modified)}
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
                                                                        !parentRightClick &&

                                                                        <ListboxItem
                                                                            key="renamingItemName"
                                                                            startContent={<Icon icon="lucide:folder-pen" width={14} />}
                                                                            onPress={() => {
                                                                                setRenamingItemName(item.name)
                                                                                SetNew_name(item.name)
                                                                                setThePop(0)
                                                                            }}
                                                                        >
                                                                            Rename
                                                                        </ListboxItem>
                                                                    }
                                                                    <ListboxItem
                                                                        key="renamingItemName"
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
                                                                        onPress={() => { dispatch(setCopyItem({ item, parentDir: directoryPath, isCut: false })); setThePop(0) }}

                                                                    >
                                                                        Copy
                                                                    </ListboxItem>

                                                                    <ListboxItem
                                                                        key="cut"
                                                                        startContent={<Icon icon="lucide:scissors" width={14} />}
                                                                        onPress={() => { dispatch(setCopyItem({ item, parentDir: directoryPath, isCut: true })); setThePop(0) }}
                                                                    >
                                                                        Cut
                                                                    </ListboxItem>

                                                                    {/* Only show paste if an item is copied */}
                                                                    {copyItem && (
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
                                                        <CompressFile item={selectedItemModal!} onClose={onOpenChange} parentPath={TheFiles?.path || ''} />
                                                    )
                                                case 'permission':
                                                    return (
                                                        <Permissiions item={selectedItemModal!} onClose={onOpenChange} parentPath={TheFiles?.path || ''} />
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
                                                            <CopyingFile copyitem={copyItem} destinationName={TheFiles?.name || ''} isComplete={copyComplete} setCopyLoader={setCopyloader} retry={handelPaste} cancel={cancelCopy} />
                                                        </motion.div>
                                                    );

                                                case 'renamingItemName':
                                                    return (
                                                        /* --- Existing: Rename Mode --- */
                                                        <motion.div
                                                            key="renamingItemName-mode"
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
                                                                    <Icon icon={getFileIcon(selectedItemModal!)} width={150} />
                                                                </motion.div>
                                                            </div>
                                                            <div className='px-6'>
                                                                <Input
                                                                    ref={renamingItemNameInputRef}

                                                                    placeholder="Enter new name"
                                                                    value={new_name}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => SetNew_name(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' && !renamingItemNameLoader) {
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
                                                                    isDisabled={renamingItemNameLoader}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    isLoading={renamingItemNameLoader}
                                                                    isDisabled={renamingItemNameLoader || new_name.trim() === renamingItemName}
                                                                    onPress={handelRename}
                                                                >
                                                                    Save Name
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    );

                                                case 'newfolder':
                                                    return (
                                                        <NewF onClose={onOpenChange} parentPath={TheFiles?.path || ''} is_dir={isNewDir} />
                                                    )


                                                case 'extract':
                                                    return (
                                                        <Extract item={selectedItemModal!} onClose={onOpenChange} parentPath={TheFiles?.path || ''} />
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
                                                                {
                                                                    !parentRightClick &&

                                                                    <ListboxItem
                                                                        key="renamingItemName"
                                                                        startContent={<Icon icon="lucide:folder-pen" width={14} />}
                                                                        onPress={startRenameInModal}
                                                                    >
                                                                        Rename
                                                                    </ListboxItem>
                                                                }
                                                                <ListboxItem
                                                                    key="renamingItemName"
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
                                                                    onPress={() => { handeldCopy(false) }}

                                                                >
                                                                    Copy
                                                                </ListboxItem>

                                                                <ListboxItem
                                                                    key="cut"
                                                                    startContent={<Icon icon="lucide:scissors" width={14} />}
                                                                    onPress={() => {
                                                                        handeldCopy(true)
                                                                    }}
                                                                >
                                                                    Cut
                                                                </ListboxItem>

                                                                {/* Only show paste if an item is copied */}
                                                                {copyItem && (
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
                <UploadModal isOpen={Uploadopen} onOpenChange={UploadOnOpenChange} currentPath={TheFiles?.path} />
            }






        </div>
    );
}

export default FileManager;