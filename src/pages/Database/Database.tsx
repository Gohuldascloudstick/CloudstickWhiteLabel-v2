import { addToast, Button, Card, Divider, Input, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@heroui/react"
import { Icon } from "@iconify/react"
import GrantPermissionModal from "./GrantPermissionModal"
import EditDatabaseModal from "./editDatabaseModal";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { creatDatabase, CreateDbuser, DeleteDb, DeleteDbuser, getAppDatabaseassineduserlist, getAPPDatabaselist, getAppDatabaseUserLIst } from "../../redux/slice/databaseSlice";
import type { AppDbUser } from "../../utils/interfaces";






const Database = () => {

    const COLLATION_OPTIONS = [
        "armscii8_general_ci", "ascii_general_ci", "big5_chinese_ci", "binary", "cp1250_general_ci",
        "cp1251_general_ci", "cp1256_general_ci", "cp1257_general_ci", "cp850_general_ci", "cp852_general_ci",
        "cp866_general_ci", "cp932_japanese_ci", "dec8_swedish_ci", "eucjpms_japanese_ci", "euckr_korean_ci",
        "gb2312_chinese_ci", "gbk_chinese_ci", "geostd8_general_ci", "greek_general_ci", "hebrew_general_ci",
        "hp8_english_ci", "keybcs2_general_ci", "koi8r_general_ci", "koi8u_general_ci", "latin1_swedish_ci",
        "latin2_general_ci", "latin5_turkish_ci", "latin7_general_ci", "macce_general_ci", "macroman_general_ci",
        "sjis_japanese_ci", "swe7_swedish_ci", "tis620_thai_ci", "ucs2_general_ci", "ujis_japanese_ci",
        "utf8_general_ci"
    ];
    const HOST_OPTIONS = [
        { id: 'local_host', label: 'Local Host' },
        { id: 'remote_host', label: 'Remote Host' },
    ];
    const {
        isOpen: isGrantUserModalOpen,
        onOpen: onGrantUserModalOpen,
        onOpenChange: onGrantUserModalOpenChange,
    } = useDisclosure();
    const {
        isOpen: isDatabaseEditModalOpen,
        onOpen: onDatabaseEditModalOpen,
        onOpenChange: onDatabaseEditModalOpenChange
    } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState<AppDbUser | null>(null);
    const [databasename, setDatabaseName] = useState("")
    const databaselist = useAppSelector((state) => state.Database.AppDatabase);
    const databaseuserlist = useAppSelector((state) => state.Database.AppDb_User)
    const [databasenameError, setDatabaseNameError] = useState("")
    const [collation, setCollation] = useState("")
    const [host, setHost] = useState("")
    const [ip, setIp] = useState("")
    const [ipError, setIpError] = useState("")
    const [hostError, setHostError] = useState("")
    const [databaseUserName, setDatabaseUserName] = useState("")
    const [databaseUserNameError, setDatabaseUsernameError] = useState("")
    const [databaseUserPassword, setdatabaseUserPassword] = useState("")
    const [databaseUserPasswordError, setdatabaseUserPasswordError] = useState("")
    const [deleteId, setDeleteId] = useState(0)
    const [databaseCreateLoader, setDatabasecreateLoader] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [deleteLoader, setDeleteLoader] = useState(false)
    const dispatch = useAppDispatch();
    const [dleteLoader, setDeleLoader] = useState(false)
    const [deletePopover, setDeletePopover] = useState<number | null>(null);
    const validateDatabaseName = (name: string) => {
        if (!name) return "Database name is required";

        if (!/^[A-Za-z]/.test(name))
            return "Must start with a letter";

        if (!/^[A-Za-z0-9_]+$/.test(name))
            return "Only letters, numbers, and underscores are allowed";

        if (name.length > 63)
            return "Must be less than 64 characters";

        return "";
    };
    const handleDelete = async (dbId: number) => {
        try {
            setDeleLoader(true)
            await dispatch(DeleteDb({ Dbid: dbId })).unwrap()
            await dispatch(getAPPDatabaselist()).unwrap()
            addToast({ description: 'Database deleted successfully', color: 'success' })
            setDeletePopover(null)
        } catch (error: any) {
            addToast({ description: String(error), color: "danger" });
        } finally {
            setDeleLoader(false)
        }
    }
    const handleDeleteDbuser = async (user: AppDbUser) => {
        try {
            setDeleteLoader(true)
            await dispatch(DeleteDbuser({ dbuserid: user.id })).unwrap()
            await dispatch(getAppDatabaseUserLIst())
            addToast({ description: 'User Removed From Server Successfully', color: 'success' })
        } catch (error: any) {
            addToast({ description: String(error), color: 'danger' })
        } finally {
            setDeleteLoader(false)
        }
    };
    const handleCreateDatabase = async () => {
        const error = validateDatabaseName(databasename);
        if (error) {
            setDatabaseNameError(error)
            return;
        }
        const payload: any = {
            database: {
                db_name: databasename,
                db_collation: collation,
            },
        };

        try {
            setDatabasecreateLoader(true)
            await dispatch(creatDatabase({ data: payload })).unwrap();
            await dispatch(getAPPDatabaselist())
            addToast({
                description: `Database ${databasename} created successfully.`,
                color: "success",
            });
            setDatabaseName("")
            setCollation("")

        } catch (error) {
            addToast({
                description: String(error) || "Failed to create database.",
                color: "danger",
            });
        } finally {
            setDatabasecreateLoader(false)
        }
    }
    const generatePassword = (length = 16) => {
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()_-+=";

        const allChars = lowercaseChars + uppercaseChars + numberChars + symbolChars;
        let password = "";

        // Ensure at least one character from each set
        password += lowercaseChars.charAt(
            Math.floor(Math.random() * lowercaseChars.length)
        );
        password += uppercaseChars.charAt(
            Math.floor(Math.random() * uppercaseChars.length)
        );
        password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
        password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));

        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Shuffle the password to randomize character positions
        return password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");
    };
    const fetchDatabaseList = async () => {
        try {
            await dispatch(getAPPDatabaselist()).unwrap();
            await dispatch(getAppDatabaseassineduserlist()).unwrap();
            await dispatch(getAppDatabaseUserLIst());
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchDatabaseList();
        // FetchRemoteAccessStatus()
    }, []);
    const clearUserField = () => {
        setDatabaseUserName("");
        setdatabaseUserPassword("")
        setHost("")
        setDatabaseNameError("")
        setdatabaseUserPasswordError("")
        setHostError("")
        setIp("")
        setIpError("")
    }
    const isValidIP = (ip: string) => {
        const regex =
            /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
        return regex.test(ip);
    };
    const handleCreateUser = async () => {
        if (host === "remote_host" && !isValidIP(ip)) {
            setIpError("Please enter a valid IP address")
            return;
        }
        if (databaseUserPassword.length < 8) {
            setdatabaseUserPasswordError("Password must be at least 8 characters long.")
            return;
        }
        if (!/[A-Z]/.test(databaseUserPassword)) {
            setdatabaseUserPasswordError("Password must contain at least one uppercase letter.");
            return;
        }
        if (!/[a-z]/.test(databaseUserPassword)) {
            setdatabaseUserPasswordError("Password must contain at least one lowercase letter.");
            return;
        }
        if (!/[0-9]/.test(databaseUserPassword)) {
            setdatabaseUserPasswordError("Password must contain at least one number.");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(databaseUserPassword)) {
            setdatabaseUserPasswordError("Password must contain at least one special character.");
            return;
        }
        if (!/^[A-Za-z][A-Za-z0-9_]{2,29}$/.test(databaseUserName)) {
            setDatabaseUsernameError(
                "3–30 chars, start with a letter, letters/numbers/underscore only."
            );
            return;
        }
        if (!host.trim()) {
            setHostError("Host cannot be empty")
            return;
        }
        let hosttype = ""
        if (host === "local_host") {
            hosttype ="localhost"
        } else if (host === "remote_host") {
            hosttype = ip
        }

        const data: any = {
            db_user_name: databaseUserName,
            password: databaseUserPassword,
            host: hosttype,
        };
        try {
            await dispatch(CreateDbuser({ data })).unwrap()
            await dispatch(getAppDatabaseUserLIst())
            addToast({ description: 'New user Added Successfully', color: 'success' })
            clearUserField()
        } catch (error: any) {
            addToast({ description: String(error), color: 'danger' })
        }
    }
    return (
        <div className="">
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                MySQL® Databases
            </span>
            </p>
            <p className="mt-4 text-gray-500">
                Manage large amounts of information over the web easily. MySQL databases are necessary to run many web-based applications, such as bulletin boards, content management systems, and online shopping carts. For more information, read the documentation.
            </p>
            <div className="mt-6  w-full  ">
                <div className=" w-full space-y-6 ">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-lg">Create Database</span>
                        </div>
                        <Divider />
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-8 py-8 ">
                            <div className="flex flex-col md:flex-row items-center grow gap-6 w-full">
                                <div className="flex items-center gap-3 shrink-0">
                                    <Icon icon="mdi:database-edit" className="text-blue-900" width={40} />
                                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                        Create Database
                                    </span>
                                </div>
                                <div className="w-full max-w-md">
                                    <Input
                                        label="Database Name"
                                        placeholder="e.g., my_app_db"
                                        value={databasename}
                                        onValueChange={(value) => { setDatabaseName(value), setDatabaseNameError("") }}
                                        isInvalid={!!databasenameError}
                                        errorMessage={databasenameError}
                                        isRequired
                                        className="col-span-full"
                                        variant="bordered"
                                        labelPlacement="outside"
                                    />
                                </div>


                                <div className="flex items-center gap-3 w-full md:w-72">
                                    <Select
                                        label="Collation (Optional)"
                                        placeholder="Select collation"
                                        selectedKeys={collation ? new Set([collation]) : new Set()}

                                        variant="bordered"
                                        labelPlacement="outside"
                                        onSelectionChange={(keys) => {
                                            const value = String([...keys][0]);
                                            setCollation(value);
                                        }}
                                        classNames={{ popoverContent: "dark:bg-slate-900" }}
                                    >
                                        {COLLATION_OPTIONS.map(option => (
                                            <SelectItem key={option}>{option}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>


                            <div className="shrink-0 w-full lg:w-auto">
                                <Button isLoading={databaseCreateLoader} isDisabled={databaseCreateLoader} onPress={handleCreateDatabase} className="w-full lg:w-auto px-2 text-white font-semibold bg-linear-to-r from-[#2168a1] to-[#11999e]">
                                    Create Database
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 ">
                            <Icon icon={"pepicons-pencil:database-circle"} className="text-blue-900" width={22} />
                            <span className="font-bold text-indigo-900 text-lg">Existing Databases</span>
                        </div>
                        <Divider />
                        <div className="flex flex-col gap-4">
                            <Table
                                classNames={{
                                    wrapper: "p-0  rounded-xs overflow-hidden",
                                    th: "bg-gray-50/50 text-slate-700 font-bold uppercase tracking-wider h-12",
                                    td: "py-4 px-4 border-b border-gray-100",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn width={400}>
                                        <div className="flex items-center gap-4">
                                            <span>Name</span>
                                            <Input
                                                isClearable
                                                className="max-w-50"
                                                placeholder="Search Database"
                                                size="sm"
                                                startContent={<Icon icon="ic:baseline-search" width={24} className="text-default-400" />}
                                                variant="bordered"
                                            />
                                        </div>
                                    </TableColumn>
                                    <TableColumn align="center">Grant Permission</TableColumn>
                                    <TableColumn align="center">Privileged Users</TableColumn>
                                    <TableColumn align="center">Actions</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {databaselist.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-500">
                                                No database found
                                            </TableCell>
                                        </TableRow>
                                    ) :
                                        databaselist.map((data) => (
                                            <TableRow key={data.id}>
                                                <TableCell className="text-slate-800 font-medium">
                                                    {data?.db_name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center">
                                                        <span className="flex items-center gap-1 cursor-pointer text-blue-800" onClick={onGrantUserModalOpen}>
                                                            Grant User
                                                            <Icon icon="mdi:user-plus-outline" fontSize={20} className="mb-0.5" />
                                                        </span>

                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-gray-400 text-xs italic">None assigned</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center">
                                                        <Popover isOpen={deletePopover === data.id} onOpenChange={(open) => open ? setDeletePopover(data.id) : ""}>
                                                            <PopoverTrigger>
                                                                <Button
                                                                    key="delete"
                                                                    variant="light"


                                                                    size="sm"
                                                                    color="danger"
                                                                >
                                                                    <Icon icon={"lucide:trash-2"} width={16} />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="dark:bg-slate-900">
                                                                <div className="w-64 p-2 ">
                                                                    <div className="flex flex-col gap-3 ">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="p-2 rounded-full bg-danger-100 text-danger-600">
                                                                                <Icon
                                                                                    icon="lucide:alert-triangle"
                                                                                    width={16}
                                                                                />
                                                                            </div>
                                                                            <h4 className="font-semibold text-sm text-default-800 dark:text-white">
                                                                                Confirm Removal
                                                                            </h4>
                                                                        </div>

                                                                        <p className="text-xs text-default-800 leading-relaxed text-center">
                                                                            Are you sure you want to remove the database ? <br />This action cannot be undone.
                                                                        </p>
                                                                        <div className="flex justify-end gap-2 mt-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="light"
                                                                                color="default"
                                                                                className="self-start px-1 py-1 h-auto font-normal text-xs "
                                                                                onPress={() => setDeletePopover(null)}
                                                                                disabled={dleteLoader}

                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                color="danger"
                                                                                className="self-start px-1 py-1 h-auto font-normal text-xs"
                                                                                onPress={() => handleDelete(data.id)}
                                                                                isLoading={dleteLoader}
                                                                                disabled={dleteLoader}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2">
                            <Icon icon={"fontisto:mysql"} className="text-blue-900" width={22} />
                            <span className="font-bold text-indigo-900 text-lg">MySQL Users</span>
                        </div>
                        <Divider />
                        <div className="flex items-start gap-2 p-6 min-w-30 ">
                            <Icon icon={"tdesign:user-add-filled"} fontSize={28} className="text-slate-700" />
                            <h3 className="text-lg font-medium text-slate-700">Add User</h3>
                        </div>
                        <div className=" py-2 px-12" >
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label="Database User Name"
                                        placeholder="e.g., app_user"
                                        value={databaseUserName}
                                        onValueChange={(value) => {
                                            setDatabaseUserName(value),
                                                setDatabaseUsernameError("")
                                        }}
                                        isInvalid={!!databaseUserNameError}
                                        errorMessage={databaseUserNameError}
                                        isRequired
                                        variant="bordered"
                                        labelPlacement="outside"
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="Password"
                                        placeholder="Enter the password"
                                        value={databaseUserPassword}
                                        type={showPassword ? "text" : "password"}
                                        onValueChange={(value) => { setdatabaseUserPassword(value), setdatabaseUserPasswordError("") }}
                                        isInvalid={!!databaseUserPasswordError}
                                        errorMessage={databaseUserPasswordError}
                                        isRequired
                                        variant="bordered"
                                        labelPlacement="outside"
                                        endContent={
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => {
                                                        setdatabaseUserPassword(generatePassword()), setdatabaseUserPasswordError("")
                                                    }}
                                                    className="p-1 min-w-0 h-auto text-blue-500"
                                                >
                                                    Generate
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => setShowPassword(!showPassword)}
                                                    className="p-1 min-w-0 h-auto"
                                                >
                                                    <Icon
                                                        icon={showPassword ? "lucide:eye" : "lucide:eye-off"}
                                                        className="text-xl text-default-400"
                                                    />
                                                </Button>
                                            </div>
                                        }
                                    />
                                    <Select
                                        label="Host"
                                        placeholder="Select Host"
                                        selectedKeys={host ? new Set([host]) : new Set()}
                                        variant="bordered"
                                        disallowEmptySelection
                                        labelPlacement="outside"
                                        onSelectionChange={(keys) => {
                                            const value = String([...keys][0]);
                                            setHost(value);
                                            setHostError("")
                                        }}
                                        className="col-span-full md:col-span-1"
                                        classNames={{ popoverContent: "dark:bg-slate-900" }}
                                        isRequired
                                        isInvalid={!!hostError}
                                        errorMessage={hostError}
                                    >
                                        {HOST_OPTIONS.map(option => (
                                            <SelectItem key={option.id}>{option.label}</SelectItem>
                                        ))}
                                    </Select>
                                    {
                                        host === "remote_host" && (
                                            <Input
                                                label="IP/Host"
                                                placeholder="Ip/Host"
                                                value={ip}
                                                onValueChange={(value) => {
                                                    setIp(value),
                                                        setIpError("")

                                                }}
                                                isInvalid={!!ipError}
                                                errorMessage={ipError}
                                                isRequired
                                                variant="bordered"
                                                labelPlacement="outside"
                                            />
                                        )}
                                </div>
                                <div className="flex justify-end m-4">
                                    <Button
                                        onPress={handleCreateUser}
                                        className="bg-linear-to-r from-[#2168a1] to-[#11999e] text-white text-sm px-8 rounded-sm"
                                        size="sm"
                                    >
                                        Create User
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2">
                            <Icon icon={"solar:user-circle-linear"} className="text-blue-900" width={22} />
                            <span className="font-bold text-indigo-900 text-lg">Existing Users</span>
                        </div>
                        <Divider />
                        <div>
                            <Table
                                classNames={{
                                    wrapper: "p-0  rounded-xs overflow-hidden",
                                    th: "bg-gray-50/50 text-slate-700 font-bold uppercase tracking-wider h-12",
                                    td: "py-4 px-4 border-b border-gray-100",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn width={400}>
                                        <div className="flex items-center gap-4">
                                            <span>Users</span>
                                            <Input
                                                isClearable
                                                className="max-w-50"
                                                placeholder="Search User"
                                                size="sm"
                                                startContent={<Icon icon="ic:baseline-search" className="text-default-400" width={24} />}
                                                variant="bordered"
                                            />
                                        </div>
                                    </TableColumn>
                                    <TableColumn align="end">Actions</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {databaseuserlist.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-gray-500">
                                                No database User found
                                            </TableCell>
                                        </TableRow>
                                    ) :
                                        databaseuserlist?.map((item) => (
                                            <TableRow >
                                                <TableCell className="text-slate-800 font-medium">
                                                    {item.db_user_name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end">
                                                        <Tooltip content="Edit database">
                                                            <Button onPress={() => { setSelectedUser(item); onDatabaseEditModalOpen() }} className="text-gray-500 hover:text-red-500" isIconOnly variant="light" color="default" size="sm">
                                                                <Icon icon="ri:edit-line" fontSize={20} />
                                                            </Button>
                                                        </Tooltip>
                                                        <Popover isOpen={deleteId == item.id} onOpenChange={(open) => open ? setDeleteId(item.id) : setDeleteId(0)} classNames={{ base: 'dark:bg-slate-900 border border-default-200  rounded-xl ' }} >
                                                            <PopoverTrigger>
                                                                <Button
                                                                    variant="light"
                                                                    color="danger"
                                                                    size="sm"
                                                                    isIconOnly
                                                                    className="w-8 h-8 rounded-full hover:bg-danger-50 hover:dark:bg-danger-900/50"

                                                                >
                                                                    <Icon icon="lucide:trash-2" width={16} />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <div className="    w-64 p-2 ">
                                                                    <div className="flex flex-col gap-3 ">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="p-2 rounded-full bg-danger-100 text-danger-600">
                                                                                <Icon icon="lucide:alert-triangle" width={16} />
                                                                            </div>
                                                                            <h4 className="font-semibold text-sm text-default-800 dark:text-white">
                                                                                Confirm Removal
                                                                            </h4>
                                                                        </div>
                                                                        <p className="text-xs text-default-500 leading-relaxed text-center">
                                                                            Are you sure you want to remove user <br />{" "}
                                                                            <span className="font-semibold text-default-700 dark:text-white">
                                                                                {item.db_user_name}
                                                                            </span>{" "}
                                                                            from this Server ? <br />This action cannot be undone.
                                                                        </p>
                                                                        <div className="flex justify-end gap-2 mt-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="light"
                                                                                color="default"
                                                                                className="self-start px-1 py-1 h-auto font-normal text-xs "
                                                                                onPress={() => setDeleteId(0)}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                color="danger"
                                                                                className="self-start px-1 py-1 h-auto font-normal text-xs"
                                                                                onPress={() => handleDeleteDbuser(item)}
                                                                                isLoading={deleteLoader}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div >
            <GrantPermissionModal isOpen={isGrantUserModalOpen} onOpenChange={onGrantUserModalOpenChange} />
            <EditDatabaseModal isOpen={isDatabaseEditModalOpen} onOpenChange={onDatabaseEditModalOpenChange} selectedUser={selectedUser} />
        </div >
    )
}

export default Database