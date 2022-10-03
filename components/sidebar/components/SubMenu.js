import * as Icons from "react-icons/md";

import { CheckCircleIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { useEffect, useRef } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

function Icon({ icon, ...props }) {
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

export default function SubMenu({ route }) {
  let router = useRouter();
  let btnRef = useRef();

  useEffect(() => {
    console.log(router?.pathname, "=", route?.routes[0]?.path);
  }, [route]);

  return (
    <div className="w-full overflow-y-auto">
      <div className="w-full max-w-md mx-auto rounded-2xl">
        <Menu refName={btnRef} appear="true" as={"div"}>
          {({ open }) => (
            <>
              <Menu.Button
                className={`w-full items-baseline pl-10 justify-between text-lg inline-flex py-2 transition-colors duration-150 rounded-lg hover:text-[#05C4C4]
                                ${
                                  route?.routes?.path?.includes(
                                    router?.pathname
                                  )
                                    ? "text-[#05C4C4]"
                                    : "text-white"
                                }
                            `}
              >
                <div className="relative inline-flex font-semibold items-center focus:outline-none">
                  {route?.icon && (
                    <Icon
                      className="w-8 h-8"
                      aria-hidden="true"
                      icon={route.icon}
                    />
                  )}
                  <span className={route?.icon ? "ml-2 mt-2" : "ml-5 mt-1"}>
                    {route.name}
                  </span>
                </div>

                {/* <ChevronUpIcon
                  className={`transform transition-all w-5 h-5 text-white ${
                    !open ? "rotate-90" : "rotate-180"
                  } `}
                /> */}
              </Menu.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="text-sm text-white focus:outline-none  border-l ml-24">
                  {route?.routes?.map((r, i) => (
                    <li
                      className="w-full block transition-colors duration-150 text-sm px-2 hover:text-[#05C4C4]  text-white mb-3 focus:outline-none"
                      key={i}
                    >
                      <Link href={{ pathname: r?.url, query: r?.query }}>
                        <a className="relative w-full flex font-semibold items-center ">
                          {r?.icon && (
                            <Icon
                              className="w-6 h-6"
                              aria-hidden="true"
                              icon={r.icon}
                            />
                          )}
                          <span
                            className={`${
                              router.pathname === r.path
                                ? " text-[#05C4C4] font-bold"
                                : r?.icon
                                ? "ml-2"
                                : "ml-8"
                            } ml-5 text-lg`}
                          >
                            {r.name}
                          </span>
                          {/* {router.pathname === r.path && (
                            <CheckCircleIcon className="w-4 h-4 text-green-300 mr-2 ml-1" />
                          )} */}
                        </a>
                      </Link>
                    </li>
                  ))}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
}
