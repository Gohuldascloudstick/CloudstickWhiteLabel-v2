import { Button, Card, Divider, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"

const Ssl = () => {
    const navigate = useNavigate();
    return (
        <div>
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                SSL Management
            </span>
            </p>
            <p className="mt-4 text-gray-500">
                You can manage SSL certificates for your web applications from this page, Please note that renew feature is available only for Let's Encrypt SSL certificates.
            </p>
            <div className="flex justify-end mt-2">

                <Button onPress={() => navigate("addcronjobs")} className="bg-orange-600 text-white rounded-md">
                    Deploy New SSL
                </Button>
            </div>
            <div className="mt-6  w-full  ">


                <div className=" w-full space-y-6 max-h-[73vh] overflow-y-auto scrollbar-hide">


                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-lg">SSL Management</span>
                        </div>
                        <Divider />
                        <div className="flex flex-col gap-4">
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
                                            <span>DOMAINS</span>
                                            <Input
                                                isClearable
                                                className="max-w-50"
                                                placeholder="Search..."
                                                size="sm"
                                                startContent={<Icon icon="ic:baseline-search" width={24} className="text-default-400" />}
                                                variant="bordered"
                                            />
                                        </div>
                                    </TableColumn>
                                    <TableColumn align="center">SSL PROVIDER</TableColumn>
                                  
                                    <TableColumn align="end">ACtion</TableColumn>
                                </TableHeader>

                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell className="text-slate-800 font-medium">
                                            vandanatest_new_database
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <span className="flex items-center gap-1 cursor-pointer text-blue-800">
                                                    Grant User
                                                    <Icon icon="mdi:user-plus-outline" fontSize={20} className="mb-0.5" />
                                                </span>

                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end">
                                                <Tooltip content="Delete database">
                                                    <Button className="text-gray-500 hover:text-red-500" isIconOnly variant="light" color="default" size="sm">
                                                        <Icon icon="mdi:trash-can-outline" fontSize={20} />
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

export default Ssl