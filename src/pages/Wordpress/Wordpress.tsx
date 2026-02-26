import { addToast, Button, Card, Divider, Input, Switch } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { magicLink } from "../../redux/slice/websiteSlice";
import { getUSerCounts, getWordPressManagerVersions, getWpdebug, getWpindex, getWpMaintance, getWPPluginCount, getWpUrls, handleWPversionActions, updateDebug, updatesearchIndex, UpdateWP_URls, updateWpMaintance } from "../../redux/slice/WordPressManager";
import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import Users from "./Users";
import AddUser from "./AddUser";
import type { wpDebug } from "../../utils/interfaces";
import Plugins from "./Plugins";

const Wordpress = () => {
  const dispatch = useAppDispatch();
  const [magicloader, setmagicloader] = useState<boolean>(false);
  const [selectedOPtion, setSelectedOption] = useState("GENERAL");
  const [siteUrl, setSiteUrl] = useState("N/A");
  const [homeUrl, setHomeUrl] = useState("N/A");
  const [homeurlEdit, setHomeurlEdit] = useState(false);
  const [siteurlLoader, setSiteurlLoader] = useState(false);
  const [siteurlEdit, setSiteurlEdit] = useState(false);
  const [homeurlLoader, setHomeurlLoader] = useState(false);
  const wpdebug = useAppSelector((state) => state.wordPressManger.wpDebug)
  const [DebugLoader, setDebugLoader] = useState(false);
  const wpDebug_loader = useAppSelector((state) => state.wordPressManger.wpdebug_loader)
  const [maintanceLoader, setMiantanceLoader] = useState(false);
  const wpMaintance = useAppSelector((state) => state.wordPressManger.wpMAIntance);
  const wpMaintanceLoader = useAppSelector((state) => state.wordPressManger.wpmaintanceLoader);
  const [SearchindexLoader, setSearchindexLoader] = useState(false);
  const wpSearchIndexLoader = useAppSelector((state) => state.wordPressManger.wpSearch_index_enabled_loader)
  const wpSearchIndex = useAppSelector((state) => state.wordPressManger.wpsearch_index_enabled);
  const versionDetails = useAppSelector(
    (state) => state.wordPressManger.wordPressManagerVersion
  );
  const pluginLoader = useAppSelector((state) => state.wordPressManger.pliginLoader);
  const totalCount = useMotionValue(0);
  const totalRounded = useTransform(totalCount, (x: number) => Math.round(x));
  const UserCounts = useAppSelector((state) => state.wordPressManger.wpUserCount);
  const activeCount = useMotionValue(0);
  const activeRounded = useTransform(activeCount, (x: number) => Math.round(x));
  const siteUrls = useAppSelector((state) => state.wordPressManger.WpURLS);
  const totalplugin = useMotionValue(0);
  const totalpluginRounded = useTransform(totalplugin, (x: number) => Math.round(x));
  const UserCountLoader = useAppSelector((state) => state.wordPressManger.wPUserCountLoader);
  const activeplugin = useMotionValue(0);
  const activepluginRounded = useTransform(activeplugin, (x: number) => Math.round(x));
  const [Loader, setLoader] = useState("");
  const PluginCounts = useAppSelector((state) => state.wordPressManger.WpPLuginCount);

  const generateMagicLink = async () => {
    try {
      setmagicloader(true);
      const result = await dispatch(
        magicLink()
      ).unwrap();
      console.log(result);
      if (result) {
        window.open(result.magic_link, "_blank");
      }
    } catch (error: any) {
      addToast({
        description: error || "Magiclink failed",
        color: "danger",
      });
    } finally {
      setmagicloader(false);
    }
  };
  const updatewpdebug = async <K extends keyof wpDebug>(
    key: K,
    value: wpDebug[K]
  ) => {
    setDebugLoader(true);

    let data = { ...wpdebug }
    data[key] = value
    data.debug_log_path = ''

    try {
      const result = await dispatch(updateDebug({ data })).unwrap();
      await dispatch(getWpdebug()).unwrap();
      addToast({
        description: `${result.message}`,
        color: "success",
      });
    } catch (error: any) {
      addToast({
        description: error,
        color: "danger",
      });
    } finally {
      setDebugLoader(false);
    }
  };
  const Vesrioncontrols = async (action: string) => {
    setLoader(action);
    try {
      const result = await dispatch(
        handleWPversionActions({ action })
      ).unwrap();
      await dispatch(
        getWordPressManagerVersions()
      ).unwrap();
      addToast({
        description: result.message,
        color: "success",
      });
    } catch (error: any) {
      addToast({
        description: error,
        color: "danger",
      });
    } finally {
      setLoader("");
    }
  };
  const updateMiantance = async (toggle: boolean) => {
    setMiantanceLoader(true);
    try {
      await dispatch(
        updateWpMaintance({ toggle })
      ).unwrap();
      addToast({
        description: `Wordpress maintanance mode updated successfully`,
        color: "success",
      });
    } catch (error: any) {
      addToast({
        description: error,
        color: "danger",
      });
    } finally {
      setMiantanceLoader(false);
    }
  };
  const updatewpSearchIndex = async (toggle: boolean) => {
    setSearchindexLoader(true);
    try {
      await dispatch(
        updatesearchIndex({ toggle })
      ).unwrap();
      addToast({
        description: `Wordpress search index mode updated successfully`,
        color: "success",
      });
    } catch (error: any) {
      addToast({
        description: error,
        color: "danger",
      });
    } finally {
      setSearchindexLoader(false);
    }
  };
  const UpdateUrls = async (type: string) => {
    try {
      let data
      if (type === "Site") {
        setSiteurlLoader(true);
        data = { site_url: siteUrl };
      } else {
        setHomeurlLoader(true);
        data = { home_url: homeUrl };
      }
      await dispatch(UpdateWP_URls({ data })).unwrap();
      addToast({
        description: `${type} url Updated Successfully`,
        color: "success",
      });
    } catch (error: any) {
      addToast({
        description: error,
        color: "danger",
      });
    } finally {
      if (type === "Site") {
        setSiteurlLoader(false);
        setSiteurlEdit(false);
      } else {
        setHomeurlLoader(false);
        setHomeurlEdit(false);
      }
    }
  };
  useEffect(() => {
    let totalControls: any;
    let activeControls: any;

    if (UserCountLoader) {
      // Animate in a loop while loading (0 → 100 → 0 → 100)
      totalControls = animate(totalCount, 100, {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      });

      activeControls = animate(activeCount, 50, {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      });
    } else if (UserCounts) {
      // Animate to real values when loaded
      totalControls = animate(totalCount, UserCounts.total_users, {
        duration: 1.5,
      });

      activeControls = animate(activeCount, UserCounts.active_users, {
        duration: 1.5,
      });
    }

    return () => {
      totalControls?.stop();
      activeControls?.stop();
    };
  }, [UserCountLoader, UserCounts]);

  useEffect(() => {
    let totalControls: any;
    let activeControls: any;

    if (UserCountLoader) {
      // Users loading → loop animation
      totalControls = animate(totalCount, 100, {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      });
      activeControls = animate(activeCount, 50, {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      });
    } else if (UserCounts) {
      // Users loaded → animate to real values
      totalControls = animate(totalCount, UserCounts.total_users, {
        duration: 1.5,
      });
      activeControls = animate(activeCount, UserCounts.active_users, {
        duration: 1.5,
      });
    }

    return () => {
      totalControls?.stop();
      activeControls?.stop();
    };
  }, [UserCountLoader, UserCounts]);


  useEffect(() => {
    if (siteUrls) {
      setSiteUrl(siteUrls.site_url);
      setHomeUrl(siteUrls.home_url)
    }
  }, [siteUrls])

  useEffect(() => {
    let totalPluginControls: any;
    let activePluginControls: any;

    if (pluginLoader) {
      // Plugins loading → loop animation
      totalPluginControls = animate(totalplugin, 50, {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      });
      activePluginControls = animate(activeplugin, 25, {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      });
    } else if (PluginCounts) {
      // Plugins loaded → animate to real values
      totalPluginControls = animate(totalplugin, PluginCounts.total_plugins, {
        duration: 1.5,
      });
      activePluginControls = animate(
        activeplugin,
        PluginCounts.active_plugins,
        {
          duration: 1.5,
        }
      );
    }

    return () => {
      totalPluginControls?.stop();
      activePluginControls?.stop();
    };
  }, [pluginLoader, PluginCounts]);
  useEffect(() => {
    dispatch(getWpUrls())
    dispatch(getWpdebug())
    dispatch(getWpindex())
    dispatch(getWpMaintance())
    dispatch(getUSerCounts())
    dispatch(getWPPluginCount())
    dispatch(getWordPressManagerVersions())
  }, [])
  const options = [
    "GENERAL", "USERS", "ADD USER", "PLUGINS"
  ]

  return (
    <div className=" lg:p-2 overflow-y-auto scrollbar-hide">

      <p className=" text-xl md:text-2xl lg:text-3xl">Welcome to
        <span className=" ml-1 font-bold text-teal-600">
          WordPress Manager
        </span>
      </p>
      <div className="flex  items-center justify-between">
        <div>
          <p className="mt-1 md:mt-2 lg:mt-2 text-xs md:text-sm lg:text-md text-gray-500">
            Manage your associated WordPress content management system.
          </p>
        </div>
        <div>
          <Button
            size="sm"
            color="primary"
            className=" bg-teal-600 mr-4"
            data-testid='Magic Link'
            startContent={
              !magicloader && (
                <Icon icon="lucide:link" width={14} />
              )
            }
            isLoading={magicloader}
            onPress={generateMagicLink}
          >
            Magic Link
          </Button>
        </div>
      </div>
      <div className=" mt-3 lg:mt-6  w-full  ">
        <div className=" w-full space-y-6 ">
          <Card className="w-full shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-4 bg-linear-to-r from-[#2168a1] to-[#11999e]">
              <Icon icon={"uil:wordpress-simple"} width={24} className="text-white" />
              <span className="font-bold text-white text-sm md:text-md lg:text-lg">WordPress Manager</span>
            </div>
            <Divider />
            <div className=" p-4 lg:p-8 flex flex-col gap-3 lg:gap-6 font-sans">

              <div className="flex gap-2 border-b-1 border-gray-100">
                {options.map((opt) => (
                  <div className={` ${selectedOPtion === opt ? "border-blue-800 border-b-2" : ""} `}>
                    <Button
                      variant="light"
                      className="hover:bg-transparent! text-blue-500 font-semibold"
                      onPress={() => { setSelectedOption(opt) }}
                    >
                      {opt}
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                {selectedOPtion === "GENERAL" && (
                  <>
                    <div className="flex justify-between  ">
                      <div className=" w-full space-y-4">
                        <div className="flex items-end space-x-2 mt-1">
                          <Input
                            value={siteUrl}
                            label="Website URL"
                            labelPlacement="outside"
                            isReadOnly={!siteurlEdit}
                            onChange={(e) => setSiteUrl(e.target.value)}
                            fullWidth
                            size="sm"
                            startContent={<Icon icon="lucide:link" width={14} />}
                            placeholder="https://example.com"
                          />
                          {siteurlEdit ? (
                            <Button
                              color="primary"
                              size="sm"
                              onPress={() => UpdateUrls("Site")}
                              isLoading={siteurlLoader}
                              isDisabled={siteurlLoader}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              color="default"
                              size="sm"
                              variant="light"
                              onPress={() => setSiteurlEdit(true)}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                        <div className="flex items-end space-x-2 mt-1">
                          <Input
                            value={homeUrl}
                            label="Home URL"
                            labelPlacement="outside"
                            isReadOnly={!homeurlEdit}
                            onChange={(e) => setHomeUrl(e.target.value)}
                            fullWidth
                            size="sm"
                            startContent={<Icon icon="lucide:home" width={14} />}
                            placeholder="https://example.com"
                          />
                          {homeurlEdit ? (
                            <Button
                              color="primary"
                              size="sm"
                              onPress={() => UpdateUrls("Home")}
                              isLoading={homeurlLoader}
                              isDisabled={homeurlLoader}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              color="default"
                              size="sm"
                              variant="light"
                              onPress={() => setHomeurlEdit(true)}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="w-full flex-items-center pt-4 grid grid-cols-2 px-22 ">
                        <div className="flex items-center justify-between px-18">
                          <h4 className="text-sm font-medium">WordPress Debugging</h4>
                          <span
                            className={`${wpDebug_loader || DebugLoader ? " cursor-wait" : " "}`}
                          >
                            <Switch
                              size="sm"
                              isSelected={wpdebug.debug_enabled}
                              onValueChange={() =>
                                updatewpdebug("debug_enabled", !wpdebug.debug_enabled)
                              }
                              isDisabled={wpDebug_loader || DebugLoader}
                              classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4 dark:bg-slate-700",
                                thumb: "w-2 h-2",
                              }}
                            />
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-18">
                          <h4 className="text-sm font-medium">Search Indexing</h4>
                          <span
                            className={`${SearchindexLoader || wpSearchIndexLoader ? " cursor-wait" : " "
                              }`}
                          >
                            <Switch
                              size="sm"
                              isSelected={wpSearchIndex}
                              onValueChange={() => updatewpSearchIndex(!wpSearchIndex)}
                              isDisabled={SearchindexLoader}
                              classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4 dark:bg-slate-700",
                                thumb: "w-2 h-2",
                              }}
                            ></Switch>
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-18">
                          <h4 className="text-sm font-medium">Maintanence Mode</h4>
                          <span
                            className={`${maintanceLoader || wpMaintanceLoader ? " cursor-wait" : " "
                              }`}
                          >
                            <Switch
                              size="sm"
                              isSelected={wpMaintance}
                              onValueChange={() => updateMiantance(!wpMaintance)}
                              isDisabled={maintanceLoader}
                              classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4 dark:bg-slate-700",
                                thumb: "w-2 h-2",
                              }}
                            ></Switch>
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-18">
                          <h4 className="text-sm font-medium">Enable Auto Updates</h4>
                          <span
                            className={` ${Loader === "enable-auto-update" ||
                              Loader === "disable-auto-update"
                              ? "cursor-wait "
                              : "cursor-pointer "
                              }`}
                          >
                            <Switch
                              size="sm"
                              isDisabled={
                                Loader === "enable-auto-update" ||
                                Loader === "disable-auto-update"
                              }
                              onValueChange={() =>
                                Vesrioncontrols(
                                  versionDetails.auto_update_minor
                                    ? "disable-auto-update"
                                    : "enable-auto-update"
                                )
                              }
                              isSelected={versionDetails.auto_update_major}
                              classNames={{
                                base: "w-10 h-4",
                                wrapper: "w-8 h-4 dark:bg-slate-700",
                                thumb: "w-2 h-2",
                              }}
                            ></Switch>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-12 justify-around items-center  gap-4">
                      <div className="flex flex-col items-start">
                        <Icon
                          icon="mdi:account-group"
                          className="text-blue-500 text-xl"
                        />
                        <p className="text-xs text-default-500 dark:text-default-800 mt-1">Total Users</p>
                        <motion.h4 className="text-base font-bold">
                          {totalRounded}
                        </motion.h4>
                      </div>
                      <div className="flex flex-col items-start">
                        <Icon
                          icon="mdi:account-check"
                          className="text-green-500 text-xl"
                        />
                        <p className="text-xs text-default-500 dark:text-default-800 mt-1">Active Users</p>
                        <motion.h4 className="text-base font-bold">
                          {activeRounded}
                        </motion.h4>
                      </div>
                      <div className="flex flex-col items-start">
                        <Icon icon="mdi:puzzle" className="text-purple-500 text-xl" />
                        <p className="text-xs text-default-500 dark:text-default-800 mt-1">Total Plugins</p>
                        <motion.h4 className="text-base font-bold">
                          {totalpluginRounded}
                        </motion.h4>
                      </div>
                      <div className="flex flex-col items-start">
                        <Icon icon="mdi:plugin" className="text-green-500 text-xl" />
                        <p className="text-xs text-default-500 dark:text-default-800 mt-1">Active Plugins</p>
                        <motion.h4 className="text-base font-bold">
                          {activepluginRounded}
                        </motion.h4>
                      </div>
                    </div>
                  </>
                )}
                {selectedOPtion === "USERS" && (
                  <Users />
                )}
                {selectedOPtion === "ADD USER" && (
                  <AddUser />
                )}
                {selectedOPtion === "PLUGINS" && (
                  <Plugins />
                )}

              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Wordpress