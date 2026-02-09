import { Button, Card, Divider, Input, Link, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react"
import { Icon } from "@iconify/react"



const Database = () => {
    return (
        <div>
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                MySQL® Databases
            </span>
            </p>
            <p className="mt-4 text-gray-500">
                Manage large amounts of information over the web easily. MySQL databases are necessary to run many web-based applications, such as bulletin boards, content management systems, and online shopping carts. For more information, read the documentation.
            </p>

            <div className="mt-6  w-full  ">
                <div className=" w-full space-y-6 max-h-[73vh] overflow-y-auto scrollbar-hide">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-lg">Create Database</span>
                        </div>
                        <Divider />
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-8 py-8 ">
                            <div className="flex flex-col md:flex-row items-center grow gap-6 w-full">
                                <div className="flex items-center gap-3 shrink-0">
                                    <Icon icon="mdi:database-edit" className="text-blue-900" width={40} />
                                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                        Create Database
                                    </span>
                                </div>
                                <div className="w-full max-w-md">
                                    <Input
                                        type="text"
                                        variant="bordered"
                                        placeholder="Enter name"
                                        startContent={
                                            <div className="border-r border-gray-300 pr-2 mr-1">
                                                <span className="text-gray-400 text-small">vandanatest_</span>
                                            </div>
                                        }
                                        className="w-full"
                                    />
                                </div>


                                <div className="flex items-center gap-3 w-full md:w-72">
                                    <span className="text-sm font-medium text-gray-600">Collation</span>
                                    <Select
                                        placeholder="Please select an item"
                                        variant="bordered"
                                        className="w-full"
                                    >
                                        <SelectItem key="utf8">utf8_general_ci</SelectItem>
                                        <SelectItem key="utf8mb4">utf8mb4_unicode_ci</SelectItem>
                                    </Select>
                                </div>
                            </div>


                            <div className="shrink-0 w-full lg:w-auto">
                                <Button className="w-full lg:w-auto px-8 text-white font-semibold bg-linear-to-r from-[#2168a1] to-[#11999e]">
                                    Create Database
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 ">
                            <Icon icon={"pepicons-pencil:database-circle"} className="text-blue-900" width={22} />
                            <span className="font-bold text-indigo-900 text-lg">Existing Databases</span>
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
                                            <span>Name</span>
                                            <Input
                                                isClearable
                                                className="max-w-50"
                                                placeholder="Search Database"
                                                size="sm"
                                                startContent={<Icon icon="ic:baseline-search" width={24} className="text-default-400" />}
                                                variant="bordered"
                                            />
                                        </div>
                                    </TableColumn>
                                    <TableColumn align="center">Grant Permission</TableColumn>
                                    <TableColumn align="center">Privileged Users</TableColumn>
                                    <TableColumn align="end">Actions</TableColumn>
                                </TableHeader>

                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell className="text-slate-800 font-medium">
                                            vandanatest_new_database
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Link
                                                    isExternal
                                                    href="#"
                                                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1.5 text-sm font-semibold transition-opacity active:opacity-50"
                                                >
                                                    Grant User
                                                    <Icon icon="mdi:user-plus-outline" fontSize={20} className="mb-0.5" />
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell>

                                            <span className="text-gray-400 text-xs italic">None assigned</span>
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

                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2">
                            <Icon icon={"fontisto:mysql"} className="text-blue-900" width={22} />
                            <span className="font-bold text-indigo-900 text-lg">MySQL Users</span>
                        </div>
                        <Divider />
                        <div className="flex items-start gap-2 p-6 min-w-30 ">
                            <Icon icon={"tdesign:user-add-filled"} fontSize={28} className="text-slate-700" />
                            <h3 className="text-lg font-medium text-slate-700">Add User</h3>
                        </div>
                        <div className=" py-2 px-12" >
                            <div className="flex-1 flex flex-col gap-6">

                                <div className="flex flex-col gap-2">

                                    <Input
                                        type="text"
                                        placeholder="Enter Name"
                                        label="UserName"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        startContent={
                                            <div className=" border-r pr-2  text-slate-500 text-sm">
                                                vandanatest_
                                            </div>
                                        }
                                    />
                                </div>


                                <div className="flex flex-col gap-2">


                                    <Input
                                        type="password"
                                        label="Password"
                                        labelPlacement="outside"
                                        placeholder="Enter Password"
                                        variant="bordered"
                                        endContent={
                                            <div className="flex items-center gap-2">


                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    isIconOnly
                                                    // onPress={() => setShowNewPassword(!showNewPassword)}
                                                    className="p-1 min-w-0 h-auto"
                                                >
                                                    <Icon
                                                        icon={"lucide:eye"}
                                                        className="text-xl text-default-400"
                                                    />
                                                </Button>
                                                <span className="text-xs text-blue-500">Generate</span>
                                            </div>
                                        }
                                    />

                                </div>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="password"
                                        label="Confirm Password"
                                        labelPlacement="outside"
                                        placeholder="Enter Password"
                                        variant="bordered"

                                    />
                                </div>
                                <div className="flex justify-end m-4">
                                    <Button
                                        className="bg-linear-to-r from-[#2168a1] to-[#11999e] text-white text-sm px-8 rounded-sm"
                                        size="sm"
                                    >
                                        Create User
                                    </Button>
                                </div>
                            </div>
                        </div>


                    </Card>

                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2">
                            <Icon icon={"solar:user-circle-linear"} className="text-blue-900" width={22} />
                            <span className="font-bold text-indigo-900 text-lg">Existing Users</span>
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
                                            <span>Users</span>
                                            <Input
                                                isClearable
                                                className="max-w-50"
                                                placeholder="Search User"
                                                size="sm"
                                                startContent={<Icon icon="ic:baseline-search" className="text-default-400" width={24} />}
                                                variant="bordered"
                                            />
                                        </div>
                                    </TableColumn>

                                    <TableColumn align="end">Actions</TableColumn>
                                </TableHeader>

                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell className="text-slate-800 font-medium">
                                            vandanatest_new_database
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

export default Database