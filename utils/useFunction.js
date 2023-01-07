import { BsCheckCircleFill } from "react-icons/bs";
import { MdDangerous } from "react-icons/md";
import moment from "moment";
import { toast } from "react-toastify";

export const toastify = (msg, type) => {
  if (type == "error") {
    return toast.error(msg, {
      icon: () => <MdDangerous className="text-red-300 h-5 w-5" />,
      hideProgressBar: true,
    });
  } else if (type == "success") {
    return toast.success(msg, {
      icon: () => <BsCheckCircleFill className="text-[#324158] h-5 w-5" />,
      hideProgressBar: true,
    });
  }
};

export const dateToString = (date) => {
  if (date) {
    return moment(date).format("DD-MM-YYYY");
    // return new Date(date).toISOString().split("T")[0];
  }
};

export const upperCaseToCapitalize = val => {
  return val?.split('')[0] + val?.toLowerCase()?.substring(1)
}
