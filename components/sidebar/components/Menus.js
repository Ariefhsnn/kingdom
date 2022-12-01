// import Submenu from '../Submenu';
import * as Icons from "react-icons/md";

import React, { useEffect } from "react";
import { removeCookie, setCookie } from "../../../utils/cookie";

import Link from "next/link";
import { RiLogoutCircleRLine } from "react-icons/ri";
import SubMenu from "./SubMenu";
import { toastify } from "../../../utils/useFunction";
import { useRouter } from "next/router";

function Icon({ icon, ...props }) {
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

export default function Menus(props) {
  const router = useRouter();
  const { pathname, query } = router;
  const { routes } = props;

  // useEffect(() => {
  //   console.log(pathname, "=", routes[0]?.routes[0]?.path);
  // }, [pathname]);

  const onLogout = async () => {
    await toastify("Logged out successfully", "success");
    await removeCookie("token");
    await removeCookie("userId");
    await router.push("/");
  };

  return routes?.map((route, idx) => {
    if (route?.routes) {
      return <SubMenu key={idx} route={route} />;
    } else {
      return (
        <li
          key={idx}
          className="relative mb-3 rounded-md flex flex-col items-center justify-center cursor-pointer px-4  ml-4"
        >
          <Link href={{ pathname: route?.url, query: route?.query }}>
            <a
              className={`text-lg text-white font-bold inline-flex py-2 px-2 items-center w-full transition-colors duration-150 hover:text-[#05C4C4] rounded-lg ${
                pathname == routes?.routes?.path
                  ? "text-sky-500 "
                  : "text-white"
              }`}
            >
              {route?.icon && (
                <Icon
                  className="w-8 h-8"
                  aria-hidden="true"
                  icon={route.icon || ""}
                />
              )}
              <span className={`ml-2`}>{route.name || ""}</span>
            </a>
          </Link>
          <button
            className="flex w-full justify-start ml-4 mt-2 gap-2 items-center text-white font-bold hover:text-red-300"
            onClick={onLogout}
          >
            <RiLogoutCircleRLine className="w-8 h-8" />
            <p className="text-lg mt-1">Logout</p>
          </button>
        </li>
      );
    }
  });
}
