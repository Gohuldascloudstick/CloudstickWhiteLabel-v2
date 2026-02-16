import React, { useState, useMemo } from 'react';
import { Button, Input, addToast, RadioGroup, Radio } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useParams } from 'react-router-dom'; // Assuming this hook
import type { FileManagerItem } from '../../utils/interfaces';
import { useAppDispatch } from '../../redux/hook';
import { CompressFile as CompressFileAction,getFileOrDirectory } from '../../redux/slice/FIlemanagerSlice';

// Define the available archive formats
type ArchiveFormat = 'zip' | 'tar' | 'gzip';

interface CompressFileProps {
    item: FileManagerItem;
    onClose: () => void;
    parentPath: string;
}

const archiveFormats: { key: ArchiveFormat, label: string, extension: string }[] = [
    { key: 'zip', label: '.zip', extension: '.zip' },
    { key: 'tar', label: '.tar', extension: '.tar' },
    { key: 'gzip', label: '.tar.gz', extension: '.tar.gz' },
];

const CompressFile: React.FC<CompressFileProps> = ({ item, onClose ,parentPath }) => {
    const { webid, id: serverId } = useParams();
    const dispatch = useAppDispatch();

    // --- Default Value Calculations ---
    const defaultArchiveName = useMemo(() => {
        const parts = item.name.split('.');
        if (parts.length > 1 && !item.is_dir) {
            parts.pop();
        }
        return parts.join('.');
    }, [item.name, item.is_dir]);

    const defaultParentPath = useMemo(() => {
        const path = item.path;
        if (item.is_dir) {
            return path.substring(0, path.lastIndexOf('/')) || '/';
        }
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        return parentPath.substring(0, parentPath.lastIndexOf('/')) || '/';
    }, [item.path, item.is_dir]);
    // ---------------------------------

    // --- State Management ---
    const [archiveName, setArchiveName] = useState(defaultArchiveName);
    const [destinationPath, setDestinationPath] = useState(parentPath);
    const [format, setFormat] = useState<ArchiveFormat>('zip');
    const [isLoading, setIsLoading] = useState(false);

    const selectedFormat = useMemo(() => {
        return archiveFormats.find(f => f.key === format);
    }, [format]);

    const fullArchiveFilename = `${archiveName}${selectedFormat?.extension || '.zip'}`;
    // -------------------------

    const handleCompress =async () => {
        if (!archiveName.trim() || !destinationPath.trim() || !selectedFormat) {
            addToast({ description: 'Please fill in all required fields.', color: 'danger' });
            return;
        }

        setIsLoading(true);

        const data = {
            path: parentPath, 
            name: item.name, 
            new_path: destinationPath, 
            new_name: fullArchiveFilename, 
        };
//format: selectedFormat.key,
        try {
 
            await dispatch(CompressFileAction({webid, serverid:serverId, data,action:selectedFormat.key})).unwrap()
            await dispatch(getFileOrDirectory({webid:Number(webid), serverId, path:destinationPath})).unwrap()
            addToast({ description: `File compressed successfully!`, color: 'success' });
            // ----------------------------
            onClose();

        } catch (error:any) {
         
            addToast({ description: error, color: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Consistent component size
        <div className="flex flex-col gap-4 w-full min-w-75 p-1">
            {/* Header */}
            <h2 className="text-lg font-semibold flex items-center gap-2 text-default-900 border-b pb-2 border-default-100">
                <Icon icon="lucide:package" width={20} className="text-primary-500" />
                Compress Item
            </h2>

            {/* Target Item Info - Compact */}
            <div className="bg-default-50 dark:bg-default-100/50 p-2 rounded-lg text-xs border border-default-200">
                <div className="text-default-700 font-semibold flex items-center gap-2">
                    <Icon icon={item.is_dir ? 'lucide:folder' : 'lucide:file'} width={14} />
                    Target: <span className="font-normal truncate" title={item.name}>{item.name}</span>
                </div>
                <div className="text-default-500 mt-1 truncate text-xs" title={item.path}>
                    Path: {item.path}
                </div>
            </div>

            {/* 1. Archive Name Input */}
            <Input
                label="Archive Name"
                placeholder="e.g., backup_files"
                value={archiveName}
                onChange={(e) => setArchiveName(e.target.value)}
                isRequired
                size='sm' 
                description={`Final file name: ${archiveName}${selectedFormat?.extension || '.zip'}`}
            />

            <div className="relative border border-default-300 rounded-lg p-4 pt-6">
                {/* Floating label to mimic <legend> */}
                <div className="absolute -top-3 left-3 bg-white dark:bg-default-50 px-1 text-sm font-medium text-default-700">
                    Archive format
                </div>
                <RadioGroup 
                    value={format} 
                    onValueChange={(value) => setFormat(value as ArchiveFormat)} 
                    orientation="horizontal"
                    className='gap-8 '
                >
                    {archiveFormats.map((f) => (
                        <Radio key={f.key} value={f.key} size='sm' className=' mr-4' >
                           {f.label}
                        </Radio>
                    ))}
                </RadioGroup>
            </div>
            
            
        
            <Input
                label="Destination Path"
                placeholder="/var/www/html"
                value={destinationPath}
                onChange={(e) => setDestinationPath(e.target.value)}
                isRequired
                size='sm' 
                
            />
            
            {/* Actions */}
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
                    onPress={handleCompress}
                    isLoading={isLoading}
                    isDisabled={isLoading || !archiveName.trim() || !destinationPath.trim()}
                    startContent={<Icon icon="lucide:archive" width={16} />}
                >
                    Compress
                </Button>
            </div>
        </div>
    );
};

export default CompressFile;