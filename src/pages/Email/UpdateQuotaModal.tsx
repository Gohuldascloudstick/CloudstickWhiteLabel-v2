import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
import type React from "react";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { getEmailList, updateQuota } from "../../redux/slice/EmailSlice";

interface UpdateQuotaProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void;
    email: string;
    domain: string;
}
const UpdateQuotaModal: React.FC<UpdateQuotaProps> = ({
    isOpen, onOpenChange, email, domain
}) => {
    const [storage, setStorage] = useState("unlimited");
    const [limit, setLimit] = useState("");
    const dispatch = useAppDispatch()
    const [limitError, setLimitError] = useState("")
    const [unit, setUnit] = useState("MB");
    const [changequotaloader, setchangeQuotaLoader] = useState(false);
    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            setLimitError("");
            setLimit("")
            setUnit("MB")
            setStorage("unlimited")
        }
        onOpenChange(isOpen);
    }
    const handleQuotaSave = async () => {
        if (storage == 'limited') {
            if (!limit.trim()) {
                setLimitError("Limit cannot be empty");
                return;
            }
            if (isNaN(Number(limit))) {
                setLimitError("Limit must be a number");
                return;
            }
            if (Number(limit) <= 0) {
                setLimitError("Limit must be greater than 0");
                return;
            }
        }
        let data: {
            name: string;
            quota_type: string;
            quota_value?: number;
            quota_unit?: string;
        } = {
            "name": email.replace(`@${domain}`, ""),
            "quota_type": storage,
        }
        if (storage == 'limited') {
            data.quota_value = Number(limit)
            data.quota_unit = unit
        }

        try {
            setchangeQuotaLoader(true);
            await dispatch(updateQuota({ data: data })).unwrap();
            addToast({
                title: "The email storage quota has been updated.",
                color: "success"
            })
            await dispatch(getEmailList()).unwrap();
            handleClose(false)
        } catch (error) {
            addToast({
                title: "Failed to update email account quota.",
                description: String(error),
                color: "danger"
            })

        } finally {
            setchangeQuotaLoader(false)
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={handleClose}
            size="xl">
            <ModalContent>
                <ModalHeader className="bg-linear-to-r from-[#2168a1] to-[#11999e] text-white ">
                    Update Quota
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-2  my-4">
                        <RadioGroup orientation="horizontal"
                            value={storage}
                            onValueChange={(v) => {
                                setStorage(v as "limited" | "unlimited")
                                setLimit("")
                                setUnit("MB")
                                setLimitError("")
                            }
                            }
                            label="Storage Space">
                            <Radio value="limited" classNames={{ label: "text-slate-600 text-sm" }} >Limited</Radio>
                            <Radio value="unlimited" classNames={{ label: "text-slate-600 text-sm" }}>Unlimited</Radio>
                        </RadioGroup>
                    </div>
                    {storage === "limited" && (

                        <div className="my-2">
                            <Input
                                placeholder="Enter the limit"
                                variant="bordered"
                                value={limit}
                                isInvalid={!!limitError}
                                errorMessage={limitError}
                                onChange={(e) => {
                                    setLimit(e.target.value),
                                        setLimitError("")
                                }}
                                endContent={
                                    <Select
                                        aria-label="Unit"
                                        size="sm"
                                        variant="flat"
                                        selectedKeys={[unit]}
                                        className="w-25"
                                        disallowEmptySelection
                                        classNames={{
                                            trigger: "h-6 min-h-6 px-1",
                                            value: "text-md !text-gray-500 p-2",
                                            popoverContent: "min-w-[60px]",
                                        }}
                                        onSelectionChange={(keys) =>
                                            setUnit([...keys][0] as string)
                                        }
                                    >
                                        {["B", "KB", "MB", "GB", "TB"].map((u) => (
                                            <SelectItem key={u}>{u}</SelectItem>
                                        ))}
                                    </Select>
                                }
                            />
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        size="sm"
                        onPress={() => handleClose(false)}
                        className=""
                        isDisabled={changequotaloader}>
                        Cancel
                    </Button>
                    <Button
                        variant="flat"
                        size="sm"
                        className="bg-orange-600 text-white rounded-md"
                        onPress={handleQuotaSave}
                        isLoading={changequotaloader}
                        isDisabled={changequotaloader}>
                        Update
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UpdateQuotaModal