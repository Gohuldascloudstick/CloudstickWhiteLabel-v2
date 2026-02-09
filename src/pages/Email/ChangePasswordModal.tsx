import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import type React from "react";

interface ChangePasswordProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordProps> = (
    {
        isOpen, onOpenChange
    }
) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton
            size="xl">
            <ModalContent>
                <ModalHeader className="bg-linear-to-r from-[#2168a1] to-[#11999e] text-white ">
                    Change Password

                </ModalHeader>
                <ModalBody>
                    <div className="my-2">

                        <Input
                            type="password"
                            label="New Password"
                            labelPlacement="outside"
                            placeholder="Enter New Password"
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
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        size="sm"
                        onPress={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="flat"
                        size="sm"
                        className="bg-orange-600 text-white">
                        Update
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ChangePasswordModal