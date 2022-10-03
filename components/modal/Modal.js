import { Dialog, Transition } from "@headlessui/react";

import { Fragment } from "react";

export default function Modal(props) {
  const {
    isOpen,
    openModal,
    closeModal,
    title,
    subTitle,
    children,
    sizes,
    hiddenClose,
    position,
    border,
    customHeader,
  } = props;
  const variants =
    sizes === "small"
      ? "max-w-md"
      : sizes === "large"
      ? "max-w-5xl"
      : "max-w-2xl";
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[1000] overflow-y-auto"
          onClose={closeModal}
        >
          <div
            className={`flex min-h-screen 
                        ${
                          position === "top"
                            ? "items-start"
                            : position === "bottom"
                            ? "items-end"
                            : "items-center"
                        }`}
          >
            <div
              className="fixed inset-0 bg-black/30"
              aria-hidden="true"
              onClick={closeModal}
            />

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in-out duration-200"
              leaveFrom="opacity-100 scale-95"
              leaveTo="opacity-0 scale-100"
            >
              <div
                className={`relative mx-auto w-full inline-block text-left align-middle transition-all transform ${variants}`}
              >
                <div className="bg-white shadow-xl rounded-lg">
                  <div
                    className={`w-full flex justify-between items-center px-10 pt-10 pb-5 ${
                      border ? "border-b-2 border-gray-300" : ""
                    }`}
                  >
                    {customHeader}

                    {title && (
                      <Dialog.Title
                        as="h3"
                        className={`text-xl font-semibold leading-6 text-gray-700${
                          hiddenClose ? " w-full" : ""
                        }`}
                      >
                        {title}
                        <p className="text-gray-500 text-sm">{subTitle}</p>
                      </Dialog.Title>
                    )}

                    {/* {!hiddenClose && (
                      // <button
                      //     onClick={closeModal}
                      //     className="text-gray-500 hover:text-gray-700 rounded-lg text-sm p-1.5 focus:outline-none"
                      //     type="button"
                      // >
                      // </button>
                      <MdClose
                        onClick={closeModal}
                        className="text-gray-500 w-5 h-5 cursor-pointer"
                      />
                    )} */}
                  </div>

                  <div className="w-full">{children}</div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
