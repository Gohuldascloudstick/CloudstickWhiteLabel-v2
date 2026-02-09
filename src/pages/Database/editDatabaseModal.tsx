import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import type React from "react";

interface EditDatabaseProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
const editDatabaseModal: React.FC<EditDatabaseProps> = ({
    isOpen,
    onOpenChange,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton>
            <ModalContent>

                <ModalHeader>
                    <div>
                        vandanatest_new_database
                    </div>
                </ModalHeader>
                <ModalBody className="flex gap-6">
                    <Input
                        label="New Password"
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
                        } />
                    <Input
                        label="Confirm Password"
                        labelPlacement="outside"
                        placeholder="Enter password"
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

                            </div>
                        } />
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        size="sm"
                        onPress={()=>onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="flat"
                        size="sm"
                        className="bg-orange-600 text-white" >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    )
}

export default editDatabaseModal