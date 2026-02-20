import { addToast, Button, Card, Divider, Input, Popover, PopoverContent, PopoverTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { clearedit, editJob, getAppCron, removeServerCron } from "../../redux/slice/CronjobSlice";
import type { CronJob } from "../../utils/interfaces";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../redux/hook";


const Cronjob = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const reducerDispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeleteingId] = useState(0)
    const appcronjobs = useAppSelector((state) => state.CronJob.AppCrons)
    const jobs = appcronjobs.filter(
        (item) =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.binary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
    const deleteJob = async (CronID: number) => {
        try {
            setDeleteingId(CronID)
            await dispatch(removeServerCron({ CronID })).unwrap();
            await dispatch(getAppCron()).unwrap();
            addToast({
                description: "Cron Job Removed Successfully",
                color: "success",
            });
        } catch (error) {
            addToast({
                description: String(error),
                color: "danger",
            });
        } finally {
            setDeleteingId(0)
        }
    };
    const setEditJob = async (job: CronJob) => {
        await reducerDispatch(editJob(job));
        setOpenPopoverId(null);
        console.log("111111111")
        navigate("/cronjobs/addcronjobs")
    };

    return (
        <div className="max-h-[90vh]  p-2 overflow-y-auto scrollbar-hide">
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                Cron Jobs
            </span>
            </p>
            <p className="mt-4 text-gray-500">
                Cron is a time-based job scheduler available in Linux operating systems. It is used to automate scripts or commands that are used regularly.(add enter/return line to separate). As Shown below are the scheduled Cron Jobs. Use the Create button to configure a new cron job on this server.
            </p>
            <div className="flex justify-end mt-2">

                <Button onPress={() => {
                    reducerDispatch(clearedit())
                    navigate("addcronjobs")
                }} className="bg-orange-600 text-white rounded-md">
                    Create Cron Job
                </Button>
            </div>

            <div className="mt-6  w-full  ">
                <div className=" w-full space-y-6 ">


                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-lg">Cron Jobs</span>
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
                                            <span>JOB NAME</span>
                                            <Input
                                                variant="bordered"
                                                placeholder="Search ..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className=" md:w-1/2 text-sm select-text! rounded-md"
                                                size="sm"
                                            />
                                        </div>
                                    </TableColumn>
                                    <TableColumn align="center">RUN AS</TableColumn>
                                    <TableColumn align="center">COMMAND</TableColumn>
                                    <TableColumn align="center">TIME TO RUN</TableColumn>
                                    <TableColumn align="end">ACtion</TableColumn>
                                </TableHeader>

                                <TableBody>
                                    {jobs.map((job) => (
                                        <TableRow key={job.id}>
                                            <TableCell className="text-slate-800 font-medium">
                                                <span className="text-sm font-medium">{job.label}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{job.user_name}</span>
                                            </TableCell>
                                            <TableCell>

                                                <code className="bg-default-200 dark:bg-default-50 text-default-600 px-2 py-1 rounded text-xs max-w-62.5 overflow-hidden text-ellipsis whitespace-nowrap inline-block">
                                                    {job.path}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <code className="bg-primary-50 dark:bg-primary-900/50 text-primary-600 px-2 py-1 rounded text-xs font-mono">
                                                    {job.schedule}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <Popover
                                                    placement="bottom-end"
                                                    isOpen={openPopoverId == job.id}
                                                    onOpenChange={(isOpen) => setOpenPopoverId(isOpen ? job.id : null)}
                                                    classNames={{ content: "w-[140px] dark:bg-slate-900 py-2 rounded-lg" }}
                                                >
                                                    <PopoverTrigger>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            aria-label="More actions"

                                                        >
                                                            <Icon icon="lucide:more-vertical" width={18} />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent aria-label="Cron Job Actions">
                                                        <Button
                                                            key="edit"
                                                            fullWidth
                                                            size="sm"
                                                            variant="light"
                                                            startContent={<Icon icon="lucide:pencil" width={14} />}
                                                            onPress={() => setEditJob(job)}
                                                        >
                                                            Update Job
                                                        </Button>
                                                        <Button
                                                            key="remove"
                                                            fullWidth
                                                            color="danger"
                                                            variant="light"
                                                            size="sm"
                                                            startContent={deletingId != job.id && <Icon icon="lucide:trash-2" width={14} />}
                                                            onPress={() => deleteJob(job.id)}
                                                            isLoading={deletingId == job.id}
                                                        >
                                                            Remove Job
                                                        </Button>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div >
        </div >
    )
}

export default Cronjob