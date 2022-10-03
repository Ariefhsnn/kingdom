import React from "react";

export default function Button(props) {
  let { variant, children, disabled } = props;
  const primary =
    "flex items-center bg-purple-700 text-white shadow font-bold text-base px-4 py-2 hover:bg-indigo-600 focus:outline-none duration-300 transition transform hover:shadow-offset-black focus:shadow-offset-black border border-indigo-700 hover:border-indigo-500 rounded hover:shadow-lg";
  const secondary =
    "flex items-center bg-sky-600 text-white shadow-md font-bold text-base px-4 py-2 hover:bg-sky-700 focus:outline-none duration-300 transition transform hover:shadow-offset-black focus:shadow-offset-black border border-green-300 hover:border-green-300 rounded";
  const danger =
    "flex items-center text-red-500 border border-red-500 bg-transparent shadow font-bold text-base px-4 py-2 hover:bg-white focus:outline-none duration-300 transition transform hover:shadow-offset-black focus:shadow-offset-black border rounded hover:shadow-lg hover:bg-gray-50";
  const warning =
    "flex items-center bg-yellow-500 text-white shadow-md font-bold text-base px-4 py-2 hover:bg-yellow-600 focus:outline-none duration-300 transition transform hover:shadow-offset-black focus:shadow-offset-black border-yellow-500 hover:border-yellow-600 rounded";
  const outline =
    "flex items-center text-purple-700 border border-purple-700 bg-transparent shadow font-bold text-base px-4 py-2 hover:bg-white focus:outline-none duration-300 transition transform hover:shadow-offset-black focus:shadow-offset-black border rounded hover:shadow-lg";
  const outlineNone =
    "flex items-center text-gray-500 hover:text-secondary-500 font-bold text-base p-2 focus:outline-none hover:shadow-offset-black focus:shadow-offset-black duration-300 transition transform rounded";
  const disableColor =
    "flex items-center text-gray-500 opacity-50 font-bold text-base focus:outline-none rounded";
  const outlineGreen =
    "flex items-center bg-transparent border-green-300 text-green-300 px-4 py-1 rounded-xl hover:shadow-lg hover:text-green-500 hover:border-green-500 w-full  border-4 font-bold transition transform duration-300";
  const outlineBlue =
    "flex items-center bg-transparent border-sky-300 text-sky-300 px-4 py-1 rounded-xl hover:shadow-lg hover:text-sky-500 hover:border-sky-500 w-full  border-4 font-bold transition transform duration-300";
  return (
    <button
      {...props}
      className={`${variant === "outline" && outline} ${
        variant === "outline-none" && outlineNone
      } ${
        !variant ||
        variant == undefined ||
        variant == "" ||
        (variant === "primary" && primary)
      } ${variant === "danger" && danger} ${
        variant === "secondary" && secondary
      }  ${variant === "warning" && warning} ${
        variant === "outlineGreen" && outlineGreen
      } ${variant === "outlineBlue" && outlineBlue} ${
        disabled && disableColor
      } ${props.className}`}
    >
      {!children ? "Klik" : children}
    </button>
  );
}
