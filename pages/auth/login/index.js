import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../../utils/cookie";

import { BiLoaderAlt } from "react-icons/bi";
import Button from "../../../components/button";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { toastify } from "../../../utils/useFunction";
import { useRouter } from "next/router";

export default function Login() {
  let router = useRouter();
  const [isForm, setIsForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const onLogin = async () => {
    await setLoading(true);
    try {
      const res = await axios.post("v1/auth/login", isForm, config);

      let { data, status } = res;

      if (status == 200) {
        toastify("Logged in successfully!", "success");
        await setCookie("token", data?.data?.token);
        await setCookie("userId", data?.data?.id);
        await router.push("/community");
      }
    } catch (error) {
      let { status, data } = await error?.response;
      toastify(data?.message, "error");
    } finally {
      await setLoading(false);
    }
  };

  useEffect(() => {
    if (!isForm?.email || !isForm?.password) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [isForm]);

  return (
    <>
      <Head>
        <title>Login | Kingdom Driven</title>
        <meta name="description" content="Kingdom Driven" />
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/>  */}
      </Head>
      <div className="bg-gray-50 w-full h-screen p-5">
        <div className="w-full lg:w-1/3 justify-center flex flex-col p-5 mx-auto my-3">
          <span className="text-xl flex justify-center text-gray-700 font-bold lg:text-2xl mb-5">
            Kingdom Business App
          </span>

          <Image
            src="/img/Logo.png"
            alt="logo"
            width={200}
            height="100%"
            objectFit="contain"
          />

          <span className="mt-10 lg:mt-5 flex justify-center text-lg font-bold text-gray-700 lg:text-2xl">
            CMS Portal
          </span>
          <div className="flex flex-col justify-center w-full my-10 lg:my-20 gap-5">
            <form>
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
                  required
                  onChange={(e) =>
                    setIsForm({ ...isForm, email: e?.target.value })
                  }
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
                  required
                  onChange={(e) =>
                    setIsForm({ ...isForm, password: e?.target.value })
                  }
                />
              </div>
              <div className="lg:mt-10">
                <Button
                  variant="secondary"
                  className="bg-sky-600 hover:bg-sky-700 shadow-lg w-full py-1.5 rounded-md lg:w-[40%] lg:flex mx-auto"
                  onClick={onLogin}
                  disabled={loading || isDisabled}
                >
                  {loading ? (
                    <div className="flex flex-row items-center gap-2 w-full justify-center">
                      <BiLoaderAlt className="h-5 w-5 animate-spin-slow" />
                      <span className="text-white font-semibold text-sm">
                        {" "}
                        Proccessing{" "}
                      </span>
                    </div>
                  ) : (
                    <span className="flex justify-center text-white font-semibold lg:text-sm mx-auto">
                      Login
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
          <span className="mt-5 lg:mt-5 text-gray-700 font-semibold flex justify-center lg:text-2xl">
            Powered by GB
          </span>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const token = await getCookie("token", context.req);
  const userId = await getCookie("userId", context.req);

  if (token) {
    return {
      redirect: {
        destination: "/community",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
