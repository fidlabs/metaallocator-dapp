import AppLayout from "@/components/AppLayout";
import ScreenBreadcrumbs from "@/components/ScreenBreadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import type { ReactElement } from "react";

export default function HomePage() {
  return (
    <div className="container mx-auto flex flex-col gap-6 pb-8">
      <ScreenBreadcrumbs
        items={[
          {
            label: "Home",
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Allocators</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              List and create new allocator contracts. Manage individual
              allocators allowance. Manage contracts ownership and more.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/allocator">Manage Allocators</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Create new Client contracts. Manage individual clients allowance.
              Manage contracts ownership and more.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/client">Manage Clients</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
