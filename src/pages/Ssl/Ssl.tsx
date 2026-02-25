import { Button, Card, Divider } from "@heroui/react"
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion'
import CustomRenew from "./CustomRenew";
import UpdateSSlCOmfig from "./UpdateSSlCOmfig";
import AddNewSLL from "./AddNewSLL";
import SSlDetails from "./SSlDetails";
import { Icon } from "@iconify/react";
import { getServer } from "../../redux/slice/serverslice";
import { useDispatch } from "react-redux";
import { clearEditMode, setCustomREnew } from "../../redux/slice/SLLMangerSLice";
import { getWebDetails } from "../../redux/slice/websiteSlice";
const Ssl = () => {
    const Editmode = useAppSelector((state) => state.SSL.IsEditing)
    const [isNewMode, setIsNewMode] = useState(false)
    const ReducerDispathc = useDispatch()
    const dispatch = useAppDispatch()
    const CustomeRenewMode = useAppSelector((state) => state.SSL.isCustomRenew)
    const websiteDetial = useAppSelector((state) => state.website.selectedWebsite)
    useEffect(() => {
        dispatch(getServer())
        ReducerDispathc(setCustomREnew(false))
        ReducerDispathc(clearEditMode())
        dispatch(getWebDetails());
    }, [])
    return (
        <div className="p-2 overflow-y-auto scrollbar-hide">
            <p className="text-3xl">Welcome to <span className=" font-bold text-teal-600">
                SSL Management
            </span>
            </p>
            <p className="mt-4 text-gray-500">
                You can manage SSL certificates for your web applications from this page, Please note that renew feature is available only for Let's Encrypt SSL certificates.
            </p>
            <div className="flex justify-end mt-2">

                <Button onPress={() => setIsNewMode(true)} className="bg-orange-600 text-white rounded-md">
                    Deploy New SSL
                </Button>
            </div>
            <div className="mt-6  w-full  ">
                <div className=" w-full space-y-6 ">
                    <Card className="w-full shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
                            <span className="font-bold text-white text-lg">SSL Management</span>
                        </div>
                        <Divider />

                        {!websiteDetial?.website?.is_ssl_installed && !isNewMode && !Editmode ?
                            <div className="flex flex-col items-center gap-2 py-18 h-full justify-center">
                                <Icon icon="lucide:database-x" className="text-default-400 mb-3" width={36} />
                                <p className="text-lg">No SSL found</p>
                            </div>
                            :
                            <div className=' pt-2'>
                                <AnimatePresence mode="wait">
                                    {
                                        CustomeRenewMode ? (
                                            <motion.div
                                                key="customRenew"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <CustomRenew type="website" />
                                            </motion.div>
                                        ) : Editmode ? (
                                            <motion.div
                                                key="update"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <UpdateSSlCOmfig type="website" />
                                            </motion.div>
                                        ) : isNewMode ? (
                                            <motion.div
                                                key="new"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <AddNewSLL setIseditMode={setIsNewMode} ssltype='website' />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="details"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <SSlDetails ssltype='website' />
                                            </motion.div>
                                        )
                                    }
                                </AnimatePresence>
                            </div>
                        }
                    </Card>
                </div>
            </div >
        </div >
    )
}

export default Ssl