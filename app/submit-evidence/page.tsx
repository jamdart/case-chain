"use client";
import { Input, Textarea, Button } from "@nextui-org/react";
import { useRef, useState } from "react";
import { CONTRACT_ADDRESS } from "@/const/value";
import { abi } from "@/const/contract-abi";
import { ethers } from "ethers";
import { Inter } from "next/font/google";
import { storeFiles } from "@/utils/uploadFile";

const inter = Inter({ subsets: ["latin"] });

export default function SubmitEvidence() {
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const caseId = useRef<any>();
  const evidenceDescription = useRef<any>();
  const startDate = useRef<any>();
  const [file, setFile] = useState<any>();

  const handleAddEvidence = async () => {
    setIsButtonLoading(true);
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(
      //@ts-ignore
      window.ethereum as ethers.providers.ExternalProvider
    );
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    // Get the signer from the provider
    const signer = provider.getSigner();
    console.log({ signer });
    console.log({ contract });
    try {
      let fileUrl;
      if (file) {
        fileUrl = await storeFiles(file);
        fileUrl = fileUrl + `/${file[0].name}`;
        console.log({ fileUrl });
      }

      const txDetails = await contract
        .connect(signer)
        .registerEvidence(
          caseId.current.value,
          evidenceDescription.current.value,
          fileUrl,
          startDate.current.value
        )
        .then(async (res: any) => {
          await res.wait();
          alert("Evidence uploaded successfully");
        });
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsButtonLoading(false);
    }
  };
  return (
    <div
      className={`min-h-[calc(100vh-300px)] flex justify-center items-center ${inter.className}`}
    >
      <div className="max-w-screen-xl">
        <h1 className="font-bold text-5xl leading-loose tracking-tighter my-6 gradient-txt-white">
          Submit Evidence
        </h1>
        <div className="flex flex-col gap-4">
          <Input
            className="w-[450px]"
            size="lg"
            label="Case ID"
            ref={caseId}
            isRequired
          />
          <Textarea
            className="w-[450px]"
            size="lg"
            label="Evidence Description"
            ref={evidenceDescription}
            isRequired
          />

          <Input
            className="w-[450px]"
            size="lg"
            type="date"
            label="Start Date"
            placeholder="Enter start date of case"
            ref={startDate}
            isRequired
          />
          <Input
            className="w-[450px] upload-evidence"
            size="lg"
            ref={file}
            type="file"
            onChange={(e: any) => setFile(e.target.files)}
          />

          <Button
            color="primary"
            isLoading={isButtonLoading}
            onClick={handleAddEvidence}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
