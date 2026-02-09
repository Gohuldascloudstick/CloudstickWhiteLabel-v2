import { Button, Card, Divider, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react"
import { Icon } from "@iconify/react"


const Subdomain = () => {
    return (
        <div>
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                Sub domains
            </span>
            </p>
            <p className="mt-4 text-gray-500">
                Here you can manage the domains connected to this webapp. Make sure to create the necessary DNS records that point the domain to this server IP address.            </p>

            <div className="mt-6  w-full  ">
                <div className=" w-full space-y-6 max-h-[73vh] overflow-y-auto scrollbar-hide">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 flex items-center gap-2 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e] text-white">
                            <Icon icon={"bi:globe"} width={24}/>
                            <span className="font-bold  text-lg">Sub Domains </span>
                        </div>
                        <Divider />
                        <div className=" p-6  ">

                            <h3 className="text-lg font-medium text-slate-700">Add New Sub Domain</h3>
                            <div className="bg-green-100 mt-4 text-green-800 p-2">
                                <span>
                                    ! After adding a new domain, you may need to redeploy SSL/TLS from the Manage SSL tab to keep SSL/TLS enabled for any new domain.
                                </span>
                            </div>
                        </div>
                        <div className=" py-2 px-12" >
                            <div className="flex-1 flex flex-col gap-6">
                                <Input
                                    label="Sub Domain App Name"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    placeholder="Enter Subdomain App Name" />
                                <Input
                                    variant="bordered"
                                    placeholder="Enter Subdomain name"
                                    label="Sub Domain Name"
                                    labelPlacement="outside"
                                    endContent={
                                        <div className="bg-slate-50 border-l px-3 py-2 -mr-3 text-slate-400 text-sm whitespace-nowrap">
                                            .app-qzykx.fPhYnEyHcueeKGC.vanadana.site
                                        </div>
                                    }
                                />
                                <Input
                                    type="text"
                                    placeholder="Enter Path"
                                    label="rootpath"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    startContent={
                                        <div className=" border-r pr-2  text-slate-500 text-sm">
                                            /home/vandanatest/apps/
                                        </div>
                                    }
                                />
                                <Select
                                    label="PHP Version"
                                    labelPlacement="outside"
                                    placeholder="Please select one"
                                    variant="bordered"
                                >
                                    <SelectItem>
                                        PHP 8.2
                                    </SelectItem>
                                    <SelectItem>
                                        PHP 8.3
                                    </SelectItem>
                                </Select>

                                <div className="flex justify-end m-4">
                                    <Button
                                        className="bg-linear-to-r bg-orange-600 text-white text-sm px-8 rounded-sm"
                                        size="sm"
                                    >
                                        Create Sub Domain
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2">
                            <Icon icon={"iconoir:www"} className="text-blue-900" width={22} />
                            <span className="font-bold text-indigo-900 text-lg">Existing Sub Domains</span>
                        </div>
                        <Divider />
                        <div>
                            <Table

                                classNames={{
                                    wrapper: "p-0  rounded-xs overflow-hidden",
                                    th: "bg-gray-50/50 text-slate-700 font-bold uppercase tracking-wider h-12",
                                    td: "py-4 px-4 border-b border-gray-100",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn width={400}>
                                        <div className="flex items-center gap-4">
                                            <span>APP NAME</span>
                                            <Input
                                                isClearable
                                                className="max-w-35"
                                                placeholder="Search..."
                                                size="sm" 
                                                startContent={<Icon icon="ic:baseline-search" className="text-default-400" width={24} />}
                                                variant="bordered"
                                            />
                                        </div>
                                    </TableColumn>
                                    <TableColumn>SUB DOMAIN NAME </TableColumn>
                                    <TableColumn>DOCUMENT ROOT</TableColumn>
                                    <TableColumn>PHP VERSION</TableColumn>
                                    <TableColumn>Actions</TableColumn>
                                </TableHeader>

                                <TableBody>
                                    <TableRow >
                                        <TableCell className="text-slate-800 font-medium">
                                            vandanatest_new_database
                                        </TableCell>
                                        <TableCell>hii</TableCell>
                                        <TableCell>hii</TableCell>
<TableCell>
    hiii
</TableCell>
                                        <TableCell>
                                            <div className="flex justify-end">
                                                <Tooltip content="Delete database">
                                                    <Button className="text-gray-500 hover:text-red-500" isIconOnly variant="light" color="default" size="sm">
                                                        <Icon icon="mdi:trash-can-outline" fontSize={20} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Edit database">
                                                    <Button className="text-gray-500 hover:text-red-500" isIconOnly variant="light" color="default" size="sm">
                                                        <Icon icon="ri:edit-line" fontSize={20} />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </TableCell>

                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </Card>




                </div>

            </div >
        </div >
    )
}

export default Subdomain