import { Icon } from "@iconify/react";
import { Button, Input, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { ExtractFile } from "../../redux/slice/FileManagerSlice";
import type { FileManagerItem } from "../../utils/interfaces";

interface ExtractProps {
  item: FileManagerItem;
  onClose: () => void;
  parentPath: string;
}

const Extract = ({ item, onClose, parentPath }: ExtractProps) => {
  const [loading, setLoading] = useState(false);
  const [targetPath, setTargetPath] = useState(parentPath);
  const dispatch = useAppDispatch();

  const handleExtract = async () => {
    setLoading(true);
    try {
      await dispatch(ExtractFile({ 
        path: item.path, 
        target: targetPath 
      })).unwrap();
      onClose();
    } catch (error) {
      console.error("Extraction failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ModalHeader className="gap-2 items-center">
        <Icon icon="mdi:folder-zip-outline" className="text-primary" width={24} />
        Extract Archive
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500">
            Extract <span className="font-bold text-slate-700">{item.name}</span> to:
          </p>
          <Input 
            label="Target Directory" 
            variant="bordered" 
            value={targetPath} 
            onValueChange={setTargetPath}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onPress={onClose}>Cancel</Button>
        <Button color="primary" isLoading={loading} onPress={handleExtract}>
          Extract
        </Button>
      </ModalFooter>
    </>
  );
};

export default Extract;
