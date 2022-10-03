import Button from "../../../components/button";
import Head from "next/head";
import Layouts from "../../../components/Layouts";
import Link from "next/link";
import React from "react";

export default function login() {
  return (
    <>
      <Head>
        <title>Login | Kingdom Driven</title>
        <meta name="description" content="Kingdom Driven" />
      </Head>
      <div className="bg-gray-50 w-full h-screen p-5">
        <div className="w-full lg:w-1/3 justify-center flex flex-col p-10 mx-auto my-5">
          <span className="text-xl flex justify-center text-gray-700 font-bold lg:text-2xl">
            Kingdom Business App (Logo)
          </span>
          <span className="mt-10 lg:mt-20 flex justify-center text-lg font-bold text-gray-700 lg:text-2xl">
            CMS Portal
          </span>
          <div className="flex flex-col justify-center w-full my-10 lg:my-20 gap-5">
            <div className="flex flex-col md:flex-row w-full items-center">
              <label
                htmlFor="email"
                className="font-semibold text-gray-600 focus:outline-none border-none outline-none w-full lg:w-1/4 lg:text-base"
              >
                Email
              </label>
              <input
                type="email"
                className="bg-gray-100 px-4 py-1.5 rounded w-full lg:w-3/4 focus:outline-none text-gray-500"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <label
                htmlFor="password"
                className="font-semibold text-gray-600  w-full lg:w-1/4"
              >
                {" "}
                Password{" "}
              </label>
              <input
                type="password"
                className="bg-gray-100 px-4 py-1.5 rounded w-full lg:w-3/4 focus:outline-none text-gray-500"
              />
            </div>
            <div className="lg:mt-10">
              <Button
                variant="secondary"
                className="bg-sky-600 hover:bg-sky-700 shadow-lg w-full py-1.5 rounded-md lg:w-1/3 lg:flex mx-auto"
              >
                <Link href={`/community`}>
                  <span className="flex justify-center text-white font-semibold lg:text-xl mx-auto">
                    Login
                  </span>
                </Link>
              </Button>
            </div>
          </div>
          <span className="mt-5 lg:mt-20 text-gray-700 font-semibold flex justify-center lg:text-2xl">
            Powered by GB
          </span>
        </div>
      </div>
    </>
  );
}
