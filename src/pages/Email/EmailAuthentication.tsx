import { Button, Card, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { Copy } from "../../components/copytoClipboard/Copy";
import { useEffect } from "react";
import { getConfig } from "../../redux/slice/EmailSlice";
import CopyToClipboardWrapper from "../../components/copytoClipboard/CopyToClipboardWrapper";


const EmailAuthentication = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const records = useAppSelector(state => state.Email.records);
  const dnsRecords = [
    records?.a && {
      type: "A",
      name: records.a.name,
      ttl: records.a.ttl,
      value: records.a.value,
      ip: records.a.ip,
      server: records.a.server,
      priority: records.a.priority
    },
    records?.mx && {
      type: "MX",
      name: records.mx.name,
      ttl: records.mx.ttl,
      value: records.mx.value,
      ip: records.mx.ip,
      server: records.mx.server,
      priority: records.mx.priority
    },
    records?.dkim && {
      type: "DKIM",
      name: records.dkim.name,
      ttl: records.dkim.ttl,
      value: records.dkim.value,
      ip: records.dkim.ip,
      server: records.dkim.server,
      priority: records.dkim.priority
    },
    records?.spf && {
      type: "SPF",
      name: records.spf.name,
      ttl: records.spf.ttl,
      value: records.spf.value,
      ip: records.spf.ip,
      server: records.spf.server,
      priority: records.spf.priority
    },
    records?.dmarc && {
      type: "DMARC",
      name: records.dmarc.name,
      ttl: records.dmarc.ttl,
      value: records.dmarc.value,
      ip: records.dmarc.ip,
      server: records.dmarc.server,
      priority: records.dmarc.priority
    },


  ];
  const getEmailConfiguration = async () => {
    try {
      await dispatch(getConfig()).unwrap();
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getEmailConfiguration();

  }, [])

  return (
    <div className="max-h-[90vh]  lg:p-2 overflow-y-auto scrollbar-hide">
      <p className=" text-xl md:text-2xl lg:text-3xl">Welcome to
        <span className=" ml-1 font-bold text-teal-600">
          Email Authentication
        </span>
      </p>
      <p className="mt-1 md:mt-2 lg:mt-2 text-xs md:text-sm lg:text-md text-gray-500">
        This feature lets you create and manage email accounts.
      </p>
      <div className=" mt-3 lg:mt-6  w-full  ">
        <div className=" w-full space-y-6 ">
          <Card className="w-full shadow-sm border border-gray-200">
            <div className=" px-3 md:px-6 py-2 md:py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
              <span className="font-bold text-white text-sm md:text-md lg:text-lg">Create an Email</span>
            </div>
            <Divider />
            <div className=" p-4 lg:p-8 flex flex-col gap-3 lg:gap-6 ">
              <span className="text-md font-semibold">
                Setup DNS Records for Email
              </span>
              <div className="pl-16">
                <span className="text-md ">
                  We recommend to add the following records in your DNS Zone
                </span>
                <div className="text-sm mt-4 pl-6 space-y-4">
                  <div className="flex  gap-2 ">
                    <Icon icon={"icon-park-outline:dot"} className="pt-1" />
                    <p >
                      A sender policy framework (3PF) record is a type of DNS TXT record that lists all the servers authorised to send emails from a particular domain.
                    </p>
                  </div>
                  <div className="flex  gap-2 ">
                    <Icon icon={"icon-park-outline:dot"} className="pt-1" />
                    <p>
                      An MX-record (Mail eXchange-record) is a type of resource record in the Domain Name System (DN5).
                    </p>
                  </div>
                  <div className="flex  gap-2 ">
                    <Icon icon={"icon-park-outline:dot"} className="pt-1" />
                    <p>
                      This is the system that, among other indicates to what specific IP address emails need to be sent.
                    </p>
                  </div>
                  <div className="flex  gap-2 ">
                    <Icon icon={"icon-park-outline:dot"} className="pt-1" />
                    <p>
                      DomainKeys Identified Mail, or DKIM, is a technical standard that helps protect email senders and recipients from spam, spoofing, and phishing.
                    </p>
                  </div>
                  <div className="flex  gap-2 ">
                    <Icon icon={"icon-park-outline:dot"} className="pt-1" />
                    <p>
                      DMARC is an open email authentication protocol that provides domain-level protection of the email channel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-4 flex justify-end">
              <Button
                onPress={() => navigate("/email")}

                className="bg-[#f07c33] text-xs md:text-sm text-white font-medium px-2 md:px-6 rounded-md hover:bg-[#d96b28] transition-colors"
                size="md"
              >
                <span className="hidden md:block">
                  Create Email
                </span>
                <span className="blcok md:hidden">Create</span>

              </Button>
            </div>
          </Card>
          <Card className="w-full shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-4  ">
              <Icon icon={"vaadin:records"} />
              <span className="font-bold text-sm md:text-md lg:text-lg"> Records</span>
            </div>
            {dnsRecords?.map((record, index) => (
              <div key={index} className="p-4 py-6 border-t-1 border-gray-200">
                <span className="text-md font-bold text-gray-700 dark:text-zinc-200">
                  {`${record?.type} Record`}
                </span>
                <div className="my-4 ">
                  {record?.name && (
                    <div
                      className="w-full bg-transparent  hover:bg-white dark:hover:bg-slate-800 transition-all rounded-xl px-4  flex items-center "
                    >
                      <div>
                        <span className="text-gray-800 font-medium  text-md mr-2">
                          NAME:
                        </span>
                        <span className="font-medium  text-md text-zinc-600 dark:text-zinc-400 break-all">
                          {record?.name}
                        </span>
                      </div>

                      <CopyToClipboardWrapper textToCopy={String(record?.name)}>
                        <Button isIconOnly size="sm" variant="light">
                          <Copy width={12} />
                        </Button>
                      </CopyToClipboardWrapper>
                    </div>

                  )}
                  {record?.ttl && (
                    <div
                      className="w-full bg-transparent  hover:bg-white dark:hover:bg-slate-800 transition-all rounded-xl px-4  flex items-center "
                    >
                      <div>
                        <span className="text-gray-800 font-medium   text-md mr-2">
                          TTL:
                        </span>
                        <span className="font-medium  text-md text-zinc-600 dark:text-zinc-400 break-all">
                          {record?.ttl}
                        </span>
                      </div>

                       <CopyToClipboardWrapper textToCopy={String(record?.ttl)}>
                        <Button isIconOnly size="sm" variant="light">
                          <Copy width={12} />
                        </Button>
                      </CopyToClipboardWrapper>

                    </div>

                  )}
                  {record?.value && (
                    <div
                      className="w-full bg-transparent  hover:bg-white dark:hover:bg-slate-800 transition-all rounded-xl px-4  flex items-start "
                    >
                      <div className="flex gap-3">
                        <span className="text-gray-800 font-medium  text-md mr-2">
                          VALUE:
                        </span>
                        <span className="font-medium  text-md text-zinc-600 dark:text-zinc-400 break-all">
                          {record?.value}
                        </span>
                      </div>

                       <CopyToClipboardWrapper textToCopy={String(record?.value)}>
                        <Button isIconOnly size="sm" variant="light">
                          <Copy width={12} />
                        </Button>
                      </CopyToClipboardWrapper>

                    </div>

                  )}
                  {record?.ip && (
                    <div
                      className="w-full bg-transparent  hover:bg-white dark:hover:bg-slate-800 transition-all rounded-xl px-4  flex items-center "
                    >
                      <div>
                        <span className="text-gray-800 font-medium  text-md mr-2">
                          IP:
                        </span>
                        <span className="font-medium  text-md text-zinc-600 dark:text-zinc-400 break-all">
                          {record?.ip}
                        </span>
                      </div>

                      <CopyToClipboardWrapper textToCopy={String(record?.ip)}>
                        <Button isIconOnly size="sm" variant="light">
                          <Copy width={12} />
                        </Button>
                      </CopyToClipboardWrapper>

                    </div>

                  )}
                  {record?.server && (
                    <div
                      className="w-full bg-transparent  hover:bg-white dark:hover:bg-slate-800 transition-all rounded-xl px-4  flex items-center "
                    >
                      <div>
                        <span className="text-gray-800 font-medium  text-md mr-2">
                          SERVER:
                        </span>
                        <span className="font-medium  text-md text-zinc-600 dark:text-zinc-400 break-all">
                          {record?.server}
                        </span>
                      </div>

                       <CopyToClipboardWrapper textToCopy={String(record?.server)}>
                        <Button isIconOnly size="sm" variant="light">
                          <Copy width={12} />
                        </Button>
                      </CopyToClipboardWrapper>

                    </div>

                  )}
                  {record?.priority && (
                    <div
                      className="w-full bg-transparent  hover:bg-white dark:hover:bg-slate-800 transition-all rounded-xl px-4  flex items-center "
                    >
                      <div className="">
                        <span className="text-gray-800 font-medium  text-md mr-2">
                          PRIORITY:
                        </span>
                        <span className="font-medium  text-md text-zinc-600 dark:text-zinc-400 break-all">
                          {record?.priority}
                        </span>
                      </div>

                      <CopyToClipboardWrapper textToCopy={String(record?.priority)}>
                        <Button isIconOnly size="sm" variant="light">
                          <Copy width={12} />
                        </Button>
                      </CopyToClipboardWrapper>
                    </div>

                  )}
                </div>
              </div>
            ))}


          </Card>
        </div>

      </div >

    </div >
  )
}

export default EmailAuthentication