import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useCallback,  } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { getApacheLog, getNginxLog } from '../../redux/slice/websiteSlice';
import LogTerminalModal from './LogTerminal';

// Minimal List Item Component (LogTypeListItem) - kept for list view
interface LogListItemProps {
  logType: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'danger';
  onSelect: (logType: string) => void;
}

const LogTypeListItem: React.FC<LogListItemProps> = ({ 
  logType, 
  title, 
  description, 
  icon, 
  color, 
  onSelect 
}) => {
  const iconColorClass = color === 'primary' ? 'text-primary-500' : 'text-danger-500';

  return (
    <div 
      key={logType}
      className="flex flex-col sm:flex-row justify-between sm:items-center pt-4 sm:py-4 px-6 border-b border-default-100 last:border-b-0 hover:bg-default-50/50 transition-colors cursor-pointer"
      onClick={() => onSelect(logType)}
    >
      <div className="flex justify-start sm:items-center gap-4 flex-1">
        <div className={`p-2 rounded-lg ${iconColorClass} bg-default-100/50`}>
          <Icon icon={icon} width={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-default-800">
            {title}
          </h3>
          <p className="text-default-700 text-xs mt-0.5">
            {description}
          </p>
        </div>
      </div>
      <div className='flex justify-end  py-2 mt-2'>
        <Button 
            size="sm"
            variant="flat"
            color={color}
            onPress={() => onSelect(logType)}
            endContent={<Icon icon="lucide:arrow-right" width={16} />}
            className='min-w-25 '
        >
            View
        </Button>
      </div>
    </div>
  );
};


const Serverlogs = () => {
 
  const dispatch = useAppDispatch();
  const [selectedLogType, setSelectedLogType] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const selectedwebsite = useAppSelector((state) => state.website.selectedWebsite);

  // Simplified website object for terminal display
  const websiteName = selectedwebsite?.website?.name || "Your Website";

type LogData = {
  logType: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'danger'; // Enforce the strict union type
}

const logCardData: LogData[] = [
  {
    logType: "nginx-access",
    title: "NGINX Access",
    description: "Successful and unsuccessful requests.",
    color: "primary",
    icon: "lucide:file-text",
  },
  {
    logType: "nginx-error",
    title: "NGINX Error",
    description: "Diagnostic information and errors.",
    color: "danger",
    icon: "lucide:alert-triangle",
  },

  ...(selectedwebsite?.website?.stack_type === "nginx+apache"
    ? ([
        {
          logType: "apache-access",
          title: "Apache Access",
          description: "Successful and unsuccessful requests.",
          color: "primary",
          icon: "lucide:file-text",
        },
        {
          logType: "apache-error",
          title: "Apache Error",
          description: "Diagnostic information and errors.",
          color: "danger",
          icon: "lucide:alert-triangle",
        },
      ] as LogData[])
    : []),
];
  // Extract minimal data for LogTerminal tabs
  const logTypeTabInfo = logCardData.map(d => ({ logType: d.logType, title: d.title }));
  
  // Handler to open the modal
  const handleSelectLog = (logType: string) => {
    setSelectedLogType(logType);
    setIsModalOpen(true);
  }

  // Handler to close the modal
  const handleCloseModal = (open: boolean) => {
    if (!open) {
        setIsModalOpen(false);
        setSelectedLogType(null); // Clear selected log type on close
    }
  }

  // Fetch function kept here as it relies on route params
  const fetchlogs = useCallback(async (scroll_count: number) => {
    if (!selectedLogType) return;

    try {
        let logName: 'access' | 'error' = selectedLogType.includes('error') ? 'error' : 'access';
        let isApache = selectedLogType.includes('apache');
        
        const thunkPayload = {
            scroll_count: scroll_count, 
            log: logName,
        };

        if (isApache) {
             await dispatch(getApacheLog(thunkPayload));
        } else {
             await dispatch(getNginxLog(thunkPayload));
        }

    } catch (error) {
        console.log("Log fetch failed:", error);
    }
  }, [selectedLogType, dispatch]);

  return (
    <div className='max-h-[90vh] lg:p-2 overflow-y-auto scrollbar-hide'>
      <p className='text-xl md:text-2xl lg:text-3xl'>Welcome to
        <span className='ml-1 font-bold text-brand'>
          Web Server Log
        </span>
      </p>
      <p className='mt-1 md:mt-2 lg:mt-2 text-xs md:text-sm lg:text-md text-gray-500'>
        View real-time and historical logs for your server.
      </p>

      <div className='mt-3 lg:mt-6 w-full'>
        <Card className='w-full shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-3 md:px-6 py-2 md:py-4 bg-brand'>
            <span className='font-bold text-white text-sm md:text-md lg:text-lg'>Log Viewer</span>
          </div>
          
          <div className='divide-y divide-default-100'>
            {logCardData.map((data) => (
              <LogTypeListItem
                key={data.logType}
                {...data}
                onSelect={handleSelectLog} 
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Log Terminal Modal */}
      <LogTerminalModal
        isOpen={isModalOpen}
        onOpenChange={handleCloseModal}
        selectedLogType={selectedLogType}
        setSelectedLogType={setSelectedLogType}
        logTypeTabInfo={logTypeTabInfo}
        websiteName={websiteName}
        fetchlogs={fetchlogs}
      />
    </div>
  )
}

export default Serverlogs;