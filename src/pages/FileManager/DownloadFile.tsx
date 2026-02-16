import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/hook';
import { getfileFOlder } from '../../../redux/slice/FIlemanagerSlice';
import { FileManagerItem } from '../../../utils/interfaces';
import { Button, addToast } from '@heroui/react';
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

interface DownloadFileProps {
    name: string;
    onClose: () => void;
    path: string;
}

const DownloadFile: React.FC<DownloadFileProps> = ({ name, onClose, path }) => {
    const { webid, id: serverId } = useParams();
    const dispatch = useAppDispatch();

    const [status, setStatus] = useState<'idle' | 'downloading' | 'success'>('idle');

    const downloadFileAction = useCallback(async () => {
        setStatus('downloading');
        try {
            const result: FileManagerItem = await dispatch(
                getfileFOlder({ serverId, webid: Number(webid), path })
            ).unwrap();

            // Handle the file blob creation
            const textContent = result?.content || "";
            const blob = new Blob([textContent], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            // Show Success Animation
            setStatus('success');

            // Auto close after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            addToast({ description: 'Failed to download file.', color: 'danger' });
            onClose(); // Close on error so user isn't stuck
        }
    }, [dispatch, serverId, webid, path, name, onClose]);

    useEffect(() => {
        downloadFileAction();
    }, [downloadFileAction]);

    return (
        <div className="flex flex-col items-center justify-center p-6 min-h-[280px]">
            <AnimatePresence mode="wait">
                {status === 'downloading' ? (
                    <motion.div
                        key="downloading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="relative mb-4">
                            <Icon 
                                icon="line-md:downloading-loop" 
                                width={64} 
                                className="text-primary animate-pulse" 
                            />
                  
                        </div>
                        <h3 className="text-lg font-semibold">Downloading...</h3>
                        <p className="text-xs text-default-500 mt-1 truncate max-w-[250px]">
                            {name}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="bg-success/10 p-4 rounded-full mb-4">
                            <Icon
                                icon="material-symbols-light:sync-saved-locally-outline-rounded"
                                width={64}
                                className="text-success"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-success">Download Complete</h3>
                        <p className="text-xs text-default-500 mt-1">
                            Your file is ready.
                        </p>
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            className="h-1 bg-success/20 rounded-full mt-6 overflow-hidden"
                        >
                            <motion.div 
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 1 }}
                                className="h-full bg-success"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DownloadFile;