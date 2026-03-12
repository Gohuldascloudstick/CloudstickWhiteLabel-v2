import { Icon } from "@iconify/react";
import { Button, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { CompressFile as CompressThunk } from "../../redux/slice/FileManagerSlice";
import type { FileManagerItem } from "../../utils/interfaces";

interface CompressFileProps {
  item: FileManagerItem;
  onClose: () => void;
  parentPath: string;
}

const CompressFile = ({ item, onClose, parentPath }: CompressFileProps) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("zip");
  const dispatch = useAppDispatch();

  const handleCompress = async () => {
    setLoading(true);
    try {
      await dispatch(CompressThunk({ 
        path: parentPath, 
        name: item.name, 
        type 
      })).unwrap();
      onClose();
    } catch (error) {
      console.error("Compression failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ModalHeader className="gap-2 items-center">
        <Icon icon="mdi:zip-box-outline" className="text-primary" width={24} />
        Compress Item
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500">
            Create an archive for <span className="font-bold text-slate-700">{item.name}</span>
          </p>
          <Select 
            label="Archive Format" 
            variant="bordered" 
            defaultSelectedKeys={["zip"]}
            onSelectionChange={(keys) => setType(Array.from(keys)[0] as string)}
          >
            <SelectItem key="zip">ZIP Archive (.zip)</SelectItem>
            <SelectItem key="tar">TARball (.tar)</SelectItem>
            <SelectItem key="targz">TAR GZ (.tar.gz)</SelectItem>
          </Select>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onPress={onClose}>Cancel</Button>
        <Button color="primary" isLoading={loading} onPress={handleCompress}>
          Compress
        </Button>
      </ModalFooter>
    </>
  );
};

export default CompressFile;
