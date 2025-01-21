import { SlashIcon } from "lucide-react";
import Link from "next/link";
import { ComponentProps, Fragment, ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export interface ScreenBreadcrumbsProps
  extends Omit<ComponentProps<typeof Breadcrumb>, "children"> {
  items: Array<{
    label: ReactNode;
    href?: string | null | undefined;
  }>;
}

export function ScreenBreadcrumbs({ items, ...rest }: ScreenBreadcrumbsProps) {
  return (
    <Breadcrumb {...rest}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                item.label
              )}
            </BreadcrumbItem>

            {index !== items.length - 1 && (
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default ScreenBreadcrumbs;
