import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useNavigate } from "react-router-dom";

interface LogoutProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;

}
const LogoutModal: React.FC<LogoutProps> = ({
    isOpen,
    onOpenChange,

}) => {
    const navigate = useNavigate();
    const HandleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login')
        onOpenChange(false);
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton>
            <ModalContent>

                <ModalHeader className="bg-brand text-white">
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
                        className="bg-brand text-white"
                        onPress={() => HandleLogout()}
                    >
                        Yes
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    )
}

export default LogoutModal