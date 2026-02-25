import { addToast, Button, Textarea, Card, CardBody, CardFooter } from "@heroui/react";

import { useState, type FormEvent } from "react";

import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { renewCustomSsl, RenewServerCustomSsl, setCustomREnew } from "../../redux/slice/SLLMangerSLice";
import { getWebDetails } from "../../redux/slice/websiteSlice";
import { getServer } from "../../redux/slice/serverslice";






const CustomRenew = ({ type }: { type: string }) => {
  const { id: serverId, webid: websiteId } = useParams();
  const server = useAppSelector((state) => state.server.serverList)?.find(
    (server) => server.id.toString() == serverId
  );
  const dispatch = useAppDispatch();
  const ReducerDispatch = useDispatch();

  const websiteDetail = useAppSelector((state) => state.website.selectedWebsite);
  const website = type == "website" ? websiteDetail?.website : server

  
  const initialPrivateKey = website?.ssl_private_key || "";
  const initialCertificate = website?.ssl_certificate || "";
  
  const [privateKey, setPrivateKey] = useState(initialPrivateKey);
  const [certificate, setCertificate] = useState(initialCertificate);
 
  const [isLoading, setIsLoading] = useState(false);

 

  const handleCancel = () => {
    ReducerDispatch(setCustomREnew(false))
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!websiteId || !serverId) {
      addToast({
        description: "Missing server or website ID. Cannot update custom SSL.",
        color: "danger",
        title: "Error"
      });
      setIsLoading(false);
      return;
    }

    // Validation for required fields
    if (!privateKey.trim() || !certificate.trim()) {
      addToast({
        description: "Both Private Key and Certificate fields are required.",
        color: "danger",
        title: "Validation Error"
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      private_key: privateKey.trim(),
      certificate: certificate.trim(),
      
    };

   

    try {  
      await dispatch(renewCustomSsl({payload: payload })).unwrap();
      await dispatch(getWebDetails());

      addToast({
        description: "Custom SSL Certificate renewed and configured successfully!",
        color: "success",
        title: "Success"
      });

      handleCancel();

    } catch (error:any) {
      console.error("Failed to renew custom SSL certificate:", error);
      addToast({
        description: error,
        color: "danger",
        title: "Renewal Failed"
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
        description: "Missing server  ID. Cannot update custom SSL.",
        color: "danger",
        title: "Error"
      });
      setIsLoading(false);
      return;
    }


    if (!privateKey.trim() || !certificate.trim()) {
      addToast({
        description: "Both Private Key and Certificate fields are required.",
        color: "danger",
        title: "Validation Error"
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      private_key: privateKey.trim(),
      certificate: certificate.trim(),

    };

    try {
      await dispatch(RenewServerCustomSsl({data: payload })).unwrap();
      await dispatch(getServer());
      addToast({
        description: "Custom SSL Certificate renewed and configured successfully!",
        color: "success",
        title: "Success"
      });

      handleCancel();

    } catch (error:any) {
      console.error("Failed to renew custom SSL certificate:", error);
      addToast({
        description: error,
        color: "danger",
        title: "Renewal Failed"
      });
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <>
      {type == "website" ? (

        <form onSubmit={handleUpdate} className="mt-4 max-w-300 mx-auto">
          <div className="shadow-sm p-4">
            <div className="p-2! md:p-6! space-y-8 ">
              <section className="space-y-6 p-6 border border-default-200 rounded-lg bg-white dark:bg-default-100/50">
                
                <Textarea
                  data-testid="private-key-textarea"
                  label="Private Key (PEM Format)"
                  placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                  labelPlacement="outside"
                  value={privateKey}
                  onValueChange={setPrivateKey}
                  minRows={10}
                  classNames={{
                    input: "font-mono text-xs text-danger-500", 
                    label: "text-sm font-medium text-default-700 mb-2",
                    inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg',
                    description: 'text-xs text-default-500'
                  }}
                  description="The private key associated with your SSL certificate. Keep this highly secure."
                />

                
                <Textarea
                  data-testid="certificate-textarea"
                  label="SSL Certificate (PEM Format)"
                  placeholder="-----BEGIN CERTIFICATE-----..."
                  labelPlacement="outside"
                  value={certificate}
                  onValueChange={setCertificate}
                  minRows={10}
                  classNames={{
                    input: "font-mono text-xs text-success-500",
                    label: "text-sm font-medium text-default-700 mb-2",
                    inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg',
                    description: 'text-xs text-default-500'
                  }}
                  description="The full chain certificate (server certificate followed by intermediate CA certificates)."
                />
              </section>
            </div>
            <div className="flex justify-end p-6 border-t border-default-200 dark:border-default-700">
              <Button size="sm" variant="light" className=" mr-2" onPress={handleCancel} data-testid="cancel-button">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                data-testid="update-custom-ssl-button"
              >
                {isLoading
                  ? "Updating Custom SSL..."
                  : "Update Custom SSL"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleServerUpdate} className="mt-4 max-w-300 mx-auto">
          <Card className="shadow-sm border border-default-200">
            <CardBody className="p-2! md:p-6! space-y-8 dark:bg-slate-900">
              <section className="space-y-6 p-6 border border-default-200 rounded-lg bg-white dark:bg-default-100/50">
                <Textarea
                  data-testid="private-key-textarea"
                  label="Private Key (PEM Format)"
                  placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                  labelPlacement="outside"
                  value={privateKey}
                  onValueChange={setPrivateKey}
                  minRows={10}
                  classNames={{
                    input: "font-mono text-xs text-danger-500",
                    label: "text-sm font-medium text-default-700 mb-2",
                    inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg',
                    description: 'text-xs text-default-500'
                  }}
                  description="The private key associated with your SSL certificate. Keep this highly secure."
                />
                <Textarea
                  data-testid="certificate-textarea"
                  label="SSL Certificate (PEM Format)"
                  placeholder="-----BEGIN CERTIFICATE-----..."
                  labelPlacement="outside"
                  value={certificate}
                  onValueChange={setCertificate}
                  minRows={10}
                  classNames={{
                    input: "font-mono text-xs text-success-500",
                    label: "text-sm font-medium text-default-700 mb-2",
                    inputWrapper: ' bg-default-50 dark:bg-slate-900 border border-default-200 dark:border-default-400 rounded-lg',
                    description: 'text-xs text-default-500'
                  }}
                  description="The full chain certificate (server certificate followed by intermediate CA certificates)."
                />
              </section>
            </CardBody>
            <CardFooter className="flex justify-end p-6 border-t border-default-200 dark:border-default-700">
              <Button size="sm" variant="light" className=" mr-2" onPress={handleCancel} data-testid="cancel-button">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                data-testid="update-custom-ssl-button"
              >
                {isLoading
                  ? "Updating Custom SSL..."
                  : "Update Custom SSL"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </>
  );
};

export default CustomRenew;