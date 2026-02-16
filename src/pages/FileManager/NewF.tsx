import React, { useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, addToast, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { useParams } from 'react-router-dom';
import { CreateItem, getFileOrDirectory } from '../../../redux/slice/FIlemanagerSlice';
import { FileManagerItem } from '../../../utils/interfaces';
import { is } from '@babel/types';

interface props {
    onClose: () => void;
    parentPath: string;
    is_dir: boolean;
}

const NewF: React.FC<props> = ({ onClose, parentPath, is_dir }) => {
    const dispatch = useAppDispatch();
    const { webid, id: serverId } = useParams();
    
    // Modal controls for File Overwrite Confirmation
    const { isOpen, onOpen, onOpenChange, onClose: closeModal } = useDisclosure();

    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // State to handle Input validation errors (specifically for existing folders)
    const [nameError, setNameError] = useState<string | null>(null);

    const parentFolder: FileManagerItem = useAppSelector((state) => state.FileManger.TheFiles);

    // --- Helpers ---

    const isFIleAlredyExist = (checkName: string) => {
        if (!parentFolder || !parentFolder.children) return false;
        const data = parentFolder.children.filter((item) => !item.is_dir && item.name === checkName);
        return data.length > 0;
    }

    const isFolderAlredyExist = (checkName: string) => {
        if (!parentFolder || !parentFolder.children) return false;
        const data = parentFolder.children.filter((item) => item.is_dir && item.name === checkName);
        return data.length > 0;
    }

    const encodeContent = (str: string) => {
        try {
            return btoa(str);
        } catch (e) {
            console.error("Encoding failed", e);
            return "";
        }
    };

    // --- Logic ---

    // 1. The Execution Function (Performs the API Call)
    const executeCreation = async () => {
        setIsLoading(true);

        try {
            const payload: any = {
                path: parentPath,
                name: name,
                is_dir: is_dir
            };

            // Encode content if it's a file and has content
            if (!is_dir && content.length > 0) {
                payload.content = content;
            }

            await dispatch(CreateItem({ 
                webid, 
                serverid: serverId, 
                data: payload 
            })).unwrap();

       const result =     await dispatch(getFileOrDirectory({ 
                webid: Number(webid), 
                serverId, 
                path: parentPath 
            })).unwrap();

            if(!is_dir){
              const item = result.message[0].children.find((it: FileManagerItem) => it.name === name && !it.is_dir);
            console.log(item);


           const editorUrl = `/FileEditor?path=${encodeURIComponent(item.path)}&name=${encodeURIComponent(item.name)}&webid=${webid}&serverId=${serverId}`;
                                                            window.open(editorUrl, '_blank', 'noreferrer');

            }

            addToast({ description: `${is_dir ? 'Folder' : 'File'} created successfully!`, color: 'success' });
            
            // Close everything
            if(isOpen) closeModal(); 
            onClose();

        } catch (error: any) {
            addToast({ description: error.message || "Failed to create item", color: 'danger' });
            // If it failed, close the modal so user can try again, but keep main form open
            if(isOpen) closeModal(); 
        } finally {
            setIsLoading(false);
        }
    };

    // 2. The Trigger Function (Validates input before execution)
    const handleCreateButtonPress = () => {
        // Reset previous errors
        setNameError(null);

        if (!name.trim()) {
            setNameError("Name is required");
            return;
        }

        // Scenario A: It's a Folder
        if (is_dir) {
            if (isFolderAlredyExist(name)) {
                // STOP: Show error on input
                setNameError(`A folder named "${name}" already exists in this directory.`);
                return; 
            }
            // Go ahead
            executeCreation();
        } 
        
        // Scenario B: It's a File
        else {
            if (isFIleAlredyExist(name)) {
                // STOP: Open Confirmation Modal
                onOpen();
                return;
            }
            // Go ahead
            executeCreation();
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full min-w-[300px] p-1">
            {/* Header */}
            <h2 className="text-lg font-semibold flex items-center gap-2 text-default-900 border-b pb-2 border-default-100">
                <Icon 
                    icon={is_dir ? "lucide:folder-plus" : "lucide:file-plus"} 
                    width={20} 
                    className="text-primary-500" 
                />
                Create New {is_dir ? 'Folder' : 'File'}
            </h2>

            {/* Path Info */}
            <div className="bg-default-50 dark:bg-default-100/50 p-2 rounded-lg text-xs border border-default-200">
                <div className="text-default-500 dark:text-default-700 truncate" title={parentPath}>
                    Location: {parentPath}
                </div>
            </div>

            {/* Name Input */}
            <Input
                label="Name"
                placeholder={is_dir ? "e.g., my_new_folder" : "e.g., script.txt"}
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError(null); // Clear error on typing
                }}
               onKeyDown={(e) => {
        // Check if the pressed key is in the forbidden list
        const forbiddenKeys = ['/', '\\', ' ', ':', '*', '?', '"', '<', '>', '|'];
        if (forbiddenKeys.includes(e.key)) {
            e.preventDefault();
        }
    }}
                isRequired
                size='sm'
                autoFocus
                className='text-default-700'
                classNames={{
                    label: 'dark:text-default-900',
                    inputWrapper: 'dark:border dark:border-default-400'
                }}
                // Error handling props
                isInvalid={!!nameError}
                errorMessage={nameError}
            />

            {/* Content Input - Only visible for Files */}
            {/* {!is_dir && (
                <div className='flex flex-col gap-1 min-h-56 '>
                    <Textarea
                        label="Content (Optional)"
                        placeholder="Type file content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        classNames={{
                            label: 'dark:text-default-900',
                            inputWrapper: 'dark:border dark:border-default-400'
                        }}
                        minRows={10}
                        maxRows={10}
                        size='sm'
                    />
                    <p className="text-[10px] text-default-400 dark:text-default-700 px-1">
                        Content will be encoded to Base64 before sending.
                    </p>
                </div>
            )} */}

            {/* Main Form Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-default-100">
                <Button
                    variant="flat"
                    size="sm"
                    onPress={onClose}
                    isDisabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    size="sm"
                    onPress={handleCreateButtonPress} // Calls validation first
                    isLoading={isLoading}
                    isDisabled={isLoading || !name.trim()}
                    startContent={!isLoading && <Icon icon="lucide:plus" width={16} />}
                >
                    Create
                </Button>
            </div>

            {/* Confirmation Modal for File Overwrite */}
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                // Used backdrop blur to clearly separate from the parent modal
                backdrop='transparent'
                size='lg'
                hideCloseButton
                isDismissable={false}
                classNames={{
                    base: "bg-white dark:bg-content1 border border-default-200 shadow-xl",
                }}
            >
                <ModalContent>
                    {(onCloseModal) => (
                        <>
                            {/* Standardized Header */}
                            <ModalHeader className="flex items-center gap-2 pb-2 border-b border-default-100">
                                <Icon icon="lucide:alert-circle" width={20} className="text-danger-500" />
                                <span className="text-medium font-semibold text-default-900">File Already Exists</span>
                            </ModalHeader>

                            {/* Standardized Body */}
                            <ModalBody className="py-4">
                                <div className="text-sm text-default-700">
                                    <p>
                                        A file named <span className="font-semibold text-default-900">"{name}"</span> is already in this directory.
                                    </p>
                                    <p className="mt-3 text-default-500 text-xs leading-relaxed">
                                        Continuing will overwrite the existing file content. This action cannot be undone.
                                    </p>
                                </div>
                            </ModalBody>

                            {/* Standardized Footer (Matches the main form) */}
                            <ModalFooter className="pt-2 border-t border-default-100">
                                <Button 
                                    variant="flat" 
                                    size="sm" 
                                    onPress={onCloseModal}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    color="danger" 
                                    size="sm"
                                    onPress={()=>{onCloseModal(); executeCreation()}} 
                                    isLoading={isLoading}
                                    startContent={<Icon icon="lucide:refresh-cw" width={14} />}
                                >
                                    Overwrite
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default NewF;