// import Submenu from '../Submenu';
import * as Icons from "react-icons/md";

import React, { useEffect } from "react";

import Link from "next/link";
import SubMenu from "./SubMenu";
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

  return routes?.map((route, idx) => {
    if (route?.routes) {
      return <SubMenu key={idx} route={route} />;
    } else {
      return (
        <li
          key={idx}
          className="relative mb-3 rounded-md flex items-center justify-center cursor-pointer px-4  ml-4"
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
        </li>
      );
    }
  });
}
