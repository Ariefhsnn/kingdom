import { BsCheckCircleFill } from "react-icons/bs";
import { MdDangerous } from "react-icons/md";
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
  let year = new Date(date).getFullYear();
  let month = new Date(date).getMonth();
  let day = new Date(date).getDay();
  return `${day} - ${month} - ${year}`;
};
