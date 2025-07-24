import ScreenBreadcrumbs from "@/components/ScreenBreadcrumbs";
import { OnRampAddressBook } from "./components/on-ramp-address-book";

export default function OnRampPage() {
  return (
    <div className="container mx-auto grid gap-6">
      <ScreenBreadcrumbs
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "On-Ramp",
          },
        ]}
      />
      <OnRampAddressBook />
    </div>
  );
}
