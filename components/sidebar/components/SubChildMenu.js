import * as Icons from "react-icons/md";

import { CheckCircleIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/router";

function Icon({ icon, ...props }) {
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

export default function SubChildMenu({ route }) {
  let router = useRouter();
  let btnRef = useRef();

  // console.log(11, router?.pathname);

  return (
    <div className="w-full overflow-y-auto">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl">
        <Menu refName={btnRef} appear="true" as={"div"}>
          {({ open }) => (
            <>
              <Menu.Button
                className={`w-full items-center justify-between text-sm inline-flex py-2 px-2 transition-colors duration-150 hover:text-green-400 hover:bg-green-100 dark:hover:text-green-200 rounded-lg 
                                ${
                                  router.pathname?.includes(route.path)
                                    ? "text-white bg-green-300"
                                    : "text-gray-500"
                                }
                            `}
              >
                <div className="relative inline-flex font-semibold items-center focus:outline-none">
                  {route?.icon && (
                    <Icon
                      className="w-6 h-6"
                      aria-hidden="true"
                      icon={route.icon}
                    />
                  )}
                  <span className={route?.icon ? "ml-2" : "ml-4"}>
                    {route.name}
                  </span>
                </div>

                <ChevronUpIcon
                  className={`transform transition-all w-5 h-5 ${
                    !open ? "rotate-90" : "rotate-180"
                  } `}
                />
              </Menu.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="text-sm text-gray-500 focus:outline-none">
                  {route.menus.map((r, i) => (
                    <li
                      className="w-full block py-2 transition-colors duration-150 text-sm px-2 hover:text-green-400 hover:bg-green-100 dark:hover:text-green-200 rounded-lg text-gray-500 mb-3 focus:outline-none"
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
                                ? "ml-8 text-green-300 font-bold"
                                : r?.icon
                                ? "ml-2"
                                : "ml-8"
                            }`}
                          >
                            {r.name}
                          </span>
                          {router.pathname === r.path && (
                            <CheckCircleIcon className="w-4 h-4 text-green-300 mr-2 ml-1" />
                          )}
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
