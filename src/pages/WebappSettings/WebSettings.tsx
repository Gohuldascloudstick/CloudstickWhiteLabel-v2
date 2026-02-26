import { addToast, Button, Card, cn, Divider, Input, Listbox, ListboxItem, Select, SelectItem, Switch, Textarea } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hook"
import { getPhpVersions, getWebDetails } from "../../redux/slice/websiteSlice"
import NginxSttings from "./NginxSttings"
import AppDomain from "./AppDomain"
import { changeAppPhpversion, changeAppPublicPath, changePhpConfig, changeWebStack } from "../../redux/slice/appSettingSlice"


const WebSettings = () => {
    const type = localStorage.getItem("webappType")
    const phpversions = useAppSelector(state => state.website.phpversion)
    const [phpversionloader, setPhpversionLoader] = useState(false);
    const [webstackloader, setWebstackLoader] = useState(false);
    const [publicpathloadear, setPublicPathLoader] = useState(false);
    const currentWebsite = useAppSelector((state) => state.website.selectedWebsite);
    const nginxsettings = useRef<HTMLDivElement>(null);
    const phpsettings = useRef<HTMLDivElement>(null);
    const publicpathref = useRef<HTMLDivElement>(null);
    const phpversionref = useRef<HTMLDivElement>(null);
    const webstackref = useRef<HTMLDivElement>(null);
    const domainref = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const [cardOpen, setCardopen] = useState("")
    const [publicpath, setPublicpath] = useState("");
    const [publicpathError, setPublicPathError] = useState("")
    const [phpVersion, setPhpVersion] = useState<string>(currentWebsite?.php_version?.slice(0, 1) + "." + currentWebsite?.php_version?.slice(1));
    const [webstack, setWebstack] = useState<string>(currentWebsite?.website?.stack_type ?? "");
    const [processmanager, setProcessManager] = useState<string>(currentWebsite?.php_process_manager ?? "");
    const [startservers, setStartServers] = useState<number>(currentWebsite?.php_start_servers ?? 0);
    const [minspareservers, setMinSpareServers] = useState<number>(currentWebsite?.php_min_spare_servers ?? 0);
    const [maxspareservers, setMaxSpareServers] = useState<number>(currentWebsite?.php_max_spare_servers ?? 0)
    const [maxchildren, setMaxchildren] = useState<number>(currentWebsite?.php_max_children ?? 0);
    const [maxchildrenError, setMaxchildrenError] = useState("");
    const [minspareserverError, setMinSpareserverError] = useState("");
    const [maxSpareError, setmaxSpareError] = useState("");
    const [startserverError, setStartServerError] = useState("");
    const [maxrequest, setMaxRequest] = useState<number>(currentWebsite?.php_max_requests ?? 0);
    const [maxrequestError, setMaxrequestError] = useState("")
    const [openbasedir, setOpenbasedir] = useState<string>(currentWebsite?.php_open_base_dir ?? "");
    const [openbasedirError, setOpenbasedirError] = useState("")
    const [timezone, setTimezone] = useState<string>(currentWebsite?.php_timezone ?? "");
    const [maxExecutionTime, setMaxExecutionTime] = useState<number>(currentWebsite?.php_max_execution_time ?? 0);
    const [maxExecutionTimeerror, setMaxExecutionTimeError] = useState("")
    const [maxInputTime, setMaxInputTime] = useState<number>(currentWebsite?.php_max_input_time ?? 0);
    const [maxinputtimeError, setMaxinputtimeError] = useState("")
    const [maxInputVars, setMaxinputVars] = useState<number>(currentWebsite?.php_max_input_vars ?? 0);
    const [maxinputvarsError, setmaxInputvarsError] = useState("")
    const [memoryLimit, setMemoryLimit] = useState<number>(currentWebsite?.php_memory_limit ?? 0);
    const [memoryLimitError, setMemoryLimitError] = useState("")
    const [postMaxSize, setpostMaxSize] = useState<number>(currentWebsite?.php_post_max_size ?? 0);
    const [postMaxSizeError, setPostmaxSizeError] = useState("")
    const [UploadMaxFIleSize, setUploadMaxFileSize] = useState<number>(currentWebsite?.php_upload_max_filesize ?? 0);
    const [UploadMaxfilesizeError, setUploadMaxFilesizeError] = useState("")
    const [maxLifetime, setMaxLifeTime] = useState<number>(currentWebsite?.php_session_max_lifetime ?? 0);
    const [maxlifetimeError, setmaxlifetimeError] = useState("")
    const [disableFuncton, setDisableFunction] = useState<string>(currentWebsite?.php_disable_functions ?? "");
    const [allowurlfopen, setAllowUrlfOpen] = useState(currentWebsite?.php_allow_url_fopen);
    const [shortopentag, setShortOpenTag] = useState(currentWebsite?.php_short_open_tag);
    const [fpmLoader, setFpmLoader] = useState(false);
    const phpTimeZoneList = [
        { value: "UTC", text: "UTC (Coordinated Universal Time)" },

        { value: "Africa/Abidjan", text: "Africa / Abidjan" },
        { value: "Africa/Accra", text: "Africa / Accra" },
        { value: "Africa/Addis_Ababa", text: "Africa / Addis Ababa" },
        { value: "Africa/Cairo", text: "Africa / Cairo" },
        { value: "Africa/Johannesburg", text: "Africa / Johannesburg" },

        { value: "America/New_York", text: "America / New York" },
        { value: "America/Chicago", text: "America / Chicago" },
        { value: "America/Denver", text: "America / Denver" },
        { value: "America/Los_Angeles", text: "America / Los Angeles" },
        { value: "America/Sao_Paulo", text: "America / São Paulo" },

        { value: "Asia/Dubai", text: "Asia / Dubai" },
        { value: "Asia/Kolkata", text: "Asia / Kolkata" },
        { value: "Asia/Tokyo", text: "Asia / Tokyo" },
        { value: "Asia/Shanghai", text: "Asia / Shanghai" },
        { value: "Asia/Singapore", text: "Asia / Singapore" },

        { value: "Australia/Sydney", text: "Australia / Sydney" },
        { value: "Australia/Perth", text: "Australia / Perth" },

        { value: "Europe/London", text: "Europe / London" },
        { value: "Europe/Berlin", text: "Europe / Berlin" },
        { value: "Europe/Paris", text: "Europe / Paris" },
        { value: "Europe/Rome", text: "Europe / Rome" },

        { value: "Pacific/Auckland", text: "Pacific / Auckland" },
    ];

    const stacktype = [
        { id: "nginx", label: "Native Nginx" },
        { id: "nginx+apache", label: "Nginx + Apache" },
    ];
    type MenuItem = {
        id: string;
        name: string;
        icon: string;
        ref?: React.RefObject<HTMLDivElement | null>;
    };
    const menuItems: MenuItem[] = [
        {
            id: "webstackref",
            name: "Change Web Stack ",
            icon: "lucide:database",
            ref: webstackref,
        },
        // {
        //     id: "resetpassword",
        //     name: "Change password",
        //     icon: "lucide:key",
        //     ref: resetpassword,
        // },
        {
            id: "domainref",
            name: "Domains",
            icon: "raphael:globe",
            ref: domainref
        },
        {
            id: "publicpathref",
            name: "Change Public Path",
            icon: "mynaui:path",
            ref: publicpathref,

        },
        {
            id: "nginxsettings",
            name: "NGINX Settings",
            icon: "simple-icons:nginx",
            ref: nginxsettings,
        },
        // {
        //     id: "fpmsettings",
        //     name: "FPM settings",
        //     icon: "lucide:settings-2",
        //     ref: fpmsettings,
        // }

    ];
    if (type !== "ghost" && type !== "proxyapp") {
        menuItems.unshift({
            id: "phpversionref",
            name: "Change PHP Version",
            icon: "ri:php-fill",
            ref: phpversionref,
        });
    }
    if (type !== "ghost" && type !== "proxyapp") {
        menuItems.push({
            id: "phpsettings",
            name: "PHP Settings",
            icon: "ri:php-fill",
            ref: phpsettings,
        });
    }
    const handleFields = () => {
        setPhpVersion(currentWebsite?.php_version?.slice(0, 1) + "." + currentWebsite?.php_version?.slice(1));
        setWebstack(currentWebsite?.website?.stack_type ?? "");
        setProcessManager(currentWebsite?.php_process_manager ?? "")
        setMaxchildren(currentWebsite?.php_max_children ?? 0)
        setMaxRequest(currentWebsite?.php_max_requests ?? 0)
        setStartServers(currentWebsite?.php_start_servers ?? 0)
        setMinSpareServers(currentWebsite?.php_min_spare_servers ?? 0)
        setMaxSpareServers(currentWebsite?.php_max_spare_servers ?? 0)
        setOpenbasedir(currentWebsite?.php_open_base_dir ?? "")
        setTimezone(currentWebsite?.php_timezone ?? "")
        setMaxExecutionTime(currentWebsite?.php_max_execution_time ?? 0)
        setMaxInputTime(currentWebsite?.php_max_input_time ?? 0)
        setMaxinputVars(currentWebsite?.php_max_input_vars ?? 0)
        setMemoryLimit(currentWebsite?.php_memory_limit ?? 0)
        setpostMaxSize(currentWebsite?.php_post_max_size ?? 0)
        setUploadMaxFileSize(currentWebsite?.php_upload_max_filesize ?? 0)
        setMaxLifeTime(currentWebsite?.php_session_max_lifetime ?? 0)
        setDisableFunction(currentWebsite?.php_disable_functions ?? "")
        setAllowUrlfOpen(currentWebsite?.php_allow_url_fopen)
        setShortOpenTag(currentWebsite?.php_short_open_tag)
        setMaxchildrenError("")
        setMaxinputtimeError("")
        setmaxInputvarsError("")
        setMaxrequestError("")
        setPublicpath("");
        setPublicPathError("")
        setStartServerError("")
        setMinSpareserverError("")
        setmaxSpareError("")
        setMemoryLimitError("")
        setPostmaxSizeError("")
        setUploadMaxFilesizeError("")
        setmaxlifetimeError("")
        setMaxExecutionTimeError("")
    }
    const handleCardOpen = (name: string) => {
        if (cardOpen === name) {
            setCardopen("")
        } else {
            setCardopen(name)
            handleFields()
        }
    }
    const Changephpversion = async () => {
        try {
            setPhpversionLoader(true)
            await dispatch(
                changeAppPhpversion({
                    data: { php_version: phpVersion.replace('.', '') }
                })).unwrap();
            addToast({
                title: "PHP version changed successfully",
                color: 'success'
            })
            dispatch(
                getWebDetails())

        } catch (error: any) {
            addToast({
                title: "Failed to change PHP version",
                description: error,
                color: "danger"
            })

        } finally {
            setPhpversionLoader(false);
        }
    }
    const changeWebstackType = async () => {
        try {
            setWebstackLoader(true);
            await dispatch(changeWebStack({
                data: { "stack_type": webstack }
            })).unwrap();
            addToast({
                title: "Webstack changed successfully",
                color: 'success'
            });
            dispatch(getWebDetails())
        } catch (error: any) {
            addToast({
                title: "Failed to change web stack",
                description: error,
                color: "danger"
            })

        } finally {
            setWebstackLoader(false);
        }
    }
    const changePublicpath = async () => {
        if (!publicpath || !publicpath.trim()) {
            setPublicPathError("Path cannot be empty");
            return;
        }
        if (/\s/.test(publicpath)) {
            setPublicPathError("Path must not contain spaces");
            return;
        }
        if (!publicpath.startsWith("/")) {
            setPublicPathError("Path must start with /");
            return;
        }
        if (publicpath.length > 1 && publicpath.endsWith("/")) {
            setPublicPathError("Path must not end with /");
            return;
        }
        if (publicpath.includes("//")) {
            setPublicPathError("Path cannot contain consecutive slashes");
            return;
        }
        if (!/^[a-zA-Z0-9/_-]+$/.test(publicpath)) {
            setPublicPathError("Path contains invalid characters");
            return;
        }

        try {
            setPublicPathLoader(true);
            await dispatch(changeAppPublicPath({ data: { "public_path": currentWebsite?.website?.public_path + publicpath } })).unwrap();
            addToast({
                title: "Public path changed successfully",
                color: 'success'
            });
            dispatch(getWebDetails())
            setPublicpath("")

        } catch (error: any) {
            addToast({
                title: "Failed to change public path",
                description: error,
                color: "danger"
            })
        } finally {
            setPublicPathLoader(false);
        }
    }
    const changephpConfig = async () => {
        interface datatype {
            php_max_children: number,
            php_process_manager: string,
            php_max_requests: number,
            php_start_servers?: number,
            php_min_spare_servers?: number,
            php_max_spare_servers?: number,
            php_open_base_dir: string,
            php_timezone: string,
            php_max_execution_time: number,
            php_max_input_time: number,
            php_max_input_vars: number,
            php_memory_limit: number,
            php_post_max_size: number,
            php_upload_max_filesize: number,
            php_session_max_lifetime: number,
            php_disable_functions: string,
            php_allow_url_fopen: boolean,
            php_short_open_tag: boolean
        }
        const data: datatype = {
            "php_max_children": maxchildren,
            "php_process_manager": processmanager,
            "php_max_requests": maxrequest,
            "php_open_base_dir": openbasedir,
            "php_timezone": timezone,
            "php_max_execution_time": maxExecutionTime,
            "php_max_input_time": maxInputTime,
            "php_max_input_vars": maxInputVars,
            "php_memory_limit": memoryLimit,
            "php_post_max_size": postMaxSize,
            "php_upload_max_filesize": UploadMaxFIleSize,
            "php_session_max_lifetime": maxLifetime,
            "php_disable_functions": disableFuncton,
            "php_allow_url_fopen": allowurlfopen ?? false,
            "php_short_open_tag": shortopentag ?? false,

        };
        if (processmanager === "dynamic") {
            data.php_start_servers = startservers;
            data.php_min_spare_servers = minspareservers;
            data.php_max_spare_servers = maxspareservers;
        }
        try {
            setFpmLoader(true);
            await dispatch(changePhpConfig({ data: data })).unwrap();
            addToast({
                title: "Updated PHP settings successfully",
                color: "success"
            })
            dispatch(
                getWebDetails())
        } catch (error: any) {
            addToast({
                title: "Failed to update PHP settings",
                description: error,
                color: "danger"
            })
        } finally {
            setFpmLoader(false)
        }
    }
    const handleprocessMnager = () => {
        setMaxchildren(currentWebsite?.php_max_children ?? 0)
        setMaxRequest(currentWebsite?.php_max_requests ?? 0)
        setStartServers(currentWebsite?.php_start_servers ?? 0)
        setMinSpareServers(currentWebsite?.php_min_spare_servers ?? 0)
        setMaxSpareServers(currentWebsite?.php_max_spare_servers ?? 0)
    }
    useEffect(() => {
        setWebstack(currentWebsite?.website?.stack_type ?? "" )
        setPhpVersion(currentWebsite?.php_version?.slice(0, 1) + "." + currentWebsite?.php_version?.slice(1))
        setProcessManager(currentWebsite?.php_process_manager ?? "")
        setMaxchildren(currentWebsite?.php_max_children ?? 0)
        setMaxRequest(currentWebsite?.php_max_requests ?? 0)
        setStartServers(currentWebsite?.php_start_servers ?? 0)
        setMinSpareServers(currentWebsite?.php_min_spare_servers ?? 0)
        setMaxSpareServers(currentWebsite?.php_max_spare_servers ?? 0)
        setOpenbasedir(currentWebsite?.php_open_base_dir ?? "")
        setTimezone(currentWebsite?.php_timezone?? "")
        setMaxExecutionTime(currentWebsite?.php_max_execution_time ?? 0)
        setMaxInputTime(currentWebsite?.php_max_input_time ?? 0)
        setMaxinputVars(currentWebsite?.php_max_input_vars ?? 0)
        setMemoryLimit(currentWebsite?.php_memory_limit ?? 0)
        setpostMaxSize(currentWebsite?.php_post_max_size ?? 0)
        setUploadMaxFileSize(currentWebsite?.php_upload_max_filesize ?? 0)
        setMaxLifeTime(currentWebsite?.php_session_max_lifetime ?? 0)
        setDisableFunction(currentWebsite?.php_disable_functions ?? "")
        setAllowUrlfOpen(currentWebsite?.php_allow_url_fopen)
        setShortOpenTag(currentWebsite?.php_short_open_tag)
    }, [])
    useEffect(() => {
        dispatch(getPhpVersions());
        dispatch(getWebDetails());
    }, [])
    return (
        <div className="max-h-[90vh]  p-2 overflow-y-auto scrollbar-hide">
            <p className="text-3xl">Welcome to
                <span className=" font-bold text-teal-600">
                    Web Application Settings
                </span>
            </p>
            <div className="mt-12  w-full  ">
                <div className=" w-full space-y-6 ">
                    <Card className="w-full shadow-sm border  border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 text-white bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <Icon
                                icon="lucide:globe"
                                className="text-white transition-transform group-hover:scale-110"
                                width={22}
                            />
                            <span className="font-bold  text-lg"> Add Web Application to Server CloudStick</span>
                        </div>
                        <Divider />
                        <div className="flex flex-col lg:flex-row p-12 gap-4 ">
                            <div className="  w-full ">
                                <div className="flex flex-col gap-5">
                                    {type !== "ghost" && type !== "proxyapp" && (
                                        <div ref={phpversionref} className="group">
                                            <Card className=" p-2 md:p-4 shadow-sm rounded-xl   transition-all duration-200 hover:shadow-md">
                                                <div
                                                    onClick={() => handleCardOpen("phpversionref")}
                                                    className={`group cursor-pointer select-none p-4 `}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex gap-4">
                                                            <div className="shrink-0 mt-1">
                                                                <Icon
                                                                    icon="ri:php-fill"
                                                                    className="text-blue-600 transition-transform group-hover:scale-110"
                                                                    width={28}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <h2 className="text-[15px] font-semibold text-slate-800 ">
                                                                    PHP Version Management
                                                                </h2>
                                                                <p className="text-sm leading-snug text-slate-500  ">
                                                                    Configure the active PHP environment for your application. Changes take effect immediately across all services.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center self-center pl-4">
                                                            <Icon className='text-gray-300'
                                                                icon={cardOpen === "phpversionref"
                                                                    ? "mdi:chevron-down"
                                                                    : "mdi:chevron-right"}
                                                                width={20}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={` ${cardOpen === "phpversionref" ? "block" : "hidden"} mt-4 gap-4 px-16 py-8 border-t border-gray-200 `}>
                                                    <Select
                                                        label="PHP Version"
                                                        placeholder="Select version"
                                                        variant="flat"
                                                        disallowEmptySelection
                                                        selectedKeys={phpVersion ? new Set([phpVersion]) : new Set()}
                                                        onSelectionChange={(keys) =>
                                                            setPhpVersion([...keys][0] as string)
                                                        }
                                                        labelPlacement="outside"
                                                        classNames={{
                                                            trigger: "bg-default-100 ",
                                                            popoverContent: "",
                                                        }}
                                                    >
                                                        {phpversions
                                                            ?.slice()
                                                            .sort((a, b) => Number(a) - Number(b))
                                                            .map((v) => (
                                                                <SelectItem key={v}>
                                                                    {`PHP ${v}`}
                                                                </SelectItem>
                                                            ))}
                                                    </Select>
                                                    <div className='flex justify-end mt-4 gap-2'>
                                                        <Button
                                                            size='sm'
                                                            variant='light'
                                                            color='danger'
                                                            isDisabled={phpversionloader}
                                                            onPress={() => handleCardOpen("")}>
                                                            cancel
                                                        </Button>

                                                        <Button
                                                            size='sm'
                                                            color='primary'
                                                            isDisabled={phpversionloader}
                                                            isLoading={phpversionloader}
                                                            onPress={Changephpversion}>
                                                            Change
                                                        </Button>

                                                    </div>
                                                </div>

                                            </Card>
                                        </div>
                                    )}
                                    <div ref={webstackref} className="group">
                                        <Card className="p-2 md:p-4 shadow-sm rounded-xl  transition-all duration-200 hover:shadow-md">
                                            <div onClick={() => handleCardOpen("webstackref")}
                                                className={`group cursor-pointer select-none p-4`}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-4">
                                                        <div className="shrink-0 mt-1">
                                                            <Icon icon={"lucide:database"}
                                                                className="text-blue-600 transition-transform group-hover:scale-110"
                                                                width={28} />
                                                        </div>
                                                        <div className='flex flex-col space-y-1'>
                                                            <h2 className="text-[15px] font-semibold text-slate-800 ">
                                                                Change Web Stack
                                                            </h2>
                                                            <p className="text-sm leading-snug text-slate-500  ">
                                                                Change Web Stack allows you to select and switch the web server stack used by the application.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center self-center pl-4">
                                                        <Icon className='text-gray-300'
                                                            icon={cardOpen === "webstackref"
                                                                ? "mdi:chevron-down"
                                                                : "mdi:chevron-right"}
                                                            width={20}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={` ${cardOpen === "webstackref" ? "block" : "hidden"} mt-4 gap-4 px-16 py-8 border-t border-gray-200 `}>
                                                <Select
                                                    label="Web Stack"
                                                    labelPlacement="outside"
                                                    selectedKeys={webstack ? new Set([webstack]) : new Set()}
                                                    onSelectionChange={(keys) =>
                                                        setWebstack([...keys][0] as string)
                                                    }
                                                    classNames={{
                                                        trigger: "bg-default-100 ",
                                                        popoverContent: "",
                                                    }}
                                                    placeholder="Select stack"
                                                    variant="flat"
                                                    disallowEmptySelection
                                                >
                                                    {stacktype.map((s) => <SelectItem key={s.id}>{s.label}</SelectItem>)}
                                                </Select>
                                                <div className='flex justify-end mt-4 gap-2'>
                                                    <Button
                                                        size='sm'
                                                        variant='light'
                                                        color='danger'
                                                        isDisabled={webstackloader}
                                                        onPress={() => handleCardOpen("")}>
                                                        cancel
                                                    </Button>

                                                    <Button
                                                        size='sm'
                                                        color='primary'
                                                        isDisabled={webstackloader}
                                                        isLoading={webstackloader}
                                                        onPress={changeWebstackType}>
                                                        Change
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                    <div ref={domainref} className="group">
                                        <Card className="p-2 md:p-4 shadow-sm rounded-xl  transition-all duration-200 hover:shadow-md">
                                            <div onClick={() => handleCardOpen("domainref")}
                                                className={`group cursor-pointer select-none p-4`}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-4">
                                                        <div className="shrink-0 mt-1">
                                                            <Icon icon={"raphael:globe"} className="text-blue-600 transition-transform group-hover:scale-110"
                                                                width={28} />
                                                        </div>
                                                        <div className='flex flex-col space-y-1'>
                                                            <h2 className="text-[15px] font-semibold text-slate-800 ">
                                                                Domains
                                                            </h2>
                                                            <p className="text-sm leading-snug text-slate-500  max-w-lg">
                                                                Manage your connected domain names
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center self-center pl-4">

                                                        <Icon className='text-gray-300'
                                                            icon={cardOpen === "domainref"
                                                                ? "mdi:chevron-down"
                                                                : "mdi:chevron-right"}
                                                            width={20}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={` ${cardOpen === "domainref" ? "block" : "hidden"} mt-4 gap-4 px-16 py-8 border-t border-gray-200 `}>
                                                <AppDomain />
                                            </div>
                                        </Card>
                                    </div>
                                    <div ref={publicpathref} className="group">
                                        <Card className="p-2 md:p-4 shadow-sm rounded-xl  transition-all duration-200 hover:shadow-md">
                                            <div onClick={() => handleCardOpen("publicpathref")}
                                                className={`group cursor-pointer select-none p-4`}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-4">
                                                        <div className="shrink-0 mt-1">
                                                            <Icon icon={"mynaui:path"}
                                                                className="text-blue-600 transition-transform group-hover:scale-110"
                                                                width={28} />
                                                        </div>
                                                        <div className='flex flex-col space-y-1'>
                                                            <h2 className="text-[15px] font-semibold text-slate-800 ">
                                                                Change Public Path
                                                            </h2>
                                                            <p className="text-sm leading-snug text-slate-500  ">
                                                                Public Path specifies the directory exposed to the web server where the application’s public files are served.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center self-center pl-4">
                                                        <Icon className='text-gray-300'
                                                            icon={cardOpen === "publicpathref"
                                                                ? "mdi:chevron-down"
                                                                : "mdi:chevron-right"}
                                                            width={20}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={` ${cardOpen === "publicpathref" ? "block" : "hidden"} mt-4 gap-4 px-16 py-8 border-t border-gray-200 `}>
                                                <Input
                                                    type="text"
                                                    label="Public Path"
                                                    placeholder="Enter a path"
                                                    value={publicpath}
                                                    onValueChange={(value) => {
                                                        setPublicpath(value);
                                                        setPublicPathError("")
                                                    }}
                                                    errorMessage={publicpathError}
                                                    isInvalid={!!publicpathError}
                                                    variant="flat"
                                                    labelPlacement="outside"
                                                    classNames={{ inputWrapper: "bg-default-100 " }}
                                                    startContent={
                                                        <div className=" hidden md:block  items-center pr-2 border-r border-slate-200 text-slate-400 text-sm">
                                                            {currentWebsite?.website?.public_path && currentWebsite?.website?.public_path.length > 28 ? currentWebsite?.website?.public_path.slice(0, 25) + "..." : currentWebsite?.website?.public_path}
                                                        </div>
                                                    }
                                                />
                                                <div className='flex justify-end mt-4 gap-2'>
                                                    <Button
                                                        size='sm'
                                                        variant='light'
                                                        color='danger'
                                                        isDisabled={publicpathloadear}
                                                        onPress={() => handleCardOpen("")}>
                                                        cancel
                                                    </Button>

                                                    <Button
                                                        size='sm'
                                                        color='primary'
                                                        isDisabled={publicpathloadear}
                                                        isLoading={publicpathloadear}
                                                        onPress={changePublicpath}>
                                                        Change
                                                    </Button>

                                                </div>

                                            </div>
                                        </Card>
                                    </div>
                                    <div ref={nginxsettings} className="group">
                                        <Card className="p-2 md:p-4 shadow-sm rounded-xl  transition-all duration-200 hover:shadow-md">
                                            <div onClick={() => handleCardOpen("nginxsettings")} className={`group cursor-pointer select-none p-4`}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-4">
                                                        <div className="shrink-0 mt-1">
                                                            <Icon icon={"simple-icons:nginx"} className="text-blue-600 transition-transform group-hover:scale-110"
                                                                width={28} />
                                                        </div>
                                                        <div className='flex flex-col space-y-1'>
                                                            <h2 className="text-[15px] font-semibold text-slate-800 ">
                                                                NGINX Settings
                                                            </h2>
                                                            <p className="text-sm leading-snug text-slate-500  ">
                                                                NGINX Settings provide controls to customize server behavior, performance, and routing for your web applications.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center self-center pl-4">
                                                        <Icon className='text-gray-300'
                                                            icon={cardOpen === "nginxsettings"
                                                                ? "mdi:chevron-down"
                                                                : "mdi:chevron-right"}
                                                            width={20}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={` ${cardOpen === "nginxsettings" ? "block" : "hidden"} mt-4 gap-4 px-16 py-8 border-t border-gray-200  `}>
                                                <NginxSttings />
                                            </div>
                                        </Card>
                                    </div>
                                    {type !== "ghost" && type !== "proxyapp" && (
                                        <div ref={phpsettings} className="group">
                                            <Card className="p-2 md:p-4 shadow-sm rounded-xl  transition-all duration-200 hover:shadow-md">
                                                <div onClick={() => handleCardOpen("phpsettings")} className={`group cursor-pointer select-none p-4`}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex gap-4">
                                                            <div className="shrink-0 mt-1">
                                                                <Icon icon={"ri:php-fill"} className="text-blue-600 transition-transform group-hover:scale-110"
                                                                    width={28} />
                                                            </div>
                                                            <div className='flex flex-col space-y-1'>
                                                                <h2 className="text-[15px] font-semibold text-slate-800 ">
                                                                    PHP Settings
                                                                </h2>
                                                                <p className="text-sm leading-snug text-slate-500 ">
                                                                    PHP Settings provide controls to customize PHP configuration, performance, and compatibility for your web applications.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center self-center pl-4">
                                                            <Icon className='text-gray-300'
                                                                icon={cardOpen === "fpmsettings"
                                                                    ? "mdi:chevron-down"
                                                                    : "mdi:chevron-right"}
                                                                width={20}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={` ${cardOpen === "phpsettings" ? "block" : "hidden"} mt-4 gap-4 px-16 py-8 border-t border-gray-200  `}>
                                                    <div className='mb-6'>
                                                        <Input
                                                            type="text"
                                                            label="Open Basedir"
                                                            placeholder="/home/..."
                                                            value={openbasedir}
                                                            errorMessage={openbasedirError}
                                                            isInvalid={!!openbasedirError}
                                                            onValueChange={(value) => {
                                                                setOpenbasedir(value);
                                                                setOpenbasedirError("")
                                                            }}
                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            classNames={{ inputWrapper: "bg-default-100 " }}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">

                                                        <Select
                                                            label="Date Timezone"
                                                            placeholder="Select timezone"
                                                            variant="flat"
                                                            disallowEmptySelection
                                                            selectedKeys={timezone ? new Set([timezone]) : new Set()}
                                                            onSelectionChange={(keys) => {
                                                                const value = Array.from(keys)[0];
                                                                setTimezone(value as string);
                                                            }}
                                                            labelPlacement="outside"
                                                            classNames={{
                                                                trigger: "bg-default-100 ",
                                                                popoverContent: "",
                                                            }}
                                                        >
                                                            {phpTimeZoneList.map((v) => (
                                                                <SelectItem key={v.value}>
                                                                    {v.text}
                                                                </SelectItem>
                                                            ))}

                                                        </Select>
                                                        <Input
                                                            type="text"
                                                            label="Max Execution Time"
                                                            value={String(maxExecutionTime)}
                                                            // onValueChange={(v) => setMaxExecutionTime(Number(v))}
                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                if (Number.isNaN(num)) {
                                                                    setMaxExecutionTimeError("Must be a number");
                                                                    return;
                                                                }
                                                                setMaxExecutionTime(num);
                                                                setMaxExecutionTimeError("");
                                                            }}
                                                            errorMessage={
                                                                maxExecutionTimeerror
                                                            }
                                                            isInvalid={!!maxExecutionTimeerror}
                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            // endContent={<span className="text-slate-400 text-xs">s</span>}
                                                            classNames={{ inputWrapper: "bg-default-100 " }}
                                                        />
                                                        <Input
                                                            type="text"
                                                            label="Max Input Time"
                                                            value={String(maxInputTime)}
                                                            // onValueChange={(v) => setMaxInputTime(Number(v))}

                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                if (Number.isNaN(num)) {
                                                                    setMaxinputtimeError("Must be a number");
                                                                    return;
                                                                }
                                                                setMaxInputTime(num);
                                                                setMaxinputtimeError("");
                                                            }}
                                                            errorMessage={
                                                                maxinputtimeError
                                                            }
                                                            isInvalid={!!maxinputtimeError}
                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            // endContent={<span className="text-slate-400 text-xs">s</span>}
                                                            classNames={{ inputWrapper: "bg-default-100 " }}
                                                        />
                                                        <Input
                                                            type="text"
                                                            label="Max Input Vars"
                                                            value={String(maxInputVars)}
                                                            // onValueChange={(v) => setMaxinputVars(Number(v))}
                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                if (Number.isNaN(num)) {
                                                                    setmaxInputvarsError("Must be a number");
                                                                    return;
                                                                }
                                                                setMaxinputVars(num);
                                                                setmaxInputvarsError("");
                                                            }}
                                                            errorMessage={
                                                                maxinputvarsError
                                                            }
                                                            isInvalid={!!maxinputvarsError}
                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            classNames={{ inputWrapper: "bg-default-100 " }}
                                                        />
                                                        <Input
                                                            type="text"
                                                            label="Memory Limit"
                                                            value={String(memoryLimit)}
                                                            // onValueChange={(v) => setMemoryLimit(Number(v))}
                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                if (Number.isNaN(num)) {
                                                                    setMemoryLimitError("Must be a number");
                                                                    return;
                                                                }
                                                                setMemoryLimit(num);
                                                                setMemoryLimitError("");
                                                            }}
                                                            errorMessage={
                                                                memoryLimitError
                                                            }
                                                            isInvalid={!!memoryLimitError}

                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            endContent={<span className="text-slate-400 text-xs">MB</span>}
                                                            classNames={{ inputWrapper: "bg-default-100 " }}
                                                        />
                                                        <Input
                                                            type="text"
                                                            label="Post Max Size"
                                                            value={String(postMaxSize)}
                                                            // onValueChange={(v) => setpostMaxSize(Number(v))}
                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                if (Number.isNaN(num)) {
                                                                    setPostmaxSizeError("Must be a number");
                                                                    return;
                                                                }
                                                                setpostMaxSize(num);
                                                                setPostmaxSizeError("");
                                                            }}
                                                            errorMessage={
                                                                postMaxSizeError
                                                            }
                                                            isInvalid={!!postMaxSizeError}
                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            endContent={<span className="text-slate-400 text-xs">MB</span>}
                                                            classNames={{ inputWrapper: "bg-default-100" }}
                                                        />
                                                        <Input
                                                            type="text"
                                                            label="Upload Max Filesize"
                                                            value={String(UploadMaxFIleSize)}
                                                            // onValueChange={(v) => setUploadMaxFileSize(Number(v))}
                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                if (Number.isNaN(num)) {
                                                                    setUploadMaxFilesizeError("Must be a number");
                                                                    return;
                                                                }
                                                                setUploadMaxFileSize(num);
                                                                setUploadMaxFilesizeError("");
                                                            }}
                                                            errorMessage={
                                                                UploadMaxfilesizeError
                                                            }
                                                            isInvalid={!!UploadMaxfilesizeError}
                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            endContent={<span className="text-slate-400 text-xs">MB</span>}
                                                            classNames={{ inputWrapper: "bg-default-100" }}
                                                        />
                                                        <Input
                                                            type="text"
                                                            label="Session Max Lifetime"
                                                            value={String(maxLifetime)}
                                                            // onValueChange={(v) => setMaxLifeTime(Number(v))}

                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                if (Number.isNaN(num)) {
                                                                    setmaxlifetimeError("Must be a number");
                                                                    return;
                                                                }
                                                                setMaxLifeTime(num);
                                                                setmaxlifetimeError("");
                                                            }}
                                                            errorMessage={
                                                                maxlifetimeError
                                                            }
                                                            isInvalid={!!maxlifetimeError}
                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            endContent={<span className="text-slate-400 text-xs">s</span>}
                                                            classNames={{ inputWrapper: "bg-default-100 " }}
                                                        />
                                                    </div>
                                                    <div className='mb-6'>
                                                        <Textarea
                                                            label="Disable Functions"
                                                            labelPlacement="outside"
                                                            value={disableFuncton}
                                                            onValueChange={(v) => setDisableFunction(v)}
                                                            variant="flat"
                                                            minRows={3}
                                                            classNames={{ inputWrapper: "bg-default-100" }}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <Select
                                                            label="Process Manager"
                                                            labelPlacement="outside"
                                                            selectedKeys={processmanager ? new Set([processmanager]) : new Set()}
                                                            onSelectionChange={(keys) => {
                                                                setProcessManager([...keys][0] as string);
                                                                handleprocessMnager()
                                                            }}
                                                            variant="flat"
                                                            disallowEmptySelection
                                                            classNames={{
                                                                trigger: "bg-default-100",
                                                                popoverContent: "",
                                                                value: "text-gray-400"
                                                            }}
                                                        >
                                                            <SelectItem key="ondemand">Ondemand</SelectItem>
                                                            <SelectItem key="static">Static</SelectItem>
                                                            <SelectItem key="dynamic">Dynamic</SelectItem>
                                                        </Select>

                                                        {processmanager === "dynamic" && (
                                                            <>

                                                                <Input
                                                                    type='text'
                                                                    label="pm.start_servers"
                                                                    value={String(startservers)}
                                                                    onValueChange={(value) => {
                                                                        const num = Number(value);
                                                                        if (Number.isNaN(num)) {
                                                                            setStartServerError("Must be a number");
                                                                            return;
                                                                        }
                                                                        setStartServers(num);
                                                                        setStartServerError("");
                                                                    }}
                                                                    errorMessage={
                                                                        startserverError
                                                                    }
                                                                    isInvalid={!!startserverError}

                                                                    variant="flat"
                                                                    labelPlacement="outside"
                                                                    classNames={{ inputWrapper: "bg-default-100 " }}
                                                                />
                                                                <Input
                                                                    type='text'
                                                                    label="pm.min_spare_servers"
                                                                    value={String(minspareservers)}
                                                                    onValueChange={(value) => {
                                                                        const num = Number(value);
                                                                        if (Number.isNaN(num)) {
                                                                            setMinSpareserverError("Must be a number");
                                                                            return;
                                                                        }
                                                                        setMinSpareServers(num);
                                                                        setMinSpareserverError("");
                                                                    }}
                                                                    errorMessage={
                                                                        minspareserverError
                                                                    }
                                                                    isInvalid={!!minspareserverError}

                                                                    variant="flat"
                                                                    labelPlacement="outside"
                                                                    classNames={{ inputWrapper: "bg-default-100" }}
                                                                />
                                                                <Input
                                                                    type='text'
                                                                    label="pm.max_spare_servers"
                                                                    value={String(maxspareservers)}
                                                                    onValueChange={(value) => {
                                                                        const num = Number(value);
                                                                        if (Number.isNaN(num)) {
                                                                            setmaxSpareError("Must be a number");
                                                                            return;
                                                                        }
                                                                        setMaxSpareServers(num);
                                                                        setmaxSpareError("");
                                                                    }}
                                                                    errorMessage={
                                                                        maxSpareError
                                                                    }
                                                                    isInvalid={!!maxSpareError}

                                                                    variant="flat"
                                                                    labelPlacement="outside"
                                                                    classNames={{ inputWrapper: "bg-default-100 " }}
                                                                />
                                                            </>

                                                        )}
                                                        <Input
                                                            type='text'
                                                            label="pm.max_children"
                                                            value={String(maxchildren)}
                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                if (Number.isNaN(num)) {
                                                                    setMaxchildrenError("Must be a number");
                                                                    return;
                                                                }
                                                                setMaxchildren(num);
                                                                setMaxchildrenError("");
                                                            }}
                                                            errorMessage={
                                                                maxchildrenError
                                                            }
                                                            isInvalid={!!maxchildrenError}

                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            classNames={{ inputWrapper: "bg-default-100 " }}
                                                        />
                                                        <Input
                                                            type="text"
                                                            label="pm.max_requests"
                                                            value={String(maxrequest)}
                                                            errorMessage={maxrequestError}
                                                            isInvalid={!!maxrequestError}
                                                            onValueChange={(value) => {
                                                                const num = Number(value);
                                                                if (Number.isNaN(num)) {
                                                                    setMaxrequestError("Must be a number");
                                                                    return;
                                                                }
                                                                setMaxRequest(num);
                                                                setMaxrequestError("");
                                                            }}

                                                            variant="flat"
                                                            labelPlacement="outside"
                                                            classNames={{ inputWrapper: "bg-default-100 " }}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-4 mt-4">
                                                        <h3 className="text-sm font-bold text-default-400 uppercase tracking-widest">PHP Features</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex items-center justify-between p-4 rounded-xl border  border-default-100 bg-default-50/50 hover:bg-default-50 transition-colors">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="text-sm font-semibold text-slate-700 ">Allow URL Fopen</span>
                                                                    <span className="text-[10px] text-default-400 uppercase font-bold   ">allow_url_fopen</span>
                                                                </div>
                                                                <Switch
                                                                    defaultSelected
                                                                    size="sm"
                                                                    color="primary"
                                                                    isSelected={allowurlfopen}
                                                                    // isDisabled={globalLoading}
                                                                    onValueChange={(v) => { setAllowUrlfOpen(v) }}
                                                                    classNames={{
                                                                        base: "w-10 h-4",
                                                                        wrapper: "w-8 h-4",
                                                                        thumb: "w-2 h-2",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-between p-4 rounded-xl border  border-default-100 bg-default-50/50 hover:bg-default-50 transition-colors">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="text-sm font-semibold text-slate-700 ">Short Open Tag</span>
                                                                    <span className="text-[10px] text-default-400 uppercase font-bold  ">short_open_tag</span>
                                                                </div>
                                                                <Switch
                                                                    defaultSelected
                                                                    size="sm"
                                                                    color="primary"
                                                                    isSelected={shortopentag}
                                                                    // isDisabled={globalLoading}
                                                                    onValueChange={(v) => { setShortOpenTag(v) }}
                                                                    classNames={{
                                                                        base: "w-10 h-4",
                                                                        wrapper: "w-8 h-4",
                                                                        thumb: "w-2 h-2",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-end mt-6 gap-2'>
                                                        <Button
                                                            size='sm'
                                                            variant='light'
                                                            color='danger'
                                                            isDisabled={fpmLoader}
                                                            onPress={() => handleCardOpen("")}>
                                                            cancel
                                                        </Button>

                                                        <Button
                                                            size='sm'
                                                            color='primary'
                                                            isDisabled={fpmLoader}
                                                            isLoading={fpmLoader}
                                                            onPress={changephpConfig}
                                                        >
                                                            Change
                                                        </Button>

                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    )}
                                </div>

                            </div>
                            <div className="hidden lg:block sticky top-6 self-start">
                                <Card className="p-4 rounded-xl shadow-sm border border-default-100 w-64 max-h-[calc(100vh-120px)] overflow-y-auto">
                                    <Listbox aria-label="Profile Sections" variant="light">
                                        {menuItems.map((item) => (
                                            <ListboxItem
                                                className={cn("py-3 px-4 rounded-lg text-default-700 hover:text-default-900 hover:bg-primary-50  transition-colors")}
                                                key={item.id}
                                                startContent={<Icon icon={item.icon} width={20} className="text-default-500" />}
                                                onPress={() => {
                                                    item.ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                                                    setCardopen(item.id);
                                                    handleFields();
                                                }}
                                            >
                                                {item.name}
                                            </ListboxItem>
                                        ))}
                                    </Listbox>
                                </Card>
                            </div>
                        </div>

                    </Card>
                </div>

            </div >

        </div >
    )
}

export default WebSettings