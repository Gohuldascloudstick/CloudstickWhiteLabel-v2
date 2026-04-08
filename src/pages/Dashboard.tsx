import { addToast, Card, CardBody, Divider } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { getPhpMyAdminLogin } from "../redux/slice/dataBaseSlice"
import { getWebDetails } from "../redux/slice/websiteSlice";


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [phpMyAdminLoader, setPhpMyAdminLoader] = useState(false);
  const website = useAppSelector(state => state?.website?.selectedWebsite)
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
  const websitetype = localStorage.getItem("webtype")
  const getwebsitedetails = async () => {
    try {
      await dispatch(getWebDetails()).unwrap();
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getwebsitedetails()
  }, [])
  return (
    <div className="w-full ">
      <p className="text-xl md:text-2xl lg:text-3xl">Welcome </p>

      <div className="  mt-3 md:mt-6 flex w-full justify-between gap-4">
        <div className=" w-full space-y-6 ">
          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4 ">
              <span className="font-bold text-gray-500 text-lg">Email</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="hugeicons:mail-account-01" className="text-primary" width={32} />
                <span onClick={() => navigate("/email")} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Email Accounts
                </span>
              </div>
              <div className="flex items-center gap-3  ">
                <Icon icon="cib:roundcube" className="text-primary" width={32} />
                <span onClick={() => navigate("/email/enablewebmail")} className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  Enable Webmail
                </span>
              </div>
              <div className="flex items-center gap-3 ">
                <Icon icon="hugeicons:mail-secure-01" className="text-primary" width={32} />
                <span onClick={() => navigate("email/emailauthentication")} className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  Email Authentication
                </span>
              </div>

            </div>
          </Card>

          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-gray-500 text-lg">Files</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="ph:folder-user" className="text-primary" width={32} />
                <span onClick={() => navigate('/file')} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  File Manager
                </span>
              </div>
              {websitetype?.toLowerCase() === "wordpress" &&

                <div className="flex items-center gap-3  ">
                  <Icon icon="jam:wordpress" className="text-primary" width={32} />
                  <span onClick={() => navigate('/wordpress')} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                    WordPress Manager
                  </span>
                </div>
              }
              {/* <div className="flex items-center gap-3  ">
                <Icon icon="iconoir:git" className="text-primary" width={32} />
                <span onClick={() => navigate('/git')} className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  Git
                </span>
              </div> */}
            </div>
          </Card>

          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-gray-500 text-lg">Databases</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="fa7-brands:php" className="text-primary" width={32} />
                <span onClick={() => navigate("/websettings")} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  PHP Settings
                </span>
              </div>
              <div className="flex items-center gap-3  ">
                <Icon icon="simple-icons:mysql" className="text-primary" width={36} />
                <span onClick={() => navigate("/database")} className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  MySQL Databses
                </span>
              </div>
              <div className="flex items-center gap-3 ">
                {phpMyAdminLoader ? <Icon icon="codex:loader" className="text-blue-600" width={32} /> : <Icon icon="simple-icons:phpmyadmin" className="text-primary" width={32} />}

                <span className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" onClick={getPhpAdminLoginLink}>
                  phpMyAdmin
                </span>
              </div>

            </div>
          </Card>

          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-gray-500 text-lg">Domains</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="la:globe-americas" className="text-primary" width={32} />
                <span onClick={() => navigate('/subdomain')} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Sub Domains
                </span>
              </div>
            </div>
          </Card>

          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-gray-500 text-lg">Security</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="iconamoon:shield-yes-light" className="text-primary" width={32} />
                <span onClick={() => navigate('/ssl')} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  SSL/TSL
                </span>
              </div>


            </div>
          </Card>



          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-gray-500 text-lg">Advanced</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="eos-icons:cronjob" className="text-primary" width={32} />
                <span onClick={() => navigate("/cronjobs")} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Cron Jobs
                </span>
              </div>
              <div className="flex items-center gap-3  ">
                <Icon icon="fluent:clipboard-bullet-list-ltr-20-regular" className="text-primary" width={32} />
                <span onClick={() => navigate('/logs')} className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                  Web Server Log
                </span>
              </div>


            </div>
          </Card>


          <Card className="w-full shadow-sm border border-gray-200">
            <div className="px-6 py-4">
              <span className="font-bold text-gray-500 text-lg">Preferences</span>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-4 px-8  py-8">
              <div className="flex items-center gap-3  ">
                <Icon icon="material-symbols-light:settings-account-box-outline-rounded" className="text-primary" width={32} />
                <span onClick={() => navigate("/password")} className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Change Password
                </span>
              </div>
            </div>
          </Card>
        </div>
        <div>
          <Card className="w-[15vw] shadow-sm border border-gray-200">
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
                <p className="text-blue-600 text-sm">
                  {website?.website?.domains?.[0] && (
                    <a
                      href={`http${website?.website?.is_ssl_installed ? 's' : ''}://${website?.website?.domains[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {website?.website?.domains[0]}
                    </a>
                  )}
                </p>
              </div>
              <Divider />
              <div className="my-4">
                {/* <p className="text-sm">
                  IP Address
                </p>
                <p className="text-sm text-blue-600">{ }</p> */}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard