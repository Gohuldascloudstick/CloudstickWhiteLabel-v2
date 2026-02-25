import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Link,
  addToast,

} from "@heroui/react";
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAppDispatch } from '../../redux/hook';
import { addthirdPartyIntegration } from '../../redux/slice/thirdpartyintergration';
import { getCloudflareAccounts } from '../../redux/slice/dnsSlice';


interface ModalIntrface{
    isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

}
const AddNewCloudflareApiKEy :React.FC<ModalIntrface> = ({isModalOpen, setIsModalOpen}) => {

    const dispatch = useAppDispatch()


      const [apiLabel, setApiLabel] = React.useState("");
      const [apiUsername, setApiUsername] = React.useState("");
      const [apiSecret, setApiSecret] = React.useState("");
       const [paswwordview, setPasswordview] = React.useState(false);
         const [accountLoader, setAccountLoader] = React.useState(false);

        

           const handleAddApiSubmit = async () => {
             console.log("Adding new API key:", { apiLabel, apiUsername, apiSecret });
             setAccountLoader(true);
             try {
               const data = {
                 label: apiLabel,
                 username: apiUsername,
                 secret_key: apiSecret,
                 service: "Cloudflare",
               };
               await dispatch(addthirdPartyIntegration(data)).unwrap();
            await dispatch(getCloudflareAccounts("")).unwrap();
         
               addToast({
                 title: "CloudFalre Account Added success",
                 description: `Successfully Added Account  ${apiLabel}.`,
                 color: "success",
               });
               setApiLabel("");
               setApiUsername("");
               setApiSecret("");
               setIsModalOpen(false);
             } catch (error:any) {
               addToast({
                 title: "Account Add failed",
                 description: error || "An unexpected error occurred.",
                 color: "danger",
               });
             } finally {
               setAccountLoader(false);
             }
           };
         

  return (
    <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        placement="center"
        size="md"
        backdrop="blur"
        isDismissable={false}
         classNames={{ base: "dark:bg-[#111D33]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center">
                  <Icon
                    icon="lucide:key"
                    className="text-primary-500 mr-2"
                    width={20}
                  />
                  Add New API Key
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-10">
                  <div className="p-3 bg-primary-50 dark:bg-blue-900/20 rounded-lg border border-primary-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Icon
                        icon="lucide:info"
                        className="text-primary-500 mt-0.5"
                        width={16}
                      />
                      <div className="text-xs text-primary-700 dark:text-primary-500">
                        <p>
                          Add your CloudFlare API credentials to manage your
                          domains.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Input
                      label="Label"
                        labelPlacement='outside'
                      value={apiLabel}
                      onValueChange={setApiLabel}
                       data-testid="api-label-input"
                      isRequired
                      description="A descriptive name to identify this API key"
                    
                      classNames={{description :'dark:text-default-600',
                          label: 'dark:text-default-900',
                    inputWrapper: 'dark:border dark:border-default-400'
                      }}
                      
                    />
                    <Input
                      label="Username / Email ID / Key ID"
                       classNames={{description :'dark:text-default-600',
                          label: 'dark:text-default-900',
                    inputWrapper: 'dark:border dark:border-default-400'
                       }}
                       labelPlacement='outside'
                      value={apiUsername}
                      onValueChange={setApiUsername}
                       data-testid="api-username-input"
                      isRequired
                      // startContent={
                      //   <Icon
                      //     icon="lucide:user"
                      //     className="text-default-400 flex-shrink-0"
                      //     width={16}
                      //   />
                      // }
                      description="The identifier provided by your DNS service"
                    />
                    <Input
                      label="Secret"
                      value={apiSecret}
                      onValueChange={setApiSecret}
                      type={paswwordview ? "text" : "password"}
                       classNames={{description :'dark:text-default-600',
                          label: 'dark:text-default-900',
                    inputWrapper: 'dark:border dark:border-default-400'
                       }}
                         labelPlacement='outside'
                       data-testid="api-secret-input"
                      isRequired
                      // startContent={
                      //   <Icon
                      //     icon="lucide:key"
                      //     className="text-default-400 flex-shrink-0"
                      //     width={16}
                      //   />
                      // }
                      description="Your API secret or token"
                      endContent={
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          className="focus:outline-none"
                          data-testid="toggle-password-visibility"
                          onPress={() => {
                            setPasswordview(!paswwordview);
                          }}
                        >
                          <Icon
                            icon={
                              paswwordview ? "lucide:eye-off" : "lucide:eye"
                            }
                            className="text-default-400"
                            width={16}
                          />
                        </Button>
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-default-50 dark:bg-default-100/20 rounded-lg border border-default-200 dark:border-default-100/30">
                    <Icon
                      icon="lucide:help-circle"
                      className="text-default-500"
                      width={12}
                    />
                    <div className="text-xs text-default-600">
                      <Link
                        href="https://cloudstick.io/knowledgebase/cloudflare/how-to-integrate-cloud-flare-account-into-cloud-stick"
                        isExternal
                        showAnchorIcon
                        data-testid="api-key-help-link"
                        className="text-primary text-xs"
                      >
                        How to get the API key
                      </Link>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="pt-6">
                <Button
                  variant="flat"
                  size="sm"
                  onPress={onClose}
                  data-testid="cancel-button"
                  startContent={<Icon icon="lucide:x" width={16} />}
                  isDisabled={accountLoader}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  size="sm"
                  data-testid="add-account-button"
                  onPress={handleAddApiSubmit}
                  isDisabled={
                    !apiLabel || !apiUsername || !apiSecret || accountLoader
                  }
                  startContent={
                    accountLoader ? "" : <Icon icon="lucide:plus" width={16} />
                  }
                  isLoading={accountLoader}
                >
                  Add Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}

export default AddNewCloudflareApiKEy