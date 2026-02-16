import React, { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import type { FileManagerItem } from '../../utils/interfaces';
import { getFileOrDirectory, UploadFile } from '../../redux/slice/FIlemanagerSlice';


interface UploadModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
  currentPath: string;
}

const UploadModal: React.FC<UploadModalProps> = ({
  onOpenChange,
  isOpen,
  currentPath,
}) => {
  const dispatch = useAppDispatch();
  const { webid, id: serverId } = useParams();

  const parentFolder: FileManagerItem = useAppSelector(
    (state) => state.FileManger.TheFiles
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /** Overwrite confirmation modal */
  const {
    isOpen: isConfirmOpen,
    onOpen: openConfirm,
    onClose: closeConfirm,
  } = useDisclosure();

  /* ---------- Helpers ---------- */

  const isFileAlreadyExists = (fileName: string) => {
    if (!parentFolder?.children) return false;
    return parentFolder.children.some(
      (item) => !item.is_dir && item.name === fileName
    );
  };

  const resetAndClose = () => {
    setFile(null);
    setShowSuccess(false);
    setIsDragging(false);
    onOpenChange();
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  /* ---------- Drag & Drop ---------- */

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const item = e.dataTransfer.items?.[0];
    const entry = (item as any)?.webkitGetAsEntry?.();

    if (!entry) {
      addToast({ description: "Unsupported item.", color: "warning" });
      return;
    }

    if (entry.isDirectory) {
      addToast({
        description: "Folders are not allowed. Upload a file only.",
        color: "warning",
      });
      return;
    }

    entry.file((f: File) => setFile(f));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  /* ---------- Upload Logic ---------- */

  const executeUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", currentPath);

      await dispatch(
        UploadFile({ webid, serverid: serverId, data: formData })
      ).unwrap();

      await dispatch(
        getFileOrDirectory({
          webid: Number(webid),
          serverId,
          path: currentPath,
        })
      ).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        resetAndClose()
      }, 2000);
    } catch (err: any) {
      addToast({ description: err || "Upload failed", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (!file) return;

    if (isFileAlreadyExists(file.name)) {
      openConfirm();
      return;
    }

    executeUpload();
  };

  /* ---------- UI ---------- */

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="md"
        classNames={{base:'dark:bg-slate-900'}}
      >
        <ModalContent>
  <ModalHeader className="flex flex-col gap-1">
              <div className='flex items-center gap-2'>
                <Icon icon="lucide:upload-cloud" className="text-primary" width={20} />
                <span className="text-lg font-semibold">Upload File</span>
              </div>
              <span className="text-xs font-normal text-default-500 dark:text-default-700">
                Destination: {currentPath}
              </span>
            </ModalHeader>

          <ModalBody className="py-6">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />

            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.div
                  key="drop"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 min-h-[240px]
                    flex flex-col items-center justify-center cursor-pointer
                    transition-all
                    ${isDragging
                      ? "border-primary bg-primary/5"
                      : "border-default-200 dark:border-default-500 hover:border-primary/50"}
                  `}
                >
                  {file ? (
                    <>
                      <Icon icon="lucide:file-text" width={40} className="text-primary mb-2" />
                      <p className="text-sm font-medium break-all">{file.name}</p>
                      <p className="text-xs text-default-400 dark:text-default-700">
                        {formatFileSize(file.size)}
                      </p>
                    </>
                  ) : (
                    <>
                    <div className="flex flex-col items-center pointer-events-none">
                    <Icon 
                      icon={isDragging ? "lucide:arrow-down-to-line" : "line-md:uploading-loop"} 
                      width={48} 
                      className={`mb-2 ${isDragging ? "text-primary" : "text-primary-500"}`}
                    />
                    <p className="text-sm font-medium text-default-600">
                      {isDragging ? "Drop file to upload" : "Click or Drag file here"}
                    </p>
                    {/* <p className="text-xs text-default-400 mt-1">
                      Max file size: 100MB (Files only)
                    </p> */}
                  </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10"
                >
                  <Icon
                    icon="lucide:check-circle"
                    width={56}
                    className="text-success mb-4"
                  />
                  <p className="text-lg font-semibold">Upload Successful</p>
                  <p className="text-xs text-default-500 mt-1">
                    {file?.name} uploaded successfully
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </ModalBody>

          <ModalFooter className="border-t border-default-100">
            {!showSuccess && (
              <>
                <Button variant="flat" size="sm" onPress={resetAndClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  isLoading={isLoading}
                  isDisabled={!file}
                  onPress={handleUploadClick}
                >
                  Upload
                </Button>
              </>
            ) }
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Overwrite Confirmation */}
      <Modal isOpen={isConfirmOpen} onClose={closeConfirm} isDismissable={false} size='lg'>
        <ModalContent>
          <ModalHeader className="border-b border-default-100">
            <Icon icon="lucide:alert-circle" className="text-danger" />
            <span className="ml-2 font-semibold">File Already Exists</span>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm">
              A file named <b>{file?.name}</b> already exists.
            </p>
            <p className="text-xs text-default-500 mt-2">
              Continuing will overwrite the existing file.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" size="sm" onPress={closeConfirm}>
              Cancel
            </Button>
            <Button
              color="danger"
              size="sm"
              onPress={() => {
                closeConfirm();
                executeUpload();
              }}
            >
              Overwrite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadModal;
