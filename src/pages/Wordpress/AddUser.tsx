import { addToast, Button, Input, Select, SelectItem } from "@heroui/react"
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { createWordPressUser, getWorpressUser } from "../../redux/slice/WordPressManager";


const AddUser = () => {
    const [newRole, setNewRole] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [paswwordview, setPasswordview] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const dispatch = useAppDispatch();
    const [newEmail, setNewEmail] = useState("");
    const [usercreationloader, setUsercretaionLoader] = useState(false);
    const clear = () => {
        setNewEmail("")
        setNewPassword("")
        setNewRole("");
        setNewUsername("");

    }
    const handleCreateUser = async () => {
        setUsercretaionLoader(true);
        try {
            await dispatch(
                createWordPressUser({ email: newEmail, user_name: newUsername, password: newPassword, role: newRole })
            ).unwrap();
            await dispatch(
                getWorpressUser()
            ).unwrap();
            clear()

            addToast({
                title: "WordPress User Cretation",
                description: `New WordPress user Created.`,
                color: "success",
            });
        } catch (error: any) {
            addToast({
                title: "User Creation Failed",
                description: error,
                color: "danger",
            });
        } finally {
            setUsercretaionLoader(false);
        }
        // Close the modal and reset state
    };
    const roles = [
        { key: "", label: "All" },
        { key: "administrator", label: "Administrator" },
        { key: "subscriber", label: "Subscriber" },
        { key: "contributor", label: "Contributor" },
        { key: "editor", label: "Editor" },
        { key: "author", label: "Author" },
    ];
    return (
        <div className="flex flex-col space-y-4">
            <Input
                label="Username"
                placeholder="Enter username"
                labelPlacement="outside"
                variant="bordered"
                value={newUsername}
                isRequired
                onValueChange={setNewUsername}
                className="md:col-span-2"
            />

            <Input
                label="Email Address"
                placeholder="example@domain.com"
                labelPlacement="outside"
                variant="bordered"
                type="email"
                value={newEmail}
                onValueChange={setNewEmail}
                isRequired
                className="md:col-span-2"
            />

            <Select
                label="User Role"
                placeholder="Select a role"
                labelPlacement="outside"
                variant="bordered"
                selectedKeys={[newRole]}
                onSelectionChange={(keys) =>
                    setNewRole(Array.from(keys)[0] as string)
                }
                isRequired
                className="md:col-span-2"
                classNames={{
                    popoverContent: "dark:bg-slate-900",
                    listbox: "[&_[data-hover=true]]:!bg-default-200",
                }}
            >
                {roles.slice(1).map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
            </Select>
            <Input
                label="Password"
                placeholder="Enter password"
                labelPlacement="outside"
                variant="bordered"
                value={newPassword}
                onValueChange={setNewPassword}
                type={paswwordview ? "text" : "password"}
                isRequired
                className="md:col-span-2"
                endContent={
                    <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="focus:outline-none"
                        onPress={() => setPasswordview(!paswwordview)}
                    >
                        <Icon
                            icon={paswwordview ? "lucide:eye-off" : "lucide:eye"}
                            className="text-default-400"
                            width={16}
                        />
                    </Button>
                }
            />
            <div className="py-6 flex justify-end">
                <Button
                    color="primary"
                    onPress={() => handleCreateUser()}
                    size="sm"
                    isLoading={usercreationloader}
                    isDisabled={
                        !newUsername || !newEmail || !newRole || !newPassword
                    }
                >
                    {"Create User"}
                </Button>
            </div>
        </div>
    )
}

export default AddUser