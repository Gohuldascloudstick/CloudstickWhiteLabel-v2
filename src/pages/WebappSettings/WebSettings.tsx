import { Button, Card, Checkbox, Divider, Input, Select, SelectItem, Textarea } from "@heroui/react"
import { Icon } from "@iconify/react"


const WebSettings = () => {
    return (
        <div>
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                Web Application Settings
            </span>
            </p>


            <div className="mt-12  w-full  ">
                <div className=" w-full space-y-6 max-h-[73vh] overflow-y-auto scrollbar-hide">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 text-white bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <Icon icon={"bi:globe"} className="" width={22} />
                            <span className="font-bold  text-lg">Add Web Application to Server CloudStick</span>
                        </div>
                        <Divider />

                        <div className=" pt-6 py-2 px-12" >
                            <div className="flex-1 flex flex-col gap-6">
                                <Input
                                    variant="bordered"
                                    label="File System Quota Size (in MB,GB,TB)"
                                    labelPlacement="outside"
                                    disabled
                                    placeholder="You can't use this feature since File System Quota is disabled"
                                    classNames={{
                                        inputWrapper: "bg-slate-300",
                                        input:"placeholder:text-gray-400"
                                        
                                    }}
                                />


                                <Input
                                    type="password"
                                    label="Password"
                                    labelPlacement="outside"
                                    placeholder="Enter Password"
                                    variant="bordered"
                                    endContent={
                                        <div className="flex items-center gap-2">


                                            <Button
                                                size="sm"
                                                variant="light"
                                                isIconOnly
                                                // onPress={() => setShowNewPassword(!showNewPassword)}
                                                className="p-1 min-w-0 h-auto"
                                            >
                                                <Icon
                                                    icon={"lucide:eye"}
                                                    className="text-xl text-default-400"
                                                />
                                            </Button>
                                            <span className="text-xs text-blue-500">Generate</span>
                                        </div>
                                    }
                                />
                                <div className="flex justify-end">
                                    <Button variant="solid" size="sm" className="bg-orange-600 text-white rounded-md">
                                        Update
                                    </Button>
                                </div>

                                <Input
                                    type="text"
                                    placeholder="/home/vandanatest/apps/"
                                    label="Public Path"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Select
                                    label="PHP Version"
                                    labelPlacement="outside"
                                    placeholder="Please select one"
                                    variant="bordered"
                                >
                                    <SelectItem >
                                        PHP 8.2
                                    </SelectItem>
                                    <SelectItem>
                                        PHP 8.3
                                    </SelectItem>
                                </Select>
                                <Select
                                    label="Web Application Stack"
                                    labelPlacement="outside"
                                    placeholder="Please select one"
                                    variant="bordered"
                                >
                                    <SelectItem >
                                        Native Nginx
                                    </SelectItem>
                                    <SelectItem>
                                        Nginx + Appache
                                    </SelectItem>
                                </Select>
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