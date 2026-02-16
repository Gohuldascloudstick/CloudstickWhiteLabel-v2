import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import type React from "react";
import type { AppDbUser } from "../../utils/interfaces";
import { useRef, useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { ChnageDbUserPAssword } from "../../redux/slice/databaseSlice";

interface EditDatabaseProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    selectedUser: AppDbUser | null;
}
const editDatabaseModal: React.FC<EditDatabaseProps> = ({
    isOpen,
    onOpenChange,
    selectedUser
}) => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [NewPasswordError, setNewPasswordError] = useState("")
    const [newPassword, setNewPassword] = useState('');
    const dispatch = useAppDispatch()
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const confirmInputRef = useRef<HTMLInputElement>(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changeLoader, SetChangeLoader] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const resetFormState = () => {
        setNewPassword("");
        setConfirmPassword("");
        setNewPasswordError("");
        setConfirmPasswordError("");
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = (newOpenState: boolean) => {
       
        if (!newOpenState) {
            resetFormState();
        }
        onOpenChange(newOpenState);
    };
    const generatePassword = (length = 16) => {
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()_-+=";

        const allChars = lowercaseChars + uppercaseChars + numberChars + symbolChars;
        let password = "";

        // Ensure at least one character from each set
        password += lowercaseChars.charAt(
            Math.floor(Math.random() * lowercaseChars.length)
        );
        password += uppercaseChars.charAt(
            Math.floor(Math.random() * uppercaseChars.length)
        );
        password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
        password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));

        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Shuffle the password to randomize character positions
        return password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");
    };
    const handleGeneratePassword = (password: string) => {
        setNewPassword(password);
        setConfirmPassword(password);
        setConfirmPasswordError("");
        setNewPasswordError("");
    }
    const handleChangePassword = async () => {
        if (!newPassword.trim()) {
            setNewPasswordError("Password cannot be empty")
            return;
        }
        if (!confirmPassword.trim()) {
            setConfirmPasswordError("Password cannot be empty")
            return;
        }
        if (newPassword.length < 8) {
            setNewPasswordError("Password must be at least 8 characters long.")
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            setNewPasswordError("Password must contain at least one uppercase letter.");
            return;
        }
        if (!/[a-z]/.test(newPassword)) {
            setNewPasswordError("Password must contain at least one lowercase letter.");
            return;
        }
        if (!/[0-9]/.test(newPassword)) {
            setNewPasswordError("Password must contain at least one number.");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            setNewPasswordError("Password must contain at least one special character.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }
        SetChangeLoader(true)
        try {
            if (selectedUser?.id != null) {
                await dispatch(  
                    ChnageDbUserPAssword({
                        userid: selectedUser.id,
                        password: newPassword,
                    })
                ).unwrap();
            }
            addToast({ description: `Password successfully changed for ${selectedUser?.db_user_name}`, color: "success" });
            onOpenChange(false)
        } catch (error:any) {
            addToast({ description: String(error), color: "danger" });
        } finally {
            SetChangeLoader(false)
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={handleClose}
            hideCloseButton>
            <ModalContent>

                <ModalHeader>
                    <div>
                        Change Password for {selectedUser?.db_user_name}
                    </div>
                </ModalHeader>
                <ModalBody className="flex gap-6">
                    <Input
                        label="New Password"
                        placeholder="Enter new password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        isInvalid={!!NewPasswordError}
                        errorMessage={NewPasswordError}
                        onChange={(e) => { setNewPassword(e.target.value); setShowConfirmPassword(false); setNewPasswordError("") }}
                        isRequired
                        labelPlacement="outside"
                        variant="bordered"
                        endContent={
                            <div className="flex items-center gap-2">
                                <span onClick={() => handleGeneratePassword(generatePassword())} className="cursor-pointer text-xs text-blue-500">Generate</span>
                                <Button
                                    size="sm"
                                    variant="light"
                                    isIconOnly
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    className="p-1 min-w-0 h-auto"
                                >
                                    <Icon
                                        icon={showNewPassword ? "lucide:eye" : "lucide:eye-off"}
                                        className="text-xl text-default-400"
                                    />
                                </Button>
                            </div>
                        }
                    />

                    <Input
                        ref={confirmInputRef}
                        label="Confirm Password"
                        variant="bordered"
                        placeholder="Confirm new password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onValueChange={(value) => { setConfirmPassword(value); setConfirmPasswordError("") }}
                        isRequired
                        isInvalid={!!confirmPasswordError}
                        errorMessage={confirmPasswordError}
                        labelPlacement="outside"
                        endContent={
                            <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                onPress={() => { setShowConfirmPassword(!showConfirmPassword); setShowNewPassword(false) }}
                                className="p-1 min-w-0 h-auto"
                            >
                                <Icon
                                    icon={showConfirmPassword ? "lucide:eye" : "lucide:eye-off"}
                                    className="text-xl text-default-400"
                                />
                            </Button>
                        }
                    />


                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        size="sm"
                         onPress={() => handleClose(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="flat"
                        size="sm"
                        isLoading={changeLoader}
                        className="bg-orange-600 text-white"
                        onPress={() => handleChangePassword()} >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    )
}

export default editDatabaseModal