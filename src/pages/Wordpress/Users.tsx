import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useEffect, useState } from "react";
import { dleteWordpressUser, getWorpressUser, UpdateWordpressUser } from "../../redux/slice/WordPressManager";
import { Icon } from "@iconify/react";


const Users = () => {
    const dispatch = useAppDispatch();
    const WordPressUSers = useAppSelector((state) => state.wordPressManger.wordpressUSer
    );
    const [paswwordview, setPasswordview] = useState(false);
    const [userDeleteloader, setUserDeleteLoader] = useState(false);
    const [popOverId, setPopOverId] = useState('')
    const [updateid, setUpdateid] = useState('');
    const [newPassword, setNewPassword] = useState("");

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [usercreationloader, setUsercretaionLoader] = useState(false);
    const getwordpressusers = async () => {
        try {
            await dispatch(getWorpressUser()).unwrap();
        } catch (error) {
            console.log(error)
        }

    }
    const handleDleteUSer = async (userid: string) => {
        setUserDeleteLoader(true);
        try {
            await dispatch(
                dleteWordpressUser({ id: userid })
            ).unwrap();
            addToast({
                title: "WordPress User Deletion",
                description: ` WordPress user Deleted`,
                color: "success",
            });
        } catch (error: any) {
            addToast({
                title: "WordPress User Deletion",
                description: error,
                color: "danger",
            });
        } finally {
            setUserDeleteLoader(false);
        }
    };

    const handleChangePassword = async () => {
        setUsercretaionLoader(true); // Reusing loader for simplicity
        try {
            // Here you would dispatch a thunk to update the password only
            // Example: await dispatch(updateWordPressPassword({ webid, serverid: id, id: updateid, password: newPassword })).unwrap();
            await dispatch(UpdateWordpressUser({ id: updateid, data: { password: newPassword } })).unwrap();
            addToast({
                title: "Password Updated",
                description: `Password for ${newUsername} has been updated.`,
                color: "success",
            });

            setIsChangePasswordModalOpen(false);
            setNewPassword(''); // Clear password input
        } catch (error: any) {
            addToast({
                title: "Password Update Failed",
                description: error,
                color: "danger",
            });
        } finally {
            setUsercretaionLoader(false);
        }
    };
    useEffect(() => {
        getwordpressusers()
    }, [])
    return (
        <div>
            <Table classNames={{
                wrapper: "p-0 rounded-xs overflow-hidden",
                th: "bg-gray-50/50 text-slate-700 font-bold uppercase tracking-wider h-12",
                td: "py-4 px-4 border-b border-gray-100",
            }}>
                <TableHeader>
                    <TableColumn>
                        USERNAME
                    </TableColumn>
                    <TableColumn>
                        EMAIL
                    </TableColumn>
                    <TableColumn>
                        ROLE
                    </TableColumn>
                    <TableColumn>
                        CREATED ON
                    </TableColumn>
                    <TableColumn>
                        ACTION
                    </TableColumn>

                </TableHeader>
                <TableBody>
                    {WordPressUSers && WordPressUSers.map((users) => (
                        <TableRow>
                            <TableCell>
                                {users?.user_name}
                            </TableCell>
                            <TableCell>
                                {users?.email}
                            </TableCell>
                            <TableCell>
                                {users?.role}
                            </TableCell>
                            <TableCell>
                                {users.created_at}
                            </TableCell>
                            <TableCell>
                                <Popover
                                    isOpen={popOverId == users.id}
                                    onOpenChange={(open) => setPopOverId(open ? users.id : '')}
                                    placement="bottom-end"
                                    className=" shadow-none rounded-md"
                                    classNames={{
                                        base: "rounded-sm shadow-none dark:bg-slate-900",
                                    }}
                                >
                                    <PopoverTrigger>
                                        <Button
                                            startContent={
                                                <Icon
                                                    icon="lucide:ellipsis-vertical"
                                                    className="text-default-700"
                                                    width={20}
                                                />
                                            }
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent className=" rounded-sm shadow-xl py-3">
                                        <div className=" w-40!  ">
                                            <Button
                                                onPress={() => {

                                                    setUpdateid(users.id);
                                                    setNewUsername(users.user_name);
                                                    setIsChangePasswordModalOpen(true);
                                                    setPopOverId('')
                                                }}
                                                size="sm"
                                                color="default"
                                                variant="light"
                                                className=" w-full group"
                                                startContent={
                                                    <Icon
                                                        icon="lucide:lock"
                                                        className=" group-hover:scale-110 transition-all duration-75 ease-soft-spring "
                                                    />
                                                }
                                            >
                                                Change Password
                                            </Button>
                                            <Button
                                                onPress={() => handleDleteUSer(users.id)}
                                                isLoading={userDeleteloader}
                                                size="sm"
                                                color="danger"
                                                variant="light"
                                                className=" w-full group"
                                                startContent={
                                                    !userDeleteloader && (
                                                        <Icon
                                                            icon="lucide:trash-2"
                                                            className=" group-hover:scale-110 transition-all duration-75 ease-soft-spring "
                                                        />
                                                    )
                                                }
                                            >
                                                Delete User
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>

            </Table>
            <Modal
                isOpen={isChangePasswordModalOpen}
                onOpenChange={setIsChangePasswordModalOpen}
                placement="center"
                size="md" // Slightly larger for better label visibility
                backdrop="blur"
                isDismissable={false}
                classNames={{
                    base: "dark:bg-slate-900",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleChangePassword();
                            }}
                        >
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Icon
                                        icon="lucide:lock"
                                        className="text-primary"
                                        width={22}
                                    />
                                    <span>Change Password</span>
                                </div>
                            </ModalHeader>

                            <ModalBody>
                                <div className="py-2">
                                    <Input
                                        label="New Password"
                                        placeholder="Enter or generate a new password"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={newPassword}
                                        onValueChange={setNewPassword}
                                        type={paswwordview ? "text" : "password"}
                                        isRequired
                                        classNames={{
                                            label: "text-sm font-medium",
                                        }}
                                        endContent={
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    isIconOnly
                                                    variant="light"

                                                    size="sm"
                                                    className="focus:outline-none"
                                                    onPress={() => setPasswordview(!paswwordview)}
                                                >
                                                    <Icon
                                                        icon={paswwordview ? "lucide:eye-off" : "lucide:eye"}
                                                        className="text-default-400"
                                                        width={16}
                                                    />
                                                </Button>
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    color="primary"
                                                    className="h-7 text-[10px] px-2"
                                                    onPress={() => {
                                                        const generatedPassword = Math.random().toString(36).slice(-10);
                                                        setNewPassword(generatedPassword);
                                                    }}
                                                >
                                                    Generate
                                                </Button>
                                            </div>
                                        }
                                    />
                                    <p className="text-xs text-default-500 mt-2">
                                        Ensure your new password is secure and easy to remember.
                                    </p>
                                </div>
                            </ModalBody>

                            <ModalFooter className="py-6">
                                <Button
                                    variant="light"
                                    color="danger"
                                    size="sm"
                                    onPress={() => {
                                        setNewPassword('');
                                        onClose();
                                    }}

                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    size="sm"
                                    onPress={handleChangePassword}
                                    isLoading={usercreationloader}
                                    isDisabled={!newPassword || usercreationloader}

                                >
                                    Update
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Users