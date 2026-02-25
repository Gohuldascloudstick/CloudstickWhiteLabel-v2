import { addToast, Button, Card, Divider } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { magicLink } from "../../redux/slice/websiteSlice";


const Wordpress = () => {
  const dispatch = useAppDispatch();
  const [magicloader, setmagicloader] = useState<boolean>(false);
  const generateMagicLink = async () => {
    try {
      setmagicloader(true);
      const result = await dispatch(
        magicLink()
      ).unwrap();
      console.log(result);
      if (result) {
        window.open(result.magic_link, "_blank");
      }
    } catch (error:any) {
      addToast({
        description: error || "Magiclink failed",
        color: "danger",
      });
    } finally {
      setmagicloader(false);
    }
  };
  return (
    <div className=" lg:p-2 overflow-y-auto scrollbar-hide">

      <p className=" text-xl md:text-2xl lg:text-3xl">Welcome to
        <span className=" ml-1 font-bold text-teal-600">
          WordPress Manager
        </span>
      </p>
      <div className="flex  items-center justify-between">
        <div>
          <p className="mt-1 md:mt-2 lg:mt-2 text-xs md:text-sm lg:text-md text-gray-500">
            Manage your associated WordPress content management system.
          </p>
        </div>
        <div>

          <Button
            size="sm"
            color="primary"
            className=" bg-teal-600"
            data-testid='Magic Link'
            startContent={
              !magicloader && (
                <Icon icon="lucide:link" width={14} />
              )
            }
            isLoading={magicloader}
            onPress={generateMagicLink}
          >
            Magic Link
          </Button>
        </div>
      </div>
      <div className=" mt-3 lg:mt-6  w-full  ">
        <div className=" w-full space-y-6 ">
          <Card className="w-full shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
              <Icon icon={"uil:wordpress-simple"} width={24} className="text-white" />
              <span className="font-bold text-white text-sm md:text-md lg:text-lg">WordPress Manager</span>
            </div>
            <Divider />
            <div className=" p-4 lg:p-8 flex flex-col gap-3 lg:gap-6 font-sans">





            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Wordpress