
import { Button, Card, Checkbox, Divider, Input, Radio, RadioGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useState } from "react"
import EmailForwardingModal from "./EmailForwardingModal";
import ChangePasswordModal from "./ChangePasswordModal";
import UpdateQuotaModal from "./UpdateQuotaModal";

const Email = () => {
    const [storage, setStorage] = useState("unlimited");
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

    return (
        <div>
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                Email Accounts
            </span>
            </p>
            <p className="mt-4 text-gray-500">
                This feature lets you create and manage email accounts.
            </p>
            <div className="mt-6  w-full  ">
                <div className=" w-full space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-lg">Create an Email Account</span>
                        </div>
                        <Divider />
                        <div className="p-8 flex flex-col gap-6 font-sans">
                            <div className="">
                                <Input
                                    variant="bordered"
                                    placeholder="Enter Username"
                                    label="Username"
                                    labelPlacement="outside"
                                    endContent={
                                        <div className="bg-slate-50 border-l px-3 py-2 -mr-3 text-slate-400 text-sm whitespace-nowrap">
                                            @app-qzykx.fPhYnEyHcueeKGC.vanadana.site
                                        </div>
                                    }
                                />
                            </div>
                            <div className="">
                                <Input
                                    type="password"
                                    variant="bordered"
                                    label="Password"
                                    labelPlacement="outside"
                                    placeholder="Enter Password"

                                    endContent={
                                        <button className="text-slate-400 focus:outline-none">
                                            <Icon icon="mdi:eye-off-outline" fontSize={20} />
                                        </button>
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <RadioGroup orientation="horizontal" value={storage} onValueChange={(value) => setStorage(value)} label="Storage Space">
                                    <Radio value="limited" classNames={{ label: "text-slate-600 text-sm" }} >Limited</Radio>
                                    <Radio value="unlimited" classNames={{ label: "text-slate-600 text-sm" }}>Unlimited</Radio>
                                </RadioGroup>
                            </div>
                            {storage === "limited" && (

                                <div className="">
                                    <Input
                                        label="Quota"
                                        labelPlacement="outside"
                                        type="text"
                                        variant="bordered"
                                        placeholder="Enter Quota Limit"
                                        className="flex-1  outline-none text-sm"
                                        endContent={
                                            <span className="text-gray-500">
                                                MB
                                            </span>
                                        }
                                    />
                                </div>
                            )
                            }

                            <Checkbox defaultSelected radius="sm" classNames={{ label: "text-slate-600 text-sm" }}>
                                Send a welcome email with instructions to set up an email client
                            </Checkbox>
                            <div className="mt-2">
                                <Button
                                    className="bg-[#f07c33] text-white font-medium px-6 rounded-md hover:bg-[#d96b28] transition-colors"
                                    size="md"
                                >
                                    Create Email Account
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]  ">
                            <span className="font-bold text-white text-lg">Existing Databases</span>
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
                                        Accounts
                                    </TableColumn>
                                    <TableColumn align="center">
                                        <div className="flex items-center gap-4">
                                            <span>Restrictions	</span>
                                            <Input
                                                isClearable
                                                className="max-w-50"
                                                placeholder="Search..."
                                                size="sm"
                                                startContent={<Icon icon="ic:baseline-search" width={24} className="text-default-400" />}
                                                variant="bordered"
                                            />
                                        </div>
                                    </TableColumn>
                                </TableHeader>

                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell className="text-slate-800 font-medium">
                                            vandanatest_new_database
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 justify-between items-center">
                                                <p>
                                                    Unlimited
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="bordered"
                                                        onPress={onEmailForwardModalOpen}
                                                        startContent={
                                                            <div>
                                                                <Icon icon={"fluent:mail-16-regular"} width={24} />
                                                            </div>
                                                        }
                                                        className="p-6 text-sm">
                                                        Email  Forwarding
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="bordered"
                                                        onPress={onChangePasswordModalOpen}
                                                        startContent={
                                                            <div>
                                                                <Icon icon={"fluent:mail-16-regular"} width={24} />
                                                            </div>
                                                        }
                                                        className="p-6 text-sm">
                                                        Change Password
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="bordered"
                                                        onPress={onUpdateQuotaModalOpen}
                                                        startContent={
                                                            <div>
                                                                <Icon icon={"fluent:mail-16-regular"} width={24} />
                                                            </div>
                                                        }
                                                        className="p-6 text-sm">
                                                        Quota
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="bordered"
                                                        startContent={
                                                            <div>
                                                                <Icon icon={"fluent:mail-16-regular"} width={24} />
                                                            </div>
                                                        }
                                                        className="p-6 text-sm">
                                                        Delete
                                                    </Button>
                                                </div>


                                            </div>
                                        </TableCell>

                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                    </Card>
                </div>

            </div >
            <EmailForwardingModal isOpen={isEmailForwardModalOpen} onOpenChange={onEmailForwardModalOpenChange} />
            <ChangePasswordModal isOpen={isChangePasswordModalOpen} onOpenChange={onChangePasswordModalOpenChange} />
            <UpdateQuotaModal isOpen={isUpdateQuotaModalOpen} onOpenChange={onUpdateQuotaModalOpenChange} />
        </div >
    )
}

export default Email