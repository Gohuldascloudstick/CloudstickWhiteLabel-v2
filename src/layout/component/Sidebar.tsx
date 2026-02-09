import { Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
    const navigate = useNavigate()
    const navItems = [
        { name: "Dashboard", icon: "lucide:layout-dashboard", path: "/" },
        { name: "Database", icon: "solar:database-outline", path: "/database" },
        { name: "Email Accounts", icon: "fluent:mail-16-regular", path: "/email" },
        { name: "File Manager", icon: "fluent:folder-add-20-regular", path: "/backup" },
        {name: "Sub domains",icon: "fluent:globe-20-regular",path: "/integrations",},
        { name: "Web Server Log", icon: "fluent:clipboard-bullet-list-ltr-20-regular", path: "/services" },
        { name: "Git", icon: "iconoir:git", path: "/sshVault" },
        { name: "Password Management", icon: "solar:password-outline", path: "/hostname" },
        { name: "Web Application Settings", icon: "fluent:settings-32-regular", path: "/system-users" },
        { name: "Cron Jobs", icon: "eos-icons:cronjob", path: "/supervisors" },
        { name: "SSL Management", icon: "fluent:shield-globe-24-regular", path: "/supervisors" },
        { name: "WordPress Manager", icon: "uil:wordpress-simple", path: "/wordpress_templates" },

    ];
    return (
        <div className="w-full flex flex-col justify-between bg-gray-300">

            <div className=" flex flex-col pt-22 gap-2" >
                {navItems.map((item) =>

                    <Tooltip
                        content={item.name}
                        placement="right"
                        offset={15}
                        delay={1000}
                        size="sm"
                    >
                        <div key={item.path} onClick={()=>navigate(item.path)} className="w-full  hover:bg-gray-400/30 flex justify-center items-center">
                            <div className="p-3 text-gray-700/50">
                                <Icon icon={item.icon} width={26} />
                            </div>
                        </div>
                    </Tooltip>


                )
                }
            </div >
            <div className="pb-5 flex justify-center border-t border-gray-400  pt-2">
                <button className="text-teal-700/60 hover:text-teal-700 transition-colors">
                    <Icon icon="fluent:arrow-exit-12-filled" width={35} />
                </button>
            </div>
        </div>
    )
}

export default Sidebar