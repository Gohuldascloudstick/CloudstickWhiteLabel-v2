import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../redux/hook';
import { 
    addToast, 
    Button, 
    Drawer, 
    DrawerContent, 
    Listbox, 
    ListboxItem, 
    Modal, 
    ModalBody, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    Popover, 
    PopoverContent, 
    PopoverTrigger, 
    useDisclosure 
} from '@heroui/react';
import { getfileFOlder, CreateItem } from '../redux/slice/FileManagerSlice';
import type { FileManagerItem } from '../utils/interfaces';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getFileIcon } from '../helpperFunctions/ConvertionFunction';
import FileEditorComponent from '../components/FileManager/FileEditorComponent';

// --- Recursive Sidebar Item Component ---
const FileTreeItem = ({ 
    item, 
    onSelect, 
    onExpand, 
    expandedPaths, 
    selectedPath,
    onSetSelected,
    newItemState,
    onCancelNewItem,
    onCreateNewItem,
    depth = 0 
}: { 
    item: FileManagerItem; 
    onSelect: (item: FileManagerItem) => void; 
    onExpand: (path: string) => void; 
    expandedPaths: Set<string>; 
    selectedPath: string | null;
    onSetSelected: (path: string) => void;
    newItemState: { parentPath: string; type: "file" | "folder" } | null;
    onCancelNewItem: () => void;
    onCreateNewItem: (name: string) => Promise<void>;
    depth?: number 
}) => {
    const isExpanded = expandedPaths.has(item.path);
    const isSelected = selectedPath === item.path;
    const isCreatingHere = newItemState?.parentPath === item.path;
    const [newName, setNewName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSetSelected(item.path);
        if (item.is_dir) {
            onExpand(item.path);
        } else {
            onSelect(item);
        }
    };

    const handleCommit = async () => {
        if (!newName.trim()) {
            onCancelNewItem();
            return;
        }
        if (isCreating) return;

        setIsCreating(true);
        try {
            await onCreateNewItem(newName.trim());
            // Successful creation will unmount this block via parent state change
        } catch (error) {
            setIsCreating(false);
        }
    };

    return (
        <div className="select-none">
            <div
                onClick={handleToggle}
                className={`flex items-center py-1 px-2 hover:bg-slate-800 cursor-pointer text-sm gap-2 transition-colors group ${isSelected ? 'bg-blue-600/30 font-medium' : ''}`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
                <Icon 
                    icon={item.is_dir ? (isExpanded ? "mdi:chevron-down" : "mdi:chevron-right") : getFileIcon(item)} 
                    className={item.is_dir ? "text-slate-500" : "text-brand"}
                    width={16}
                />
                <span className="truncate flex-1">{item.name}</span>
            </div>

            {/* Inline Input for New Item */}
            {isCreatingHere && isExpanded && (
                <div className="flex items-center py-1 px-2 gap-2" style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}>
                    <Icon 
                        icon={isCreating ? "svg-spinners:ring-resize" : (newItemState.type === "folder" ? "mdi:folder-outline" : "mdi:file-outline")} 
                        className={newItemState.type === "folder" ? "text-slate-500" : "text-brand"}
                        width={16}
                    />
                    <input 
                        autoFocus
                        value={newName}
                        disabled={isCreating}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleCommit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCommit();
                            if (e.key === "Escape") {
                                onCancelNewItem();
                                setNewName("");
                            }
                        }}
                        className="bg-transparent border border-blue-500 outline-none text-xs w-full px-1 disabled:opacity-50"
                        placeholder={newItemState.type === "folder" ? "Folder name..." : "File name..."}
                    />
                </div>
            )}

            {isExpanded && item.children?.map((child: any) => (
                <FileTreeItem
                    key={child.path}
                    item={child}
                    onSelect={onSelect}
                    onExpand={onExpand}
                    expandedPaths={expandedPaths}
                    selectedPath={selectedPath}
                    onSetSelected={onSetSelected}
                    newItemState={newItemState}
                    onCancelNewItem={onCancelNewItem}
                    onCreateNewItem={onCreateNewItem}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
};

// --- Main Page Component ---
const FileEditorPage = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();

    const initialPath = searchParams.get('path') || "/";
    const initialName = searchParams.get('name') || "Workspace";

    const { isOpen: isSidebarDrawerOpen, onOpen: openSidebarDrawer, onOpenChange: onSidebarDrawerChange } = useDisclosure();
    const { isOpen: isDiscardModalOpen, onOpen: openDiscardModal, onOpenChange: onDiscardModalChange } = useDisclosure();

    const [fileTree, setFileTree] = useState<FileManagerItem | null>(null);
    const [openTabs, setOpenTabs] = useState<FileManagerItem[]>([]);
    const [activePath, setActivePath] = useState<string | null>(null);
    const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(new Set());
    const [autosave, setAutosave] = useState<boolean>(false);
    const [theme, setTheme] = useState(localStorage.getItem('FileEditorTheme') || 'vs-dark');
    const [pendingClosePath, setPendingClosePath] = useState<string | null>(null);

    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set([initialPath]));
    const [selectedPath, setSelectedPath] = useState<string | null>(initialPath);
    const [newItemState, setNewItemState] = useState<{ parentPath: string; type: "file" | "folder" } | null>(null);
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const isResizing = useRef(false);

    // Initial Load
    useEffect(() => {
        const loadInitial = async () => {
            try {
                const data = await dispatch(getfileFOlder({ path: initialPath })).unwrap();
                setFileTree(data);
                
                // If it's a file, open it
                if (!data.is_dir) {
                    handleFileOpen(data);
                }
            } catch (error: any) {
                addToast({ description: "Failed to load workspace", color: 'danger' });
            }
        };
        loadInitial();
    }, [initialPath]);

    // Resizing Logic
    const startResizing = (_e: React.MouseEvent) => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'col-resize';
    };

    const stopResizing = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'default';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX;
        if (newWidth > 150 && newWidth < 600) {
            setSidebarWidth(newWidth);
        }
    };

    const loadFolder = async (path: string) => {
        setExpandedPaths((prev) => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });

        // Don't refetch if we already have children and it's expanded
        const node = findNode(fileTree, path);
        const alreadyHasChildren = (node?.children?.length ?? 0) > 0;
        if (alreadyHasChildren) return;

        try {
            const data = await dispatch(getfileFOlder({ path })).unwrap();
            updateTreeState(path, data.children || []);
        } catch (error: any) {
            addToast({ description: "Failed to load directory", color: 'danger' });
        }
    };

    const findNode = (node: any, path: string): any => {
        if (!node) return null;
        if (node.path === path) return node;
        if (node.children) {
            for (let child of node.children) {
                const found = findNode(child, path);
                if (found) return found;
            }
        }
        return null;
    };

    const updateTreeState = (path: string, children: any[]) => {
        setFileTree((prev) => {
            if (!prev) return null;
            const newTree = JSON.parse(JSON.stringify(prev));
            const node = findNode(newTree, path);
            if (node) {
                node.children = children;
            }
            return newTree;
        });
    };

    const handleFileOpen = async (file: FileManagerItem) => {
        if (file.is_dir) return;

        const alreadyOpened = openTabs.find(t => t.path === file.path);
        if (alreadyOpened) {
            setActivePath(file.path);
            return;
        }

        try {
            const data = await dispatch(getfileFOlder({ 
                path: file.path, 
            })).unwrap();
            setOpenTabs(prev => [...prev, data]);
            setActivePath(file.path);
        } catch (error: any) {
            addToast({ description: "Failed to open file", color: 'danger' });
        }
    };

    const handleCloseTab = (path: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        
        if (dirtyFiles.has(path)) {
            setPendingClosePath(path);
            openDiscardModal();
        } else {
            finalizeCloseTab(path);
        }
    };

    const finalizeCloseTab = (path: string) => {
        setOpenTabs(prev => {
            const index = prev.findIndex(t => t.path === path);
            const newList = prev.filter(t => t.path !== path);
            
            if (activePath === path) {
                if (newList.length > 0) {
                    const nextIndex = Math.min(index, newList.length - 1);
                    setActivePath(newList[nextIndex].path);
                } else {
                    setActivePath(null);
                }
            }
            return newList;
        });

        setDirtyFiles(prev => {
            const next = new Set(prev);
            next.delete(path);
            return next;
        });
        
        setPendingClosePath(null);
    };

    const handleNewItem = (type: "file" | "folder") => {
        let parentPath = initialPath;
        if (selectedPath) {
            const node = findNode(fileTree, selectedPath);
            if (node) {
                parentPath = node.is_dir ? node.path : node.path.substring(0, node.path.lastIndexOf("/"));
            }
        }
        
        // Ensure parent is expanded
        if (!expandedPaths.has(parentPath)) {
            loadFolder(parentPath);
        }
        
        setNewItemState({ parentPath, type });
    };

    const handleCreate = async (name: string) => {
        if (!newItemState) return;
        
        const payload = {
            path: newItemState.parentPath,
            name,
            is_dir: newItemState.type === "folder"
        };

        try {
            await dispatch(CreateItem(payload)).unwrap();
            addToast({ description: `${newItemState.type === "folder" ? "Folder" : "File"} created successfully`, color: "success" });
            
            // Refresh parent
            const data = await dispatch(getfileFOlder({ path: newItemState.parentPath })).unwrap();
            updateTreeState(newItemState.parentPath, data.children || []);
            
            // If it's a file, open it
            if (newItemState.type === "file") {
                const newFilePath = `${newItemState.parentPath}/${name}`.replace(/\/+/g, "/");
                const fullFile = await dispatch(getfileFOlder({ path: newFilePath })).unwrap();
                setOpenTabs(prev => [...prev, fullFile]);
                setActivePath(newFilePath);
            }
        } catch (error: any) {
            addToast({ description: "Creation failed: " + error, color: "danger" });
            throw error;
        } finally {
            if (!newItemState) return; // Already handled
            setNewItemState(null);
        }
    };

    const handleDirtyChange = (isDirty: boolean) => {
        if (!activePath) return;
        setDirtyFiles(prev => {
            const next = new Set(prev);
            if (isDirty) next.add(activePath);
            else next.delete(activePath);
            return next;
        });
    };

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('FileEditorTheme', newTheme);
    };

    const handleToggleAutosave = () => {
        setAutosave(!autosave);
        localStorage.setItem('FileEditorAutosave', (!autosave).toString());
    };

    return (
        <div className={`flex flex-col h-screen w-full overflow-hidden font-sans ${theme === 'light' ? 'bg-white text-slate-800' : 'bg-slate-950 text-slate-300'}`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-2 border-b z-10 ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="light" size="sm" className="md:hidden" onPress={openSidebarDrawer}>
                        <Icon icon="mdi:menu" width={20} />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:folder-outline" className="text-brand" width={18} />
                        <span className={`text-xs font-semibold tracking-wide uppercase ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Workspace</span>
                        <span className="text-slate-600">/</span>
                        <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{initialName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
     
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Desktop Sidebar */}
                <div 
                    className={`hidden md:flex flex-col shrink-0 border-r overflow-hidden ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}
                    style={{ width: `${sidebarWidth}px` }}
                >
                    <div className="p-3 border-b flex items-center justify-between sticky top-0 z-10 bg-inherit">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Explorer</span>
                        <div className='flex items-center gap-1.5'>
                            <button 
                                onClick={() => handleNewItem("file")}
                                className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                                title="New File"
                            >
                                <Icon icon="lucide:file-plus" width={14} />
                            </button>
                            <button 
                                onClick={() => handleNewItem("folder")}
                                className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                                title="New Folder"
                            >
                                <Icon icon="lucide:folder-plus" width={14} />
                            </button>
                            <button 
                                onClick={() => loadFolder(initialPath)}
                                className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                                title="Refresh"
                            >
                                <Icon icon="mdi:refresh" width={14} />
                            </button>
                            <Popover
            classNames={{
              base: `${theme == 'light' ? 'bg-white' : 'bg-[#1e1e1e]'} shadow-none`,
              content: ` rounded-md ${theme == 'light' ? 'bg-white border-lightgrey text-black' : 'bg-slate-900 text-white border-[#333]'} shadow-none border `,
            }}
          >
            <PopoverTrigger>
              <span className=' cursor-pointer p-0.5'>
                <Icon icon={'lucide:settings-2'} width={16} />
              </span>
            </PopoverTrigger>
            <PopoverContent>
              <Listbox
                aria-label="File Actions"
                className="p-0"
                itemClasses={{
                  base: "p-2 rounded-none h-9 text-sm data-[hover=true]:bg-default-100/70",
                }}
              >
         
                <ListboxItem
                  key="theme-wrapper"
                  className="p-0"
                  textValue="Change Theme"
                >
                  <Popover placement="right-start" offset={10}>
                    <PopoverTrigger>
                      <div className="flex items-center gap-2 w-full h-full px-2 py-1">
                        <Icon icon="lucide:palette" width={14} />
                        <span className="flex-1 ">Change theme</span>
                        <Icon icon="lucide:chevron-right" width={14} />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className={`${theme === 'light' ? 'bg-white border-lightgrey text-black' : 'bg-slate-900 text-white border-[#333]'} p-1 border shadow-xl`}>
                      <Listbox
                        aria-label="Theme selection"
                      onSelectionChange={(keys) => {
    // Convert the Set to an array and get the first item
    const selectedValue = Array.from(keys)[0] as 'light' | 'vs-dark';
    
    if (selectedValue) {
      handleThemeChange(selectedValue);
    }
  }}
                        selectedKeys={[theme]}
                        selectionMode="single"
                        itemClasses={{
                          base: "p-2 rounded-none h-9 text-sm data-[hover=true]:bg-default-100/70",
                        }}
                      >
                        <ListboxItem className='px-6' key="vs-dark" classNames={{base :'hover:bg-red-200'}}  >
                          VS Dark
                        </ListboxItem>
                        <ListboxItem className='px-6' key="light" >
                          Light
                        </ListboxItem>
                        {/* You can easily add more themes here in the future */}
                      </Listbox>
                    </PopoverContent>
                  </Popover>
                </ListboxItem>

                <ListboxItem
                  key="autosave"
                  startContent={<Icon icon="lucide:save" width={14} />}
                  onPress={handleToggleAutosave}
                >
                  {autosave ? 'Disable' : 'Enable'} Autosave
                </ListboxItem>
              </Listbox>
            </PopoverContent>

          </Popover>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                        {fileTree ? (
                            <FileTreeItem 
                                item={fileTree} 
                                onSelect={handleFileOpen} 
                                onExpand={loadFolder} 
                                expandedPaths={expandedPaths} 
                                selectedPath={selectedPath}
                                onSetSelected={setSelectedPath}
                                newItemState={newItemState}
                                onCancelNewItem={() => setNewItemState(null)}
                                onCreateNewItem={handleCreate}
                            />
                        ) : (
                            <div className="p-4 flex justify-center"><Icon icon="svg-spinners:ring-resize" /></div>
                        )}
                    </div>
                </div>

                {/* Resize Handle */}
                <div 
                    onMouseDown={startResizing}
                    className={`hidden md:block w-1 cursor-col-resize transition-colors hover:bg-blue-500/50 z-20 ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}
                />

                {/* Editor Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    
                    {/* Tabs Bar */}
                    <div className={`flex items-center overflow-x-auto h-10 shrink-0 select-none no-scrollbar border-b ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                        {openTabs.map(tab => (
                            <div 
                                key={tab.path}
                                onClick={() => {
                                    setActivePath(tab.path);
                                }}
                                className={`flex items-center gap-2 px-3 h-full cursor-pointer text-xs border-r transition-all min-w-30 max-w-50 group ${
                                    activePath === tab.path 
                                        ? (theme === 'light' ? 'bg-white font-medium border-t-2 border-t-blue-500' : 'bg-slate-950 font-medium border-t-2 border-t-blue-600') 
                                        : (theme === 'light' ? 'hover:bg-white/50 text-slate-500' : 'hover:bg-slate-800 text-slate-500')
                                }`}
                            >
                                <Icon icon={getFileIcon(tab)} className={theme === 'light' ? "text-slate-400" : "text-brand"} />
                                <span className="truncate flex-1">{tab.name}</span>
                                {dirtyFiles.has(tab.path) ? (
                                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:hidden" />
                                ) : null}
                                <Icon 
                                    icon="mdi:close" 
                                    className={`opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-800 p-0.5 rounded ${dirtyFiles.has(tab.path) ? 'hidden group-hover:block' : ''}`} 
                                    onClick={(e) => handleCloseTab(tab.path, e)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Active Editor */}
                    <div className="flex-1 relative overflow-hidden">
                        {activePath ? (
                            <FileEditorComponent
                                key={activePath}
                                file={openTabs.find(t => t.path === activePath)!}
                                onDirtyChange={handleDirtyChange}
                                theme={theme}
                                autoSave={autosave}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                                <Icon icon="mdi:file-code-outline" width={64} />
                                <div className="text-center">
                                    <p className="text-sm font-medium">No file open</p>
                                    <p className="text-xs">Select a file from the sidebar to edit</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Drawer */}
            <Drawer isOpen={isSidebarDrawerOpen} onOpenChange={onSidebarDrawerChange} placement="left" size="xs" className={`${theme === 'light' ? 'bg-white' : 'bg-slate-900 border-r border-slate-800'}`}>
                <DrawerContent>
                    {(onClose) => (
                        <div className="flex flex-col h-full pt-6">
                            <div className="px-4 py-3 border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-500">
                                Project Explorer
                            </div>
                            <div className="flex-1 overflow-y-auto py-2">
                                {fileTree && (
                                    <FileTreeItem 
                                        item={fileTree} 
                                        onSelect={(it) => { handleFileOpen(it); onClose(); }} 
                                        onExpand={loadFolder} 
                                        expandedPaths={expandedPaths} 
                                        selectedPath={selectedPath}
                                        onSetSelected={setSelectedPath}
                                        newItemState={newItemState}
                                        onCancelNewItem={() => setNewItemState(null)}
                                        onCreateNewItem={handleCreate}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>

            {/* Discard Changes Modal */}
            <Modal isOpen={isDiscardModalOpen} onOpenChange={onDiscardModalChange} placement="center" size="sm">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-2 items-center">
                                <Icon icon="mdi:alert-circle-outline" className="text-warning" width={22} />
                                <span>Unsaved Changes</span>
                            </ModalHeader>
                             <ModalBody className="py-4 text-sm">
                                You have unsaved changes in <span className="font-semibold">{openTabs.find(t => t.path === (pendingClosePath || activePath))?.name}</span>. Discarding will permanently lose these changes.
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" size="sm" onPress={() => {
                                    setPendingClosePath(null);
                                    onClose();
                                }}>Cancel</Button>
                                <Button color="danger" size="sm" onPress={() => {
                                    if (pendingClosePath) {
                                        finalizeCloseTab(pendingClosePath);
                                    }
                                    onClose();
                                }}>Discard</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        
        </div>
    );
};

export default FileEditorPage;
