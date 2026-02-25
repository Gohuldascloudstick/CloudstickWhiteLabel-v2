import { Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { useLocation, useNavigate } from "react-router-dom";


const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const navItems = [
        { name: "Dashboard", icon: "lucide:layout-dashboard", path: "/" },
        { name: "Database", icon: "solar:database-outline", path: "/database" },
        { name: "Email Accounts", icon: "fluent:mail-16-regular", path: "/email" },
        { name: "File Manager", icon: "fluent:folder-add-20-regular", path: "/file" },
        { name: "Sub domains", icon: "fluent:globe-20-regular", path: "/subdomain", },
        { name: "Web Server Log", icon: "fluent:clipboard-bullet-list-ltr-20-regular", path: "/logs" },
        { name: "Git", icon: "iconoir:git", path: "/git" },
        { name: "Password Management", icon: "solar:password-outline", path: "/password" },
        { name: "Web Application Settings", icon: "fluent:settings-32-regular", path: "/websettings" },
        { name: "Cron Jobs", icon: "eos-icons:cronjob", path: "/cronjobs" },
        { name: "SSL Management", icon: "fluent:shield-globe-24-regular", path: "/ssl" },
        { name: "WordPress Manager", icon: "uil:wordpress-simple", path: "/wordpress" },

    ];
    return (
        <div className="w-full h-full flex flex-col bg-gray-300">

            
            <div className="flex-1 overflow-y-auto pt-22 flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive =
                        item.path === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(item.path);

                    return (
                        <Tooltip
                            key={item.path}
                            content={item.name}
                            placement="right"
                            offset={15}
                            delay={1000}
                            size="sm"
                        >
                            <div
                                onClick={() => navigate(item.path)}
                                className={`w-full ${isActive ? "bg-gray-400/30" : ""
                                    } hover:bg-gray-400/30 flex justify-center items-center`}
                            >
                                <div className="p-3 text-gray-700/50">
                                    <Icon icon={item.icon} width={26} />
                                </div>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>

          
            <div className="pb-3 flex justify-center border-t border-gray-400 pt-2">
                <button className="text-teal-700/60 hover:text-teal-700 transition-colors">
                    <Icon icon="fluent:arrow-exit-12-filled" width={35} />
                </button>
            </div>
        </div>

    )
}

export default Sidebar