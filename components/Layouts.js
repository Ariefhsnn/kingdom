import Head from "next/head";
import { MdTableRows } from "react-icons/md";
import React from "react";
import Sidebar from "./sidebar";

export default function Layouts(props) {
  const { header, sidebar, setSidebar, description, title, logo, children } =
    props;

  const toggleSideBar = () => {
    setSidebar(!sidebar);
  };

  return (
    <>
      <Head>
        <title>{title + " | Kingdom Driven"}</title>
        <meta name="description" content={`Kingdom Driven - ${description}`} />        
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta> */}
      </Head>
      <div className="relative flex w-full overflow-y-auto bg-gray-50">
        <Sidebar header={header} sidebar={sidebar} setSidebar={setSidebar} />
        {/* <button
          className="md:hidden flex justify-start text-primary-500
          "
          onClick={toggleSideBar}
        >
          <MdTableRows className="w-8 h-8 m-2" />
        </button> */}
        <div className="relative md:ml-[25rem] md:mt-[2rem] mt-5 flex flex-col items-center w-full h-screen min-h-full duration-300 ease-in-out ">
          {children}
        </div>
      </div>
    </>
  );
}
