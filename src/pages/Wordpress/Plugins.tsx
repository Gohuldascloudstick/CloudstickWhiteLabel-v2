import { addToast, Button, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useEffect, useState } from "react";
import { getWordPressPlugins, handlePluginAction } from "../../redux/slice/WordPressManager";
import { Icon } from "@iconify/react";


const Plugins = () => {
    const dispatch = useAppDispatch();
    const [statusLoader, setStatusLoader] = useState(false);
    const [updateLoader, setupdateLoader] = useState(false);
    const [deleteLoader, setdeleteLoader] = useState(false);
    const wordpressplugsList = useAppSelector(
        (state) => state.wordPressManger.wordpressPlugins
    );
    const getplugins = async () => {
        try {
            await dispatch(getWordPressPlugins());
        } catch (error) {
            console.log(error)
        }
    }
    const handlestatus = async (act: string, name: string) => {
        const action = act === "inactive" ? "activate" : "deactivate"
        setStatusLoader(true)
        try {
            await dispatch(handlePluginAction({ action: action, plugin_name: [name] })).unwrap();
            getplugins();
            addToast({
                title: "Updated successfully",
                color: "success"
            })
        } catch (error: any) {
            addToast({
                title: "Failed to update",
                description: error,
                color: "danger"
            })
        } finally {
            setStatusLoader(false)
        }
    }
    const handleupdate = async (name: string) => {

        setupdateLoader(true)
        try {
            await dispatch(handlePluginAction({ action: "update", plugin_name: [name] })).unwrap();
            getplugins();
            addToast({
                title: "Activated successfully",
                color: "success"
            })
        } catch (error: any) {
            addToast({
                title: "Failed to activate",
                description: error,
                color: "danger"
            })
        } finally {
            setupdateLoader(false)
        }
    }
    const handledelete = async (name: string) => {

        setdeleteLoader(true)
        try {
            await dispatch(handlePluginAction({ action: "update", plugin_name: [name] })).unwrap();
            getplugins();
            addToast({
                title: "Activated successfully",
                color: "success"
            })
        } catch (error: any) {
            addToast({
                title: "Failed to activate",
                description: error,
                color: "danger"
            })
        } finally {
            setdeleteLoader(false)
        }
    }
    useEffect(() => {
        getplugins();
    }, [])
    return (
        <div>
            <Table classNames={{
                wrapper: "p-0 rounded-xs overflow-hidden",
                th: "bg-gray-50/50 text-slate-700 font-bold uppercase tracking-wider h-12",
                td: "py-4 px-4 border-b border-gray-100",
            }}>
                <TableHeader>
                    <TableColumn>
                        PLUGINS
                    </TableColumn>
                    <TableColumn>
                        VERSION
                    </TableColumn>
                    <TableColumn>
                        STATUS
                    </TableColumn>
                    <TableColumn>
                        ENABLE/DISABLE
                    </TableColumn>
                    <TableColumn>
                        UPDATE
                    </TableColumn>
                    <TableColumn>
                        REMOVE
                    </TableColumn>

                </TableHeader>
                <TableBody>
                    {wordpressplugsList && wordpressplugsList.map((plugs) => (
                        <TableRow>
                            <TableCell>
                                {plugs.name}
                            </TableCell>
                            <TableCell>
                                {plugs.version}
                            </TableCell>
                            <TableCell>
                                <div className={`${plugs.status === "inactive" ? "text-danger-500" : "text-success-500"}`}>
                                    {plugs.status.toUpperCase()}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="pl-8">
                                    <span
                                        className={` ${statusLoader
                                            ? "cursor-wait "
                                            : "cursor-pointer "
                                            }`}
                                    >
                                        <Switch
                                            isSelected={plugs.status === "active"}
                                            isDisabled={
                                                statusLoader
                                            }
                                            size="sm"
                                            classNames={{
                                                base: "w-10 h-4",
                                                wrapper: "w-8 h-4 dark:bg-slate-700",
                                                thumb: "w-2 h-2",
                                            }}
                                            onChange={() => handlestatus(plugs.status, plugs.name)}
                                        />
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {plugs.update === "none" ? (
                                    <span className="text-success-500 border-1 border-success-500 p-1">
                                        Up to date
                                    </span>
                                ) : (
                                    <Button variant="light" isLoading={updateLoader} isDisabled={updateLoader} onPress={() => handleupdate(plugs.name)} className="text-blue-500 px-3 border-1 rounded-xs cursor-pointer border-blue-500 p-1">
                                        Activate
                                    </Button>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button
                                    onPress={() => handledelete(plugs.name)}
                                    variant="light"
                                    isLoading={deleteLoader}
                                    isDisabled={!!deleteLoader}
                                    className="text-danger-500 ">
                                    <Icon icon={"lucide:trash-2"} width={20} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </div>
    )
}

export default Plugins