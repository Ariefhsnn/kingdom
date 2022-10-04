import React, { useEffect, useState } from "react";

import { AiOutlineEdit } from "react-icons/ai";
import Button from "../../components/button";
import DefaultSelect from "../../components/select";
import { GlobalFilter } from "../../components/table/components/GlobalFilter";
import Layouts from "../../components/Layouts";
import { MdEdit } from "react-icons/md";
import Modal from "../../components/modal/Modal";
import Navbar from "../../components/navbar";
import Table from "../../components/table";
import TaskTab from "../../components/button/TaskTab";
import UploaderBox from "../../components/button/UploaderBox";
import items from "../../utils/json/user.json";

const index = () => {
  const [sidebar, setSidebar] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [tab, setTab] = useState("Tab");
  const [isSearch, setIsSearch] = useState("");
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [fileSelected, setFileSelected] = useState([]);
  const [opt, setOpt] = useState([]);
  const [val, setVal] = useState([]);

  const Menus = [
    {
      name: "Tab",
    },
  ];

  const openModalAdd = () => {
    setIsShowAdd(true);
  };

  const closeModalAdd = () => {
    setIsShowAdd(false);
    setFileSelected([]);
    setVal([]);
  };

  const onEdit = (val) => {
    console.log(100, val);
  };

  useEffect(() => {
    let optData = [];
    if (items?.length > 0) {
      setDataTable(items);
      setTotal(items?.length);
      items?.forEach((element) => {
        optData.push({
          ...element,
          label: element?.groupName,
          value: element?.groupName,
        });
      });
      setOpt(optData);
    } else {
      setDataTable([]);
    }
  }, [items]);

  const Columns = [
    {
      Header: "User name",
      Footer: "User name",
      accessor: "userName",
    },
    {
      Header: "User ID",
      Footer: "User ID",
      accessor: "userId",
    },
    {
      Header: "Join date",
      Footer: "Join date",
      accessor: "joinDate",
    },
    {
      Header: "Delete",
      Footer: "Delete",
      accessor: "Delete",
    },
    {
      Header: "Member type",
      Footer: "Member type",
      accessor: "id",
      Cell: ({ row, value }) => {
        return (
          <button onClick={() => onEdit(row?.original)}>
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
        title="User Management"
        description="User Management"
        sidebar={sidebar}
        setSidebar={setSidebar}
      >
        <main className="container w-full flex flex-col text-primary-500 px-5 md:px-0">
          <span className="tracking-wider text-2xl font-bold mb-10">
            User Management
          </span>
          <span className="text-lg font-semibold"> Users ({total}) </span>

          <div className="w-full md:w-[90%] flex justify-between items-center mt-5">
            <div className="w-60">
              <GlobalFilter
                preFilteredRows={tab == "Tab" ? dataTable : null}
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

          {tab == "Tab" ? (
            <div className="w-full">
              <Table
                loading={loading}
                setLoading={setLoading}
                Columns={Columns}
                items={dataTable}
                setIsSelected={setIsSelected}
                totalPages={pageCount}
                total={total}
                setPages={pageCount}
              />
            </div>
          ) : null}
        </main>
      </Layouts>
      <Modal
        isOpen={isShowAdd}
        closeModal={closeModalAdd}
        title="Create Tab"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Tab name
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 py-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full mb-5 flex flex-col gap-3">
            <label htmlFor="contentType" className="font-bold text-base ">
              {" "}
              Content Type{" "}
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Images"
                  id="Images"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                />
                <label
                  htmlFor="Images"
                  className="font-semibold cursor-pointer"
                >
                  {" "}
                  Images{" "}
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Videos"
                  id="Videos"
                  name="contentType"
                  className="text-gray-500 w-4 h-4 "
                />
                <label
                  htmlFor="Videos"
                  className="font-semibold cursor-pointer"
                >
                  {" "}
                  Videos{" "}
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Articles"
                  id="Articles"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                />
                <label
                  htmlFor="Articles"
                  className="font-semibold cursor-pointer"
                >
                  {" "}
                  Articles{" "}
                </label>
              </div>
            </div>
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
              <span className="text-base capitalize w-full "> Create </span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default index;
