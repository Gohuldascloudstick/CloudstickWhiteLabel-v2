import { Button, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem } from "@heroui/react"
import type React from "react";
import { useState } from "react";

interface GrantUSerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
const GrantPermissionModal: React.FC<GrantUSerProps> = ({
    isOpen,
    onOpenChange,
}) => {
    // const [selectedUser, setSelectedUsr] = useState("")
    const [selectedHost, setSelectedHost] = useState("")
    const HOST_OPTIONS = ["Local Host", "Remote Host"];
    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                hideCloseButton
                size="xl">

                <ModalContent>
                    <ModalHeader className="bg-linear-to-r from-[#2168a1] to-[#11999e] text-white ">
                        Grant User
                    </ModalHeader>
                    <ModalBody>
                        <span className="text-gray-600 text-sm">
                            You can start creating Databases here. In case you are not able to create any databases please contact our Support.
                        </span>
                        <div className="mt-2 flex flex-col gap-6">

                            <Select
                                label="Select Users"
                                labelPlacement="outside"
                                placeholder="Please Select an option"
                                variant="bordered"
                            >
                                <SelectItem>
                                    vandanatest_gohul
                                </SelectItem>
                            </Select>

                            {/* <Select
                                label="Select User"
                                isRequired
                                placeholder="Select a user"
                                selectedKeys={selectedUser}
                                onSelectionChange={(value)=>setSelectedUsr(value)}
                                isInvalid={errors.selectedUser}
                                errorMessage={errors.selectedUser ? "User selection is required" : undefined}
                                variant="bordered"
                                labelPlacement="outside"
                                classNames={{ popoverContent: "dark:bg-slate-900" }}
                                className="mb-4"
                            >
                                {filterdUserList.map(user => (
                                    <SelectItem key={user.id}>{user.db_user_name}</SelectItem>
                                ))}
                            </Select> */}


                            <Select
                                label="Privileges"
                                labelPlacement="outside"
                                placeholder="Please Select an option"
                                variant="bordered"
                            >
                                <SelectItem>
                                    UPDATE
                                </SelectItem>
                                <SelectItem>
                                    SELECT
                                </SelectItem>
                                <SelectItem>
                                    TRIGGER
                                </SelectItem>
                            </Select>

                            <Select
                                label="Host"
                                placeholder="Select Host"
                                selectedKeys={selectedHost}
                                onSelectionChange={() => setSelectedHost}
                                variant="bordered"
                                labelPlacement="outside"
                                classNames={{ popoverContent: "dark:bg-slate-900" }}
                                className="mb-4"
                            >
                                {HOST_OPTIONS.map(option => (
                                    <SelectItem key={option}>{option}</SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex justify-end my-4 items-center gap-2">
                            <Button
                                variant="light"
                                size="sm"
                                className=""
                                onPress={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button variant="solid" size="sm" className="bg-orange-600 rounded-md text-white">
                                Add
                            </Button>
                        </div>

                    </ModalBody>
                </ModalContent>

            </Modal>
        </>
    )
}

export default GrantPermissionModal