import { addToast, Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger } from "@heroui/react"
import type React from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { DeleteForwardEmail, forwardEmail, getForwardEmail } from "../../redux/slice/EmailSlice";
import { Icon } from "@iconify/react";
interface EmailForwardProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void;
    name: string;
    domain: string
}
const EmailForwardingModal: React.FC<EmailForwardProps> = (
    {
        isOpen,
        onOpenChange,
        name,
        domain
    }
) => {
    const [forwardemail, setForwardEmail] = useState("");
    const [emailerror, setEmailError] = useState("");
    const forwardedEmails = useAppSelector(state => state.Email.forward_email);
    const [forwardLoader, setForwardLoader] = useState(false);
    const [openDeletePopover, setDeletePopover] = useState("");
    const [forwarddeleteLoader, setForwardDeleteLoader] = useState(false)
    const dispatch = useAppDispatch();
    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {

            setEmailError("")
            setForwardEmail("");
        }
        onOpenChange(isOpen);
        setEmailError("");
    }
    const handleDeleteForwardEmail = async (email: string) => {
        const forward_data = {

            "name": name.replace(`@${domain}`, "")

        }
        try {
            setForwardDeleteLoader(true)
            console.log(forward_data, "")
            await dispatch(DeleteForwardEmail({ forwardemail: email, name: name.replace(`@${domain}`, "") })).unwrap();
            await dispatch(getForwardEmail({ data: forward_data }))
            addToast({
                title: "Forwarded email deleted successfully",
                color: "success"
            })
        } catch (error) {
            addToast({
                title: "Forwarded email deletion failed",
                description: String(error),
                color: "danger"
            })
        } finally {
            setForwardDeleteLoader(false)
        }
    }

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };


    const handleSubmit = async () => {

        if (!forwardemail.trim()) {
            setEmailError("Email cannot be empty");
        }
        if (!validateEmail(forwardemail)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        const data = {
            "name": name.replace(`@${domain}`, ""),
            "forward_email": forwardemail
        }
        const forward_data = {

            "name": name.replace(`@${domain}`, "")

        }
        try {
            setForwardLoader(true);

            await dispatch(forwardEmail({ data: data })).unwrap();
            console.log("called")
            await dispatch(getForwardEmail({ data: forward_data }));
            setDeletePopover("")
            addToast({
                title: "Email forwarded successfully.",
                color: "success"
            })
            handleClose(false)
        } catch (error: any) {
            addToast({
                title: "Failed to forward email.",
                description: String(error),
                color: "danger"
            })
        } finally {
            setForwardLoader(false);
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
                    Add Forwarder
                </ModalHeader>
                <ModalBody >
                    <span className="text-gray-600 mt-2">Add emails you’d like Recieve Emails on</span>
                    <div className="my-2">
                        <Input
                            label="Email"
                            variant="bordered"
                            placeholder="Enter email"
                            onChange={(e) => {
                                setForwardEmail(e.target.value);
                                if (emailerror) setEmailError("");
                            }}
                            isRequired
                            isInvalid={!!emailerror}
                            errorMessage={emailerror}
                            labelPlacement="outside"
                        />
                    </div>


                    <div className="  w-full p-2 grid grid-cols-2 gap-2 mt-2 max-h-[40vh] overflow-y-auto">
                        {forwardedEmails?.map((forward) => (

                            <Card className="rounded-md shadow-sm" >
                                <div className="p-2 px-4 flex items-center justify-between ">
                                    <div className="">
                                        <span>

                                            {forward.length > 25 ? forward.slice(0, 23) + "..." : forward}
                                        </span>
                                    </div>
                                    <div>

                                        <Popover isOpen={openDeletePopover === forward} onOpenChange={(isOpen) => {
                                            setDeletePopover(isOpen ? forward : "");
                                        }}>
                                            <PopoverTrigger>
                                                <Button
                                                    isIconOnly
                                                    variant="flat"
                                                    color="danger"
                                                    size="sm"
                                                    className="bg-transparent hover:bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"

                                                >
                                                    <Icon icon="lucide:trash-2" width={18} />
                                                </Button>

                                            </PopoverTrigger>
                                            <PopoverContent className="p-4 min-w-75 space-y-4 pt-4 rounded-md  dark:bg-slate-900">
                                                <div className=' text-center flex flex-col items-center'>
                                                    <Icon icon="lucide:alert-triangle" width={20} className="text-red-500 shrink-0 mt-0.5" />
                                                    <p className="text-xs text-default-700 text-center text-wrap mt-1">
                                                        Are you sure you want to delete this Forward email <br /> <span className='font-semibold'>{forward}?</span>
                                                    </p>
                                                </div>
                                                <div className="flex justify-end gap-2 w-full">
                                                    <Button variant="flat" size="sm" className="w-full"
                                                        isDisabled={forwarddeleteLoader}
                                                        onPress={() => setDeletePopover("")}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        size="sm"
                                                        className="w-full"
                                                        isLoading={forwarddeleteLoader}
                                                        isDisabled={forwarddeleteLoader}
                                                        onPress={() => handleDeleteForwardEmail(forward)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        size="sm"
                        isDisabled={forwardLoader}
                        onPress={() => handleClose(false)}
                        className="">
                        Cancel
                    </Button>
                    <Button
                        variant="flat"
                        size="sm"
                        className="bg-orange-600 text-white rounded-md"
                        isDisabled={forwardLoader}
                        isLoading={forwardLoader}
                        onPress={() => handleSubmit()}>
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EmailForwardingModal