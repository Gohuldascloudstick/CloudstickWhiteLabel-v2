import { Button, Card, Divider } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useAppSelector } from "../../redux/hook"
import { useState } from "react"


const Serverlogs = () => {
  const selectedwebsite = useAppSelector((state) => state.website.selectedWebsite)
  const [selectedLogType, setSelectedLogType] = useState<string | null>(null);
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

    ...(selectedwebsite && selectedwebsite.website.stack_type === "nginx+apache"
      // 👇 The Fix: Assert the type of the array being spread as LogData[]
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
      ] as LogData[]) // <-- Type Assertion applied here!
      : []),
  ];

  const logTypeTabInfo = logCardData.map(d => ({ logType: d.logType, title: d.title }));
  return (
    <div className="max-h-[90vh]  lg:p-2 overflow-y-auto scrollbar-hide">
      <p className=" text-xl md:text-2xl lg:text-3xl">Welcome to
        <span className=" ml-1 font-bold text-teal-600">
          Web Server Log
        </span>
      </p>
      <p className="mt-1 md:mt-2 lg:mt-2 text-xs md:text-sm lg:text-md text-gray-500">
        This feature lets you view and manage your files and folders easily.
      </p>
      <div className=" mt-3 lg:mt-6  w-full  ">
        <div className=" w-full space-y-6 ">
          <Card className="w-full shadow-sm border border-gray-200">
            <div className=" px-3 md:px-6 py-2 md:py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
              <span className="font-bold text-white text-sm md:text-md lg:text-lg">Web Server Log</span>
            </div>
            <Divider />


            <div>
              {logTypeTabInfo.map((tab) => (
                <Button
                  key={tab.logType}
                  size="sm"
                  className={` ${tab.logType !== selectedLogType ? 'bg-default-200/60 dark:bg-default-300/80 text-default-500 dark:text-default-600' : 'bg-primary-500 text-white'} px-3 shrink-0 text-[10px] sm:text-xs`}
                  variant={"solid"}
                  color={"primary"}
                  // onPress={() => handleLogTypeChange(tab.logType)}
                  startContent={<Icon icon="lucide:file-text" width={14} className=' hidden sm:flex' />}
                >
                  {tab.title}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Serverlogs