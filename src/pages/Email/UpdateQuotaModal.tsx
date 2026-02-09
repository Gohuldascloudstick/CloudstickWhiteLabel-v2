import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup } from "@heroui/react";
import type React from "react";
import { useState } from "react";

interface UpdateQuotaProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void;
}
const UpdateQuotaModal: React.FC<UpdateQuotaProps> = ({
    isOpen, onOpenChange
}) => {
    const [storage, setStorage] = useState("unlimited");
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl">
            <ModalContent>
                <ModalHeader className="bg-linear-to-r from-[#2168a1] to-[#11999e] text-white ">
                    Update Quota
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-2">
                        <RadioGroup orientation="horizontal" value={storage} onValueChange={(value) => setStorage(value)} label="Storage Space">
                            <Radio value="limited" classNames={{ label: "text-slate-600 text-sm" }} >Limited</Radio>
                            <Radio value="unlimited" classNames={{ label: "text-slate-600 text-sm" }}>Unlimited</Radio>
                        </RadioGroup>
                    </div>
                    {storage === "limited" && (

                        <div className="my-2">
                            <Input
                                label="Quota"
                                labelPlacement="outside"
                                type="text"
                                variant="bordered"
                                placeholder="Enter Quota Limit"
                                className="flex-1  outline-none text-sm"
                                endContent={
                                    <span className="text-gray-500">
                                        MB
                                    </span>
                                }
                            />
                        </div>
                    )
                    }

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
                        Update
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UpdateQuotaModal