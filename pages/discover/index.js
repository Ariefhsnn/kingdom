import React, { useEffect, useState } from "react";

import { AiOutlineEdit } from "react-icons/ai";
import Button from "../../components/button";
import { GlobalFilter } from "../../components/table/components/GlobalFilter";
import Layouts from "../../components/Layouts";
import Modal from "../../components/modal/Modal";
import Navbar from "../../components/navbar";
import Table from "../../components/table";
import TaskTab from "../../components/button/TaskTab";
import { getCookie } from "../../utils/cookie";
import items from "../../utils/json/tabs.json";

const index = (props) => {
  let { token, userId } = props;
  const [sidebar, setSidebar] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [tab, setTab] = useState("Tab");
  const [isSearch, setIsSearch] = useState("");
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [fileSelected, setFileSelected] = useState([]);
  const [val, setVal] = useState([]);
  const [radioValue, setRadioValue] = useState("");
  const [isForm, setIsForm] = useState({});

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

  const openModalEdit = (items) => {
    setIsForm(items);
    setIsShowEdit(true);
    setRadioValue(items?.contentType);
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setIsForm({});
    setRadioValue("");
  };

  // const getDiscover = async () => {
  //   try {
  //     axios
  //       .get("http://157.230.35.148:9005/v1/discover")
  //       .then(function (response) {
  //         setDataTable(response?.data?.data);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getDiscover();
  // }, []);

  useEffect(() => {
    if (items?.length > 0) {
      setDataTable(items);
      setTotal(items?.length);
    } else {
      setDataTable([]);
    }
  }, [items]);

  const Columns = [
    {
      Header: "Title",
      Footer: "Title",
      accessor: "title",
    },
    {
      Header: "Content Type",
      Footer: "Content Type",
      accessor: "contentType",
    },
    {
      Header: "Content Count",
      Footer: "Content Count",
      accessor: "contentCount",
    },
    {
      Header: "Creation date",
      Footer: "Creation date",
      accessor: "creationDate",
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
        title="Discover"
        description="Discover"
        sidebar={sidebar}
        setSidebar={setSidebar}
      >
        <main className="container w-full flex flex-col text-primary-500 px-5 md:px-0">
          <span className="tracking-wider text-2xl font-bold mb-10">
            Discover / Create
          </span>
          <span className="text-lg font-semibold"> Create </span>
          <div className="w-40 my-5">
            <Button
              variant="outlineGreen"
              onClick={openModalAdd}
              className="flex justify-center"
            >
              <span className="flex justify-center"> New Tab</span>
            </Button>
          </div>
          <span className="text-lg font-semibold">
            {" "}
            Tabs ({items?.length}){" "}
          </span>
          <TaskTab options={Menus} value={tab} setValue={setTab}>
            <div className="md:ml-10 w-full md:w-[80%] flex justify-between items-center">
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
          </TaskTab>
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

      {/* Modal Create */}
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
              Content Type
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
                  Images
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
                  Videos
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
                  Articles
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

      {/* Edit Create */}
      <Modal
        isOpen={isShowEdit}
        closeModal={closeModalEdit}
        title="Edit Tab"
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
              value={isForm?.title}
              onChange={(e) =>
                setIsForm({ ...isForm, title: e?.target?.value })
              }
            />
          </div>

          <div className="w-full mb-5 flex flex-col gap-3">
            <label htmlFor="contentType" className="font-bold text-base ">
              Content Type
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Images"
                  id="Images"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "Images"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Images"
                  className="font-semibold cursor-pointer"
                >
                  Images
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Videos"
                  id="Videos"
                  name="contentType"
                  className="text-gray-500 w-4 h-4 "
                  checked={radioValue === "Videos"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Videos"
                  className="font-semibold cursor-pointer"
                >
                  Videos
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Articles"
                  id="Articles"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "Articles"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Articles"
                  className="font-semibold cursor-pointer"
                >
                  Articles
                </label>
              </div>
            </div>
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Creation Date </label>
            <span className="text-gray-500 text-base font-semibold">
              {" "}
              {isForm?.creationDate}{" "}
            </span>
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Content Count </label>
            <span className="text-gray-500 text-base font-semibold">
              {" "}
              {isForm?.contentCount}{" "}
            </span>
          </div>

          <div className="w-full mx-auto flex flex-row gap-3">
            <Button
              variant="danger"
              className="w-1/2 flex justify-center items-center"
              onClick={closeModalEdit}
            >
              <span className="text-base capitalize w-full"> Delete tab </span>
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

export async function getServerSideProps(context) {
  const token = getCookie("token", context.req);
  const userId = getCookie("userId", context.req);

  if (!token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { token, userId },
  };
}
