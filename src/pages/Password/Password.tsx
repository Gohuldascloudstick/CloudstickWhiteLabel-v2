import { addToast, Button, Card, Divider, Input } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { Updatepasword } from "../../redux/slice/websiteSlice";


const Password = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [changeLoader, SetChangeLoader] = useState(false);
    const dispatch = useAppDispatch();
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
    const handleChange = (value: string) => {
        setNewPassword(value)
        setConfirmPassword(value)
        setPasswordError("")
        setConfirmError("")

    }
    const handleclear = () => {
        setNewPassword("")
        setConfirmPassword("")
        setPasswordError("")
        setConfirmError("")
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    }
    const handleChangePassword = async () => {
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
        SetChangeLoader(true);
        try {
            await dispatch(Updatepasword({
                data: { password: newPassword.trim(), confirm_password: confirmPassword.trim() },
            })).unwrap();
            addToast({
                description: `Password changed successfully  `,
                color: "success",
            });
            handleclear();
        } catch (error: any) {
            addToast({
                description: String(error),
                color: "danger",
            });
        } finally {
            SetChangeLoader(false);
        }
    }
    return (
        <div className="max-h-[90vh]  p-2 overflow-y-auto scrollbar-hide">
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                Password Management
            </span>
            </p>
            <p className="mt-4 text-gray-500">
                We recommend a password with upper cases , lower cases and numericals.
            </p>
            <div className="mt-6  w-full  ">
                <div className=" w-full space-y-6 ">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-lg">Change Password</span>
                        </div>
                        <Divider />
                        <div className="p-8 flex flex-col gap-6 font-sans">
                            <div className="">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    variant="bordered"
                                    label="New Password"
                                    value={newPassword}
                                    labelPlacement="outside"
                                    placeholder="Enter new password"
                                    onValueChange={(value) => {
                                        setNewPassword(value);
                                        setPasswordError("")
                                    }}
                                    errorMessage={passwordError}
                                    isInvalid={!!passwordError}
                                    endContent={
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleChange(generatePassword())}
                                                className="p-1 min-w-0 h-auto text-blue-500"
                                            >
                                                Generate
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="light"
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
                            </div>
                            <div className="">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    variant="bordered"
                                    label="Confirm Password"
                                    placeholder="Confirm new password"
                                    labelPlacement="outside"
                                    value={confirmPassword}
                                    onValueChange={(value) => {
                                        setConfirmPassword(value);
                                        setConfirmError("")
                                    }}
                                    errorMessage={confirmError}
                                    isInvalid={!!confirmError}
                                    isRequired
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
                            <div className="mt-2 flex justify-end w-full">
                                <Button
                                    className="bg-[#f07c33] text-white font-medium px-6 rounded-md hover:bg-[#d96b28] transition-colors"
                                    size="md"
                                    onPress={handleChangePassword}
                                    isLoading={changeLoader}
                                    isDisabled={changeLoader}
                                >
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </Card>

                </div>

            </div >

        </div >
    )
}

export default Password