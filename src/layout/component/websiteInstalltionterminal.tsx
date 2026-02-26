import React, { useRef, useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";

import { useDispatch } from "react-redux";
import { ClearWebsiteInstaltionLogs } from "../../redux/slice/WSslice";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type WebisteDetails } from "../../utils/interfaces";
import { createSubdomainFreeSslHttp } from "../../redux/slice/SudomainSlice";
import { TerminalLoading } from "./TerminalLoading";

interface WebsiteInstallationTerminalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedStack: string;
  onBackToForm: () => void;
  onCloseTerminal: () => void;
  websiteName: string;
  domain: string;
  type: string;
}


// Helper function to check if a string is valid JSON
const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};



const WebsiteInstallationTerminal: React.FC<
  WebsiteInstallationTerminalProps
> = ({
  isOpen,
  onOpenChange,
  selectedStack,
  onCloseTerminal,
  websiteName,
  domain,
  type,
}) => {



    const serverList = useAppSelector((state) => state.server.serverList)

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const reducerDispatch = useDispatch();
    const restoreFileData = location.state?.restoreFileData;
    const returnToRestore = location.state?.returnToRestore;
    const activeTab = location.state?.activeTab;

    const terminalRef = useRef<HTMLDivElement>(null);
    const { id } = useParams();
    const webInstallMessages = useAppSelector(
      (state) => state.ws.webInstallMessage
    );

    
    const activeserver = serverList.find((server) => server.id?.toString() === id?.toString());
    const [websiteDetails, setWebsiteDetails] = useState<any>(null);
    

    const firstErrorIndex = useMemo(() => {
      return webInstallMessages.findIndex(
        (log) => log.includes("Error:") || log.includes("FAILED")
      );
    }, [webInstallMessages]);

    const terminalStatus = useMemo(() => {
      if (webInstallMessages.length === 0) {
        return "idle";
      }

      const lastMessage = webInstallMessages[webInstallMessages.length - 1];

      if (isJson(lastMessage)) {
        return "success";
      }

      if (firstErrorIndex !== -1) {
        return "error";
      }

      return "running";
    }, [webInstallMessages, firstErrorIndex]);

    const handleCreateFreeSslHttp = async (data: WebisteDetails) => {
      const ssldata = {
        authorisation: "HTTP",
        access: "HTTPS",
        brotli_enabled: true,
      };

      const websiteId = data?.id;

      try {

        await dispatch(createSubdomainFreeSslHttp({
          websiteId: String(websiteId),
          data: ssldata,
        })).unwrap();
        addToast({
          title: "ssl  installed successfully",
          color: 'success'
        })
      } catch (error) {
        console.log(error)
      }

    };


    useEffect(() => {
      if (terminalRef.current && isOpen) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }

      if (terminalStatus === "success" && !websiteDetails) {
        const lastMessage = webInstallMessages[webInstallMessages.length - 1];
        if (isJson(lastMessage)) {
          try {
            if (returnToRestore) {
              const parsedJson = JSON.parse(lastMessage);
              console.log(parsedJson);

              reducerDispatch(ClearWebsiteInstaltionLogs())
              navigate(`/backup`, {
                state: {
                  performRestore: true,
                  fileToRestore: restoreFileData,
                  activeTab: activeTab,
                  restoreserverid: id,
                  TargetId: parsedJson.website.id
                }
              })

            }
            else {
              const parsedJson = JSON.parse(lastMessage);
              setWebsiteDetails(parsedJson);
              { type === "roundcube" && handleCreateFreeSslHttp(parsedJson) }
            }
          } catch (e) {
            console.error("Failed to parse website details JSON:", e);
          }
        }
      }
    }, [terminalStatus, webInstallMessages, websiteDetails, isOpen]);




    const getStatusColor = () => {
      switch (terminalStatus) {
        case "success":
          return "success";
        case "error":
          return "danger";
        case "running":
          return "primary";
        default:
          return "default";
      }
    };

    const getStatusText = () => {
      switch (terminalStatus) {
        case "success":
          return "Installation Complete";
        case "error":
          return "Installation Failed";
        case "running":
          return "Installing";
        default:
          return "Idle";
      }
    };

    const formatLog = (log: string, index: number) => {
      // Exclude the JSON payload from the visible log output
      if (isJson(log)) {
        return null;
      }

      const logPrefix = (
        <span className="text-[#00aaff] mr-2">
          [{String(index + 1).padStart(3, "0")}]
        </span>
      );

      let logContent;

      const isErrorOrFailed = log.includes("Error:") || log.includes("FAILED");
      const isPostErrorLog = firstErrorIndex !== -1 && index > firstErrorIndex;
      const isFirstError = index === firstErrorIndex && isErrorOrFailed;

      // Logic to handle post-error logging, similar to WebsiteDeletionTerminal
      if (isFirstError) {
        // Style the first detected error message
        logContent = <span className="text-red-400">{log}</span>;
      } else if (isPostErrorLog) {
        // Style messages *after* the first error index in a secondary color
        logContent = <span className="text-gray-600">{log}</span>;
      } else if (log.includes("Website created successfully")) {
        logContent = <span className="text-green-400 font-semibold">{log}</span>;
      } else if (isErrorOrFailed) {
        // Style any other error/failed messages that occurred before the firstErrorIndex
        // or messages that are errors but are not the 'firstError' as determined by index.
        logContent = <span className="text-red-400">{log}</span>;
      } else if (log.toLowerCase().includes("success") || log.toLowerCase().includes("completed")) {
        logContent = <span className="text-green-400">{log}</span>;
      } else if (log.includes("Warning:")) {
        logContent = <span className="text-yellow-400">{log}</span>;
      } else {
        logContent = <span>{log}</span>;
      }

      return (
        <div key={index} className="mb-2 leading-relaxed px-4 flex gap-2">
          {logPrefix}
          {logContent}
        </div>
      );
    };


    return (
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="5xl"
          scrollBehavior="inside"
          isDismissable={terminalStatus !== "running"}
          hideCloseButton
        >
          <ModalContent className="bg-transparent">
            {() => (
              <div>
                <ModalHeader className=" rounded-t-2xl flex flex-col gap-1 border-b border-default-200 bg-[#1a1a1a] text-white ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-full bg-${getStatusColor()}-100 text-${getStatusColor()}-500`}
                      >
                        {terminalStatus === "running" ? (
                          <Icon
                            icon="lucide:loader-2"
                            className="animate-spin"
                            width={20}
                          />
                        ) : terminalStatus === "success" ? (
                          <Icon icon="lucide:check-circle" width={20} />
                        ) : (
                          <Icon icon="lucide:alert-circle" width={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">
                          {selectedStack} - {getStatusText()}
                        </h3>
                        <div className="text-xs text-gray-400">
                          <p>
                            Website: {websiteName} | Domain: {domain}
                          </p>
                          <p>
                            Server: {activeserver?.name} | IP: {activeserver?.ip4}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip color={getStatusColor()} size="sm" variant="flat">
                        {getStatusText()}
                      </Chip>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody className="p-0">
                  <div
                    ref={terminalRef}
                    className="relative font-mono text-sm bg-[#0c0c0c] text-[#f1f1f1] p-6 h-112.5 overflow-y-auto"
                  >
                    <div className="border-b border-[#333333] pb-3 mb-4 px-4">
                      <div className="text-[#00ff00] mb-1">
                        CloudStick Terminal v2.1.4
                      </div>
                      <div className="text-[#888888] text-xs">
                        <p>Stack: {selectedStack}</p>
                        <p>
                          Website: {websiteName} | Domain: {domain}
                        </p>
                        <p>
                          Server: {activeserver?.name} | IP: {activeserver?.ip4}
                        </p>
                        <p>{new Date().toLocaleString()}</p>
                      </div>
                    </div>

                    {webInstallMessages.map((log: string, index: number) => {
                      return formatLog(log, index);
                    })}

                    {terminalStatus === "running" && (
                      <div className="flex items-center px-4">
                        <span className="text-[#00ff00] mr-2">
                          <TerminalLoading />
                        </span>
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter className="rounded-b-2xl relative border-t border-default-200 bg-[#1a1a1a] text-white">
                  <Button
                    color="secondary"
                    variant="bordered"
                    size="sm"
                    onPress={() => {
                      onCloseTerminal();
                    }}
                    isDisabled={terminalStatus === "running"}

                  >
                    Close
                  </Button>
                  {(terminalStatus === "success" ||
                    terminalStatus === "error") && (
                      <Button
                        color={terminalStatus === "success" ? "success" : "danger"}
                        size="sm"
                        onPress={() => {
                          dispatch(ClearWebsiteInstaltionLogs());
                          onCloseTerminal(); // Now, onCloseTerminal can be called safely here
                          onOpenChange(false); // Close the main terminal modal
                        }}
                        startContent={
                          <Icon
                            icon={
                              terminalStatus === "success"
                                ? "lucide:check"
                                : "lucide:x"
                            }
                            width={16}
                          />
                        }
                      >
                        {terminalStatus === "success" ? "Complete" : "Dismiss"}
                      </Button>
                    )}
                </ModalFooter>
              </div>
            )}
          </ModalContent>
        </Modal>
       


      </>
    );
  };

export default WebsiteInstallationTerminal;