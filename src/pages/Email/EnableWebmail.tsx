import { Button, Card, Divider, Input } from "@heroui/react"


const EnableWebmail = () => {
    return (
        <div className="max-h-[90vh]  p-2 overflow-y-auto scrollbar-hide">
            <p className="text-3xl">Welcome to
                <span className="ml-1 font-bold text-teal-600">
                    Roundcube
                </span>
            </p>
            <p className="mt-4 text-gray-500">
                Here you can manage the domains connected to this webapp. Make sure to create the necessary DNS records that point the domain to this server IP address.
            </p>
            <div className="mt-6  w-full  ">
                <div className=" w-full space-y-6 ">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-lg">Roundcube Installation</span>
                        </div>
                        <Divider />
                        <div className="p-8 flex flex-col gap-6 font-sans">
                            <div className="">
                                <Input
                                    variant="bordered"
                                    placeholder="Enter Subdomain name"
                                    label="Domain Name"
                                    labelPlacement="outside"
                                    endContent={
                                        <div className="bg-slate-50 border-l px-3 py-2 -mr-3 text-slate-400 text-sm whitespace-nowrap">
                                            .vanadana.site
                                        </div>
                                    }
                                />
                            </div>
                            <div className="mt-2 flex justify-end">
                                <Button
                                    className="bg-[#f07c33] text-white font-medium px-6 rounded-md hover:bg-[#d96b28] transition-colors"
                                    size="md"
                                >
                                    Install Roundcube
                                </Button>
                            </div>
                        </div>
                    </Card>
                    
                </div>

            </div >

        </div >
    )
}

export default EnableWebmail