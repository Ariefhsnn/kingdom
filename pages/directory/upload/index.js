import React, { useEffect, useState } from "react";

import { AiOutlineEdit } from "react-icons/ai";
import Button from "../../../components/button";
import DefaultSelect from "../../../components/select";
import { GlobalFilter } from "../../../components/table/components/GlobalFilter";
import Layouts from "../../../components/Layouts";
import { MdEdit } from "react-icons/md";
import Modal from "../../../components/modal/Modal";
import Navbar from "../../../components/navbar";
import Table from "../../../components/table";
import TaskTab from "../../../components/button/TaskTab";
import UploaderBox from "../../../components/button/UploaderBox";
import items from "../../../utils/json/directoryUpload.json";

const index = () => {
  const [sidebar, setSidebar] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [tab, setTab] = useState("Churches");
  const [isSearch, setIsSearch] = useState("");
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [fileSelected, setFileSelected] = useState([]);
  const [val, setVal] = useState([]);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isForm, setIsForm] = useState({});
  const [churchesData, setChurchesData] = useState([]);
  const [associatesData, setAssociatesData] = useState([]);
  const [chambersData, setChambersData] = useState([]);
  const [radioValue, setRadioValue] = useState("");

  const Menus = [
    {
      name: "Churches",
    },
    {
      name: "Associates",
    },
    {
      name: "Chambers",
    },
  ];

  const openModalAdd = () => {
    setIsShowAdd(true);
  };

  const closeModalAdd = () => {
    setIsShowAdd(false);
    setFileSelected([]);
    setVal([]);
    setRadioValue("");
  };

  const openModalEdit = (items) => {
    setIsForm(items);
    setIsShowEdit(true);
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setRadioValue("");
  };

  useEffect(() => {
    if (items?.length > 0) {
      setChurchesData(items.filter((e) => e?.type == "churches"));
      setAssociatesData(items.filter((e) => e?.type == "associates"));
      setChambersData(items.filter((e) => e?.type == "chambers"));
    } else {
      setDataTable([]);
    }
  }, [items]);

  useEffect(() => {
    if (items?.length > 0) {
      let filterChurches = items.filter((e) => e?.type == "churches")?.length;
      let filterAssociates = items.filter(
        (e) => e?.type == "associates"
      )?.length;
      let filterChambers = items.filter((e) => e?.type == "chambers")?.length;
      tab == "Churches"
        ? setTotal(filterChurches)
        : tab == "Associates"
        ? setTotal(filterAssociates)
        : setTotal(filterChambers);
    }
  }, [items, tab]);

  const Columns = [
    {
      Header: "Name",
      Footer: "Name",
      accessor: "name",
    },
    {
      Header: "Location",
      Footer: "Location",
      accessor: "location",
      Cell: ({ value }) => {
        return (
          <span>
            {" "}
            {value?.length > 100 ? value.substring(70, 0) + "..." : value}{" "}
          </span>
        );
      },
    },
    {
      Header: "Phone",
      Footer: "Phone",
      accessor: "phone",
    },
    {
      Header: "Delete",
      Footer: "Delete",
      accessor: "delete",
    },
    {
      Header: "Action",
      Footer: "Action",
      accessor: "id",
      Cell: ({ row, value }) => {
        return (
          <button onClick={() => openModalEdit(row?.original)}>
            <AiOutlineEdit className="h-8 w-8 text-sky-400" />
          </button>
        );
      },
    },
  ];

  const handleFileChange = (e) => {
    setFileSelected(e);
  };

  useEffect(() => {
    console.log(12, fileSelected);
  }, [fileSelected]);

  const onSelectUser = (e) => {
    setVal([{ ...val, name: e?.groupName, id: e?.id }]);
  };

  useEffect(() => {
    console.log(val);
  }, [val]);

  return (
    <>
      <Navbar sidebar={sidebar} setSidebar={setSidebar} />
      <Layouts
        title="Directory"
        description="Directory"
        sidebar={sidebar}
        setSidebar={setSidebar}
      >
        <main className="container w-full flex flex-col text-primary-500 px-5 md:px-0">
          <span className="tracking-wider text-2xl font-bold mb-10">
            Directory / Upload
          </span>
          <span className="text-lg font-semibold"> Create </span>
          <div className="w-40 my-5">
            <Button
              variant="outlineGreen"
              onClick={openModalAdd}
              className="flex justify-center"
            >
              <span className="flex justify-center"> New Category</span>
            </Button>
          </div>
          <span className="text-lg font-semibold">
            {" "}
            Category ({items?.length}){" "}
          </span>
          <TaskTab options={Menus} value={tab} setValue={setTab}>
            <div className="md:ml-10 w-full md:w-[70%] flex justify-between items-center">
              <div className="w-60">
                <GlobalFilter
                  preFilteredRows={tab == "Churches" ? dataTable : null}
                  filter={isSearch}
                  setFilter={setIsSearch}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
              <div className="w-40">
                <Button variant="outlineBlue" className="flex justify-center">
                  Export as .xlsx
                </Button>
              </div>
            </div>
          </TaskTab>
          {tab == "Churches" ? (
            <div className="w-full">
              <Table
                loading={loading}
                setLoading={setLoading}
                Columns={Columns}
                items={churchesData}
                setIsSelected={setIsSelected}
                totalPages={pageCount}
                total={total}
                setPages={pageCount}
              />
            </div>
          ) : tab == "Associates" ? (
            <div className="w-full">
              <Table
                loading={loading}
                setLoading={setLoading}
                Columns={Columns}
                items={associatesData}
                setIsSelected={setIsSelected}
                totalPages={pageCount}
                total={total}
                setPages={pageCount}
              />
            </div>
          ) : (
            <div className="w-full">
              <Table
                loading={loading}
                setLoading={setLoading}
                Columns={Columns}
                items={chambersData}
                setIsSelected={setIsSelected}
                totalPages={pageCount}
                total={total}
                setPages={pageCount}
              />
            </div>
          )}
        </main>
      </Layouts>

      {/* Modal Add */}
      <Modal
        isOpen={isShowAdd}
        closeModal={closeModalAdd}
        title="Upload new entry"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Organization name
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label htmlFor="contentType" className="font-bold text-base ">
              Content Type
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Churches"
                  id="Churches"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "Churches"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Churches"
                  className="font-semibold cursor-pointer"
                >
                  Churches
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Associations"
                  id="Associations"
                  name="contentType"
                  className="text-gray-500 w-4 h-4 "
                  checked={radioValue === "Associations"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Associations"
                  className="font-semibold cursor-pointer"
                >
                  Associations
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Chambers"
                  id="Chambers"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "Chambers"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Chambers"
                  className="font-semibold cursor-pointer"
                >
                  Chambers
                </label>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Description
            </label>
            <textarea
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              rows="4"
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Location
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Website
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Phone
            </label>
            <input
              type="number"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Email
            </label>
            <input
              type="email"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Opening hours
            </label>
            <textarea
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              rows="4"
            />
          </div>

          <div className="w-full mb-10">
            <label className="font-bold text-base"> Gallery </label>
            <UploaderBox files={fileSelected} setFiles={setFileSelected} />
          </div>

          <div className="w-2/3 mx-auto flex flex-row gap-3">
            <Button
              variant="outline"
              className="w-1/2 flex justify-center items-center"
              onClick={closeModalAdd}
            >
              <span className="text-base capitalize w-full"> Cancel </span>
            </Button>
            <Button
              variant="primary"
              className="w-1/2 flex justify-center items-center"
            >
              <span className="text-base capitalize w-full "> Upload </span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Edit */}
      <Modal
        isOpen={isShowEdit}
        closeModal={closeModalEdit}
        title="Edit entry"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Organization name
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              value={isForm?.name || ""}
            />
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label htmlFor="contentType" className="font-bold text-base ">
              Content Type
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Churches"
                  id="Churches"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "Churches"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Churches"
                  className="font-semibold cursor-pointer"
                >
                  Churches
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Associations"
                  id="Associations"
                  name="contentType"
                  className="text-gray-500 w-4 h-4 "
                  checked={radioValue === "Associations"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Associations"
                  className="font-semibold cursor-pointer"
                >
                  Associations
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Chambers"
                  id="Chambers"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "Chambers"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Chambers"
                  className="font-semibold cursor-pointer"
                >
                  Chambers
                </label>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Description
            </label>
            <textarea
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              rows="4"
              value={isForm?.description}
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Location
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              value={isForm?.location || ""}
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Website
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Phone
            </label>
            <input
              type="number"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Email
            </label>
            <input
              type="email"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Opening hours
            </label>
            <textarea
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              rows="4"
            />
          </div>

          <div className="w-full mb-10">
            <label className="font-bold text-base"> Gallery </label>
            <UploaderBox files={fileSelected} setFiles={setFileSelected} />
          </div>

          <div className="w-2/3 mx-auto flex flex-row gap-3">
            <Button
              variant="outline"
              className="w-1/2 flex justify-center items-center"
              onClick={closeModalAdd}
            >
              <span className="text-base capitalize w-full"> Cancel </span>
            </Button>
            <Button
              variant="primary"
              className="w-1/2 flex justify-center items-center"
            >
              <span className="text-base capitalize w-full "> Upload </span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default index;
