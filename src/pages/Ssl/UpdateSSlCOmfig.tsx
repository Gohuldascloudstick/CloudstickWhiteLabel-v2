import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useEffect, useState, type FormEvent } from "react";
import { clearEditMode, UpdateServerSslSettings, updateSslSettings } from "../../redux/slice/SLLMangerSLice";
import { addToast, Button, Select, SelectItem, Switch, Textarea } from "@heroui/react";
import { getWebDetails } from "../../redux/slice/websiteSlice";
import { getServer } from "../../redux/slice/serverslice";


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
          data-testid={`access-method-option-${option.value}`}
          onClick={() => onValueChange(option.value)}
          className={`
            p-5 rounded-xl border-1 cursor-pointer transition-all duration-200
            ${value === option.value
              ? "border-primary-500 bg-primary-50/40 dark:bg-primary-900/40  transform scale-[1.01]"
              : "border-default-200  hover:border-default-400 dark:hover:border-default-600 hover:bg-default-50 dark:hover:bg-default-100/20"
            }
          `}
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





const UpdateSSlCOmfig = ({ type }: { type: string }) => {
  const dispatch = useAppDispatch();
  const ReducerDispatch = useDispatch()
  const editInitalData = useAppSelector((state) => state.SSL.IsEditing);
  const initialBrotli = editInitalData?.brotli_enabled ?? true;
  const initialAccess = editInitalData?.access ?? "HTTPS+HTTP";
  const initialTls = editInitalData?.tls_version ?? TLS_OPTIONS[1].value;
  const initialCipher = editInitalData?.cipher_suite ?? "";
  const [brotliEnabled, setBrotliEnabled] = useState(initialBrotli);
  const [tlsVersion, setTlsVersion] = useState(initialTls);
  const [cipherSuite, setCipherSuite] = useState(initialCipher);
  const [accessMethod, setAccessMethod] = useState<"HTTPS" | "HTTPS+HTTP">(
    initialAccess as "HTTPS" | "HTTPS+HTTP"
  );
  const [isLoading, setIsLoading] = useState(false);
  const serverId = JSON.parse(localStorage.getItem("serverId") || "null");
  const webId = JSON.parse(localStorage.getItem("webId") || "null")
  useEffect(() => {
    if (editInitalData) {
      setBrotliEnabled(editInitalData.brotli_enabled ?? true);
      setAccessMethod(editInitalData.access as "HTTPS" | "HTTPS+HTTP" ?? "HTTPS+HTTP");
      setTlsVersion(editInitalData.tls_version ?? TLS_OPTIONS[1].value);
      setCipherSuite(editInitalData.cipher_suite ?? "");
    }
  }, [editInitalData]);



  const handleTlsVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTlsVersion(e.target.value);

  }


  const handleclear = () => {
    ReducerDispatch(clearEditMode())
  }
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!webId || !serverId) {
      addToast({
        description: "Missing server or website ID. Cannot update SSL configuration.",
        color: "danger",
      });
      setIsLoading(false);
      return;
    }

    if (!cipherSuite.trim()) {
      addToast({
        description: "Cipher Suite cannot be empty.",
        color: "danger",
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      brotli_enabled: brotliEnabled,
      access: accessMethod,
      tls_version: tlsVersion,
      cipher_suite: cipherSuite.trim(),
    };

    console.log("Updating SSL Payload:", JSON.stringify(payload, null, 2));

    try {

      await dispatch(updateSslSettings({ data: payload })).unwrap();


      await dispatch(getWebDetails());
      handleclear()
      addToast({
        description: "SSL Configuration updated successfully!",
        color: "success",
      });


    } catch (error) {
      console.error("Failed to update SSL configuration:", error);
      addToast({
        description:
          (error as any)?.message || "Failed to update SSL configuration. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleServerUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!serverId) {
      addToast({
        description: "Missing server ID. Cannot update SSL configuration.",
        color: "danger",
      });
      setIsLoading(false);
      return;
    }


    if (!cipherSuite.trim()) {
      addToast({
        description: "Cipher Suite cannot be empty.",
        color: "danger",
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      brotli_enabled: brotliEnabled,
      access: accessMethod,
      tls_version: tlsVersion,
      cipher_suite: cipherSuite.trim(),
    };



    try {

      await dispatch(UpdateServerSslSettings({ data: payload })).unwrap();


      await dispatch(getServer());
      handleclear()
      addToast({
        description: "SSL Configuration updated successfully!",
        color: "success",
      });


    } catch (error) {
      console.error("Failed to update SSL configuration:", error);
      addToast({
        description:
          (error as any)?.message || "Failed to update SSL configuration. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      {type == "website" ? (
        <form onSubmit={handleUpdate} >
          <div className="shadow-none p-4">
            <div className="p-2! md:p-6! space-y-8 ">

              <section className="flex items-center justify-between p-2 md:p-4 rounded-lg border border-default-200 bg-white dark:bg-default-100">
                <label htmlFor="brotli-switch" className="font-medium text-default-800 cursor-pointer">
                  Brotli Compression
                  <p className="text-xs text-default-600 mt-1">
                    Enable Brotli compression for faster asset delivery.
                  </p>
                </label>
                <Switch
                  data-testid="brotli-compression-switch"
                  isSelected={brotliEnabled}
                  onValueChange={setBrotliEnabled}
                  size="sm"
                  classNames={{
                    base: "w-18 h-4 font-medium text-default-800",
                    wrapper: "w-8 h-4",
                    thumb: "w-2 h-2",
                  }}
                />
              </section>
              <section className="space-y-6 p-6 border border-default-200 rounded-lg bg-white dark:bg-default-100/50">
                <div className="grid grid-cols-1 gap-4">
                  <Select
                    data-testid="tls-version-select"
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
                  >
                    {TLS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>


                  <Textarea
                    data-testid="cipher-suite-textarea"
                    label="Cipher Suite"
                    placeholder="Enter custom cipher suite string..."
                    value={cipherSuite}
                    onValueChange={setCipherSuite}
                    minRows={5}
                    classNames={{
                      input: "font-mono text-xs text-default-800",
                      label: "text-sm font-medium text-default-700",

                      inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg  '
                    }}
                  />
                </div>


                <AccessMethodCardSelector
                  label="Access Method"
                  value={accessMethod}
                  onValueChange={(v) => setAccessMethod(v as "HTTPS" | "HTTPS+HTTP")}
                  options={ACCESS_METHOD_OPTIONS}
                />
              </section>

            </div>

            <div className="flex justify-end p-6 border-t border-default-200 dark:border-default-700">
              <Button size="sm" variant="light" className=" mr-2" onPress={() => {

                handleclear()
              }} data-testid="cancel-button">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                data-testid="update-ssl-configuration-button"
              >
                {isLoading
                  ? "Updating Configuration..."
                  : "Update SSL Configuration"}
              </Button>
            </div>
          </div>
        </form>
      ) : (

        <form onSubmit={handleServerUpdate} >
          <Card className="shadow-none border border-default-200">
            <CardBody className="p-2! md:p-6! space-y-8 dark:bg-slate-900">
              <section className="flex items-center justify-between p-2 md:p-4 rounded-lg border border-default-200 bg-white dark:bg-default-100">
                <label htmlFor="brotli-switch" className="font-medium text-default-800 cursor-pointer">
                  Brotli Compression
                  <p className="text-xs text-default-600 mt-1">
                    Enable Brotli compression for faster asset delivery.
                  </p>
                </label>
                <Switch
                  data-testid="brotli-compression-switch"
                  isSelected={brotliEnabled}
                  onValueChange={setBrotliEnabled}
                  size="sm"
                  classNames={{
                    base: "w-18 h-4 font-medium text-default-800",
                    wrapper: "w-8 h-4",
                    thumb: "w-2 h-2",
                  }}
                />
              </section>


              <section className="space-y-6 p-6 border border-default-200 rounded-lg bg-white dark:bg-default-100/50">
                <div className="grid grid-cols-1 gap-4">
                  <Select
                    data-testid="tls-version-select"
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
                  >
                    {TLS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>


                  <Textarea
                    data-testid="cipher-suite-textarea"
                    label="Cipher Suite"
                    placeholder="Enter custom cipher suite string..."
                    value={cipherSuite}
                    onValueChange={setCipherSuite}
                    minRows={5}
                    classNames={{
                      input: "font-mono text-xs text-default-800",
                      label: "text-sm font-medium text-default-700",

                      inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg  '
                    }}
                  />
                </div>


                <AccessMethodCardSelector
                  label="Access Method"
                  value={accessMethod}
                  onValueChange={(v) => setAccessMethod(v as "HTTPS" | "HTTPS+HTTP")}
                  options={ACCESS_METHOD_OPTIONS}
                />
              </section>

            </CardBody>

            <CardFooter className="flex justify-end p-6 border-t border-default-200 dark:border-default-700">
              <Button size="sm" variant="light" className=" mr-2" onPress={() => {

                handleclear()
              }} data-testid="cancel-button">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                data-testid="update-ssl-configuration-button"
              >
                {isLoading
                  ? "Updating Configuration..."
                  : "Update SSL Configuration"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}

    </>
  );
};

export default UpdateSSlCOmfig;