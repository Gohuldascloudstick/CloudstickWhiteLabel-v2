import { Icon } from "@iconify/react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useState, useRef } from "react";
import { useAppDispatch } from "../../redux/hook";
import { UploadFile } from "../../redux/slice/FileManagerSlice";

interface UploadModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  currentPath: string;
}

const UploadModal = ({ isOpen, onOpenChange, currentPath }: UploadModalProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("path", currentPath);
      formData.append("file", file);
      await dispatch(UploadFile(formData)).unwrap();
      onOpenChange();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="gap-2 items-center">
              <Icon icon="mdi:upload-outline" className="text-primary" width={24} />
              Upload File
            </ModalHeader>
            <ModalBody>
              <div 
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon icon="mdi:cloud-upload-outline" className="text-slate-400" width={48} />
                <p className="text-sm font-medium mt-2">{file ? file.name : "Click to select or drag and drop"}</p>
                <p className="text-xs text-slate-400 mt-1">Maximum file size: 100MB</p>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>Cancel</Button>
              <Button color="primary" isLoading={loading} isDisabled={!file} onPress={handleUpload}>
                Upload
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;
