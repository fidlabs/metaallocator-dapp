import ScreenBreadcrumbs from "@/components/ScreenBreadcrumbs";
import { BeneficiaryContractDeployWidget } from "./components/beneficiary-contract-deploy-widget";
import { RegisterSLAWidget } from "./components/register-sla-widget";
import { type Address } from "viem";
import { RequestDatacapWidget } from "./components/request-datacap-widget";

const factoryAddress: Address = "0x4d239cD2c62475BEa41e09BACBe59a9380C28220";
const slaAllocatorAddress: Address =
  "0x4Edca39825772c21739272F9212987f92b36e40E";
const slaRegistryAddress: Address =
  "0xadE4feEB2f4b6D829765B430c1a8674E1607762E";

export default function SLAPage() {
  return (
    <div className="container mx-auto pb-12">
      <ScreenBreadcrumbs
        className="mb-6"
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "SLA",
          },
        ]}
      />

      <div className="flex flex-col gap-8">
        <RegisterSLAWidget slaRegistryAddress={slaRegistryAddress} />
        <RequestDatacapWidget
          slaAllocatorAddress={slaAllocatorAddress}
          slaRegistryAddress={slaRegistryAddress}
        />
        <BeneficiaryContractDeployWidget factoryAddress={factoryAddress} />
      </div>
    </div>
  );
}
