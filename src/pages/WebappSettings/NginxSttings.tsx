import { addToast, Spinner, Switch } from '@heroui/react'
import  { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { getWebDetails } from '../../redux/slice/websiteSlice';
import { changeNginxSettings } from '../../redux/slice/appSettingSlice';


const NginxSttings = () => {
    
    const currentWebsite = useAppSelector((state) => state.website.selectedWebsite);
    const [cjprotection, setCjprotection] = useState(currentWebsite?.website?.cj_protection);
    const [xssfilter, setXssfilter] = useState(currentWebsite?.website?.xss_protection);
    const [mime, setMime] = useState(currentWebsite?.website?.ms_protection);
    const [Permissions, setPermissions] = useState(currentWebsite?.website?.permissions_policy);
    const [contentSecurity, setContentSecurity] = useState(currentWebsite?.website?.content_security_policy);
    const [refererPolicy, setRefererPolicy] = useState(currentWebsite?.website?.referrer_policy);
    const [crossorigin, setCrossorigin] = useState(currentWebsite?.website?.cross_origin_opener_policy);
    const [loading, setLoading] = useState("")
    const [globalLoading, setGlobalLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleSubmit = async (settings: string, value: boolean) => {
        try {
            setLoading(settings)
            setGlobalLoading(true);
            const data = {
                "cj_protection": settings === "cj_protection" ? value : cjprotection,
                "xss_protection": settings === "xss_protection" ? value : xssfilter,
                "ms_protection": settings === "ms_protection" ? value : mime,
                "permissions_policy": settings === "permissions_policy" ? value : Permissions,
                "content_security_policy": settings === "content_security_policy" ? value : contentSecurity,
                "referrer_policy": settings === "referrer_policy" ? value : refererPolicy,
                "cross_origin_opener_policy": settings === "cross_origin_opener_policy" ? value : crossorigin
            }
            await dispatch(changeNginxSettings({ data: data })).unwrap();
            addToast({
                title: `${settings} changed successfully`,
                color: 'success'
            })
            dispatch(
                getWebDetails())
        } catch (error:any) {
            addToast({
                title: `Failed to change ${settings}`,
                description: error,
                color: "danger"
            })
        } finally {
            setLoading("");
            setGlobalLoading(false);
        }
    }

    useEffect(() => {
        setCjprotection(currentWebsite?.website?.cj_protection)
        setXssfilter(currentWebsite?.website?.xss_protection)
        setMime(currentWebsite?.website?.ms_protection);
        setPermissions(currentWebsite?.website?.permissions_policy);
        setContentSecurity(currentWebsite?.website?.content_security_policy);
        setRefererPolicy(currentWebsite?.website?.referrer_policy);
        setCrossorigin(currentWebsite?.website?.cross_origin_opener_policy)
    }, [currentWebsite?.website])
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4 mt-2">
                <div className="flex items-center justify-between p-4 rounded-xl border border-default-100 bg-default-50/50 hover:bg-default-50 dark:bg-default-300 transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-400">Clickjacking</span>
                        <span className="text-[10px] text-default-400 uppercase font-bold dark:text-default-600">X-Frame-Options</span>
                    </div>
                    <div className="relative flex items-center justify-center w-10 h-5">
                        <Switch
                            defaultSelected
                            size="sm"
                            color="primary"
                            isSelected={cjprotection}
                            isDisabled={globalLoading}
                            onValueChange={(v) => { handleSubmit("cj_protection", v) }}
                            classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4",
                                thumb: "w-2 h-2",
                            }}
                        />
                        {loading === "cj_protection" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/40 rounded-full">
                                <Spinner size="sm" className="scale-50" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl dark:bg-default-300 border border-default-100 bg-default-50/50 hover:bg-default-50 transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-400">
                            XSS Filter
                        </span>
                        <span className="text-[10px] text-default-400 uppercase font-bold dark:text-default-600">
                            X-XSS-Protection
                        </span>
                    </div>
                    <div className="relative flex items-center justify-center w-10 h-5">
                        <Switch
                            defaultSelected
                            size="sm"
                            color="primary"
                            isSelected={xssfilter}
                            isDisabled={globalLoading}
                            onValueChange={(v) => handleSubmit("xss_protection", v)}
                            classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4",
                                thumb: "w-2 h-2",
                            }}
                        />

                        {loading === "xss_protection" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/40 rounded-full">
                                <Spinner size="sm" className="scale-50" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border dark:bg-default-300 border-default-100 bg-default-50/50 hover:bg-default-50 transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-400">MIME Sniffing</span>
                        <span className="text-[10px] text-default-400 uppercase font-bold  dark:text-default-600 ">X-Content-Type</span>
                    </div>
                    <div className="relative flex items-center justify-center w-10 h-5">
                        <Switch
                            defaultSelected
                            size="sm"
                            color="primary"
                            isSelected={mime}
                            isDisabled={globalLoading}
                            onValueChange={(v) => { handleSubmit("ms_protection", v) }}
                            classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4",
                                thumb: "w-2 h-2",
                            }}
                        />
                        {loading === "ms_protection" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/40 rounded-full">
                                <Spinner size="sm" className="scale-50" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-default-100 bg-default-50/50 hover:bg-default-50 dark:bg-default-300 transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-400">Permissions Policy</span>
                        <span className="text-[10px] text-default-400 uppercase font-bold dark:text-default-600">Permissions-Policy</span>
                    </div>
                    <div className="relative flex items-center justify-center w-10 h-5">
                        <Switch
                            defaultSelected
                            size="sm"
                            color="primary"
                            isSelected={Permissions}
                            isDisabled={globalLoading}
                            onValueChange={(v) => { handleSubmit("permissions_policy", v) }}
                            classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4",
                                thumb: "w-2 h-2",
                            }}
                        />
                        {loading === "permissions_policy" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/40 rounded-full">
                                <Spinner size="sm" className="scale-50" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-default-100 bg-default-50/50 hover:bg-default-50 dark:bg-default-300 transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-400">Content Security</span>
                        <span className="text-[10px] text-default-400 uppercase font-bold dark:text-default-600">CSP</span>
                    </div>
                    <div className="relative flex items-center justify-center w-10 h-5">
                        <Switch
                            defaultSelected
                            size="sm"
                            color="primary"
                            isSelected={contentSecurity}
                            isDisabled={globalLoading}
                            onValueChange={(v) => { handleSubmit("content_security_policy", v) }}
                            classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4",
                                thumb: "w-2 h-2",
                            }}
                        />
                        {loading === "content_security_policy" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/40 rounded-full">
                                <Spinner size="sm" className="scale-50" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-default-100 bg-default-50/50 hover:bg-default-50 dark:bg-default-300 transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-400">Referrer Policy</span>
                        <span className="text-[10px] text-default-400 uppercase font-bold dark:text-default-600">Referrer-Policy</span>
                    </div>
                    <div className="relative flex items-center justify-center w-10 h-5">
                        <Switch
                            defaultSelected
                            size="sm"
                            color="primary"
                            isSelected={refererPolicy}
                            isDisabled={globalLoading}
                            onValueChange={(v) => { handleSubmit("referrer_policy", v) }}
                            classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4",
                                thumb: "w-2 h-2",
                            }}
                        />
                        {loading === "referrer_policy" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/40 rounded-full">
                                <Spinner size="sm" className="scale-50" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-default-100 bg-default-50/50 hover:bg-default-50 dark:bg-default-300 transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-400">Cross Origin</span>
                        <span className="text-[10px] text-default-400 uppercase font-bold dark:text-default-600">COOP</span>
                    </div>
                    <div className="relative flex items-center justify-center w-10 h-5">
                        <Switch
                            defaultSelected
                            size="sm"
                            color="primary"
                            isSelected={crossorigin}
                            isDisabled={globalLoading}
                            onValueChange={(v) => { handleSubmit("cross_origin_opener_policy", v) }}
                            classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4",
                                thumb: "w-2 h-2",
                            }}
                        />
                        {loading === "cross_origin_opener_policy" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/40 rounded-full">
                                <Spinner size="sm" className="scale-50" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NginxSttings