import { addToast, Card, CardBody, Divider } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../redux/hook";
import { getPhpMyAdminLogin } from "../redux/slice/databaseSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [phpMyAdminLoader, setPhpMyAdminLoader] = useState(false);
  useEffect(() => {
    const serverId = "150";
    const webId = "688";
    const userId = "22"
    const systemuserId = "1060"
    const webappType = "customphp"
    localStorage.setItem("serverId", serverId);
    localStorage.setItem("webId", webId);
    localStorage.setItem("userId", userId)
    localStorage.setItem("systemuserId", systemuserId);
    localStorage.setItem("webappType", webappType)
  }, []);
  const getPhpAdminLoginLink = async () => {
    setPhpMyAdminLoader(true);
    try {
      const result = await dispatch(getPhpMyAdminLogin()).unwrap();
      if (result) window.open(result.message, "_blank");
    } catch (error) {
      addToast({ description: error as string, color: "danger" });
    } finally {
      setPhpMyAdminLoader(false);
    }
  };


  return (
    <div className="w-full max-h-[90vh]  p-2 overflow-y-auto scrollbar-hide">
      <p className="text-xl md:text-2xl lg:text-3xl">Welcome <span className=" font-bold text-teal-600">
        vandanatest
      </span></p>

      <div className="  mt-3 md:mt-6 flex w-full justify-between gap-4">
        <div className=" w-full space-y-6 ">
          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4 ">
              <span className="font-bold text-indigo-900 text-lg">Email</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="hugeicons:mail-account-01" className="text-blue-900" width={32} />
                <span onClick={() => navigate("/email")} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Email Accounts
                </span>
              </div>
              <div className="flex items-center gap-3  ">
                <Icon icon="cib:roundcube" className="text-blue-900" width={32} />
                <span onClick={() => navigate("/email/enablewebmail")} className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  Enable Webmail
                </span>
              </div>
              <div className="flex items-center gap-3 ">
                <Icon icon="hugeicons:mail-secure-01" className="text-blue-900" width={32} />
                <span onClick={()=>navigate("email/emailauthentication")} className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  Email Authentication
                </span>
              </div>

            </div>
          </Card>

          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-indigo-900 text-lg">Files</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="ph:folder-user" className="text-blue-900" width={32} />
                <span className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  File Manager
                </span>
              </div>
              <div className="flex items-center gap-3  ">
                <Icon icon="iconoir:git" className="text-blue-900" width={32} />
                <span className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  Git
                </span>
              </div>
            </div>
          </Card>

          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-indigo-900 text-lg">Databases</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="fa7-brands:php" className="text-blue-900" width={32} />
                <span onClick={()=>navigate("/websettings")} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  PHP Settings
                </span>
              </div>
              <div className="flex items-center gap-3  ">
                <Icon icon="simple-icons:mysql" className="text-blue-900" width={36} />
                <span onClick={() => navigate("/database")} className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  MySQL Databses
                </span>
              </div>
              <div className="flex items-center gap-3 ">
                {phpMyAdminLoader ? <Icon icon="codex:loader" className="text-blue-600" width={32}/> : <Icon icon="simple-icons:phpmyadmin" className="text-blue-900" width={32} />}

                <span className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" onClick={getPhpAdminLoginLink}>
                  phpMyAdmin
                </span>
              </div>

            </div>
          </Card>

          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-indigo-900 text-lg">Domains</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="la:globe-americas" className="text-blue-900" width={32} />
                <span className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Sub Domains
                </span>
              </div>
            </div>
          </Card>

          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-indigo-900 text-lg">Security</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="iconamoon:shield-yes-light" className="text-blue-900" width={32} />
                <span className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  SSL/TSL
                </span>
              </div>


            </div>
          </Card>



          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-indigo-900 text-lg">Advanced</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="eos-icons:cronjob" className="text-blue-900" width={32} />
                <span onClick={()=>navigate("/cronjobs")} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Cron Jobs
                </span>
              </div>
              <div className="flex items-center gap-3  ">
                <Icon icon="fluent:clipboard-bullet-list-ltr-20-regular" className="text-blue-900" width={32} />
                <span className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  Web Server Log
                </span>
              </div>


            </div>
          </Card>


          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-indigo-900 text-lg">Preferences</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="material-symbols-light:settings-account-box-outline-rounded" className="text-blue-900" width={32} />
                <span onClick={()=>navigate("/password")} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Change Password
                </span>
              </div>
            </div>
          </Card>
        </div>
        <div>
          <Card className="">
            <CardBody className="p-4">
              <div>
                <p className="font-bold">
                  General Information
                </p>
              </div>
              <div className="my-4">
                <p className="text-sm">
                  Primary Domain
                </p>
                <p className="text-blue-600 text-sm">app-qzykx.fPhYnEyHcueeKGC.vanadana.site</p>
              </div>
              <Divider />
              <div className="my-4">
                <p className="text-sm">
                  IP Address
                </p>
                <p className="text-sm text-blue-600">172.105.34.154</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard