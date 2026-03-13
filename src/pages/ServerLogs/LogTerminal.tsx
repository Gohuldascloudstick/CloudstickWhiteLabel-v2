import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAppSelector } from '../../redux/hook';

const MAX_LOGS_PER_PAGE = 100;

interface LogTypeTabInfo {
    logType: string;
    title: string;
}

interface LogTerminalModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedLogType: string | null;
  setSelectedLogType: (logType: string | null) => void;
  logTypeTabInfo: LogTypeTabInfo[]; 
  websiteName: string;
  fetchlogs: (scroll_count: number) => void; 
}

const THEME = {
    modalBg: "rgba(0, 0, 0, 0.95)",
    terminalBg: "#000000",
    headerBg: "#1c1c1c",
    borderColor: "#444444"
};

const getErrorLogStyle = (log: string): string => {
    const lowerLog = log.toLowerCase();
    if (lowerLog.includes("fatal") || lowerLog.includes("critical")) {
         return "text-red-400 font-bold";
    }
    return "text-red-400"; 
};

const LogTerminalModal: React.FC<LogTerminalModalProps> = ({
  isOpen,
  onOpenChange,
  selectedLogType,
  setSelectedLogType,
  logTypeTabInfo,
  websiteName,
  fetchlogs,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);

  const currentLogData = useAppSelector((state) => {
    const { nginxLog, apchelog, apcheErrolog, nginxErrolog } = state.website;
    
    switch (selectedLogType) {
        case 'nginx-access':
            return nginxLog;
        case 'nginx-error':
            return nginxErrolog;
        case 'apache-access':
            return apchelog;
        case 'apache-error':
            return apcheErrolog;
        default:
            return { logs: [], total_count: 0 };
    }
  });

  const currentLogs = currentLogData?.logs || [];
  const totalCount = currentLogData?.total_count || 0;
  
  const displayedLogs = React.useMemo(() => [...currentLogs].reverse(), [currentLogs]);

  const currentTitle = logTypeTabInfo.find(d => d.logType === selectedLogType)?.title || 'Web Server Logs';

  const handleScroll = useCallback(() => {
    const container = terminalRef.current;
    if (!container) return;

    const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    
    if (isNearBottom && !isLoading && currentLogs.length < totalCount) {
        const pagesLoaded = Math.ceil(currentLogs.length / MAX_LOGS_PER_PAGE);
        const nextPage = pagesLoaded + 1;
        
        setIsLoading(true);
        setCurrentPage(nextPage);
        fetchlogs(nextPage); 
    }
  }, [currentLogs.length, totalCount, isLoading, fetchlogs]);

  useEffect(() => {
    const container = terminalRef.current;
    if (container) {
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (terminalRef.current) {
        terminalRef.current.scrollTop = 0; 
    }
    setCurrentPage(1);
    if (selectedLogType) {
        setIsLoading(true);
        fetchlogs(1); 
    }
  }, [selectedLogType]); 
  
  useEffect(() => {
    if (isLoading && currentLogs.length >= (currentPage - 1) * MAX_LOGS_PER_PAGE) {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }
  }, [currentLogs.length, isLoading, currentPage]);

  const handleLogTypeChange = (newLogType: string) => {
    setSelectedLogType(newLogType);
    setIsLoading(false);
  };
  
  const formatLog = (log: string, index: number) => {
    const logNumber = index + 1; 
    const accessLogRegex = /^(\S+) - - \[([^\]]+)\] "(.*?)" (\d+) (\d+|-)/;
    
    let logContent;
    const isErrorLog = selectedLogType?.includes('-error');

    const logPrefix = (
      <span className="text-cyan-600 text-[11px] w-8 text-right pt-1.5 select-none font-mono flex-shrink-0">
        {logNumber.toString().padStart(4, '0')}
      </span>
    );
    const separator = <span className="text-gray-700 mx-1 hidden lg:inline pt-1.5 font-bold">│</span>;
    
    if (isErrorLog) {
        const rawLogStyle = getErrorLogStyle(log);
        logContent = (
            <div className="flex flex-row font-mono text-sm w-full lg:items-start flex-wrap">
                <span className={`${rawLogStyle} flex-grow block py-1.5 break-words whitespace-pre-wrap`}>{log}</span>
            </div>
        );
    } else {
        const parts = log.match(accessLogRegex);
        if (parts) {
            const [fullMatch, ip, timestamp, request, statusCode, size] = parts;
            const fullRequest = request.trim();

            let statusColor = 'text-green-300';
            if (statusCode.startsWith('2')) statusColor = 'text-lime-300 font-bold'; 
            else if (statusCode.startsWith('3')) statusColor = 'text-cyan-400 font-bold';
            else if (statusCode.startsWith('4')) statusColor = 'text-orange-400 font-bold'; 
            else if (statusCode.startsWith('5')) statusColor = 'text-red-500 font-bold';
            
            const ipColor = 'text-yellow-400'; 
            const timestampColor = 'text-green-500'; 
            const requestColor = 'text-green-300'; 

            logContent = (
                <div className="flex flex-col lg:flex-row font-mono text-sm w-full lg:items-start flex-wrap">
                    <span className={`${ipColor} min-w-[130px] lg:w-[130px] flex-shrink-0 py-1.5 text-left`}>{ip}</span> 
                    {separator}
                    <span className={`${timestampColor} min-w-[170px] lg:w-[170px] flex-shrink-0 text-xs py-1.5 text-left`}>[{timestamp.split(' ')[0]}]</span> 
                    {separator}
                    <span className={`${requestColor} flex-grow min-w-[150px] mr-4 block whitespace-pre-wrap break-words py-1.5`}>{fullRequest}</span>
                    {separator}
                    <span className={`${statusColor} min-w-[40px] lg:w-[40px] flex-shrink-0 text-left py-1.5`}>{statusCode}</span>
                    {separator}
                    <span className="text-zinc-400 min-w-[60px] lg:w-[60px] flex-shrink-0 text-right py-1.5">{size === '-' ? '' : `${size}b`}</span>
                </div>
            );
        } else {
            logContent = (
                <div className="flex flex-row font-mono text-sm w-full lg:items-start flex-wrap">
                    <span className={`text-green-300 flex-grow block py-1.5 break-words whitespace-pre-wrap`}>{log}</span>
                </div>
            );
        }
    }

    return (
      <div key={index} className="flex gap-1 px-4 border-b border-white/5 hover:bg-white/5 items-start">
        {logPrefix}
        <span className="text-gray-700 hidden lg:inline pt-1.5 font-bold">│</span> 
        <div className="flex-grow min-w-0" style={{ overflow: 'hidden' }}>
            {logContent}
        </div>
      </div>
    );
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen && !!selectedLogType}
      onOpenChange={(open) => onOpenChange(open)}
      size="5xl"
      isDismissable={true}
      hideCloseButton={true}
      classNames={{
        base: `bg-transparent shadow-none w-full p-2 sm:p-4`, 
      }}
    >
      <ModalContent className="bg-transparent shadow-none">
        <div className="relative w-full">
            <div className="flex justify-start sm:justify-end mb-3 gap-1 z-50 overflow-x-auto pb-1">
                {logTypeTabInfo.map((tab) => (
                    <Button
                        key={tab.logType}
                        size="sm"
                        className={` ${tab.logType !== selectedLogType ? 'bg-default-200/60 dark:bg-default-300/80 text-default-500 dark:text-default-600' : 'bg-primary-500 text-white'} px-3 flex-shrink-0 text-[10px] sm:text-xs`}
                        variant={"solid" }
                        color={ "primary" }
                        onPress={() => handleLogTypeChange(tab.logType)}
                        startContent={<Icon icon="lucide:file-text" width={14} className=' hidden sm:flex' />}
                    >
                        {tab.title}
                    </Button>
                ))}
            </div>

            <div 
                className="w-full rounded-xl shadow-2xl overflow-hidden" 
                style={{ border: `1px solid ${THEME.borderColor}`, backgroundColor: THEME.terminalBg }}
            >
                <ModalHeader 
                    className="flex items-center justify-between p-2 py-3 relative border-b text-white"
                    style={{ backgroundColor: THEME.headerBg, borderColor: THEME.borderColor }}
                >
                    <div className='flex items-center gap-2'>
                         <div className="flex space-x-1 ml-4 items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-sm font-semibold ml-2 text-zinc-300">
                            {currentTitle} Logs  
                        </span>
                    </div>

                    <div className="flex gap-1.5 mr-2">
                        <Button
                            size="sm" variant="light" isIconOnly
                            onPress={() => { setSelectedLogType(null); onOpenChange(false); }}
                            className='w-5 h-5 min-w-5 p-0'
                        >
                            <Icon icon="lucide:x" width={16} className='text-zinc-400 hover:text-white'/>
                        </Button>
                    </div>
                </ModalHeader>

                <ModalBody className="p-0">
                    <div
                        ref={terminalRef}
                        className={`relative font-mono text-sm w-full h-[70vh] md:h-[450px] overflow-y-auto custom-scrollbar`}
                        style={{ backgroundColor: THEME.terminalBg }}
                    >
                        <div className="space-y-0">
                            {displayedLogs.length === 0 && !isLoading && (
                                <div className='w-full py-6 text-center text-default-600'>-- no logs -- </div>
                            )}
                            {displayedLogs.map((log, index) => formatLog(log, index))}
                        </div>
                        
                        <div className="sticky bottom-0 w-full flex justify-center p-2 bg-black/90 border-t border-white/5">
                            {isLoading && (
                                <div className="px-3 py-1 rounded text-cyan-400 text-xs flex items-center gap-2">
                                    <Icon icon="lucide:loader-2" className='w-3 h-3 animate-spin'/>
                                    Loading more logs...
                                </div>
                            )}
                        </div>
                    </div>
                </ModalBody>
            </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default LogTerminalModal;
