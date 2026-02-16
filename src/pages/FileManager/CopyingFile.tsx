import React, { useEffect, useState } from "react";
import { FileManagerItem } from "../../../utils/interfaces";
import { useAppSelector } from "../../../redux/hook";
import { useDispatch } from "react-redux";
import { ClearEroor } from "../../../redux/slice/FIlemanagerSlice";

interface CopyingFileProps {
  copyitem: FileManagerItem | null;
  destinationName: string;
  isComplete: boolean;
  setCopyLoader: (value: boolean) => void;
  retry: () => void;
  cancel: () => void;
}

const CopyingFile = ({
  copyitem,
  destinationName,
  isComplete,
  setCopyLoader,
  retry,
  cancel,
}: CopyingFileProps) => {
  const dispatch = useDispatch()
  const [progress, setProgress] = useState(0);

  const copyError = useAppSelector((state) => state.FileManger.TheCopyError);
  
  const handlecancel = () =>{
    dispatch(ClearEroor())
cancel()
  }

  // --- PROGRESS SIMULATION LOGIC ---
  useEffect(() => {
    let interval;
    if (isComplete) {
      setProgress(100);
  
        setCopyLoader(false);
      cancel()
     
      setCopyLoader(false);
    } else if (!copyError) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99.9) return 99.9;
          const increment = Math.random() * 0.1 + 0.1;
          return prev + increment;
        });
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isComplete, copyError]);

  // --- ERROR STATE UI (Compact for Modal) ---
  if (copyError) {
    return (
      // Removed h-full and extra borders/shadows for compact modal look
      <div className="flex flex-col w-full  ">
        
        {/* Error Header */}
        <div className="flex items-center space-x-2 text-red-700 mb-2">
           {/* Smaller Icon */}
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
           </svg>
           {/* Smaller Title Font */}
           <h3 className="text-sm font-semibold">
             Copy Operation Failed
           </h3>
        </div>
        
        {/* Error Message Details */}
        {/* Use a small, scrollable container for potentially large messages */}
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded  max-h-48 overflow-y-auto mb-3 ">
            <span className="font-medium text-wrap">Error:</span> {copyError}
        </div>

        {/* File Details (Small font) */}
        <div className="w-full text-xs text-default-600 mb-4">
           <span className="font-medium">File:</span> <span className="truncate">{copyitem?.name}</span>
        </div>

        {/* Action Buttons (Justify End / Right aligned) */}
        <div className="flex justify-end space-x-2">
          {/* Small Buttons (xsm size) */}
          <button
            onClick={handlecancel}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={retry}
            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // 2. PROGRESS STATE UI
  return (
    <>
      {/* HEADER SECTION (Progress details) */}
      <div className="w-full">
        <h4 className="text-default-800 font-normal text-sm leading-tight">
          {`Copying 1 item to ${destinationName}`}
        </h4>
        <div className="flex justify-between items-end mt-1">
             <span className="text-xl font-semibold text-default-900">
                {Math.floor(progress)}% complete
             </span>
        </div>
      </div>

      {/* WINDOWS PROGRESS BAR (Graph-style container) */}
      <div className="relative w-full h-24 border border-default-400 bg-default-50 overflow-hidden">
        
        {/* 1. GRID BACKGROUND LAYER (Omitted for brevity, but kept in place below) */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-50 pointer-events-none">
            <hr className="border-t border-default-400 w-full" />
            <hr className="border-t border-default-400 w-full" />
             <hr className="border-t border-default-400 w-full" />
              <hr className="border-t border-default-400 w-full" />
            <hr className="border-t border-default-400 w-full" />
        </div>
        <div className="absolute inset-0 flex justify-between opacity-50 pointer-events-none">
            <div className="border-l border-default-400 h-full w-1/12"></div>
             <div className="border-l border-default-400 h-full w-1/12"></div>
              <div className="border-l border-default-400 h-full w-1/12"></div>
               <div className="border-l border-default-400 h-full w-1/12"></div>
                <div className="border-l border-default-400 h-full w-1/12"></div>
                 <div className="border-l border-default-400 h-full w-1/12"></div>
                  <div className="border-l border-default-400 h-full w-1/12"></div>
                   <div className="border-l border-default-400 h-full w-1/12"></div>
        </div>
        
        {/* 2. PROGRESS FILL LAYER */}
        <div 
            className="absolute top-0 left-0 h-full bg-green-300 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
        >
        </div>
        
        {/* 3. Horizontal Zero Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black opacity-80 z-10"></div>
      </div>
    
      {/* FOOTER DETAILS */}
      <div className="w-full text-xs text-default-600">
         <span className="font-medium">File:</span> <span className="truncate">{copyitem?.name}</span>
      </div>
    </>
  );
};

export default CopyingFile;