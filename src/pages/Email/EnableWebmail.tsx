import { Button, Card, CardBody, Divider, Input } from "@heroui/react"
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { addWebinstallMessage, ClearWebsiteInstaltionLogs } from "../../redux/slice/WSslice";
import { initSocket } from "../../utils/wsSingleton";
import { useDispatch } from "react-redux";
import { getWebDetails } from "../../redux/slice/websiteSlice";
import { Icon } from "@iconify/react";
import WebsiteInstallationTerminal from "../../layout/component/websiteInstalltionterminal";


const EnableWebmail = () => {
    const dispatch = useAppDispatch();
    const reducerDispatch = useDispatch()
    const [domainname, setDomainName] = useState("");
    const [domainnnameerror, setDomainNameError] = useState("");
    const user = JSON.parse(localStorage.getItem("userId") || "null");
    const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
    const webId = JSON.parse(localStorage.getItem("webId") || "null")
    const [isTerminalVisible, setIsTerminalVisible] = useState(false);
    const logs = useAppSelector((s) => s.ws.webInstallMessage);
    const currentWebsite = useAppSelector(
        (state) => state.website.selectedWebsite
    );
    const getWebsiteDetails = async () => {
        try {
            await dispatch(getWebDetails()).unwrap();
        } catch (error) {
            console.log(error)
        }
    }
    const onMessageHandler = (d: string) => {
        
        reducerDispatch(addWebinstallMessage(d));
        if (d === "Website created successfully") {
            getWebsiteDetails();
        }
    };
    const handleAddwebmail = () => {
        
        const apiUrl = import.meta.env.VITE_SERVER;
        const url = `/api/v2/roundcubewebmail/websites/${webId}/servers/${serverId}/users/${user}`;

        const data = {
            "domain_name": domainname
        }
        if (!domainname.trim()) {
            setDomainNameError("please enter a Domainname");
            return;
        }
        dispatch(ClearWebsiteInstaltionLogs());
        initSocket(apiUrl + url, onMessageHandler, data);
        setIsTerminalVisible(true);
    }
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
                                    label="Domain Name"
                                    placeholder="Enter Subdomain name "
                                    type="text"
                                    value={domainname}
                                    onChange={(e) => {
                                        setDomainName(e.target.value.trim());
                                        if (domainnnameerror) setDomainNameError("");
                                    }}
                                    isRequired
                                    isInvalid={!!domainnnameerror}
                                    errorMessage={domainnnameerror}
                                    labelPlacement="outside"
                                />
                            </div>
                            <div className="mt-2 flex justify-end">
                                <Button
                                    onPress={() => handleAddwebmail()}
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
            {logs && logs.length > 0 && (

                <WebsiteInstallationTerminal
                    isOpen={isTerminalVisible}
                    onOpenChange={() => setIsTerminalVisible(!isTerminalVisible)}
                    selectedStack="Roundcube"
                    onBackToForm={() => { }}
                    onCloseTerminal={() => setIsTerminalVisible(false)}
                    websiteName={currentWebsite?.website?.name ?? ""}
                    domain={domainname}
                    type='roundcube'
                />
            )}
            {logs && logs.length > 0 && !isTerminalVisible && (
                <Card
                    isPressable
                    onPress={() => setIsTerminalVisible(true)}
                    className="p-5 shadow-sm mt-4 border border-red-300/15 hover:border-red-600 dark:bg-red-800/10 transition-colors duration-200"
                >
                    <CardBody className="flex items-center justify-between">
                        <div className="flex  items-center gap-4">
                            <Icon
                                icon="lucide:alert-triangle"
                                className="text-red-500 text-2xl"
                            />
                            <div className="flex flex-col">
                                <h4 className="font-semibold text-red-600 dark:text-red-400">
                                    Installation Error
                                </h4>
                                <span className="text-sm text-gray-700 dark:text-gray-300/30">
                                    {logs.find((item) => item.includes("Error"))}
                                </span>
                            </div>
                            <Icon icon="lucide:arrow-right" className="text-gray-400" />
                        </div>
                    </CardBody>
                </Card>
            )}

        </div >
    )
}

export default EnableWebmail