import { addToast, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js';
import  { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { addNewDomain, removeDomain } from '../../redux/slice/appSettingSlice';
import { getWebDetails } from '../../redux/slice/websiteSlice';


const AppDomain = () => {
    const [hoverName, setHoveredname] = useState("");
    const currentWebsite = useAppSelector((state) => state.website.selectedWebsite);
    const [addDomainModal, setAddDomainModal] = useState(false);
    const [domainname, setDomainName] = useState("");
    const [domainError, setDomainError] = useState("");
    const [requiressl, setRequireSsl] = useState("false");
    const [requiredeletessl, setRequiredeleteSsl] = useState("false");
    const [loader, setLoader] = useState(false);
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [openPopover, setOpenPopover] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const handleAddNewDomain = async () => {

        if (!domainname.trim()) {
            setDomainError("Domain name cannot be empty")
            return;
        }
        const labels = domainname.split(".");

        if (labels.length < 2) {
            setDomainError("Domain must contain a valid TLD");
            return;
        }

        for (const label of labels) {
            if (!label.length) {
                setDomainError("Domain cannot contain empty labels");
                return;
            }
            if (label.length > 63) {
                setDomainError("Each domain label must be less than 63 characters");
                return;
            }
            if (label.startsWith("-") || label.endsWith("-")) {
                setDomainError("Domain labels cannot start or end with hyphens");
                return;
            }

            if (!/^[a-z0-9-]+$/.test(label)) {
                setDomainError("Only letters, numbers, and hyphens are allowed");
                return;
            }
        }
        try {
            setLoader(true)
            await dispatch(addNewDomain({ data: { "domains": [domainname] }, ssl: requiressl })).unwrap();
            setAddDomainModal(false);
            addToast({
                title: "Domain added successfully",
                color: "success"
            })
            dispatch(getWebDetails())
        } catch (error:any) {
            addToast({
                title: "Failed to add domain",
                color: "danger",
                description: error
            })
            dispatch(getWebDetails())
        } finally {
            setLoader(false)
        }
    }

    const removeDomainname = async (domain: string) => {
        try {
            setDeleteLoader(true)
            await dispatch(removeDomain({ data: { "domains": [domain] },ssl:requiredeletessl })).unwrap();
            addToast({
                title: "Domain deleted successfully",
                color: "success"
            })
            dispatch(getWebDetails())
        } catch (error:any) {
            addToast({
                title: "Failed to delete domain",
                description: error,
                color: "danger"
            })
        } finally {
            setDeleteLoader(false)
        }
    }
    return (
        <div className='flex flex-col gap-4'>
            <div className="flex items-start justify-between px-1">
                <div>
                    <h3 className="text-base font-semibold text-default-800">Linked Domains</h3>
                    {/* <p className="text-tiny text-default-500">Manage domains associated with this website</p> */}
                </div>
                <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="lucide:plus" width={16} />}
                    onPress={() => { setAddDomainModal(true), setDomainName(""), setDomainError(""), setRequireSsl("false") }}
                    className="font-medium"
                >
                    Add New
                </Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-3'>
                {currentWebsite?.website.domains.map((domain) => (
                    <div
                        onMouseEnter={() => setHoveredname(domain)}
                        onMouseLeave={() => setHoveredname("")}
                        className=" flex items-center justify-between p-3 rounded-xl border-1 border-slate-200 bg-slate-100  transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="shrink-0 p-2.5 bg-primary-100  rounded-lg transition-colors">
                                <Icon
                                    icon="lucide:globe"
                                    className="text-primary"
                                    width={18}
                                />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-medium text-sm truncate">
                                    {domain}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-default-400 dark:text-default-600 font-bold">
                                    Active Domain
                                </span>
                            </div>
                        </div>
                        <div className={`${hoverName === domain || openPopover === domain ? "block" : "hidden"}`}>
                            <Popover
                                isOpen={openPopover === domain}
                                onOpenChange={(open) => {
                                    setOpenPopover(open ? domain : null);
                                    setRequiredeleteSsl("false")
                                }}
                            >
                                <PopoverTrigger>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="danger"

                                    >
                                        <Icon icon="lucide:trash-2" width={18} />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[320px] dark:bg-slate-900 p-0 overflow-hidden border-none shadow-2xl">

                                    <div className=" px-4 py-3 flex items-center gap-3">
                                        <div className="shrink-0 p-2 rounded-full bg-danger-100 dark:bg-danger-500/20 text-danger-600">
                                            <Icon icon="lucide:alert-triangle" width={20} />
                                        </div>
                                        <h4 className="font-bold text-sm text-danger-700 dark:text-danger-500">
                                            Confirm Deletion
                                        </h4>
                                    </div>

                                    <div className="p-4 pt-2">

                                        <p className="text-[13px] text-default-600 leading-relaxed mb-4">
                                            This will remove the SSL from the current domain. The certificate will be
                                            re-provisioned for your remaining domains.
                                        </p>
                                        <div className="bg-default-50 dark:bg-default-100/50 p-3 rounded-lg mb-4">
                                            <RadioGroup
                                                label={<span className="text-[11px] font-bold uppercase tracking-wider text-default-400">Proceed with deletion?</span>}
                                                value={requiredeletessl}
                                                onValueChange={setRequiredeleteSsl}
                                                orientation="horizontal"
                                                size="sm"
                                                color="danger"
                                            >
                                                <div className="flex gap-4 mt-1">
                                                    <Radio value="false" classNames={{ label: "text-xs font-medium" }}>No, keep it</Radio>
                                                    <Radio value="true" classNames={{ label: "text-xs font-medium" }}>Yes, remove</Radio>
                                                </div>
                                            </RadioGroup>
                                        </div>


                                        <div className="flex justify-end gap-2 mt-2">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                className="font-medium"
                                                onPress={() => setOpenPopover("")}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="danger"
                                                variant={"solid"}
                                                className="font-bold shadow-md shadow-danger-500/20"
                                                isLoading={deleteLoader}
                                                isDisabled={deleteLoader}
                                                onPress={() => removeDomainname(domain)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                        </div>
                    </div>
                ))}

            </div>
            <Modal
                isOpen={addDomainModal}
                hideCloseButton
                placement="center"
                scrollBehavior="inside"
                backdrop="blur"
                classNames={{
                    base: "bg-content1 dark:bg-content1-dark",
                    header: "border-b border-default-200",
                    footer: "border-t border-default-200",
                }}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>Add Domain </ModalHeader>
                            <ModalBody className="gap-4 pt-4">
                                <Input
                                    label="Domain name"
                                    placeholder="Enter new domain"
                                    type="text"
                                    errorMessage={domainError}
                                    isInvalid={!!domainError}
                                    value={domainname}
                                    onChange={(e) => {
                                        setDomainName(e.target.value),
                                            setDomainError("")
                                    }}
                                    isRequired
                                    labelPlacement="outside"
                                />
                                <RadioGroup
                                    label="Install SSL for this domain ?"
                                    value={requiressl}
                                    onValueChange={(v) => setRequireSsl(v)}
                                    className="md:col-span-2"
                                >
                                    <div className="flex gap-4 mt-2">
                                        <Radio value="false">No</Radio>
                                        <Radio value="true">Yes</Radio>
                                    </div>
                                </RadioGroup>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light"
                                    onPress={() => setAddDomainModal(false)}
                                    isDisabled={loader}
                                    size="sm">
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    size="sm"
                                    isLoading={loader}
                                    isDisabled={loader}
                                    onPress={handleAddNewDomain}

                                >
                                    Add
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default AppDomain