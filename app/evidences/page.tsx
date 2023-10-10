"use client";
import {
  Input,
  Textarea,
  Button,
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { CONTRACT_ADDRESS } from "@/const/value";
import { abi } from "@/const/contract-abi";
import { ethers, utils } from "ethers";
import { Inter } from "next/font/google";
import { storeFiles } from "@/utils/uploadFile";

const inter = Inter({ subsets: ["latin"] });

export default function GetEvidences() {
  const caseId = useRef<any>();
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>("");
  const [evidences, setEvidences] = useState<any[]>([]);
  const handleGetEvidences = async () => {
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
      const contextCase = await contract.cases(caseId.current.value);
      console.log(contextCase);
      const contextEvidences = [];
      for (let j = 1; j <= contextCase.totalEvidences; j++) {
        const evidenceDetails = await contract.getEvidenceById(
          caseId.current.value,
          j
        );
        contextEvidences.push(evidenceDetails);
      }
      setEvidences(contextEvidences);
      console.log(evidences);
    } catch (err: any) {
      console.log(err);
    } finally {
        setIsButtonLoading(false);
    }
  };

  const handleContribute = async (senderAddress: string) => {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(
      //@ts-ignore
      window.ethereum as ethers.providers.ExternalProvider
    );
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    //@ts-ignore
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();
    try {
      const txDetails = await contract
        .connect(signer)
        .tipEvidenceOwner(senderAddress, { value: utils.parseEther(amount) });
      console.log(txDetails);
    } catch (err: any) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    console.log(evidences[0]);
  }, [evidences]);
  return (
    <div
      className={`min-h-[calc(100vh-300px)] flex justify-center items-center ${inter.className}`}
    >
      <div className="max-w-screen-xl">
        <h1 className="font-bold text-5xl leading-loose tracking-tighter my-6 gradient-txt-white">
          Get Evidences
        </h1>
        <div className="flex flex-col gap-4">
          <Input
            className="w-[450px]"
            size="lg"
            label="Case ID"
            ref={caseId}
            isRequired
          />

          <Button
            color="primary"
            isLoading={isButtonLoading}
            onClick={handleGetEvidences}
          >
            Fetch Evidences
          </Button>
        </div>
        {evidences.map((item, index) => (
          <Card className="mt-4 w-[450px]" key={index}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={item[1]}
                height={300}
              />
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <p className="text-base mb-2">{item[2]}</p>
              <p className="flex w-full justify-between text-base">{item[0]}</p>
            </CardBody>
            <CardFooter>
              <Input
                className="my-4"
                placeholder="Amount in MATIC"
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button
                onClick={() => handleContribute(item[3] as string)}
                className="mx-4"
              >
                TIP
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
