import {
  ChevronDoubleLeftIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const SidebarMobile = (props) => {
  const { sidebar, setSidebar, header, children } = props;
  let router = useRouter();

  const handleShow = () => {
    setSidebar(!sidebar);
  };

  return (
    <div className="relative group-hover:w-full bg-sky-700">
      <aside
        className={`font-sans flex md:hidden w-full max-w-xs transform transition-all duration-700 ease-in-out fixed inset-y-0 z-50 shadow-lg lg:flex-shrink-0 overflow-y-auto bg-[#324158] ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full mb-6 flex flex-col">
          {/* <!--Start logo --> */}
          <div className="sticky top-0 z-40 bg-transparent px-6 py-3.5 flex flex-items transform transition-all duration-700 ease-in-out">
            <Link href="/">
              <a className="w-full">
                <div className="mt-5 flex items-center gap-5 ">
                  <div className="rounded-full bg-transparent">
                    <Image
                      src="/img/Logo.png"
                      alt="logo"
                      width={60}
                      height="100%"
                      objectFit="scale-down"
                      className="rounded-full bg-transparent"
                    />
                  </div>

                  <div className="flex flex-col text-white">
                    <p className="text-sm font-bold uppercase"> Admin </p>
                    <p className=" text-3xl font-bold"> Kingdom </p>
                  </div>
                </div>
              </a>
            </Link>
          </div>
          <ul className="mt-6 leading-10">{children}</ul>
          {/* <!--End NavItem --> */}
        </div>
      </aside>
      <div
        onClick={handleShow}
        className={`${
          sidebar &&
          "fixed z-40 inset-0 bg-black bg-opacity-40 transition-opacity duration-100 transform opacity-100"
        }`}
      ></div>
    </div>
  );
};

export default SidebarMobile;
