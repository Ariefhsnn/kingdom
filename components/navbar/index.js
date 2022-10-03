import Link from "next/link";
import { MdTableRows } from "react-icons/md";
import React from "react";

export default function Navbar(props) {
  const { sidebar, setSidebar } = props;
  const sidebarHandle = () => {
    setSidebar(!sidebar);
  };

  return (
    <>
      <div className="flex justify-start w-full  gap-5 bg-[#324158] items-center">
        <div className="ml-5">
          <button
            className="md:hidden flex justify-start"
            onClick={sidebarHandle}
          >
            <MdTableRows className="w-8 h-8 m-2 text-gray-50" />
          </button>
        </div>
      </div>
    </>
  );
}
