import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import type React from "react";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { changeEmailPassword } from "../../redux/slice/EmailSlice";

interface ChangePasswordProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void;
    name: string;
    domain: string;
}

const ChangePasswordModal: React.FC<ChangePasswordProps> = (
    {
        isOpen, onOpenChange, name, domain
    }
) => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const dispatch = useAppDispatch();
    const [resetPasswordloader, setResetPasswordLoader] = useState(false);
    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            setConfirmError("");
            setPasswordError("");
            setNewPassword("");
            setConfirmPassword("");
        }
        onOpenChange(isOpen);
    }
    const handleSubmit = async () => {
        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long.")
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            setPasswordError("Password must contain at least one uppercase letter.");
            return;
        }
        if (!/[a-z]/.test(newPassword)) {
            setPasswordError("Password must contain at least one lowercase letter.");
            return;
        }
        if (!/[0-9]/.test(newPassword)) {
            setPasswordError("Password must contain at least one number.");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            setPasswordError("Password must contain at least one special character.");
            return;
        }
        if (!confirmPassword.trim()) {
            setConfirmError("Please confirm your password");
            return;
        }
        if (newPassword !== confirmPassword) {
            setConfirmError("Passwords do not match");
            return;
        }

        const data = {
            "name": name?.replace(`@${domain}`, ""),
            "password": newPassword
        }
        try {
           
            setResetPasswordLoader(true);
            await dispatch(changeEmailPassword({ data: data })).unwrap();
            addToast({
                title: "Password Changed Successfully",
                color: "success"
            })
            handleClose(false)
        } catch (error) {
            addToast({
                title: "Unable to change password.",
                description: String(error),
                color: "danger"
            })
        } finally {
            setResetPasswordLoader(false)
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={handleClose}
            hideCloseButton
            size="xl">
            <ModalContent>
                <ModalHeader className="bg-linear-to-r from-[#2168a1] to-[#11999e] text-white ">
                    Change Password

                </ModalHeader>
                <ModalBody>
                    <div className="my-4 flex flex-col space-y-4">

                        <Input
                            label="New Password"
                            variant="bordered"
                            placeholder="Enter new password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (passwordError) setPasswordError("");
                            }}
                            isRequired
                            isInvalid={!!passwordError}
                            errorMessage={passwordError}
                            labelPlacement="outside"
                            endContent={
                                <Button
                                    size="sm"
                                    variant="light"
                                    isIconOnly
                                    onPress={() => {
                                        setShowNewPassword(!showNewPassword);
                                        setShowConfirmPassword(false);
                                    }}
                                    className="p-1 min-w-0 h-auto"
                                >
                                    <Icon
                                        icon={showNewPassword ? "lucide:eye" : "lucide:eye-off"}
                                        className="text-xl text-default-400"
                                    />
                                </Button>
                            }
                        />
                        <Input
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            variant="bordered"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {

                                setConfirmPassword(e.target.value);
                                if (confirmError) setConfirmError("");
                            }}
                            isRequired
                            isInvalid={!!confirmError}
                            errorMessage={confirmError}
                            labelPlacement="outside"
                            endContent={
                                <Button
                                    size="sm"
                                    variant="light"
                                    isIconOnly
                                    onPress={() => {
                                        setShowConfirmPassword(!showConfirmPassword);
                                        setShowNewPassword(false);
                                    }}
                                    className="p-1 min-w-0 h-auto"
                                >
                                    <Icon
                                        icon={showConfirmPassword ? "lucide:eye" : "lucide:eye-off"}
                                        className="text-xl text-default-400"
                                    />
                                </Button>
                            }
                        />
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        size="sm"
                        onPress={() => handleClose(false)}
                        isDisabled={resetPasswordloader}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="flat"
                        size="sm"
                        className="bg-orange-600 text-white"
                        onPress={handleSubmit}
                        isLoading={resetPasswordloader}
                        isDisabled={resetPasswordloader}>
                        Update
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ChangePasswordModal