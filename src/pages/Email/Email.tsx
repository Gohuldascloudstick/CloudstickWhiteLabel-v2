
import { addToast, Button, Card, Divider, Input, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import EmailForwardingModal from "./EmailForwardingModal";
import ChangePasswordModal from "./ChangePasswordModal";
import UpdateQuotaModal from "./UpdateQuotaModal";

import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { createEmailAccount, deleteEmail, getEmailList, getForwardEmail } from "../../redux/slice/EmailSlice";
import { getWebDetails } from "../../redux/slice/websiteSlice";
import type { email } from "../../utils/interfaces";


const Email = () => {

    const [storage, setStorage] = useState("unlimited");
    const [username, setUsername] = useState("");
    const [userNameError, setUserNameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [limit, setLimit] = useState("");
    const [limitError, setLimitError] = useState("")
    const [unit, setUnit] = useState("MB");
    const [selectedEmail, setSelectedEmail] = useState<email | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [emailLoader, setEmailLoader] = useState(false);
    const emails = useAppSelector(state => state.Email.email)

    const [deleteLoader, setDeleteLoader] = useState(false)
    const currentWebsite = useAppSelector(
        (state) => state.website.selectedWebsite
    );
    const [openDeletePopover, setDeletePopover] = useState("");
    const domain = currentWebsite?.website?.domains?.[0] ?? "";
    const handlechange = (value: string) => {
        setPasswordError("")
        setPassword(value)
    }

    const resetFormState = () => {
        setUsername("");
        setPassword("");
        setUserNameError("");
        setPasswordError("");
        setShowPassword(false);
        setLimit("");
        setStorage("unlimited");
        setLimitError("");

    };

    const generatePassword = (length = 16) => {
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()_-+=";
        const allChars = lowercaseChars + uppercaseChars + numberChars + symbolChars;
        let password = "";
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
        return password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");
    }
    const getWebsiteDetails = async () => {
        try {
            await dispatch(getWebDetails()).unwrap();
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getWebsiteDetails()
    }, [])
    const dispatch = useAppDispatch();
    const {
        isOpen: isEmailForwardModalOpen,
        onOpen: onEmailForwardModalOpen,
        onOpenChange: onEmailForwardModalOpenChange,
    } = useDisclosure();
    const {
        isOpen: isChangePasswordModalOpen,
        onOpen: onChangePasswordModalOpen,
        onOpenChange: onChangePasswordModalOpenChange,
    } = useDisclosure();
    const {
        isOpen: isUpdateQuotaModalOpen,
        onOpen: onUpdateQuotaModalOpen,
        onOpenChange: onUpdateQuotaModalOpenChange,
    } = useDisclosure();
    const getemaillist = async () => {
        try {
            await dispatch(getEmailList()).unwrap();
        } catch (error) {
            console.log(error);
        }
    }
    const handleSubmit = async () => {
        if (!username.trim()) {
            setUserNameError("Username cannot be empty")
        }
        if (/\s/.test(username)) {
            setUserNameError("Username cannot contain spaces");
            return;
        }
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            setUserNameError("Username can only contain letters and numbers");
            return;
        }
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long.")
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter.");
            return;
        }
        if (!/[a-z]/.test(password)) {
            setPasswordError("Password must contain at least one lowercase letter.");
            return;
        }
        if (!/[0-9]/.test(password)) {
            setPasswordError("Password must contain at least one number.");
            return;
        }
        if (!/[!@#$%^&*(),.?"_:{}|<>]/.test(password)) {
            setPasswordError("Password must contain at least one special character.");
            return;
        }
        if (storage == 'limited') {
            if (!limit.trim()) {
                setLimitError("Limit cannot be empty");
                return;
            }
            if (isNaN(Number(limit))) {
                setLimitError("Limit must be a number");
                return;
            }
            if (Number(limit) <= 0) {
                setLimitError("Limit must be greater than 0");
                return;
            }
        }
        let data: {
            name: string;
            password: string;
            quota_type: string;
            quota_value?: number;
            quota_unit?: string;
        } = {

            "name": username,
            "password": password,
            "quota_type": storage,
        }
        if (storage == 'limited') {
            data.quota_value = Number(limit)
            data.quota_unit = unit
        }

        try {
            setEmailLoader(true);
            await dispatch(createEmailAccount({ data: data })).unwrap();
            resetFormState()
            addToast({
                title: "Email Account Created Successfully",
                color: "success",

            })
            getemaillist();
        } catch (error) {
            addToast({
                title: "Email Account Creation Failed",
                color: "danger",
                description: String(error)
            })
        } finally {
            setEmailLoader(false)
        }

    }
    const getForwaredEmailList = async (name: string) => {
        const forward_data = {
            "name": name.replace(`@${domain}`, "")
        }
        try {
            await dispatch(getForwardEmail({ data: forward_data })).unwrap();
        } catch (error) {
            console.log(error)
        }
    }
    const handleForwardEmail = (email: email) => {
        setSelectedEmail(email)
        onEmailForwardModalOpen();
        getForwaredEmailList(email.email);
    }
    const handleChangePassword = (email: email) => {
        setSelectedEmail(email)
        onChangePasswordModalOpen();
    }
    const handleChangeQuota = (email: email) => {
        setSelectedEmail(email)
        onUpdateQuotaModalOpen()
    }
    const handleDeleteEmail = (email: email) => {
        
        setSelectedEmail(email)

    }
    const handleDelete = async (name: string) => {
        try {
            console.log(selectedEmail, "22222")
            console.log("1111111111", name.replace(`@${selectedEmail?.domain}`, ""))
            setDeleteLoader(true);
            await dispatch(deleteEmail({ name: name.replace(`@${selectedEmail?.domain}`, "") })).unwrap();
            addToast({
                title: "Email account deleted successfully",
                color: "success"
            })

            setDeletePopover("null")
            getemaillist();
        } catch (error) {
            addToast({
                title: "Email account deletion failed",
                description: String(error),
                color: "danger"
            })

        } finally {
            setDeleteLoader(false);
        }
    }


    useEffect(() => {
        getemaillist();
    }, [])
    return (
        <div className=" lg:p-2 overflow-y-auto scrollbar-hide">
            <p className=" text-xl md:text-2xl lg:text-3xl">Welcome to
                <span className=" ml-1 font-bold text-teal-600">
                    Email Accounts
                </span>
            </p>
            <p className="mt-1 md:mt-2 lg:mt-2 text-xs md:text-sm lg:text-md text-gray-500">
                This feature lets you create and manage email accounts.
            </p>
            <div className=" mt-3 lg:mt-6  w-full  ">
                <div className=" w-full space-y-6 ">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className=" px-3 md:px-6 py-2 md:py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-sm md:text-md lg:text-lg">Create an Email Account</span>
                        </div>
                        <Divider />
                        <div className=" p-4 lg:p-8 flex flex-col gap-3 lg:gap-6 font-sans">
                            <div className="">
                                <Input
                                    label="User Name"
                                    placeholder="Enter user name "
                                    type="text"
                                    variant="bordered"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value.trim());
                                        if (userNameError) setUserNameError("");
                                    }}
                                    isRequired
                                    isInvalid={!!userNameError}
                                    errorMessage={userNameError}
                                    labelPlacement="outside"
                                    classNames={{
                                        label: " text-xs md:text-sm",
                                        input: "  placeholder:text-xs md:placeholder:text-sm",
                                    }}
                                    endContent={
                                        <>
                                            <span className='text-gray-400 text-sm hidden md:block'>
                                                @{domain}
                                            </span>
                                            <span className='text-gray-400 text-xs md:hidden'>
                                                @{`${domain.length > 20
                                                    ? domain.slice(0, 20) + "..."
                                                    : domain}`}
                                            </span>
                                        </>
                                    }
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="Password (min 8 characters)"
                                    placeholder="Enter password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    readOnly
                                    variant="bordered"
                                    onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                                    onChange={(e) => {
                                        setPassword(e.target.value.trim());
                                        if (passwordError) setPasswordError("");
                                    }}
                                    classNames={{
                                        label: " text-xs md:text-sm",
                                        input: "  placeholder:text-xs md:placeholder:text-sm",
                                    }}
                                    isRequired
                                    isInvalid={!!passwordError}
                                    errorMessage={passwordError}
                                    labelPlacement="outside"
                                    endContent={
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                onPress={() => handlechange(generatePassword())}
                                                className="p-1 text-xs md:text-sm  min-w-0 h-auto text-blue-500"
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <RadioGroup
                                    orientation="horizontal"
                                    value={storage}
                                    classNames={{
                                        label: " text-xs md:text-sm",

                                    }}
                                    onValueChange={(v) => {
                                        setStorage(v as "limited" | "unlimited")
                                        setLimit("")
                                        setUnit("MB")
                                        setLimitError("")
                                    }
                                    }
                                    label="Storage Space">
                                    <Radio value="limited" classNames={{ label: "text-slate-600 text-xs md:text-sm" }} >Limited</Radio>
                                    <Radio value="unlimited" classNames={{ label: "text-slate-600 text-xs md:text-sm" }}>Unlimited</Radio>
                                </RadioGroup>
                            </div>
                            {storage === "limited" && (

                                <div className="">
                                    <Input
                                        placeholder="Enter the limit"
                                        value={limit}
                                        variant="bordered"
                                        isInvalid={!!limitError}
                                        errorMessage={limitError}
                                        classNames={{
                                            label: " text-xs md:text-sm",
                                            input: "  placeholder:text-xs md:placeholder:text-sm",
                                        }}
                                        onChange={(e) => {
                                            setLimit(e.target.value),
                                                setLimitError("")
                                        }}
                                        endContent={
                                            <Select
                                                aria-label="Unit"
                                                size="sm"
                                                variant="flat"
                                                selectedKeys={[unit]}
                                                className="w-25"
                                                disallowEmptySelection
                                                classNames={{
                                                    trigger: "h-6 min-h-6 px-1",
                                                    value: " text-xs md:text-sm lg:text-md !text-gray-500 p-2",
                                                    popoverContent: " min-w-[75px]",
                                                }}
                                                onSelectionChange={(keys) =>
                                                    setUnit([...keys][0] as string)
                                                }
                                            >
                                                {["B", "KB", "MB", "GB", "TB"].map((u) => (
                                                    <SelectItem key={u}>{u}</SelectItem>
                                                ))}
                                            </Select>
                                        } />
                                </div>
                            )}
                            <div className="mt-2 flex justify-end">
                                <Button onPress={handleSubmit}
                                    isLoading={emailLoader}
                                    isDisabled={emailLoader}
                                    className="bg-orange-600 text-xs md:text-sm text-white font-medium px-2 md:px-6 rounded-md hover:bg-[#d96b28] transition-colors"
                                    size="md"
                                >
                                    <span className="hidden md:block">
                                        Create Email Account
                                    </span>
                                    <span className="blcok md:hidden">Create</span>

                                </Button>
                            </div>
                        </div>
                    </Card>
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-3 md:px-6 py-2 md:py-4 bg-linear-to-r from-[#2168a1] to-[#11999e] ">
                            <span className="font-bold text-white text-sm md:text-md lg:text-lg"> Email</span>
                        </div>
                        <Divider />
                        {emails.length > 1 ? (
                            <div className="flex flex-col gap-4 w-full overflow-x-auto ">
                                <Table className="min-w-225"
                                    classNames={{
                                        wrapper: "p-0  rounded-xs overflow-hidden",
                                        th: "text-xs bg-gray-50/50 text-slate-700 font-bold uppercase tracking-wider h-12",
                                        td: " text-xs md:text-sm py-4 px-4 border-b border-gray-100",
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn width={400}>
                                            Accounts
                                        </TableColumn>
                                        <TableColumn align="center">
                                            <div className="flex items-center gap-4">
                                                <span>Restrictions	</span>

                                            </div>
                                        </TableColumn>
                                        <TableColumn>
                                            {/* <Input
                                                isClearable
                                                className="max-w-50"
                                                placeholder="Search..."
                                                size="sm"
                                                startContent={<Icon icon="ic:baseline-search" width={24} className="text-default-400" />}
                                                variant="bordered"
                                            /> */}<>
                                            </>
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody className="">
                                        {emails?.slice(1).map((email) => (
                                            <TableRow key="1">
                                                <TableCell className="text-slate-800 font-medium">
                                                    {email.email}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-12  items-center">
                                                        <p>
                                                            {email.quota_mb === 0 ? "Unlimited" : email.quota_mb}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-between pr-2">
                                                        <Button
                                                            size="sm"
                                                            variant="bordered"
                                                            onPress={() => handleForwardEmail(email)}
                                                            startContent={
                                                                <div className="text-gray-400">
                                                                    <Icon icon={"uiw:mail"} width={16} />
                                                                </div>
                                                            }
                                                            className=" text-sm">
                                                            Email  Forwarding
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="bordered"
                                                            onPress={() => handleChangePassword(email)}
                                                            startContent={
                                                                <div className="text-gray-400">
                                                                    <Icon icon={"ic:baseline-mail-lock"} width={16} />
                                                                </div>
                                                            }
                                                            className=" text-sm">
                                                            Change Password
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="bordered"
                                                            onPress={() => handleChangeQuota(email)}
                                                            startContent={
                                                                <div className="text-gray-400">
                                                                    <Icon icon={"eos-icons:quota"} width={16} />
                                                                </div>
                                                            }
                                                            className=" text-sm">
                                                            Quota
                                                        </Button>
                                                        <Popover isOpen={openDeletePopover === email.email}
                                                            onOpenChange={(isOpen) => {
                                                                if (isOpen) {
                                                                    handleDeleteEmail(email);
                                                                    setDeletePopover(email.email);
                                                                } else {
                                                                    setDeletePopover("");
                                                                }
                                                            }}>
                                                            <PopoverTrigger>
                                                                <Button
                                                                    size="sm"
                                                                    variant="bordered"

                                                                    startContent={
                                                                        <div className="text-gray-400">
                                                                            <Icon icon={"ic:baseline-delete"} width={16} />
                                                                        </div>
                                                                    }
                                                                    className=" text-sm">
                                                                    Delete
                                                                </Button>

                                                            </PopoverTrigger>
                                                            <PopoverContent className="p-4 min-w-75 space-y-4 pt-4 rounded-md  dark:bg-slate-900">
                                                                <div className=' text-center flex flex-col items-center'>
                                                                    <Icon icon="lucide:alert-triangle" width={20} className="text-red-500 shrink-0 mt-0.5" />
                                                                    <p className="text-xs text-default-700 text-center text-wrap mt-1">
                                                                        Are you sure you want to delete this Forward email <br /> <span className='font-semibold'>{email.email}?</span>
                                                                    </p>
                                                                </div>
                                                                <div className="flex justify-end gap-2 w-full">
                                                                    <Button variant="flat" size="sm" className="w-full"
                                                                        isDisabled={deleteLoader}
                                                                        onPress={() => setDeletePopover("")}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        color="danger"
                                                                        size="sm"
                                                                        className="w-full"
                                                                        isLoading={deleteLoader}
                                                                        isDisabled={deleteLoader}
                                                                        onPress={() => handleDelete(email.email)}
                                                                    >
                                                                        Delete
                                                                    </Button>
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
                        ) : (<div className="bg-white p-6 md:p-12 text-xs md:text-sm flex items-center justify-center ">
                            <span>You haven’t created any email accounts yet.</span>


                        </div>)}

                    </Card>
                </div>

            </div >
            <EmailForwardingModal isOpen={isEmailForwardModalOpen} onOpenChange={onEmailForwardModalOpenChange} name={selectedEmail?.email ?? ""} domain={selectedEmail?.domain ?? ""} />
            <ChangePasswordModal isOpen={isChangePasswordModalOpen} onOpenChange={onChangePasswordModalOpenChange} name={selectedEmail?.email ?? ""} domain={selectedEmail?.domain ?? ""} />
            <UpdateQuotaModal isOpen={isUpdateQuotaModalOpen} onOpenChange={onUpdateQuotaModalOpenChange} email={selectedEmail?.email ?? ""} domain={selectedEmail?.domain ?? ""} />
        </div >
    )
}

export default Email