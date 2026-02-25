import { addToast, Button, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, Select, SelectItem, Switch, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";


import type { Provider } from "../../utils/interfaces";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import AddNewCloudflareApiKEy from "../../layout/component/Intergration/AddNewCloudflareApiKEy";
import { createFreeSslDns, createFreeSslHttp, createServerFreeSslDns, CreateServerFreeSslHttp, uploadCustomSsl, uploadServerCustomSsl } from "../../redux/slice/SLLMangerSLice";
import { getWebDetails } from "../../redux/slice/websiteSlice";
import { getServer } from "../../redux/slice/serverslice";
import { getCloudflareAccounts } from "../../redux/slice/dnsSlice";
const CloudflareLogo: React.FC = () => <Icon icon="devicon:cloudflare" width={24} height={24} />;
const LinodeLogo: React.FC = () => <Icon icon="logos:linode" width={24} height={24} />;
const DigitalOceanLogo: React.FC = () => <Icon icon="devicon:digitalocean" width={24} height={24} />;

const ProviderIcons: Record<string, React.ComponentType> = {
  Cloudflare: CloudflareLogo,
  linode: LinodeLogo,
  digitalocean: DigitalOceanLogo,
};


const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`bg-default-50/50 dark:bg-default-50/20 rounded-xl shadow-lg border border-default-200 ${className}`}>{children}</div>
);
const CardBody: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
const CardFooter: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);



interface AccessMethodOption {
  value: string;
  title: string;
  icon: string;
  description: string;
}

const ACCESS_METHOD_OPTIONS: AccessMethodOption[] = [
  {
    value: "HTTPS+HTTP",
    title: "HTTPS + HTTP",
    icon: "lucide:shield-half",
    description:
      "Allowing both protocols. We recommend using this if you are using a Cloudflare nameserver to avoid a redirection loop. However, HTTPS redirection will still work!",
  },
  {
    value: "HTTPS",
    title: "HTTPS Only",
    icon: "lucide:lock",
    description:
      "HTTPS Only will forcefully redirect all traffic from HTTP to the HTTPS version. Recommended for secure setups.",
  },
];

interface AccessMethodCardSelectorProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: AccessMethodOption[];
}

// --- Custom Card Selector Component ---
const AccessMethodCardSelector: React.FC<AccessMethodCardSelectorProps> = ({
  label,
  value,
  onValueChange,
  options,
}) => (
  <section>
    <h4 className="text-lg font-semibold text-default-800 mb-4">{label}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => onValueChange(option.value)}
          className={`
            p-5 rounded-xl border-1 cursor-pointer transition-all duration-200
            ${value === option.value
              ? "border-primary-500 bg-primary-50/40 dark:bg-primary-900/40  transform scale-[1.01]"
              : "border-default-200 dark:border-default-500  hover:border-default-400 dark:hover:border-default-300 dark:bg-content1/80 hover:bg-default-50 dark:hover:bg-default-100/20"
            }
          `}
          data-testid={`access-method-card-${option.value}`}
        >
          <div className="flex items-start space-x-4">
            <div className={`w-6 h-6 shrink-0 mt-0.5 ${value === option.value ? "text-primary-600" : "text-default-500"}`}>
              <Icon icon={option.icon} />
            </div>

            <div className="flex-1">
              <h5 className="font-bold text-default-900 mb-1 leading-snug">
                {option.title}
              </h5>
            </div>

            <div
              className={`
                w-4 h-4 rounded-full border-1 flex items-center justify-center shrink-0 mt-0.5
                ${value === option.value
                  ? "border-primary-500 bg-white dark:bg-default-200"
                  : "border-default-300 dark:border-default-600 bg-default-100 dark:bg-default-700"
                }
              `}
            >
              {value === option.value && (
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
              )}
            </div>


          </div>
          <div className=" mt-2 md:px-6">

            <p className="text-sm text-default-600">
              {option.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);




type DnsProviderKey = "Cloudflare" | "linode" | "digitalocean";

const DNS_PROVIDER_OPTIONS: { value: DnsProviderKey; label: string }[] = [
  { value: "Cloudflare", label: "Cloudflare" },
  { value: "linode", label: "Linode" },
  { value: "digitalocean", label: "Digital Ocean" },
];



const TLS_OPTIONS = [
  {
    value: "TLSv1.1 TLSv1.2 TLSv1.3",
    label: "TLSv1.1, TLSv1.2, TLSv1.3 (Legacy)",
  },
  {
    value: "TLSv1.2 TLSv1.3",
    label: "TLSv1.2, TLSv1.3 (Recommended)",
  },
  { value: "TLSv1.3", label: "TLSv1.3 (Modern)" },
];


const DEFAULT_CIPHER_SUITE = "EECDH+AESGCM:EDH+AESGCM:ECDHE-RSA-AES128-GCM-SHA256:AES256+EECDH:DHE-RSA-AES128-GCM-SHA256:AES256+EDH:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES256-GCM-SHA384:AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256:AES256-SHA:AES128-SHA:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4";


interface DnsAccountSelectorCardProps {
  label: string;
  selectedProvider: DnsProviderKey;
  selectedAccount: number; // ID of the selected account
  onProviderChange: (provider: DnsProviderKey) => void;
  onAccountChange: (accountId: number) => void;
  currentDnsAccounts: Provider[];
}

const DnsAccountSelectorCard: React.FC<DnsAccountSelectorCardProps> = ({
  label,
  selectedProvider,
  selectedAccount,
  onProviderChange,
  onAccountChange,
  currentDnsAccounts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAccountSelect = useCallback((accountId: number) => {
    onAccountChange(accountId);
    setIsOpen(false); // Close popover on selection
  }, [onAccountChange]);

  const handleProviderSelect = (value: string) => {
    onProviderChange(value as DnsProviderKey);
  };

  const ProviderLogo = ProviderIcons[selectedProvider];
  const selectedAccountObj = currentDnsAccounts.find(acc => acc.id === selectedAccount);
  const selectedAccountLabel = selectedAccountObj ? selectedAccountObj.label : "Select a linked account";


  const handleAddNewApi = () => {
    setIsOpen(false)
    setIsModalOpen(true);
  };

  return (
    <section className="relative">
      <h4 className="text-sm font-medium text-default-700 mb-1">{label}</h4>
      <Popover
        placement="bottom-start"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        classNames={{ base: "dark:bg-slate-900", content: ' ' }}
      >
        <PopoverTrigger>
          <div
            className={`
                            w-full border border-default-300 dark:border-default-500 rounded-lg p-3 text-sm flex items-center justify-between cursor-pointer 
                            bg-white dark:bg-content1 hover:bg-default-50 dark:hover:bg-default-100 transition
                            ${!selectedAccount ? 'text-default-500 dark:text-default-800' : 'text-default-800 dark:text-default-900'}
                        `}
            data-testid="provider-account-dropdown-trigger"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              {ProviderLogo && <ProviderLogo />}
              <span className="font-medium">
                {selectedAccountLabel}
              </span>
            </div>
            <Icon icon="lucide:chevron-down" width={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 border border-default-200 min-w-72  w-full" data-testid="provider-dropdown-content">
          <div className="p-4 w-full space-y-4">
            {/* 1. Select Provider Dropdown */}
            <div>
              <Select
                label="Select DNS Provider"
                placeholder="Select DNS Provider"
                labelPlacement="outside"
                selectedKeys={[selectedProvider]}
                data-testid="provider-select"
                onChange={(e) => handleProviderSelect(e.target.value)}
                size="sm"
                classNames={{
                  label: "text-sm font-medium text-default-700",
                  trigger: 'py-5 ',
                  popoverContent: "dark:bg-slate-900"
                }}
              >
                {DNS_PROVIDER_OPTIONS.map((opt) => {
                  const ProviderLogo = ProviderIcons[opt.value];
                  return (
                    <SelectItem key={opt.value}
                      startContent={<ProviderLogo />}
                      data-testid={`provider-select-item-${opt.value}`}
                    >
                      {opt.label}
                    </SelectItem>
                  )
                })}
              </Select>
            </div>

            {/* 2. Account List (Card Selector Style) */}
            <div className="py-2 border-y  border-default-200">
              <h5 className="text-xs font-medium text-default-700 mb-3">Available {DNS_PROVIDER_OPTIONS.find(p => p.value === selectedProvider)?.label} Accounts</h5>
              {currentDnsAccounts.length === 0 ? (
                <p className="text-xs text-default-500 p-3 bg-default-50 rounded-lg text-center">No linked accounts found for this provider.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {currentDnsAccounts.map((account) => (
                    <div
                      key={account.id}
                      onClick={() => handleAccountSelect(account.id)}
                      className={`
                                                p-3 rounded-lg border-1  cursor-pointer transition-all duration-200 flex items-center justify-between gap-2
                                                ${selectedAccount === account.id
                          ? "border-primary-500 bg-primary-50/40 dark:bg-primary-900/40"
                          : "border-default-200 dark:border-default-500 hover:border-default-400 dark:hover:border-default-600 hover:bg-default-50 dark:hover:bg-default-100/20"
                        }
                                            `}
                      data-testid={`dns-account-item-${account.id}`}
                    >
                      <span className="text-xs text-default-800 dark:text-default-700 font-medium">{account.label}</span>
                      {selectedAccount === account.id && (
                        <Icon icon="lucide:check-circle" className="text-primary-500 shrink-0" width={14} height={18} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedProvider == 'Cloudflare' &&

              <Button
                key="add_new"
                fullWidth
                variant="flat"
                size="sm"
                startContent={<Icon icon="lucide:plus" width={16} />}
                className="text-primary bg-transparent"
                onPress={handleAddNewApi}
                data-testid="add-new-api-button"
              >
                Add New API
              </Button>
            }
          </div>
        </PopoverContent>
      </Popover>

      <AddNewCloudflareApiKEy
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

    </section>
  );
};


// --- Component ---
interface AddNewSLLProps {
  setIseditMode: React.Dispatch<React.SetStateAction<boolean>>;
  ssltype: "server" | "website";
}

const AddNewSLL: React.FC<AddNewSLLProps> = ({ setIseditMode, ssltype }) => {

  const dispatch = useAppDispatch()

  // --- Form State ---
  const [brotliEnabled, setBrotliEnabled] = useState(true);
  const [sslProvider, setSslProvider] = useState<"letsencrypt" | "custom">(
    "letsencrypt"
  );

  // Let's Encrypt State
  const [authMethod, setAuthMethod] = useState<"HTTP" | "DNS">("HTTP");
  const [dnsProvider, setDnsProvider] = useState<DnsProviderKey>(
    "Cloudflare"
  );
  const [dnsAccount, setDnsAccount] = useState<number>(0); // Stores the account ID
  const [leAccessMethod, setLeAccessMethod] = useState<"HTTPS" | "HTTPS+HTTP">(
    "HTTPS+HTTP"
  );

  // Custom SSL State
  const [customCert, setCustomCert] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [tlsVersion, setTlsVersion] = useState(TLS_OPTIONS[1].value); // Default to recommended
  const [customCipherSuite, setCustomCipherSuite] = useState(DEFAULT_CIPHER_SUITE); // *UPDATED: NEW STATE FOR EDITABLE CIPHER
  const [customAccessMethod, setCustomAccessMethod] = useState<"HTTPS" | "HTTPS+HTTP">(
    "HTTPS+HTTP"
  );

  const cloudflarelist = useAppSelector((state) => state.dns.cloudflare)

  // UI State
  const [isLoading, setIsLoading] = useState(false);

  // --- Derived State & Memos ---

  // Get the list of accounts for the selected DNS provider
  const currentDnsAccounts = useMemo(() => {
    const accounts = dnsProvider == 'Cloudflare' ? cloudflarelist : []
    // Ensure dnsAccount is a valid ID for the current provider, reset if not
    if (!accounts.some(acc => acc.id === dnsAccount)) {
      // Only reset if it's not the initial state or a valid selection
      if (dnsAccount !== 0) setDnsAccount(0);
    }
    return accounts;
  }, [dnsProvider, cloudflarelist, dnsAccount]);

  // *UPDATED: Removed currentCipherSuite memo, it's now a state variable

  // --- Event Handlers ---

  // Combined handler for Provider change (now called from inside the Popover component)
  const handleDnsProviderChange = (provider: DnsProviderKey) => {
    setDnsProvider(provider);
    setDnsAccount(0); // Reset account selection when provider changes
  };

  // Handler for DNS account change (now called from inside the Popover component)
  const handleDnsAccountChange = (accountId: number) => {
    setDnsAccount(accountId);
  }

  // Handle Select change for TLS Version
  const handleTlsVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTlsVersion(e.target.value);
    // *FIX: The cipher suite is no longer updated here, preventing the bug.
  }

  const resetForm = () => {
    setBrotliEnabled(true);
    setSslProvider("letsencrypt");
    setAuthMethod("HTTP");
    setDnsProvider("Cloudflare");
    setDnsAccount(0);
    setLeAccessMethod("HTTPS+HTTP");
    setCustomCert("");
    setCustomKey("");
    setTlsVersion(TLS_OPTIONS[1].value);
    setCustomCipherSuite(DEFAULT_CIPHER_SUITE); // *UPDATED: Reset to default cipher
    setCustomAccessMethod("HTTPS+HTTP");
    setIsLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let payload: any = {
      brotli_enabled: brotliEnabled,
    };

    try {
      if (sslProvider === "letsencrypt") {

        payload.authorisation = authMethod;
        payload.access = leAccessMethod;

        if (authMethod === "DNS") {
          // Validation
          if (!dnsAccount) {
            addToast({
              description: "Please select a DNS provider account.",
              color: "danger",
            });
            setIsLoading(false);
            return;
          }
          payload.thirdparty_provider = dnsProvider;
          payload.account_label = dnsAccount.toString(); // This is the ID
        }
      } else {
        // Custom SSL
        // Validation
        if (!customCert.trim() || !customKey.trim()) {
          addToast({
            description: "Certificate and Private Key cannot be empty.",
            color: "danger",
          });
          setIsLoading(false);
          return;
        }
        if (!customCipherSuite.trim()) {
          addToast({
            description: "Cipher Suite cannot be empty.",
            color: "danger",
          });
          setIsLoading(false);
          return;
        }

        payload.provider = "custom";
        payload.private_key = customKey.trim();
        payload.certificate = customCert.trim();
        payload.access = customAccessMethod;
        payload.tls_version = tlsVersion;
        payload.cipher_suite = customCipherSuite; // *UPDATED: Use the new editable state
      }

      // Simulate API call
      if (sslProvider === "letsencrypt") {
        if (authMethod === 'DNS') {
          await dispatch(createFreeSslDns({ data: payload })).unwrap()
        } else {
          await dispatch(createFreeSslHttp({ data: payload })).unwrap()
        }
      } else {
        await dispatch(uploadCustomSsl({ data: payload })).unwrap()
      }

      await dispatch(getWebDetails())

      addToast({
        description: (
          <span data-testid="ssl-toast-success">
            SSL Certificate configuration saved successfully!
          </span>
        ),
        color: "success",
      });
      resetForm()
      setIseditMode(false)
    } catch (error: any) {
      console.error("Failed to save SSL configuration:", error);
      addToast({
        description: (
          <span data-testid="ssl-toast-error">
            {error}
          </span>
        ),
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleServerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let payload: any = {
      brotli_enabled: brotliEnabled,
    };

    try {
      if (sslProvider === "letsencrypt") {

        payload.authorisation = authMethod;
        payload.access = leAccessMethod;

        if (authMethod === "DNS") {

          if (!dnsAccount) {
            addToast({
              description: "Please select a DNS provider account.",
              color: "danger",
            });
            setIsLoading(false);
            return;
          }
          payload.thirdparty_provider = dnsProvider;
          payload.account_label = dnsAccount.toString();
        }
      } else {

        if (!customCert.trim() || !customKey.trim()) {
          addToast({
            description: "Certificate and Private Key cannot be empty.",
            color: "danger",
          });
          setIsLoading(false);
          return;
        }
        if (!customCipherSuite.trim()) {
          addToast({
            description: "Cipher Suite cannot be empty.",
            color: "danger",
          });
          setIsLoading(false);
          return;
        }

        payload.provider = "custom";
        payload.private_key = customKey.trim();
        payload.certificate = customCert.trim();
        payload.access = customAccessMethod;
        payload.tls_version = tlsVersion;
        payload.cipher_suite = customCipherSuite;
      }


      if (sslProvider === "letsencrypt") {
        if (authMethod === 'DNS') {
          await dispatch(createServerFreeSslDns({ data: payload })).unwrap()
        } else {
          await dispatch(CreateServerFreeSslHttp({ data: payload })).unwrap()
        }
      } else {
        await dispatch(uploadServerCustomSsl({ data: payload })).unwrap()
      }

      await dispatch(getServer())

      addToast({
        description: (
          <span data-testid="ssl-toast-success">
            SSL Certificate configuration saved successfully!
          </span>
        ),
        color: "success",
      });
      resetForm()
      setIseditMode(false)
    } catch (error: any) {
      console.error("Failed to save SSL configuration:", error);
      addToast({
        description: (
          <span data-testid="ssl-toast-error">
            {error}
          </span>
        ),
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getcloudflare = async () => {
      await dispatch(getCloudflareAccounts("")).unwrap()
    }
    if (cloudflarelist.length == 0) {
      getcloudflare()
    }
  }, [])



  return (
    <>
      {ssltype == "website" ? (

        <form onSubmit={handleSubmit} >
          <div className="shadow-none p-4  ">
            <div className="p-2!  md:p-6! space-y-8 dark:bg-slate-900  ">

              {/* --- 1. Brotli Compression --- */}
              <section className="flex items-center justify-between p-2 md:p-4  rounded-lg border border-default-200 dark:border-default-300   bg-white dark:bg-default-100">
                <label htmlFor="brotli-switch" className="font-medium  cursor-pointer">
                  Brotli Compression
                  <p className="text-xs text-default-600 dark:text-default-700 mt-1">
                    Enable Brotli compression for faster asset delivery (Enabled by default).
                  </p>
                </label>
                <Switch
                  data-testid="brotli-compression-switch"
                  isSelected={brotliEnabled}
                  onValueChange={setBrotliEnabled}
                  size="sm"
                  classNames={{
                    base: "w-18 h-4  font-medium text-default-800",
                    wrapper: "w-8 h-4",
                    thumb: "w-2 h-2",
                  }}
                />
              </section>

              {/* --- 2. SSL Provider --- */}
              <section>
                <RadioGroup
                  label="SSL Provider"
                  data-testid="ssl-provider-radio-group"
                  value={sslProvider}
                  onValueChange={(v) => setSslProvider(v as "letsencrypt" | "custom")}
                  orientation="horizontal"
                  classNames={{ label: "font-medium text-default-800" }}
                >
                  <Radio value="letsencrypt" data-testid="letsencrypt-radio">
                    Let’s Encrypt (Free Certificate)
                  </Radio>
                  <Radio value="custom" data-testid="custom-radio">Custom (Verisign, GoTrust, etc.)</Radio>
                </RadioGroup>
              </section>

              {/* --- 3. Let's Encrypt Options --- */}
              {sslProvider === "letsencrypt" && (
                <section className="space-y-6 p-3 md:p-6 border border-default-200 rounded-lg bg-white dark:bg-default-100/50">
                  <h3 className="font-medium text-xl text-default-800 border-b border-default-400 pb-3 mb-4">
                    Let's Encrypt Configuration
                  </h3>

                  {/* Authorisation Method */}
                  <RadioGroup
                    label="Authorisation Method"
                    orientation="horizontal"
                    value={authMethod}
                    data-testid="auth-method-radio-group"
                    onValueChange={(v) => setAuthMethod(v as "DNS" | "HTTP")}
                    classNames={{ label: "text-sm font-medium text-default-700" }}
                  >
                    <Radio value="HTTP" data-testid="http-verification-radio">HTTP Verification</Radio>
                    <Radio value="DNS" data-testid="dns-verification-radio">DNS Verification</Radio>
                  </RadioGroup>


                  {/* DNS Provider Options (REPLACED by DnsAccountSelectorCard) */}
                  {authMethod === "DNS" && (
                    <div className="pl-4 border-l-4 border-primary-500">
                      <DnsAccountSelectorCard
                        label="DNS Provider & Account"
                        selectedProvider={dnsProvider}
                        selectedAccount={dnsAccount}
                        onProviderChange={handleDnsProviderChange}
                        onAccountChange={handleDnsAccountChange}
                        currentDnsAccounts={currentDnsAccounts}
                      />
                    </div>
                  )}

                  <AccessMethodCardSelector
                    label="Access Method"
                    value={leAccessMethod}
                    onValueChange={(v) => setLeAccessMethod(v as "HTTPS" | "HTTPS+HTTP")}
                    options={ACCESS_METHOD_OPTIONS}
                  />
                </section>
              )}

              {/* --- 4. Custom SSL Options --- */}
              {sslProvider === "custom" && (
                <section className="space-y-6 p-3 md:p-6 border border-default-200 rounded-lg bg-white dark:bg-default-100/50">
                  <h3 className="font-medium text-xl text-default-800 border-b border-default-400 pb-3 mb-4">
                    Custom Certificate
                  </h3>
                  <Textarea
                    label="Certificate and CA Bundle"
                    placeholder="-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"
                    value={customCert}
                    onValueChange={setCustomCert}
                    minRows={10}
                    classNames={{
                      input: "font-mono text-xs text-default-800",
                      label: "text-sm font-medium text-default-700",
                      inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg  '
                    }}
                    data-testid="certificate-textarea"
                  />

                  <Textarea
                    label="Private Key"
                    placeholder="-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
                    value={customKey}
                    onValueChange={setCustomKey}
                    minRows={10}
                    classNames={{
                      input: "font-mono text-xs text-default-800",
                      label: "text-sm font-medium text-default-700",
                      inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg  '
                    }}
                    data-testid="private-key-textarea"
                  />

                  {/* TLS & Cipher */}
                  <div className="grid grid-cols-1  gap-4">
                    <Select
                      label="TLS Protocol Version"
                      labelPlacement="outside"
                      selectedKeys={[tlsVersion]}
                      onChange={handleTlsVersionChange} // *UPDATED: Uses the handler that doesn't change cipher
                      size="sm"
                      classNames={{
                        label: "text-sm font-medium text-default-700 mb-2",
                        trigger: 'py-5 mt-2 bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400',
                        popoverContent: 'bg-default-50 dark:bg-slate-900'
                      }}
                      data-testid="tls-version-select"
                    >
                      {TLS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} data-testid={`tls-version-select-item-${opt.value}`}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </Select>

                    {/* *UPDATED: Cipher Suite is now an editable Textarea* */}
                    <Textarea
                      label="Cipher Suite"
                      placeholder="Enter custom cipher suite string..."
                      value={customCipherSuite}
                      onValueChange={setCustomCipherSuite}
                      minRows={5}
                      classNames={{
                        input: "font-mono text-xs text-default-800",
                        label: "text-sm font-medium text-default-700",
                        inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg  '
                      }}
                      data-testid="cipher-suite-textarea"
                    />
                  </div>

                  {/* Access Method */}
                  <AccessMethodCardSelector
                    label="Access Method"
                    value={customAccessMethod} // Use customAccessMethod for custom SSL state
                    onValueChange={(v) => setCustomAccessMethod(v as "HTTPS" | "HTTPS+HTTP")}
                    options={ACCESS_METHOD_OPTIONS}
                  />
                </section>
              )}
            </div>
            <div className="flex justify-end p-6  dark:border dark:border-default-500 dark:border-t-default-700 rounded-b-lg">
              <Button size="sm" variant="light" className=" mr-2" onPress={() => {
                setIseditMode(false)
                resetForm()
              }} data-testid="cancel-button">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                data-testid="save-button"
              >
                {isLoading
                  ? "Saving Certificate..."
                  : "Save SSL Configuration"}
              </Button>
            </div>
          </div>
        </form>
      ) : (

        <form onSubmit={handleServerSubmit} >
          <Card className="shadow-none border  border-default-200 ">
            <CardBody className="p-2!  md:p-6! space-y-8 dark:bg-slate-900 ">

              <section className="flex items-center justify-between p-2 md:p-4  rounded-lg border border-default-200  bg-white dark:bg-default-100">
                <label htmlFor="brotli-switch" className="font-medium text-default-800 cursor-pointer">
                  Brotli Compression
                  <p className="text-xs text-default-600 mt-1">
                    Enable Brotli compression for faster asset delivery (Enabled by default).
                  </p>
                </label>
                <Switch
                  data-testid="brotli-compression-switch"
                  isSelected={brotliEnabled}
                  onValueChange={setBrotliEnabled}
                  size="sm"
                  classNames={{
                    base: "w-18 h-4  font-medium text-default-800",
                    wrapper: "w-8 h-4",
                    thumb: "w-2 h-2",
                  }}
                />
              </section>


              <section>
                <RadioGroup
                  label="SSL Provider"
                  data-testid="ssl-provider-radio-group"
                  value={sslProvider}
                  onValueChange={(v) => setSslProvider(v as "letsencrypt" | "custom")}
                  orientation="horizontal"
                  classNames={{ label: "font-medium text-default-800" }}
                >
                  <Radio value="letsencrypt" data-testid="letsencrypt-radio">
                    Let’s Encrypt (Free Certificate)
                  </Radio>
                  <Radio value="custom" data-testid="custom-radio">Custom (Verisign, GoTrust, etc.)</Radio>
                </RadioGroup>
              </section>


              {sslProvider === "letsencrypt" && (
                <section className="space-y-6 p-3 md:p-6 border border-default-200 rounded-lg bg-white dark:bg-default-100/50">
                  <h3 className="font-medium text-xl text-default-800 border-b border-default-400 pb-3 mb-4">
                    Let's Encrypt Configuration
                  </h3>


                  <RadioGroup
                    label="Authorisation Method"
                    orientation="horizontal"
                    value={authMethod}
                    data-testid="auth-method-radio-group"
                    onValueChange={(v) => setAuthMethod(v as "DNS" | "HTTP")}
                    classNames={{ label: "text-sm font-medium text-default-700" }}
                  >
                    <Radio value="HTTP" data-testid="http-verification-radio">HTTP Verification</Radio>
                    <Radio value="DNS" data-testid="dns-verification-radio">DNS Verification</Radio>
                  </RadioGroup>



                  {authMethod === "DNS" && (
                    <div className="pl-4 border-l-4 border-primary-500">
                      <DnsAccountSelectorCard
                        label="DNS Provider & Account"
                        selectedProvider={dnsProvider}
                        selectedAccount={dnsAccount}
                        onProviderChange={handleDnsProviderChange}
                        onAccountChange={handleDnsAccountChange}
                        currentDnsAccounts={currentDnsAccounts}
                      />
                    </div>
                  )}

                  <AccessMethodCardSelector
                    label="Access Method"
                    value={leAccessMethod}
                    onValueChange={(v) => setLeAccessMethod(v as "HTTPS" | "HTTPS+HTTP")}
                    options={ACCESS_METHOD_OPTIONS}
                  />
                </section>
              )}


              {sslProvider === "custom" && (
                <section className="space-y-6 p-3 md:p-6 border border-default-200 rounded-lg bg-white dark:bg-default-100/50">
                  <h3 className="font-medium text-xl text-default-800 border-b border-default-400 pb-3 mb-4">
                    Custom Certificate
                  </h3>
                  <Textarea
                    label="Certificate and CA Bundle"
                    placeholder="-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"
                    value={customCert}
                    onValueChange={setCustomCert}
                    minRows={10}
                    classNames={{
                      input: "font-mono text-xs text-default-800",
                      label: "text-sm font-medium text-default-700",
                      inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg  '
                    }}
                    data-testid="certificate-textarea"
                  />

                  <Textarea
                    label="Private Key"
                    placeholder="-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
                    value={customKey}
                    onValueChange={setCustomKey}
                    minRows={10}
                    classNames={{
                      input: "font-mono text-xs text-default-800",
                      label: "text-sm font-medium text-default-700",
                      inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg  '
                    }}
                    data-testid="private-key-textarea"
                  />


                  <div className="grid grid-cols-1  gap-4">
                    <Select
                      label="TLS Protocol Version"
                      labelPlacement="outside"
                      selectedKeys={[tlsVersion]}
                      onChange={handleTlsVersionChange}
                      size="sm"
                      classNames={{
                        label: "text-sm font-medium text-default-700 mb-2",
                        trigger: 'py-5 mt-2 bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400',
                        popoverContent: 'bg-default-50 dark:bg-slate-900'
                      }}
                      data-testid="tls-version-select"
                    >
                      {TLS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} data-testid={`tls-version-select-item-${opt.value}`}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </Select>


                    <Textarea
                      label="Cipher Suite"
                      placeholder="Enter custom cipher suite string..."
                      value={customCipherSuite}
                      onValueChange={setCustomCipherSuite}
                      minRows={5}
                      classNames={{
                        input: "font-mono text-xs text-default-800",
                        label: "text-sm font-medium text-default-700",
                        inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg  '
                      }}
                      data-testid="cipher-suite-textarea"
                    />
                  </div>


                  <AccessMethodCardSelector
                    label="Access Method"
                    value={customAccessMethod}
                    onValueChange={(v) => setCustomAccessMethod(v as "HTTPS" | "HTTPS+HTTP")}
                    options={ACCESS_METHOD_OPTIONS}
                  />
                </section>
              )}
            </CardBody>
            <CardFooter className="flex justify-end p-6 border border-default-200 dark:border-default-700">
              <Button size="sm" variant="light" className=" mr-2" onPress={() => {
                setIseditMode(false)
                resetForm()
              }} data-testid="cancel-button">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                data-testid="save-button"
              >
                {isLoading
                  ? "Saving Certificate..."
                  : "Save SSL Configuration"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}

    </>

  );
};

export default AddNewSLL;