import { addToast, Button, Card, Divider, Input, Select, SelectItem } from "@heroui/react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clearedit, createAppCron, getAppCron, getSysytemUser, getVendor_binary, UpdateServerCorn } from "../../redux/slice/CronjobSlice";
import { useDispatch } from "react-redux";


const CUSTOM_SCHEDULE_KEY = "CUSTOM_MODE_SWITCH";
const AddCronJob = () => {
    const navigate = useNavigate();
    const ReducerDispatch = useDispatch()
    const editvalue = useAppSelector((state) => state.CronJob.editCron);
    const SysytemUser = useAppSelector((state) => state.CronJob.SystemUser);
    const VendorBindary = useAppSelector((state) => state.CronJob.VendorBinary);
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const dispatch = useAppDispatch();
    const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
    const [errors, setErrors] = useState<Record<keyof typeof formData, boolean>>(
        {} as any
    );
    const [scheduleMode, setScheduleMode] = useState<"predefined" | "custom">(
        "predefined"
    );
    const [formData, setFormData] = useState({
        label: "",
        userName: "",
        binary: "",
        path: "",
        // Initialize schedule with "Every Minute" as the default
        schedule: "* * * * *",
        minute: "*",
        hour: "*",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "*",
    });
    const switchToPredefinedMode = () => {
        setScheduleMode("predefined");
        // Reset to the default "Every Minute" when switching back
        setFormData((prev) => ({
            ...prev,
            schedule: "* * * * *",
            minute: "*",
            hour: "*",
            dayOfMonth: "*",
            month: "*",
            dayOfWeek: "*",
        }));
        // Clear any validation errors related to custom fields
        setErrors((prev) => ({
            ...prev,
            minute: false,
            hour: false,
            dayOfMonth: false,
            month: false,
            dayOfWeek: false,
        }));
    };
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
    };
    const switchToCustomMode = () => {
        setScheduleMode("custom");
        // Clear predefined selection, but ensure custom fields are visible
        setFormData((prev) => ({
            ...prev,
            schedule: "", // Clear predefined schedule key
            // Keep custom fields as they were or reset to '*' for a clean start
            minute: prev.minute || "*",
            hour: prev.hour || "*",
            dayOfMonth: prev.dayOfMonth || "*",
            month: prev.month || "*",
            dayOfWeek: prev.dayOfWeek || "*",
        }));
        // Clear any validation errors related to predefined selection
        setErrors((prev) => ({ ...prev, schedule: false }));
    };
    const applySchedule = (selectedSchedule: string) => {
        // Check if the selected option is the custom mode switch key
        if (selectedSchedule === CUSTOM_SCHEDULE_KEY) {
            switchToCustomMode();
            return;
        }

        const parts = selectedSchedule.split(/\s+/).filter((p) => p.trim() !== "");

        if (parts.length === 5) {
            setFormData((prev) => ({
                ...prev,
                schedule: selectedSchedule,
                minute: parts[0],
                hour: parts[1],
                dayOfMonth: parts[2],
                month: parts[3],
                dayOfWeek: parts[4],
            }));
        } else {
            setFormData((prev) => ({ ...prev, schedule: "" }));
        }
    };
    const validateForm = () => {
        const newErrors: Record<keyof typeof formData, boolean> = {} as any;
        let isValid = true;

        const requiredFields: Array<keyof typeof formData> = [
            "label",
            "userName",
            "path",
            "binary",
        ];

        // Validate the core fields
        requiredFields.forEach((field) => {
            if (formData[field].trim() === "") {
                newErrors[field] = true;
                isValid = false;
            }
        });

        // Validate the schedule fields based on the current mode
        if (scheduleMode === "custom") {
            const customFields: Array<keyof typeof formData> = [
                "minute",
                "hour",
                "dayOfMonth",
                "month",
                "dayOfWeek",
            ];
            customFields.forEach((field) => {
                if (formData[field].trim() === "") {
                    newErrors[field] = true;
                    isValid = false;
                }
            });
        } else if (scheduleMode === "predefined" && !formData.schedule) {
            // This validates if the user somehow clears the selection when in predefined mode
            newErrors.schedule = true;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    const handelClose = () => {
        ReducerDispatch(clearedit())

    }
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setButtonSpinner(true);

        const finalLabel = formData.label;
        const finalBinary =
            formData.binary === "Custom command" ? "" : formData.binary;

        // Determine the final schedule payload
        const finalSchedule =
            scheduleMode === "predefined"
                ? formData.schedule // Use the selected predefined schedule string
                : [
                    // Or compile the custom fields
                    formData.minute,
                    formData.hour,
                    formData.dayOfMonth,
                    formData.month,
                    formData.dayOfWeek,
                ].join(" ");

        const cronJobData = {
            user_name: formData.userName,
            label: finalLabel,
            schedule: finalSchedule, // This matches your expected backend payload
            binary: finalBinary,
            path: formData.path,
        };
        if (!editvalue) return;
        try {
            await dispatch(
                UpdateServerCorn({ data: cronJobData, cornid: editvalue.id })
            ).unwrap();
            await dispatch(getAppCron()).unwrap();
            addToast({
                description: ` Job Updated successfully`,
                color: "success",
            });
            navigate("/cronjobs")
            handelClose()
        } catch (error: any) {
            addToast({
                description: error,
                color: "danger",
            });
        } finally {
            setButtonSpinner(false);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setButtonSpinner(true);

        const finalLabel = formData.label;
        const finalBinary =
            formData.binary === "Custom command" ? "" : formData.binary;

        // Determine the final schedule payload
        const finalSchedule =
            scheduleMode === "predefined"
                ? formData.schedule // Use the selected predefined schedule string
                : [
                    // Or compile the custom fields
                    formData.minute,
                    formData.hour,
                    formData.dayOfMonth,
                    formData.month,
                    formData.dayOfWeek,
                ].join(" ");

        const cronJobData = {
            user_name: formData.userName,
            label: finalLabel,
            schedule: finalSchedule, // This matches your expected backend payload
            binary: finalBinary,
            path: formData.path,
        };
        try {

            await dispatch(
                createAppCron({ data: cronJobData })
            ).unwrap();
            await dispatch(getAppCron()).unwrap();

            navigate("/cronjobs")
            addToast({
                description: `New Job ${finalLabel} Created successfully`,
                color: "success",
            });

        } catch (error: any) {
            addToast({
                description: error,
                color: "danger",
            });
        } finally {
            setButtonSpinner(false);
        }
    };
    const getAppCrons = async () => {
        try {
            await dispatch(getAppCron()).unwrap()
        } catch (error) {
            console.log(error);
        }
    };
    const getSystemUser = async () => {
        try {
            await dispatch(getSysytemUser()).unwrap();
        } catch (error) {
            console.log(error);
        }
    };
    const getvendor = async () => {
        try {
            await dispatch(getVendor_binary()).unwrap;
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getAppCrons();
        getvendor();
        getSystemUser();
    }, [serverId]);
    useEffect(() => {
        if (editvalue) {
            setFormData({
                label: editvalue.label,
                userName: editvalue.user_name,
                binary: editvalue.binary ? editvalue.binary : "Custom command",
                path: editvalue.path,
                // Initialize schedule with "Every Minute" as the default
                schedule: editvalue.schedule,
                minute: "*",
                hour: "*",
                dayOfMonth: "*",
                month: "*",
                dayOfWeek: "*",
            });
            applySchedule(editvalue.schedule);
        }
    }, [editvalue]);
    return (
        <div className="max-h-[90vh]  p-2 overflow-y-auto scrollbar-hide">
            <p className="text-3xl">{editvalue ? "Update" : "Add New"} <span className=" font-bold text-teal-600">
                Cron Job
            </span>
            </p>


            <div className="mt-12  w-full  ">
                <div className=" w-full space-y-6 ">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 flex items-center gap-2 text-white bg-linear-to-r from-[#2168a1] to-[#11999e]">

                            <span className="font-bold  text-lg">{editvalue ? "Update Cron Job" : "Add New Cron Job"}</span>
                        </div>
                        <Divider />

                        <div className=" pt-6 py-2 px-12" >
                            <form className="mt-3" onSubmit={editvalue ? handleUpdateSubmit : handleSubmit}>
                                <div className="flex-1 flex flex-col gap-6">
                                    <Input
                                        label="Job Label"
                                        placeholder="Label for this cron job"
                                        value={formData.label}
                                        onChange={(e) => handleChange("label", e.target.value)}
                                        isInvalid={errors.label}
                                        errorMessage={errors.label ? "Enter Label" : undefined}
                                        isRequired
                                        className="col-span-full"
                                        variant="bordered"
                                        //size="sm"
                                        labelPlacement="outside"
                                    />
                                    <Select
                                        label="User (The user to run this job)"
                                        placeholder="Please select an option"
                                        selectedKeys={formData.userName ? [formData.userName] : []}
                                        variant="bordered"
                                        //size="sm"
                                        labelPlacement="outside"
                                        onSelectionChange={(keys) => {
                                            const value = Array.from(keys).pop() as string;
                                            handleChange("userName", value || "");
                                        }}
                                        isInvalid={errors.userName}
                                        errorMessage={errors.userName ? "Select User" : undefined}
                                        isRequired
                                        classNames={{
                                            popoverContent: "dark:bg-slate-900",
                                        }}
                                    >
                                        {SysytemUser?.map((user) => (
                                            <SelectItem key={user.name}>{user.name}</SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="Vendor Binary"
                                        placeholder="Please select an option"
                                        variant="bordered"
                                        //size="sm"
                                        labelPlacement="outside"
                                        selectedKeys={formData.binary ? [formData.binary] : []}
                                        onSelectionChange={(keys) => {
                                            const value = Array.from(keys).pop() as string;
                                            handleChange("binary", value || "");
                                        }}

                                        isInvalid={errors.binary}
                                        errorMessage={errors.binary ? "Select Vendor Binary" : undefined}
                                        isRequired
                                        classNames={{
                                            popoverContent: "dark:bg-slate-900",
                                        }}
                                    >
                                        {VendorBindary?.map((binary) => (
                                            <SelectItem key={binary}>{binary}</SelectItem>
                                        ))}
                                    </Select>
                                    <Input
                                        label="Command"
                                        variant="bordered"
                                        //size="sm"
                                        labelPlacement="outside"
                                        placeholder="/path/to/script. (sh | php | js) OR if the vendor binary is empty you can run -rt/tmp"
                                        value={formData.path}
                                        onChange={(e) => handleChange("path", e.target.value)}
                                        isInvalid={errors.path}
                                        errorMessage={errors.path ? "Enter Command" : undefined}
                                        isRequired
                                        className="col-span-full"
                                    />
                                    {scheduleMode === "predefined" && (
                                        <div className="flex flex-col gap-4">
                                            <Select
                                                label="Pre Defined settings"
                                                variant="bordered"
                                                //size="sm"
                                                labelPlacement="outside"
                                                placeholder="-- Please select one --"
                                                selectedKeys={formData.schedule ? [formData.schedule] : []}
                                                onSelectionChange={(keys) => {
                                                    // Ensure selection array is not empty before pulling the value
                                                    const value = Array.from(keys).pop() as string;
                                                    applySchedule(value || "");
                                                }}
                                                className="grow"
                                                classNames={{
                                                    popoverContent: "dark:bg-slate-900",
                                                }}
                                                isRequired
                                            >
                                                <SelectItem key="* * * * *">Every Minute</SelectItem>
                                                <SelectItem key="*/30 * * * *">Every 30 Minutes</SelectItem>
                                                <SelectItem key="0 * * * *">Every Hour</SelectItem>
                                                <SelectItem key="0 0 * * *">Every Day (At 12:00am)</SelectItem>
                                                <SelectItem key="0 0 * * 0">Once in a Week</SelectItem>
                                                <SelectItem key="0 0 1 * *">Once in a Month</SelectItem>
                                                <SelectItem key="0 0 1 */6 *">Every 6 Months</SelectItem>
                                                <SelectItem key="0 0 1 1 *">Every Year</SelectItem>

                                                {/* NEW: Add the custom schedule switch option to the dropdown */}
                                                <SelectItem
                                                    key={CUSTOM_SCHEDULE_KEY}
                                                    className="text-primary font-semibold"
                                                >
                                                    Use Custom Schedule...
                                                </SelectItem>
                                            </Select>

                                            <Button
                                                variant="light"
                                                color="primary"
                                                onPress={switchToCustomMode}
                                                className="self-start px-0 py-0 h-auto font-normal text-sm"
                                                startContent={<Icon icon="lucide:arrow-right" width={16} />}
                                            >
                                                Need a specific time? **Use Custom Schedule**
                                            </Button>
                                        </div>
                                    )}
                                    {scheduleMode === "custom" && (
                                        <>
                                            <Button
                                                variant="light"
                                                color="primary"
                                                onPress={switchToPredefinedMode}
                                                className="self-start px-1 py-1 h-auto font-normal text-sm mb-4"
                                                startContent={<Icon icon="lucide:arrow-left" width={16} />}
                                            >
                                                Back to Pre Defined Schedule
                                            </Button>

                                            <div className="grid grid-cols-5 gap-3">
                                                <Input
                                                    variant="bordered"
                                                    //size="sm"
                                                    labelPlacement="outside"
                                                    label="Minute"
                                                    placeholder="*"
                                                    value={formData.minute}
                                                    onChange={(e) => handleChange("minute", e.target.value)}
                                                    isInvalid={errors.minute}
                                                    errorMessage={
                                                        errors.minute ? "This field can`t be empty" : undefined
                                                    }
                                                />
                                                <Input
                                                    variant="bordered"
                                                    //size="sm"
                                                    labelPlacement="outside"
                                                    label="Hour"
                                                    placeholder="*"
                                                    value={formData.hour}
                                                    onChange={(e) => handleChange("hour", e.target.value)}
                                                    isInvalid={errors.hour}
                                                    errorMessage={
                                                        errors.hour ? "This field can`t be empty" : undefined
                                                    }
                                                />
                                                <Input
                                                    variant="bordered"
                                                    //size="sm"
                                                    labelPlacement="outside"
                                                    label="Day of Month"
                                                    placeholder="*"
                                                    value={formData.dayOfMonth}
                                                    onChange={(e) => handleChange("dayOfMonth", e.target.value)}
                                                    isInvalid={errors.dayOfMonth}
                                                    errorMessage={
                                                        errors.dayOfMonth ? "This field can`t be empty" : undefined
                                                    }
                                                />
                                                <Input
                                                    variant="bordered"
                                                    //size="sm"
                                                    labelPlacement="outside"
                                                    label="Month"
                                                    placeholder="*"
                                                    value={formData.month}
                                                    onChange={(e) => handleChange("month", e.target.value)}
                                                    isInvalid={errors.month}
                                                    errorMessage={
                                                        errors.month ? "This field can`t be empty" : undefined
                                                    }
                                                />
                                                <Input
                                                    variant="bordered"
                                                    labelPlacement="outside"
                                                    label="Day of Week"
                                                    placeholder="*"
                                                    value={formData.dayOfWeek}
                                                    onChange={(e) => handleChange("dayOfWeek", e.target.value)}
                                                    isInvalid={errors.dayOfWeek}
                                                    errorMessage={
                                                        errors.dayOfWeek ? "This field can`t be empty" : undefined
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}



                                    <div className="flex gap-4 justify-end items-center m-4">
                                        <Button variant="light"
                                            size="sm" onPress={() => navigate("/cronjobs")}>
                                            Cancel
                                        </Button>
                                        <Button
                                            isLoading={buttonSpinner}
                                            type="submit"
                                            className="bg-orange-600 text-white text-sm px-8 rounded-sm"
                                            size="sm"
                                        >
                                            {editvalue ? "Update Cron Job" : "Add Cron Job"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>


                    </Card>






                </div>

            </div >

        </div >
    )
}

export default AddCronJob