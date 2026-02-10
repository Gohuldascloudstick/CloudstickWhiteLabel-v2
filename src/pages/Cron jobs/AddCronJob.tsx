import { Button, Card, Divider, Input, Select, SelectItem } from "@heroui/react"
import { useNavigate } from "react-router-dom"



const AddCronJob = () => {
    const navigate = useNavigate();
    return (
        <div>
            <p className="text-3xl">Add New <span className=" font-bold text-teal-600">
                Cron Job
            </span>
            </p>


            <div className="mt-12  w-full  ">
                <div className=" w-full space-y-6 max-h-[73vh] overflow-y-auto scrollbar-hide">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 text-white bg-linear-to-r from-[#2168a1] to-[#11999e]">

                            <span className="font-bold  text-lg">Add New Cron Job</span>
                        </div>
                        <Divider />

                        <div className=" pt-6 py-2 px-12" >
                            <div className="flex-1 flex flex-col gap-6">
                                <Input
                                    variant="bordered"
                                    label="Job Label"
                                    labelPlacement="outside"
                                    placeholder="Only letters,numbers,underscores and dashes are allowed"

                                />
                                <Select
                                    label="Vendor Binary"
                                    labelPlacement="outside"
                                    placeholder="Please select an option"
                                    variant="bordered"
                                >
                                    <SelectItem >
                                        /bin/bash
                                    </SelectItem>
                                    <SelectItem>
                                        Custom command
                                    </SelectItem>
                                </Select>
                                <Input
                                    type="text"
                                    placeholder="/path/to/script.(sh | php | js) OR if the vendor binary is empty you can run -rt/tmp"
                                    label="Command"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />

                               

                                <Select
                                    label="Pre Defined settings"
                                    labelPlacement="outside"
                                    placeholder="Please select one"
                                    variant="bordered"
                                >
                                    <SelectItem >
                                        Every Year
                                    </SelectItem>
                                    <SelectItem>
                                       Every Minute
                                    </SelectItem>
                                </Select>
                                
    
                                <Input
                                    type="text"
                                    placeholder="0"
                                    label="Minute"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="500"
                                    label="Hour"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="20"
                                    label="Day of Month"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="10"
                                    label="Month"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <Input
                                    type="text"
                                    placeholder="10"
                                    label="Day of week"
                                    labelPlacement="outside"
                                    variant="bordered"

                                />
                                <div className="flex justify-end items-center m-4">
                                    <Button variant="light"
                                    size="sm" onPress={()=>navigate("/cronjobs")}>
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-orange-600 text-white text-sm px-8 rounded-sm"
                                        size="sm"
                                    >
                                        Add Cron Job
                                    </Button>
                                </div>
                            </div>
                        </div>


                    </Card>






                </div>

            </div >

        </div >
    )
}

export default AddCronJob