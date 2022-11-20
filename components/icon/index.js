import { BsCheckCircleFill } from "react-icons/bs";
import { MdDangerous } from "react-icons/md";
import React from "react";

const Icon = ({ type }) => {
  if (type == "success") {
    return <BsCheckCircleFill className="text-[#324158] h-5 w-5" />;
  } else if (type == "error") {
    return <MdDangerous className="text-red-300 h-5 w-5" />;
  }
};

export default Icon;
