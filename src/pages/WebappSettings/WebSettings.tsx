import { Button, Card, Checkbox, Divider, Input, Select, SelectItem, Textarea } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { useAppSelector } from "../../redux/hook"


const WebSettings = () => {
    const [cardOpen, setCardopen] = useState("")
    const phpversions = useAppSelector(state => state.website.phpversion)
    const currentWebsite = useAppSelector((state) => state.website.selectedWebsite);
    const [phpVersion, setPhpVersion] = useState<string>(currentWebsite?.php_version?.slice(0, 1) + "." + currentWebsite?.php_version?.slice(1));
    const [webstack, setWebstack] = useState<string>(currentWebsite?.website?.stack_type || "null");
    const [phpversionloader, setPhpversionLoader] = useState(false);
    const [publicpathError, setPublicPathError] = useState("")
    const [publicpathloadear, setPublicPathLoader] = useState(false);
    const [webstackloader, setWebstackLoader] = useState(false);
    const [publicpath, setPublicpath] = useState("");
    const stacktype = [
        { id: "nginx", label: "Native Nginx" },
        { id: "nginx+apache", label: "Nginx + Apache" },
    ];

    return (
        <div className="max-h-[90vh]  p-2 overflow-y-auto scrollbar-hide">
            <p className="text-3xl">Welcome to
                <span className=" font-bold text-teal-600">
                    Web Application Settings
                </span>
            </p>
            <div className="mt-12  w-full  ">
                <div className=" w-full space-y-6 ">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 text-white bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <Icon
                                icon="ri:php-fill"
                                className="text-white transition-transform group-hover:scale-110"
                                width={22}
                            />
                            <span className="font-bold  text-lg"> PHP Version Management</span>
                        </div>
                        <Divider />
                        <div className=" pt-6 py-2  px-12" >
                            <Select
                                label="PHP Version"
                                placeholder="Select version"
                                variant="bordered"
                                disallowEmptySelection
                                selectedKeys={phpVersion ? new Set([phpVersion]) : new Set()}
                                onSelectionChange={(keys) =>
                                    setPhpVersion([...keys][0] as string)
                                }
                                labelPlacement="outside"
                                classNames={{
                                    trigger: "bg-default-100 dark:bg-default-300",
                                    popoverContent: "dark:bg-default-300 dark:text-white",
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
                            <div className="p-4 flex justify-end">
                                <Button
                                    size='sm'
                                    className="bg-orange-600 text-xs md:text-sm text-white font-medium px-2 md:px-6 rounded-md hover:bg-[#d96b28] transition-colors"
                                    isDisabled={phpversionloader}
                                    isLoading={phpversionloader}
                                // onPress={Changephpversion}
                                >
                                    Change
                                </Button>
                            </div>
                        </div>

                    </Card>
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 ">
                            <Icon icon={"mynaui:path"}
                                className=" transition-transform group-hover:scale-110"
                                width={22} />
                            <span className="font-bold  text-lg"> Change Public Path</span>
                        </div>
                        <Divider />
                        <div className=" pt-6 py-2  px-12" >
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
                                variant="bordered"
                                labelPlacement="outside"
                                classNames={{ inputWrapper: "bg-default-100 dark:bg-default-300" }}
                                startContent={
                                    <div className=" hidden md:block  items-center pr-2 border-r border-slate-200 text-slate-400 text-sm">
                                        {currentWebsite?.website?.public_path && currentWebsite?.website?.public_path.length > 28 ? currentWebsite?.website?.public_path.slice(0, 25) + "..." : currentWebsite?.website?.public_path}
                                    </div>
                                }
                            />
                            <div className="p-4 flex justify-end">
                                <Button
                                    className="bg-orange-600 text-xs md:text-sm text-white font-medium px-2 md:px-6 rounded-md hover:bg-[#d96b28] transition-colors"
                                    size='sm'
                                    color='primary'
                                    isDisabled={publicpathloadear}
                                    isLoading={publicpathloadear}
                                // onPress={changePublicpath}
                                >
                                    Change
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 ">
                            <Icon icon={"lucide:database"}
                                className=" transition-transform group-hover:scale-110"
                                width={22} />
                            <span className="font-bold  text-lg"> Change Web Stack</span>
                        </div>
                        <Divider />
                        <div className=" pt-6 py-2  px-12" >
                            <Select
                                label="Web Stack"
                                labelPlacement="outside"
                                selectedKeys={webstack ? new Set([webstack]) : new Set()}
                                onSelectionChange={(keys) =>
                                    setWebstack([...keys][0] as string)
                                }
                                classNames={{
                                    trigger: "bg-default-100 dark:bg-default-300",
                                    popoverContent: "dark:bg-default-300 dark:text-white",
                                }}
                                placeholder="Select stack"
                                variant="flat"
                                disallowEmptySelection
                            >
                                {stacktype.map((s) => <SelectItem key={s.id}>{s.label}</SelectItem>)}
                            </Select>
                            <div className="p-4 flex justify-end">

                                <Button
                                    className="bg-orange-600 text-xs md:text-sm text-white font-medium px-2 md:px-6 rounded-md hover:bg-[#d96b28] transition-colors"
                                    size='sm'
                                    color='primary'
                                    isDisabled={webstackloader}
                                    isLoading={webstackloader}
                                // onPress={changeWebstackType}
                                >
                                    Change
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 text-white bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <Icon icon={"bi:globe"} className="" width={22} />
                            <span className="font-bold  text-lg">Add Web Application to Server CloudStick</span>
                        </div>
                        <Divider />
                        <div className=" pt-6 py-2 flex flex-col gap-4 px-12" >




                            <div className="flex-1 flex flex-col gap-6">


                               
                                <span className="font-bold">NGINX Settings</span>
                                <Checkbox >
                                    Clickjacking Protection

                                </Checkbox>
                                <Checkbox >
                                    Cross-site scripting (XSS) Protection
                                </Checkbox>
                                <Checkbox >
                                    Mime Sniffing Protection

                                </Checkbox>
                                <span className="font-bold">FPM Settings</span>
                                <Select
                                    label="Process Manager"
                                    labelPlacement="outside"
                                    placeholder="Please select one"
                                    variant="bordered"
                                >
                                    <SelectItem >
                                        Ondemand
                                    </SelectItem>
                                    <SelectItem>
                                        Dynamic
                                    </SelectItem>
                                    <SelectItem>
                                        Static
                                    </SelectItem>
                                </Select>

                                <Input
                                    type="text"
                                    placeholder="50"
                                    label="pm.max_children"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="500"
                                    label="pm.max_requests"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="20"
                                    label="pm.start_servers"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="10"
                                    label="pm.min_spare_servers"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="10"
                                    label="pm.max_spare_servers"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <span className="font-bold">
                                    PHP Settings
                                </span>
                                <Input
                                    type="text"
                                    placeholder="/home/vandanatest/apps/app-qzykx/:/var/lib/php/session:/tmp"
                                    label="open_basedir"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Select
                                    label="date.timezone"
                                    labelPlacement="outside"
                                    placeholder="Please select one"
                                    variant="bordered"
                                >
                                    <SelectItem >
                                        UTC
                                    </SelectItem>

                                </Select>
                                <Textarea
                                    label="disable.functions"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    placeholder="getmyuid,passthru,leak,listen,diskfreespace,tmpfile,link,shell_exec,dl,exec,system,highlight_file,source,show_source,fpassthru,virtual,posix_ctermid,posix_getcwd,posix_getegid,posix_geteuid,posix_getgid,posix_getgrgid,posix_getgrnam,posix_getgroups,posix_getlogin,posix_getpgid,posix_getpgrp,posix_getpid,posix,_getppid,posix_getpwuid,posix_getrlimit,posix_getsid,posix_getuid,posix_isatty,posix_kill,posix_mkfifo,posix_setegid,posix_seteuid,posix_setgid,posix_setpgid,posix_setsid,posix_setuid,posix_times,posix_ttyname,posix_uname,proc_open,proc_close,proc_nice,proc_terminate,escapeshellcmd,ini_alter,popen,pcntl_exec,socket_accept,socket_bind,socket_clear_error,socket_close,socket_connect,symlink,posix_geteuid,ini_alter,socket_listen,socket_create_listen,socket_read,socket_create_pair,stream_socket_server">

                                </Textarea>
                                <Input
                                    type="text"
                                    placeholder="30"
                                    label="max_execution_time"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />




                                <Input
                                    type="text"
                                    placeholder="60"
                                    label="max_input_time"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />

                                <Input
                                    type="text"
                                    placeholder="1000"
                                    label="max_input_vars"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="256"
                                    label="max_input_vars"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="256"
                                    label="post_max_size (Nginx and PHP) (in MB)"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="256"
                                    label="upload_max_filesize (in MB)"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="256"
                                    label="session.gc_maxlifetime (in seconds)"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Checkbox >
                                    allow_url_fopen

                                </Checkbox>
                                <Checkbox >
                                    short_open_tag
                                </Checkbox>



                                <div className="flex justify-end m-4">
                                    <Button
                                        className="bg-orange-600 text-white text-sm px-8 rounded-sm"
                                        size="sm"
                                    >
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </div>


                    </Card>






                </div>

            </div >

        </div >
    )
}

export default WebSettings