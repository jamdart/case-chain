import { Input, Textarea, Button } from "@nextui-org/react";
import { useRef } from "react";
import { CONTRACT_ADDRESS } from "@/const/value";
import { abi } from "@/const/contract-abi";
import { ethers } from "ethers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RegisterCase() {
  const courtId = useRef<any>();
  const caseDescription = useRef<any>();
  const startDate = useRef<any>();

  const handleAddCase = async () => {
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
      const totalCases = await contract.totalCases();
      const txDetails = await contract
        .connect(signer)
        .registerCase(
          courtId.current.value,
          caseDescription.current.value,
          startDate.current.value
        );
      console.log(txDetails);
      alert("Case registered with Case ID " + (totalCases.toNumber() + 1));
    } catch (err: any) {
      console.log(err);
    } finally {
    }
  };
  return (
    <div
      className={`min-h-[calc(100vh-300px)] flex justify-center items-center ${inter.className}`}
    >
      <div className="max-w-screen-xl">
        <h1 className="font-bold text-5xl leading-loose tracking-tighter my-6 gradient-txt-white">
          Register Case
        </h1>
        <div className="flex flex-col gap-4">
          <Input
            className="w-[450px]"
            size="lg"
            label="Court ID"
            ref={courtId}
            isRequired
          />
          <Textarea
            className="w-[450px]"
            size="lg"
            label="Case Description"
            ref={caseDescription}
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

          <Button color="primary" onClick={handleAddCase}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
