import { useCallback, useEffect, useRef, useState } from "react";
import { FileManagerItem } from "../../../utils/interfaces";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "@heroui/react";
import { getFileIcon } from "../../../helpperFunctions/ConvertionFunction";
// import { useAppDispatch } from "../../../redux/hook"; // Not needed here

interface FileGridItemProps {
    item: FileManagerItem;
    handleFolderClick: (item: FileManagerItem) => void;
    // onOpen is now used for the modal containing actions
    onOpen: (file: FileManagerItem) => void; 
    // editmode is now primarily handled by the parent modal, but can still be passed for visual cues if needed
    editmode?: boolean, 
    // handelRename, SetNew_name, new_name are no longer handled in this component
    handelRename: () => void;
    SetNew_name: (name: string) => void
    new_name: string;
    selectedItem: FileManagerItem | null;
    webid:string;
    id:string;
}

const LONG_PRESS_DURATION = 300; // milliseconds

const FileGridItem: React.FC<FileGridItemProps> = ({ item, handleFolderClick, onOpen,webid ,id }) => {
    // Note: renameInputRef, handelRename, SetNew_name, new_name, selectedItem are now unused in this component
    
    const [pressTimer, setPressTimer] = useState<number | null>(null);
    const [isLongPressTriggered, setIsLongPressTriggered] = useState(false);

    // This handles long press for the action modal
    const handlePressStart = useCallback((item: FileManagerItem) => {
        // Reset on start
        setIsLongPressTriggered(false); 

        const timer = window.setTimeout(() => {
            setIsLongPressTriggered(true); 
            onOpen(item); // Open the modal on long press
        }, LONG_PRESS_DURATION);
        setPressTimer(timer);
    }, [onOpen]);

    // This handles tap (short press) for navigation
    const handlePressEnd = useCallback(() => {
        // Clear the timer immediately
        if (pressTimer !== null) {
            window.clearTimeout(pressTimer);
            setPressTimer(null);
        }

        // If long press was NOT triggered, it was a tap -> navigate
        if (!isLongPressTriggered) {
             if (!item.is_dir) {
                    console.log('yessssbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
                    
                                             const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                            window.open(editorUrl, '_blank', 'noreferrer');
                    return;                                                            
                }
            handleFolderClick(item); 
        }
    }, [pressTimer, isLongPressTriggered, item, handleFolderClick]);

    const handleTouchCancel = useCallback(() => {
        if (pressTimer !== null) {
            window.clearTimeout(pressTimer);
            setPressTimer(null);
        }
        setIsLongPressTriggered(false);
    }, [pressTimer]);


    // The touch handlers are applied to the Card component
    return (
        <Card
            className="flex flex-col items-center justify-start cursor-pointer shadow-none rounded-lg hover:bg-default-100 dark:hover:bg-content1/20 transition-colors group relative p-2"
            onTouchStart={(e) => {
                e.preventDefault()
                // Start the timer for long press
                handlePressStart(item) 
            }}
            onTouchEnd={(e) => {
                e.preventDefault()
                // Check if it was a tap or long press
                handlePressEnd()
            }}
            onTouchCancel={handleTouchCancel} 
            title={item.name}
            // Add desktop click handler for consistency
            onClick={() => {
                if (!item.is_dir) {
                    console.log('yessssbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
                    
                                             const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${id}`;
                                                            window.open(editorUrl, '_blank', 'noreferrer');
                                                             return;    
                                                                                
                }
                handleFolderClick(item)}} 
            onContextMenu={(e) => {
                e.preventDefault();
                onOpen(item);
            }}
        >
            <Icon
                icon={getFileIcon(item)}
                className={`text-5xl font-thin ${item.is_dir ? 'text-primary-500' : 'text-default-500'}`}
            />
            <span className="text-xs mt-1 text-center w-full break-words font-medium line-clamp-2">
                {item.name}
            </span>
        </Card>
    );
};

export default FileGridItem