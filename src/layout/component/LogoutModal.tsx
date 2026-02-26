import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface LogoutProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;

}
const LogoutModal: React.FC<LogoutProps> = ({
    isOpen,
    onOpenChange,

}) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton>
            <ModalContent>

                <ModalHeader className="bg-linear-to-r from-[#2168a1] to-[#11999e] text-white">
                    <div>
                        Logout
                    </div>
                </ModalHeader>
                <ModalBody className="p-6">

                    Are you sure? Do you want to logout this session?

                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        size="sm"
                        onPress={() => onOpenChange(false)}>
                        No
                    </Button>
                    <Button
                        variant="flat"
                        size="sm"
                        // isLoading={changeLoader}
                        className="bg-linear-to-r from-[#2168a1] to-[#11999e] text-white"
                    // onPress={() => handleChangePassword()}
                    >
                        Yes
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    )
}

export default LogoutModal