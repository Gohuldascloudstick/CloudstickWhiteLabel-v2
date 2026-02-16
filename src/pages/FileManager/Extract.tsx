import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, addToast, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useParams } from 'react-router-dom';
import { FileManagerItem } from '../../../utils/interfaces';

// Import Redux hooks and actions
import { useAppDispatch } from '../../../redux/hook';
import { ExtractFile, getfileforextart, getFileOrDirectory } from '../../../redux/slice/FIlemanagerSlice';

// Re-defining FileItem interface locally if not exported
interface FileItem {
    path: string;
    name: string;
    is_dir: boolean;
    last_modified: string;
    permission: string;
    size: number;
    children?: FileItem[];
}

const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.zip') || fileName.endsWith('.tar.gz') || fileName.endsWith('.rar')) {
        return "lucide:file-archive";
    }
    return "lucide:file";
};

interface ExtractProps {
    item: FileManagerItem;
    onClose: () => void;
    parentPath: string;
}

const Extract: React.FC<ExtractProps> = ({ item, onClose, parentPath }) => {
    const { webid, id: serverId } = useParams();
    const dispatch = useAppDispatch();

    // --- Main State ---
    const [destinationPath, setDestinationPath] = useState(parentPath || '/');
    const [isExtracting, setIsExtracting] = useState(false);

    // --- Browsing State ---
    const [isBrowsing, setIsBrowsing] = useState(false);
    const [browsePath, setBrowsePath] = useState(parentPath || '/');
    const [browserItems, setBrowserItems] = useState<FileItem[]>([]);
    const [isLoadingFolders, setIsLoadingFolders] = useState(false);

    // Track specifically selected child in the current view
    const [selectedChild, setSelectedChild] = useState<string | null>(null);

    // --- BROWSER LOGIC ---

    // Fetch folders for the specific path
    const fetchBrowsePath = useCallback(async (path: string) => {
        if (!serverId || !webid) return;

        setIsLoadingFolders(true);
        // Reset selection when entering a new folder
        setSelectedChild(null);

        try {
            const result = await dispatch(getfileforextart({ serverId, webid: Number(webid), path })).unwrap();

            const children = result.message[0].children || [];
            const foldersOnly = children.filter((f: FileItem) => f.is_dir);

            setBrowserItems(foldersOnly);
            setBrowsePath(path);
        } catch (error) {
            console.error(error);
            addToast({ color: 'danger', description: 'Failed to load folders' });
        } finally {
            setIsLoadingFolders(false);
        }
    }, [dispatch, serverId, webid]);

    // Initial load when entering browse mode
    useEffect(() => {
        if (isBrowsing) {
            fetchBrowsePath(browsePath);
        }
    }, [isBrowsing]);

    const handleEnterFolder = (folderName: string) => {
        const newPath = browsePath === '/'
            ? `/${folderName}`
            : `${browsePath}/${folderName}`;
        fetchBrowsePath(newPath);
    };

    const handleGoBack = () => {
        if (browsePath === '/') return;
        const parent = browsePath.substring(0, browsePath.lastIndexOf('/')) || '/';
        fetchBrowsePath(parent);
    };

    // Handle single click selection
    const handleSelectFolder = (folderName: string) => {
        // Toggle: if clicking same folder, keep it. If clicking different, switch. 
        setSelectedChild(folderName);
    };

    // Calculate the name to display in the bottom input
    const getCurrentSelectionName = () => {
        if (selectedChild) return selectedChild;

        // If nothing selected, return current folder name (from browsePath)
        if (browsePath === '/') return '/';
        return browsePath.split('/').pop() || '';
    };

    const confirmSelection = () => {
        let finalPath = browsePath;

        // If a child is explicitly selected, append it to the path
        if (selectedChild) {
            finalPath = browsePath === '/'
                ? `/${selectedChild}`
                : `${browsePath}/${selectedChild}`;
        }

        setDestinationPath(finalPath);
        setIsBrowsing(false);
    };

    const cancelBrowsing = () => {
        setIsBrowsing(false);
        setBrowsePath(destinationPath);
    };

    // --- EXTRACT LOGIC ---

    const handleExtract = async () => {
        if (!destinationPath.trim()) return;

        setIsExtracting(true);

        try {
            await dispatch(ExtractFile({ webid: webid, serverid: serverId, data: { path: item.path, name: item.name, new_path: destinationPath } }))
            await dispatch(getFileOrDirectory({ serverId, webid: Number(webid), path: destinationPath }))


        } catch (error) {
            addToast({ color: 'danger', description: error });
        }
        setIsExtracting(false);
        onClose();


    }


    // --- RENDER: BROWSER MODE ---
    if (isBrowsing) {
        return (
            <div className="flex flex-col h-[450px] w-full">
                {/* Browser Header */}
                <div className="p-3 border-b border-default-200 flex items-center justify-between bg-default-50">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Button isIconOnly size="sm" variant="light" onPress={handleGoBack} isDisabled={browsePath === '/'}>
                            <Icon icon="lucide:arrow-left" width={16} />
                        </Button>
                        <div className="flex flex-col w-full">
                            <span className="text-xs font-semibold text-default-500">Look in:</span>
                            {/* Address bar style display */}
                            <div className="flex items-center gap-1 text-sm border border-default-200 rounded px-2 py-1 bg-white w-full">
                                <Icon icon="lucide:folder-open" width={14} className="text-default-400" />
                                <span className="truncate font-mono">{browsePath}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Browser Body (Folder Grid/List) */}
                <div className="flex-1 overflow-y-auto p-2 bg-white" onClick={() => setSelectedChild(null)}>
                    {isLoadingFolders ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner size="md" />
                        </div>
                    ) : (
                        <>
                            {browserItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-default-400">
                                    <Icon icon="lucide:folder-open" width={40} className="mb-2 opacity-50" />
                                    <span className="text-sm">No sub-folders found</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {browserItems.map((folder) => {
                                        const isSelected = selectedChild === folder.name;
                                        return (
                                            <div
                                                key={folder.path}
                                                className={`
                                                    flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all border 
                                                    ${isSelected
                                                        ? 'bg-primary-50 border-primary-300 ring-1 ring-primary-200'
                                                        : 'hover:bg-default-100 border-transparent hover:border-default-200'
                                                    }
                                                `}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent clearing selection when clicking item
                                                    handleSelectFolder(folder.name);
                                                }}
                                                onDoubleClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEnterFolder(folder.name);
                                                }}
                                            >
                                                <Icon
                                                    icon={"mdi-light:folder"}
                                                    className={isSelected ? "text-primary-600 mb-1" : "text-primary-500 mb-1"}
                                                    width={40}
                                                />
                                                <span className={`text-xs text-center break-all line-clamp-2 leading-tight ${isSelected ? 'font-medium text-primary-700' : 'text-default-700'}`}>
                                                    {folder.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Browser Footer - Updated to match image request */}
                <div className="p-3 border-t border-default-200 flex flex-col gap-3 bg-default-50">
                    <div className="flex items-center gap-2">
                        <span className="text-sm w-16 text-right font-medium text-default-600">Folder:</span>
                        <Input
                            size="sm"
                            value={getCurrentSelectionName()}
                            isReadOnly
                            className="bg-white"
                            classNames={{
                                inputWrapper: "bg-white border border-default-300 shadow-none"
                            }}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="flat" size="sm" onPress={cancelBrowsing}>
                            Cancel
                        </Button>
                        <Button color="primary" size="sm" onPress={confirmSelection}>
                            Select Folder
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: EXTRACT FORM MODE ---
    return (
        <div className="flex flex-col gap-4 p-4 w-full">
            <div className="text-sm border-b border-default-100 pb-2">
                <p className="font-semibold text-foreground-900">Archive to Extract:</p>
                <div className="flex items-center gap-2 mt-1 text-default-600">
                    <Icon icon={getFileIcon(item.name)} width={16} />
                    <span>{item.name}</span>
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor="destination-path" className='text-sm font-medium text-default-700'>Destination Folder</label>
                <div className="flex w-full items-center gap-2">
                    <Input
                        id="destination-path"
                        className='flex-grow'
                        value={destinationPath}
                        onChange={(e) => setDestinationPath(e.target.value)}
                        isRequired
                        size='sm'
                        isDisabled={isExtracting}
                    />
                    <Button
                        variant="flat"
                        size="sm"
                        onPress={() => {
                            setBrowsePath(destinationPath);
                            setIsBrowsing(true);
                        }}
                        isDisabled={isExtracting}
                        startContent={<Icon icon="lucide:folder-open" width={16} />}
                        className='flex-shrink-0'
                    >
                        Browse
                    </Button>
                </div>
                <p className='text-xs text-default-500 mt-1'>
                    The contents will be extracted into this directory.
                </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-default-100">
                <Button variant="flat" size="sm" onPress={onClose} isDisabled={isExtracting}>
                    Cancel
                </Button>
                <Button
                    color="primary"
                    size="sm"
                    onPress={handleExtract}
                    isLoading={isExtracting}
                    isDisabled={isExtracting || !destinationPath.trim()}
                    startContent={<Icon icon="lucide:archive" width={16} />}
                >
                    Extract
                </Button>
            </div>
        </div>
    );
};

export default Extract;