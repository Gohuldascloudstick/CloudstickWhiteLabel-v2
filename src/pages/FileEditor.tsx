import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, addToast, Spinner, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { getFileOrDirectory, saveFileChange, clearFileContent } from "../redux/slice/FileManagerSlice";
import { getFileIcon, formatStorage } from "../helpperFunctions/ConvertionFunction";
import type { FileManagerItem } from "../utils/interfaces";

const FileExplorerItem = ({ item, level, onFileClick }: { item: FileManagerItem; level: number; onFileClick: (item: FileManagerItem) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.is_dir) {
      setIsOpen(!isOpen);
      if (!isOpen && (!item.children || item.children.length === 0)) {
        dispatch(getFileOrDirectory(item.path));
      }
    } else {
      onFileClick(item);
    }
  };

  return (
    <div>
      <div 
        className="flex items-center gap-2 px-2 py-1 hover:bg-slate-800 cursor-pointer rounded text-sm transition-colors"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleToggle}
      >
        <Icon 
          icon={item.is_dir ? (isOpen ? "mdi:chevron-down" : "mdi:chevron-right") : getFileIcon(item)} 
          className={item.is_dir ? "text-slate-500" : "text-teal-400"}
          width={16}
        />
        <span className="truncate">{item.name}</span>
      </div>
      {isOpen && item.children && (
        <div className="flex flex-col">
          {item.children.map((child, idx) => (
            <FileExplorerItem key={idx} item={child} level={level + 1} onFileClick={onFileClick} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileEditor = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { TheFiles, loading } = useAppSelector(state => state.fileManager);
  
  const rootPath = searchParams.get("path") || "";
  const initialName = searchParams.get("name") || "";
  const isDirEntry = searchParams.get("isDir") === "true";
  
  const [activeFile, setActiveFile] = useState<FileManagerItem | null>(null);
  const [content, setContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (rootPath) {
      dispatch(getFileOrDirectory(rootPath));
    }
    return () => {
      dispatch(clearFileContent());
    };
  }, [rootPath]);

  useEffect(() => {
    // If we entered as a file, set it as active
    if (!isDirEntry && TheFiles && !activeFile) {
      setActiveFile(TheFiles);
      setContent(TheFiles.content || "");
    }
  }, [TheFiles, isDirEntry]);

  const handleFileClick = (item: FileManagerItem) => {
    if (!item.is_dir) {
      dispatch(getFileOrDirectory(item.path))
        .unwrap()
        .then((res) => {
          setActiveFile(res.data);
          setContent(res.data.content || "");
        });
    }
  };

  const handleSave = () => {
    if (!activeFile) return;
    dispatch(saveFileChange({ path: activeFile.path, content }))
      .unwrap()
      .then(() => {
        addToast({ title: "File saved successfully", color: "success" });
      })
      .catch(err => addToast({ title: "Save failed", description: err, color: "danger" }));
  };

  if (loading && !TheFiles) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <Spinner size="lg" color="white" label="Initializing Workspace..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-300 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="light" size="sm" onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Icon icon={isSidebarOpen ? "mdi:menu-open" : "mdi:menu"} width={20} />
          </Button>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:folder-outline" className="text-teal-500" width={18} />
            <span className="text-sm font-semibold tracking-wide uppercase text-slate-400">Workspace</span>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-medium text-slate-200">{initialName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {activeFile && (
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-xs font-bold text-slate-200">{activeFile.name}</span>
              <span className="text-[10px] font-mono text-slate-500">{activeFile.path}</span>
            </div>
          )}
          <Button 
            size="sm" 
            variant="flat" 
            color="default" 
            className="text-slate-300 hover:bg-slate-800"
            onPress={() => window.close()}
          >
            Close
          </Button>
          <Button 
            size="sm" 
            color="primary" 
            onPress={handleSave}
            isDisabled={!activeFile}
            startContent={<Icon icon="mdi:content-save-outline" />}
            className="shadow-lg shadow-blue-900/20"
          >
            Save
          </Button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Explorer */}
        {isSidebarOpen && (
          <div className="w-64 md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto scrollbar-hide">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Explorer</span>
              <Icon icon="mdi:refresh" className="text-slate-500 hover:text-white cursor-pointer" onClick={() => dispatch(getFileOrDirectory(rootPath))} />
            </div>
            <div className="p-2">
              {TheFiles && (
                isDirEntry ? (
                  TheFiles.children?.map((child, idx) => (
                    <FileExplorerItem key={idx} item={child} level={0} onFileClick={handleFileClick} />
                  ))
                ) : (
                  <FileExplorerItem item={TheFiles} level={0} onFileClick={handleFileClick} />
                )
              )}
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-slate-950 relative">
          {activeFile ? (
            <>
              {/* Tab Bar Sim */}
              <div className="flex bg-slate-900 border-b border-slate-800 h-9">
                <div className="flex items-center gap-2 px-4 bg-slate-950 border-r border-slate-800 text-xs text-slate-200 border-t-2 border-t-blue-500">
                  <Icon icon={getFileIcon(activeFile)} className="text-teal-400" />
                  {activeFile.name}
                  <Icon icon="mdi:close" width={12} className="ml-2 cursor-pointer hover:bg-slate-800 p-0.5 rounded" onClick={() => setActiveFile(null)} />
                </div>
              </div>
              
              <div className="flex-1 relative group">
                <textarea
                  className="absolute inset-0 w-full h-full p-6 bg-slate-950 text-slate-200 font-mono text-[13px] border-none outline-none resize-none leading-relaxed selection:bg-blue-500/30"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  spellCheck={false}
                  autoFocus
                />
                {/* Stats Overlay */}
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 bg-slate-900/50 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  {activeFile.permission} | {formatStorage(activeFile.size, "B")}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4">
              <Icon icon="mdi:file-code-outline" width={64} className="opacity-20" />
              <div className="text-center">
                <p className="text-sm font-medium">No file selected</p>
                <p className="text-xs">Select a file from the explorer to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Status Bar */}
      <div className="h-6 bg-blue-600 text-white flex items-center justify-between px-3 text-[10px] font-medium shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Icon icon="mdi:remote" width={12} />
            <span>Cloudstick Remote</span>
          </div>
          {activeFile && (
            <div className="flex items-center gap-1">
              <Icon icon="mdi:checkbox-marked-circle-outline" width={12} />
              <span>{activeFile.permission}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>TypeScript JSX</span>
          <div className="flex items-center gap-1">
            <Icon icon="mdi:bell-outline" width={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileEditor;
