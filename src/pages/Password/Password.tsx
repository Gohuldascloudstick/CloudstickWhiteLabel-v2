import { Button, Card, Divider, Input } from "@heroui/react"
import { Icon } from "@iconify/react"


const Password = () => {
    return (
        <div>
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                Password Management
            </span>
            </p>
            <p className="mt-4 text-gray-500">
                We recommend a password with upper cases , lower cases and numericals.
            </p>
            <div className="mt-6  w-full  ">
                <div className=" w-full space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-lg">Change Password</span>
                        </div>
                        <Divider />
                        <div className="p-8 flex flex-col gap-6 font-sans">
                            <div className="">
                                <Input
                                    type="password"
                                    variant="bordered"
                                    label="New Password"
                                    labelPlacement="outside"
                                    placeholder="Enter Password"

                                    endContent={
                                        <button className="text-slate-400 focus:outline-none">
                                            <Icon icon="mdi:eye-off-outline" fontSize={20} />
                                        </button>
                                    }
                                />
                            </div>
                            <div className="">
                                <Input
                                    type="password"
                                    variant="bordered"
                                    label="Confirm New Password"
                                    labelPlacement="outside"
                                    placeholder="Confirm Password"

                                    endContent={
                                        <button className="text-slate-400 focus:outline-none">
                                            <Icon icon="mdi:eye-off-outline" fontSize={20} />
                                        </button>
                                    }
                                />
                            </div>


                            <div className="mt-2 flex justify-end w-full">
                                <Button
                                    className="bg-[#f07c33] text-white font-medium px-6 rounded-md hover:bg-[#d96b28] transition-colors"
                                    size="md"
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