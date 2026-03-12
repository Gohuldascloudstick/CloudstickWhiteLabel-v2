import { Icon } from "@iconify/react";
import { Card, Input } from "@heroui/react";
import { getFileIcon } from "../../helpperFunctions/ConvertionFunction";
import type { FileManagerItem } from "../../utils/interfaces";

interface FileGridItemProps {
  item: FileManagerItem;
  handleFolderClick: (item: FileManagerItem) => void;
  onOpen: (item: FileManagerItem) => void;
  editmode: boolean;
  handelRename: () => void;
  SetNew_name: (name: string) => void;
  new_name: string;
  selectedItem: FileManagerItem | null;
}

const FileGridItem = ({ 
  item, 
  handleFolderClick, 
  onOpen, 
  editmode, 
  handelRename, 
  SetNew_name, 
  new_name, 
  selectedItem,
}: FileGridItemProps) => {
  return (
    <Card 
      isPressable 
      className={`p-3 flex flex-col items-center justify-center gap-2 border-none shadow-none hover:bg-default-100 ${selectedItem?.path === item.path ? 'bg-default-100' : 'bg-transparent'}`}
      onPress={() => item.is_dir ? handleFolderClick(item) : onOpen(item)}
      onContextMenu={(e) => {
        e.preventDefault();
        onOpen(item);
      }}
    >
      <Icon 
        icon={getFileIcon(item)} 
        className={item.is_dir ? "text-amber-400" : "text-slate-400"} 
        width={48} 
      />
      <div className="w-full text-center">
        {editmode && selectedItem?.path === item.path ? (
          <Input 
            size="sm" 
            variant="bordered" 
            value={new_name} 
            onChange={(e) => SetNew_name(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handelRename()}
            autoFocus
          />
        ) : (
          <p className="text-xs font-medium truncate w-full px-1">{item.name}</p>
        )}
      </div>
    </Card>
  );
};

export default FileGridItem;
