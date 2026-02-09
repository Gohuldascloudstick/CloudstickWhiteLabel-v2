import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react"
import type React from "react";
interface EmailForwardProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void;
}
const EmailForwardingModal: React.FC<EmailForwardProps> = (
    {
        isOpen,
        onOpenChange
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
                    Add Forwarder
                </ModalHeader>
                <ModalBody >
                    <span className="text-gray-600 mt-2">Add emails you’d like Recieve Emails on</span>
                    <div className="my-2">
                        <Input
                            label="Email"
                            labelPlacement="outside"
                            placeholder="Mail id"
                            variant="bordered" />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        size="sm"
                        onPress={() => onOpenChange(false)}
                        className="">
                        Cancel
                    </Button>
                    <Button
                        variant="flat"
                        size="sm"
                        className="bg-orange-600 text-white rounded-md">
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EmailForwardingModal