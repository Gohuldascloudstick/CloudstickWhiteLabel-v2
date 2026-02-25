import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Divider,
  Button,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,

  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { addToast } from "@heroui/react";
import { useDispatch } from "react-redux";
import CopyToClipboardWrapper from "../../components/copytoClipboard/CopyToClipboardWrapper";
import { Copy } from "../../components/copytoClipboard/Copy";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { DeleteServerSsl, deleteSslCertificate, renewFreeSsl, RenewServerFreeSsl, setCustomREnew, setEditMode } from "../../redux/slice/SLLMangerSLice";
import { getWebDetails } from "../../redux/slice/websiteSlice";
import { getServer } from "../../redux/slice/serverslice";





// Helper function to format date strings like 'MMM D, YYYY'
const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

// NEW: Component for a tight, vertically stacked label and value for better readability
const CleanDetailItem: React.FC<{
  label: string;
  value: string | number | React.ReactNode;
  tooltip?: string;
}> = ({ label, value, tooltip }) => (
  <div className="flex flex-col py-2">
    <div className="flex items-center gap-1 mb-0.5">
      <span className="text-xs font-medium text-default-500">{label}</span>
      {tooltip && (
        <Tooltip content={tooltip} size="sm">
          <Icon
            icon="lucide:help-circle"
            className="w-3 h-3 text-default-400 cursor-pointer"
          />
        </Tooltip>
      )}
    </div>
    <span className="text-sm font-semibold text-default-900 break-all leading-snug">
      {value}
    </span>
  </div>
);

// Component for full-width, vertically stacked detail items (e.g., Cipher Suite)
const FullWidthDetailItem: React.FC<{
  label: string;
  value: string | React.ReactNode;
  tooltip?: string;
}> = ({ label, value, tooltip }) => (
  <div className="flex flex-col py-2 ">
    <div className="flex items-center gap-1 mb-1">
      <span className="text-sm text-default-600 font-medium">{label}</span>
      {tooltip && (
        <Tooltip content={tooltip}>
          <Icon
            icon="lucide:help-circle"
            className="w-3 h-3 text-default-400 cursor-pointer"
          />
        </Tooltip>
      )}
    </div>
    <div className="text-xs font-mono bg-default-50 dark:bg-default-300 dark:text-default-800 p-4 rounded-md break-all text-default-900 border border-default-200">
      {value}
    </div>
  </div>
);

// Component for displaying raw content with view/copy actions
const ContentActionItem: React.FC<{
  label: string;
  content?: string;
  title: string;
  handleView: (title: string, content: string) => void;
  handleCopy: (content: string, fieldName: string) => Promise<void>;
  tooltip?: string;
}> = ({ label, content, title, handleView, handleCopy, tooltip }) => (
  <div className="flex justify-between items-center py-2">
    <div className="flex items-center gap-1">
      <span className="text-sm text-default-600 font-medium">{label}</span>
      {tooltip && (
        <Tooltip content={tooltip}>
          <Icon
            icon="lucide:help-circle"
            className="w-3 h-3 text-default-400 cursor-pointer"
          />
        </Tooltip>
      )}
    </div>
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        color="primary"
        onPress={() => handleView(title, content || "No content available.")}
        isDisabled={!content}
        className="px-4"
      >
        View
      </Button>
      {/*  */}

      <CopyToClipboardWrapper textToCopy={content ?? ""}>
        <Button
          size="sm"
          variant="light"
          color="primary"
          endContent={<Copy />}
          onPress={() => content && handleCopy(content, title)}
          isDisabled={!content}
        >
          Copy
        </Button>
        {/* <span className="text-sm flex items-center gap-2 cursor-pointer py-1">
                      Copy 
                      <Copy />
                    </span> */}
      </CopyToClipboardWrapper>
    </div>
  </div>
);

// --- Main Component ---

const SSlDetails = ({ ssltype }: { ssltype: string }) => {
  const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
  const server = useAppSelector((state) => state.server.serverList)?.find(
    (server) => server.id.toString() == serverId
  );
  const dispatch = useAppDispatch();
  const reducerDisoatch = useDispatch()
  const websiteDetail = useAppSelector(
    (state) => state.website.selectedWebsite
  );
  const website = ssltype == 'website' ? websiteDetail?.website : server;

  // Modal state for viewing the raw certificate content
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpenPOP, setIsOpenPOP] = React.useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
  }>({ title: "", content: "" });

  const [renewLoader, setRenewLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const {
    expirationText,
    expirationColor,
    isExpired,
  }: {
    expirationText: string;
    expirationColor: "success" | "warning" | "danger" | "default";
    isExpired: boolean;
    daysRemaining: number | null;
  } = useMemo(() => {
    const expiredAtString = website?.ssl_expired_at;

    if (!expiredAtString || !website?.is_ssl_installed) {
      return {
        expirationText: "Not Installed",
        expirationColor: "default",
        isExpired: true,
        daysRemaining: null,
      };
    }

    const expiryDate = new Date(expiredAtString);
    const today = new Date();

    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDifference = expiryDate.getTime() - today.getTime();
    const days = Math.floor(timeDifference / (1000 * 3600 * 24));

    let text: string;
    let color: "success" | "warning" | "danger" | "default";
    let isExpiredStatus = false;

    if (days <= 0) {
      text = "SSL Expired";
      color = "danger";
      isExpiredStatus = true;
    } else if (days <= 5) {
      text = `${days} day${days !== 1 ? "s" : ""} left`;
      color = "danger";
    } else if (days <= 30) {
      text = `${days} days left`;
      color = "warning";
    } else {
      text = `${days} days left`;
      color = "success";
    }

    return {
      expirationText: text,
      expirationColor: color,
      isExpired: isExpiredStatus,
      daysRemaining: days,
    };
  }, [website?.ssl_expired_at, website?.is_ssl_installed]);





  // Function to handle viewing the raw certificate content
  const handleViewContent = (title: string, content: string) => {
    setModalContent({ title, content });
    onOpen();
  };

  // Function to copy content to clipboard
  const handleCopy = async (
    content: string,

  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      addToast({
        title: "Copy Failed",
        description: "Unable to copy content.",
        color: "danger",
      });
    }
  };

  const HandelRenew = async () => {
    try {
      setRenewLoader(true);

      if (website?.ssl_provider?.toLocaleLowerCase() == 'custom') {
        return reducerDisoatch(setCustomREnew(true))
      } else {

        await dispatch(renewFreeSsl()).unwrap();
        addToast({
          description: '"Successfully renew SSL certificate"',
          color: "success",
          title: "SSL Renewed",
        });
      }
    } catch (error: any) {
      addToast({
        title: "Renew Failed",
        description: error,
        color: "danger",
      });
    } finally {
      setRenewLoader(false);
    }
  };

  const HandelServerRenew = async () => {
    try {
      setRenewLoader(true);
      if (server?.ssl_provider.toLocaleLowerCase() == 'custom') {
        return reducerDisoatch(setCustomREnew(true))
      } else {

        await dispatch(RenewServerFreeSsl()).unwrap();
        addToast({
          description: '"Successfully renew SSL certificate"',
          color: "success",
          title: "SSL Renewed",
        });
      }
    } catch (error: any) {
      addToast({
        title: "Renew Failed",
        description: error,
        color: "danger",
      });
    } finally {
      setRenewLoader(false);
    }
  };


  const HnadleDleteion = async () => {
    setDeleteLoader(true)
    try {
      await (dispatch(deleteSslCertificate())).unwrap()
      await (dispatch(getWebDetails()))
      addToast({
        description: '"Successfully delete SSL certificate"',
        color: "success",
        title: "SSL Deleted",
      });
    } catch (error: any) {
      addToast({
        title: "Delete Failed",
        description: error,
        color: "danger",
      });
    } finally {
      setDeleteLoader(false)
    }
  }

  const handleserverssldeletion = async () => {
    setDeleteLoader(true)
    try {
      await (dispatch(DeleteServerSsl())).unwrap()
      await (dispatch(getServer()))
      addToast({
        description: '"Successfully delete SSL certificate"',
        color: "success",
        title: "SSL Deleted",
      });
    } catch (error: any) {
      addToast({
        title: "Delete Failed",
        description: error,
        color: "danger",
      });
    } finally {
      setDeleteLoader(false)
    }
  }

  const handleEditSetup = async () => {
    const payload = {
      brotli_enabled: website?.ssl_brotli_enabled,
      access: website?.ssl_access_method,
      tls_version: website?.ssl_tls_protocol,
      cipher_suite: website?.ssl_cipher_suite,


    }
    reducerDisoatch(setEditMode(payload))
  }

  const handleServerEditSetup = async () => {
    const payload = {
      brotli_enabled: server?.ssl_brotli_enabled,
      access: server?.ssl_access_method,
      tls_version: server?.ssl_tls_protocol,
      cipher_suite: server?.ssl_cipher_suite,


    }
    reducerDisoatch(setEditMode(payload))
  }
  // --- Render logic for Not Installed State ---
  if (!website?.is_ssl_installed && ssltype == "website") {
    return (
      <Card className="shadow-sm border border-default-200 mt-4 bg-default-50">
        <CardBody className="flex flex-col items-center justify-center p-8">
          <Icon
            icon="lucide:lock-open"
            className="text-danger-400 w-8 h-8 mb-3"
          />
          <h4 className="text-base font-semibold text-default-900">
            SSL Certificate Not Installed
          </h4>
          <p className="text-sm text-default-500 mb-4 text-center">
            Secure your website by deploying a new SSL certificate.
          </p>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:zap" />}
            size="sm"
            data-testid="install-ssl-button"
          >
            Install New SSL
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (!server?.is_ssl_installed && ssltype == "server") {
    return (
      <Card className="shadow-sm border border-default-200 mt-4 bg-default-50">
        <CardBody className="flex flex-col items-center justify-center p-8">
          <Icon
            icon="lucide:lock-open"
            className="text-danger-400 w-8 h-8 mb-3"
          />
          <h4 className="text-base font-semibold text-default-900">
            SSL Certificate Not Installed
          </h4>
          <p className="text-sm text-default-500 mb-4 text-center">
            Secure your Server by deploying a new SSL certificate.
          </p>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:zap" />}
            size="sm"
            data-testid="install-ssl-button"
          >
            Install New SSL
          </Button>
        </CardBody>
      </Card>
    );
  }

  // --- Render logic for Installed State ---
  return (
    <>
      {ssltype == "website" ? (
        <div className=" p-4 mx-auto space-y-4">
          {/* 1. SSL HEALTH SNAPSHOT CARD */}
          <Card className="shadow-sm border border-default-200" data-testid="ssl-health-snapshot-card">
            <CardBody className="py-4 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Status Icon and Text (Focus) */}
              <div className="flex items-center gap-3">
                <Icon
                  icon={isExpired ? "lucide:lock-off" : "lucide:shield-check"}
                  className={`w-6 h-6 shrink-0 ${expirationColor === "danger"
                    ? "text-danger-500"
                    : expirationColor === "warning"
                      ? "text-warning-500"
                      : "text-success-500"
                    }`}
                />
                <div>
                  <p className="text-base font-bold text-default-900 leading-snug">
                    {isExpired ? "Certificate Expired" : "SSL Active and Secured"}
                  </p>
                  <span
                    className={`text-sm font-semibold ${expirationColor === "danger"
                      ? "text-danger-500"
                      : expirationColor === "warning"
                        ? "text-warning-500"
                        : "text-success-600"
                      }`}
                  >
                    {isExpired
                      ? "Immediate action required"
                      : "Certificate is valid"}
                  </span>
                  <Chip
                    size="sm"
                    variant="bordered"
                    color={expirationColor}
                    className="font-semibold min-w-19 justify-center text-center text-[10px] ml-2"
                  >
                    {expirationText}
                  </Chip>
                </div>
              </div>

              {/* Expiration Chip and Action Button */}
              <div className="flex gap-3 items-center w-full sm:w-auto justify-between sm:justify-end border-t border-default-100 sm:border-t-0 pt-3 sm:pt-0">
                {/* Expiration Chip */}

                {/* Renew Button */}

                <Tooltip content="Initiate the renewal process" size="sm">
                  <Button
                    color="primary"
                    size="sm"
                    variant="flat"
                    data-testid="renew-ssl-button"
                    isLoading={renewLoader}
                    isDisabled={renewLoader}
                    startContent={
                      !renewLoader && (
                        <Icon icon="lucide:rotate-cw" className={`w-4 h-4 `} />
                      )
                    }
                    // isDisabled={!isExpired && daysRemaining && daysRemaining > 30}
                    onPress={HandelRenew}
                  >
                    Renew
                  </Button>
                </Tooltip>
                <Tooltip content="Update SSL Configuration" size="sm">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="secondary"
                    data-testid="edit-ssl-configuration-button"
                    onPress={handleEditSetup}
                    startContent={
                      <Icon icon="lucide:pencil" className={`w-4 h-4 `} />
                    }
                  />
                </Tooltip>
                <Tooltip content="Delete SSL Certificate" size="sm">
                  <Popover
                    isOpen={isOpenPOP}
                    onOpenChange={(open) => setIsOpenPOP(open)}
                    classNames={{
                      content: 'dark:bg-slate-900'
                    }}
                  >
                    <PopoverTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="danger"
                        data-testid="delete-ssl-button"
                        startContent={
                          <Icon icon="lucide:trash-2" className={`w-4 h-4 `} />
                        }
                      />
                    </PopoverTrigger>
                    <PopoverContent className="p-4 max-w-75 space-y-6 pt-4 rounded-md">
                      <div className="px-6">

                        <div className="flex flex-col gap-4">

                          <div className="flex items-center gap-3">

                            <div className="p-2 rounded-full bg-danger-100 text-danger-600">
                              <Icon icon="lucide:alert-triangle" width={18} />{" "}
                              {/* Increased icon size from 16 to 18 for prominence */}
                            </div>
                            <h4 className="font-semibold text-base text-default-800 dark:text-white">

                              Confirm Deletion
                            </h4>
                          </div>
                          {/* Body Text */}
                          <p className="text-xs text-default-600 leading-normal">
                            {" "}
                            {/* Increased text size from xs to sm for readability, adjusted color */}
                            Are you sure you want to **delete this SSL
                            Certificate**? This action cannot be undone and will
                            immediately remove the SSL configuration from your
                            website.
                          </p>
                          {/* Actions */}
                          <div className="flex justify-end gap-2 ">
                            <Button
                              size="sm"
                              variant="light"
                              color="default"
                              data-testid="cancel-button"
                              // Removed redundant/overriding Tailwind classes
                              onPress={() => setIsOpenPOP(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              data-testid="confirm-delete-ssl-button"
                              // Removed redundant/overriding Tailwind classes
                              // Added a loading state example (assuming `isDeleting` state exists)
                              isLoading={deleteLoader}
                              isDisabled={deleteLoader}
                              onPress={() => {
                                HnadleDleteion()
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Tooltip>
              </div>
            </CardBody>
          </Card>

          {/* 2. CORE DETAILS CARD (Using CleanDetailItem for high readability) */}
          <Card className="shadow-sm border border-default-200">
            <CardBody className="p-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-default-800">
                <Icon
                  icon="lucide:calendar-check"
                  className="w-4 h-4 text-primary-500"
                />
                Certificate Life Cycle & Core Details
              </h3>
              <Divider className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                {/* Column 1 (2 items max on mobile/small, 3 items max on tablet/desktop) */}
                <CleanDetailItem
                  label="Issued By"
                  value={website?.ssl_provider || "N/A"}
                  tooltip="The Certificate Authority (CA) that issued this certificate."
                />
                <CleanDetailItem
                  label="Issued Date"
                  value={formatDate(website?.ssl_created_at)}
                  tooltip="The date the certificate was activated."
                />
                <CleanDetailItem
                  label="Expiration Date"
                  value={
                    <span
                      className={
                        isExpired
                          ? "text-danger-600"
                          : expirationColor === "danger"
                            ? "text-danger-500"
                            : "text-default-900"
                      }
                    >
                      {formatDate(website?.ssl_expired_at)}
                    </span>
                  }
                  tooltip="The date the certificate becomes invalid."
                />

                {/* Column 2 (2 items max on mobile/small, 3 items max on tablet/desktop) */}
                <CleanDetailItem
                  label="Last Renewed"
                  value={formatDate(website?.ssl_renewed_at)}
                  tooltip="The date the certificate was last renewed."
                />
                <CleanDetailItem
                  label="Authorization Method"
                  value={website?.ssl_authorisation || "N/A"}
                  tooltip="The method used to verify domain ownership (e.g., DNS or HTTP)."
                />
                <CleanDetailItem
                  label="Access Method"
                  value={website?.ssl_access_method || "Automatic"}
                  tooltip="How the certificate was installed (e.g., manual or automatic via ACME)."
                />
              </div>
            </CardBody>
          </Card>

          {/* 3. SECURITY AND FEATURES CARD (Cipher Suite Separated) */}
          <Card className="shadow-sm border border-default-200">
            <CardBody className="p-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-default-800">
                <Icon
                  icon="lucide:shield-plus"
                  className="w-4 h-4 text-success-500"
                />
                Security Protocols & Features
              </h3>
              <Divider className="mb-2" />

              {/* Full-Width Cipher Suite Detail */}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 py-4">
                <CleanDetailItem
                  label="TLS Protocol"
                  value={website?.ssl_tls_protocol || "Default (1.2/1.3)"}
                  tooltip="Transport Layer Security version."
                />

                <CleanDetailItem
                  label="Brotli Compression"
                  value={
                    <Chip
                      size="sm"
                      color={website?.ssl_brotli_enabled ? "success" : "default"}
                      variant="flat"
                      className="font-semibold text-xs px-2"
                    >
                      {website?.ssl_brotli_enabled ? "Enabled" : "Disabled"}
                    </Chip>
                  }
                  tooltip="Speeds up SSL handshakes and data transfer."
                />
                {website?.ssl_third_party && (
                  <CleanDetailItem
                    label="Third-Party Provider"
                    value={website?.ssl_third_party || "None"}
                  />
                )}

                {/* <CleanDetailItem label="Third-Party Account ID" value={website.ssl_third_party_account ? website.ssl_third_party_account : 'N/A'} />
                        <CleanDetailItem label="ACME Registration" value={website.ssl_acme_registration ? 'Registered' : 'N/A'} tooltip="Status of the Automatic Certificate Management Environment registration." /> */}
              </div>
              <Divider className="my-4" />
              <FullWidthDetailItem
                label="Cipher Suite"
                value={
                  website?.ssl_cipher_suite ||
                  "Default Strong Cipher (e.g., ECDHE-RSA-AES256-GCM-SHA384)"
                }
                tooltip="The set of algorithms used for key exchange, authentication, and encryption."
              />
            </CardBody>
          </Card>

          {/* 4. RAW CONTENT CARD (Sensitive/Technical) */}
          <Card className="shadow-sm border border-default-200">
            <CardBody className="p-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-default-800">
                <Icon icon="lucide:code" className="w-4 h-4 text-warning-500" />
                Raw Content Access
              </h3>
              <Divider className="mb-2" />
              <div className="space-y-0.5">
                <ContentActionItem
                  label="SSL Certificate (Public Key)"
                  content={website?.ssl_certificate}
                  title="SSL Certificate"
                  handleView={handleViewContent}
                  handleCopy={handleCopy}
                  tooltip="The public part of the certificate."
                />
                <ContentActionItem
                  label="Private Key (Sensitive)"
                  content={website?.ssl_private_key}
                  title="Private Key"
                  handleView={handleViewContent}
                  handleCopy={handleCopy}
                  tooltip="Do not share this key."
                />
              </div>

              {/* <Divider className="my-4" />
          <div className="flex justify-end">
            <Button
              color="default"
              variant="light"
              size="sm"
              startContent={
                <Icon icon="lucide:settings-2" className="w-4 h-4" />
              }
              onClick={() => console.log("Open SSL Settings")}
            >
              Advanced Settings
            </Button>
          </div> */}
            </CardBody>
          </Card>

          {/* Modal for viewing Certificate/Key Content */}
          <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            size="xl"
            backdrop="blur"
            classNames={{ base: "dark:bg-slate-900" }}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-base">
                    {modalContent.title}
                  </ModalHeader>
                  <ModalBody>
                    <div className="bg-default-50  dark:bg-default-300/50 dark:text-default-800 py-2 px-4 rounded-lg text-xs font-mono max-h-[50vh] border border-default-200">
                      <div className="flex justify-end w-full sticky  ">
                        <div className="w-fit ">
                          <CopyToClipboardWrapper textToCopy={modalContent.content}>
                            <Button
                              color="default"
                              variant="light"
                              size="sm"
                              data-testid="copy-content-button"
                              onPress={() =>
                                handleCopy(modalContent.content)
                              }
                              endContent={<Copy />}
                            >

                            </Button>
                          </CopyToClipboardWrapper>

                        </div>
                      </div>
                      <div className="  whitespace-pre-wrap break-all     max-h-[40vh] scrollbar-hide overflow-y-auto ">


                        {modalContent.content}

                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <CopyToClipboardWrapper textToCopy={modalContent.content}>
                      <Button
                        color="default"
                        variant="light"
                        size="sm"
                        data-testid="copy-content-button"
                        onPress={() =>
                          handleCopy(modalContent.content)
                        }
                        endContent={<Copy />}
                      >
                        Copy Content
                      </Button>
                    </CopyToClipboardWrapper>
                    <Button color="primary" onPress={onClose} size="sm" data-testid="close-modal-button">
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      ) : (

        <div className="mt-4 w-full mx-auto space-y-4">

          <Card className="shadow-sm  border border-default-200">
            <CardBody className="py-4 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Icon
                  icon={isExpired ? "lucide:lock-off" : "lucide:shield-check"}
                  className={`w-6 h-6 shrink-0 ${expirationColor === "danger"
                    ? "text-danger-500"
                    : expirationColor === "warning"
                      ? "text-warning-500"
                      : "text-success-500"
                    }`}
                />
                <div>
                  <p className="text-base font-bold text-default-900 leading-snug">
                    {isExpired ? "Certificate Expired" : "SSL Active and Secured"}
                  </p>
                  <span
                    className={`text-sm font-semibold ${expirationColor === "danger"
                      ? "text-danger-500"
                      : expirationColor === "warning"
                        ? "text-warning-500"
                        : "text-success-600"
                      }`}
                  >
                    {isExpired
                      ? "Immediate action required"
                      : "Certificate is valid"}
                  </span>
                  <Chip
                    size="sm"
                    variant="bordered"
                    color={expirationColor}
                    className="font-semibold min-w-19 justify-center text-center text-[10px] ml-2"
                  >
                    {expirationText}
                  </Chip>
                </div>
              </div>
              <div className="flex gap-3 items-center w-full sm:w-auto justify-between sm:justify-end border-t border-default-100 sm:border-t-0 pt-3 sm:pt-0">
                <Tooltip content="Initiate the renewal process" size="sm">
                  <Button
                    color="primary"
                    size="sm"
                    variant="flat"
                    data-testid="renew-ssl-button"
                    isLoading={renewLoader}
                    isDisabled={renewLoader}
                    startContent={
                      !renewLoader && (
                        <Icon icon="lucide:rotate-cw" className={`w-4 h-4 `} />
                      )
                    }
                    // isDisabled={!isExpired && daysRemaining && daysRemaining > 30}
                    onPress={HandelServerRenew}
                  >
                    Renew
                  </Button>
                </Tooltip>
                <Tooltip content="Update SSL Configuration" size="sm">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="secondary"
                    data-testid="edit-ssl-configuration-button"
                    onPress={handleServerEditSetup}
                    startContent={
                      <Icon icon="lucide:pencil" className={`w-4 h-4 `} />
                    }
                  />
                </Tooltip>
                <Tooltip content="Delete SSL Certificate" size="sm">
                  <Popover
                    isOpen={isOpenPOP}
                    onOpenChange={(open) => setIsOpenPOP(open)}
                  >
                    <PopoverTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="danger"
                        data-testid="delete-ssl-button"
                        startContent={
                          <Icon icon="lucide:trash-2" className={`w-4 h-4 `} />
                        }
                      />
                    </PopoverTrigger>
                    <PopoverContent className="p-4 max-w-75 space-y-6 pt-4 rounded-md">
                      <div className="px-6">

                        <div className="flex flex-col gap-4">

                          <div className="flex items-center gap-3">

                            <div className="p-2 rounded-full bg-danger-100 text-danger-600">
                              <Icon icon="lucide:alert-triangle" width={18} />{" "}
                              {/* Increased icon size from 16 to 18 for prominence */}
                            </div>
                            <h4 className="font-semibold text-base text-default-800 dark:text-white">

                              Confirm Deletion
                            </h4>
                          </div>
                          {/* Body Text */}
                          <p className="text-xs text-default-600 leading-normal">
                            {" "}
                            {/* Increased text size from xs to sm for readability, adjusted color */}
                            Are you sure you want to **delete this SSL
                            Certificate**? This action cannot be undone and will
                            immediately remove the SSL configuration from your
                            website.
                          </p>
                          {/* Actions */}
                          <div className="flex justify-end gap-2 ">
                            <Button
                              size="sm"
                              variant="light"
                              color="default"
                              data-testid="cancel-button"
                              // Removed redundant/overriding Tailwind classes
                              onPress={() => setIsOpenPOP(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              data-testid="confirm-delete-ssl-button"
                              // Removed redundant/overriding Tailwind classes
                              // Added a loading state example (assuming `isDeleting` state exists)
                              isLoading={deleteLoader}
                              isDisabled={deleteLoader}
                              onPress={() => {
                                handleserverssldeletion()
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Tooltip>
              </div>
            </CardBody>
          </Card>


          <Card className="shadow-sm border border-default-200">
            <CardBody className="p-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-default-800">
                <Icon
                  icon="lucide:calendar-check"
                  className="w-4 h-4 text-primary-500"
                />
                Certificate Life Cycle & Core Details
              </h3>
              <Divider className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">

                <CleanDetailItem
                  label="Issued By"
                  value={server?.ssl_provider || "N/A"}
                  tooltip="The Certificate Authority (CA) that issued this certificate."
                />
                <CleanDetailItem
                  label="Issued Date"
                  value={formatDate(server?.ssl_created_at)}
                  tooltip="The date the certificate was activated."
                />
                <CleanDetailItem
                  label="Expiration Date"
                  value={
                    <span
                      className={
                        isExpired
                          ? "text-danger-600"
                          : expirationColor === "danger"
                            ? "text-danger-500"
                            : "text-default-900"
                      }
                    >
                      {formatDate(server?.ssl_expired_at)}
                    </span>
                  }
                  tooltip="The date the certificate becomes invalid."
                />


                <CleanDetailItem
                  label="Last Renewed"
                  value={formatDate(server?.ssl_renewed_at)}
                  tooltip="The date the certificate was last renewed."
                />
                <CleanDetailItem
                  label="Authorization Method"
                  value={server?.ssl_authorisation || "N/A"}
                  tooltip="The method used to verify domain ownership (e.g., DNS or HTTP)."
                />
                <CleanDetailItem
                  label="Access Method"
                  value={server?.ssl_access_method || "Automatic"}
                  tooltip="How the certificate was installed (e.g., manual or automatic via ACME)."
                />
              </div>
            </CardBody>
          </Card>


          <Card className="shadow-sm border border-default-200">
            <CardBody className="p-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-default-800">
                <Icon
                  icon="lucide:shield-plus"
                  className="w-4 h-4 text-success-500"
                />
                Security Protocols & Features
              </h3>
              <Divider className="mb-2" />



              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 py-4">
                <CleanDetailItem
                  label="TLS Protocol"
                  value={server?.ssl_tls_protocol || "Default (1.2/1.3)"}
                  tooltip="Transport Layer Security version."
                />

                <CleanDetailItem
                  label="Brotli Compression"
                  value={
                    <Chip
                      size="sm"
                      color={server?.ssl_brotli_enabled ? "success" : "default"}
                      variant="flat"
                      className="font-semibold text-xs px-2"
                    >
                      {server?.ssl_brotli_enabled ? "Enabled" : "Disabled"}
                    </Chip>
                  }
                  tooltip="Speeds up SSL handshakes and data transfer."
                />
                {server?.ssl_third_party && (
                  <CleanDetailItem
                    label="Third-Party Provider"
                    value={server?.ssl_third_party || "None"}
                  />
                )}

                {/* <CleanDetailItem label="Third-Party Account ID" value={website.ssl_third_party_account ? website.ssl_third_party_account : 'N/A'} />
                        <CleanDetailItem label="ACME Registration" value={website.ssl_acme_registration ? 'Registered' : 'N/A'} tooltip="Status of the Automatic Certificate Management Environment registration." /> */}
              </div>
              <Divider className="my-4" />
              <FullWidthDetailItem
                label="Cipher Suite"
                value={
                  server?.ssl_cipher_suite ||
                  "Default Strong Cipher (e.g., ECDHE-RSA-AES256-GCM-SHA384)"
                }
                tooltip="The set of algorithms used for key exchange, authentication, and encryption."
              />
            </CardBody>
          </Card>


          <Card className="shadow-sm border border-default-200">
            <CardBody className="p-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-default-800">
                <Icon icon="lucide:code" className="w-4 h-4 text-warning-500" />
                Raw Content Access
              </h3>
              <Divider className="mb-2" />
              <div className="space-y-0.5">
                <ContentActionItem
                  label="SSL Certificate (Public Key)"
                  content={server?.ssl_certificate}
                  title="SSL Certificate"
                  handleView={handleViewContent}
                  handleCopy={handleCopy}
                  tooltip="The public part of the certificate."
                />
                <ContentActionItem
                  label="Private Key (Sensitive)"
                  content={server?.ssl_private_key}
                  title="Private Key"
                  handleView={handleViewContent}
                  handleCopy={handleCopy}
                  tooltip="Do not share this key."
                />
              </div>

              {/* <Divider className="my-4" />
          <div className="flex justify-end">
            <Button
              color="default"
              variant="light"
              size="sm"
              startContent={
                <Icon icon="lucide:settings-2" className="w-4 h-4" />
              }
              onClick={() => console.log("Open SSL Settings")}
            >
              Advanced Settings
            </Button>
          </div> */}
            </CardBody>
          </Card>

          {/* Modal for viewing Certificate/Key Content */}
          <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            size="xl"
            backdrop="blur"
            classNames={{ base: "dark:bg-slate-900" }}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-base">
                    {modalContent.title}
                  </ModalHeader>
                  <ModalBody>
                    <div className="bg-default-50  dark:bg-default-300/50 dark:text-default-800 py-2 px-4 rounded-lg text-xs font-mono max-h-[50vh] border border-default-200">
                      <div className="flex justify-end w-full sticky  ">
                        <div className="w-fit ">
                          <CopyToClipboardWrapper textToCopy={modalContent.content}>
                            <Button
                              color="default"
                              variant="light"
                              size="sm"
                              data-testid="copy-content-button"
                              onPress={() =>
                                handleCopy(modalContent.content)
                              }
                              endContent={<Copy />}
                            >

                            </Button>
                          </CopyToClipboardWrapper>

                        </div>
                      </div>
                      <div className="  whitespace-pre-wrap break-all     max-h-[40vh] scrollbar-hide overflow-y-auto ">


                        {modalContent.content}

                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>

                    <Button color="primary" onPress={onClose} size="sm" data-testid="close-modal-button">
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      )}

    </>
  );
};

export default SSlDetails;
