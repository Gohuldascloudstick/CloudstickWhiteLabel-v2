import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem } from "@heroui/react"
import type React from "react";

interface GrantUSerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
const GrantPermissionModal: React.FC<GrantUSerProps> = ({
    isOpen,
    onOpenChange,
}) => {
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
                                label="Select Database"
                                labelPlacement="outside"
                                placeholder="Please Select an option"
                                variant="bordered"
                            >
                                <SelectItem>
                                    vandanatest_new_database
                                </SelectItem>
                            </Select>
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
                            <Select
                                label="Select Database"
                                labelPlacement="outside"
                                placeholder="Please Select an option"
                                variant="bordered"
                            >
                                <SelectItem>
                                    vandanatest_new_database
                                </SelectItem>
                            </Select>
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

                            <Input
                                variant="bordered"
                                label="IP/HOST"
                                labelPlacement="outside"
                                placeholder="IP/HOST"
                            />
                        </div>
                        <div className="flex justify-end my-4 items-center gap-2">
                            <Button
                                variant="light"
                                size="sm"
                                className=""
                                onPress={()=>onOpenChange(false)}>
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