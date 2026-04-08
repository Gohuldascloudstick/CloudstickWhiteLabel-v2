import { Tooltip, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

import { useLocation, useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import { useAppSelector } from "../../redux/hook";


const Sidebar = () => {
    const {
        isOpen: isLogoutModalOpen,
        onOpen: onLogoutModalOpen,
        onOpenChange: onLogoutModalOpenChange,
    } = useDisclosure();
    const websitetype = localStorage.getItem("webtype")
    const businessDetails = useAppSelector((state) => state?.auth.businessDetails)
    const navigate = useNavigate()
    const location = useLocation();
    const navItems = [
        { name: "Dashboard", icon: "lucide:layout-dashboard", path: "/" },
        { name: "Database", icon: "solar:database-outline", path: "/database" },
        { name: "Email Accounts", icon: "fluent:mail-16-regular", path: "/email" },
        { name: "File Manager", icon: "fluent:folder-add-20-regular", path: "/file" },
        { name: "Sub domains", icon: "fluent:globe-20-regular", path: "/subdomain", },
        { name: "Web Server Log", icon: "fluent:clipboard-bullet-list-ltr-20-regular", path: "/logs" },
        // { name: "Git", icon: "iconoir:git", path: "/git" },
        { name: "Password Management", icon: "solar:password-outline", path: "/password" },
        { name: "Web Application Settings", icon: "fluent:settings-32-regular", path: "/websettings" },
        { name: "Cron Jobs", icon: "eos-icons:cronjob", path: "/cronjobs" },
        { name: "SSL Management", icon: "fluent:shield-globe-24-regular", path: "/ssl" },
        ...(websitetype?.toLocaleLowerCase() === "wordpress"
            ? [{
                name: "WordPress Manager",
                icon: "uil:wordpress-simple",
                path: "/wordpress"
            }]
            : [])


    ];
    return (
        <div className="w-full h-full flex flex-col bg-gray-300 ">
            <div className="flex flex-col items-center pt-8 pb-4">
                {businessDetails?.primary_logo && (
                    <div className="h-12 w-12 p-2 bg-white/70 overflow-hidden rounded-full ring-4 ring-gray-400/50">
                        <img
                            src={businessDetails.primary_logo}
                            alt="Brand Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                )}
            </div>


            <div className="flex-1 overflow-y-auto pt-8 flex flex-col ">
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
                                className={`w-full cursor-pointer py-1 ${isActive ? "bg-gray-400/30 " : ""
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
                <button onClick={onLogoutModalOpen} className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
                    <Icon icon="fluent:arrow-exit-12-filled" width={35} />
                </button>
            </div>
            <LogoutModal isOpen={isLogoutModalOpen} onOpenChange={onLogoutModalOpenChange} />
        </div>

    )
}

export default Sidebar