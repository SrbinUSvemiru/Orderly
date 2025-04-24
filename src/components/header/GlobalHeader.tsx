"use client";

import { useHeaderStore } from "@/stores/headerStore";
import { Workflow } from "./workflow";
import { Client } from "./client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import React from "react";
import Link from "next/link";

function GlobalHeader() {
  const { headerData } = useHeaderStore();

  const breadcrumbArrayLength = headerData?.breadcrumb?.length;

  return (
    <header className="flex dark:bg-zinc-900 bg-white justify-end rounded-tl-2xl  items-center  space-x-4 px-6 pl-15 py-1 min-h-[54px]">
      {breadcrumbArrayLength && (
        <Breadcrumb className="mr-auto">
          <BreadcrumbList>
            {headerData?.breadcrumb?.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item?.url && index + 1 !== breadcrumbArrayLength ? (
                    <BreadcrumbLink
                      asChild
                      className="text-blue-500 dark:text-blue-400"
                    >
                      <Link href={item?.url}> {item?.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item?.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbArrayLength - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex justify-center items-center space-x-4">
        {headerData?.type === "workflow" && (
          <Workflow headerData={headerData} />
        )}
        {headerData?.type === "client" && <Client headerData={headerData} />}
      </div>
    </header>
  );
}

export default GlobalHeader;
