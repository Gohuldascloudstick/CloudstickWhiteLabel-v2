import { Icon } from "@iconify/react";
import { Button, ModalHeader, ModalBody, ModalFooter, Progress } from "@heroui/react";
import { useState, useEffect } from "react";

interface DownloadFileProps {
  path: string;
  name: string;
  onClose: () => void;
}

const DownloadFile = ({ path, name, onClose }: DownloadFileProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulated download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    // In a real app, this would trigger the actual file download via window.location or an anchor tag
    console.log(`Downloading ${name} from ${path}`);
    onClose();
  };

  return (
    <>
      <ModalHeader className="gap-2 items-center">
        <Icon icon="mdi:download-outline" className="text-primary" width={24} />
        Download File
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4 py-4 text-center">
          <p className="text-sm text-slate-500">
            Preparing <span className="font-bold text-slate-700">{name}</span> for download...
          </p>
          <Progress 
            size="md" 
            value={progress} 
            color={isComplete ? "success" : "primary"}
            showValueLabel={true}
            className="max-w-md mx-auto"
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onPress={onClose}>Cancel</Button>
        <Button color="primary" isDisabled={!isComplete} onPress={handleDownload}>
          Download Now
        </Button>
      </ModalFooter>
    </>
  );
};

export default DownloadFile;
