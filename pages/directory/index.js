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
import { dateToString } from "../../utils/useFunction";
import { getCookie } from "../../utils/cookie";
import items from "../../utils/json/category.json";

const Index = (props) => {
  let { token, userId } = props;
  const [sidebar, setSidebar] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [tab, setTab] = useState("Category");
  const [isSearch, setIsSearch] = useState("");
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [fileSelected, setFileSelected] = useState([]);
  const [val, setVal] = useState([]);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isForm, setIsForm] = useState({});

  const Menus = [
    {
      name: "Category",
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
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
  };

  const onEdit = (val) => {
    console.log(100, val);
  };

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
      Header: "Content Count",
      Footer: "Content Count",
      accessor: "contentCount",
    },
    {
      Header: "Creation date",
      Footer: "Creation date",
      accessor: "creationDate",
      Cell: ({ value }) => {
        return <span>{dateToString(value)}</span>;
      },
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
            Directory / Create
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
          <span className="text-lg font-semibold"> Category ({total}) </span>
          <TaskTab options={Menus} value={tab} setValue={setTab}>
            <div className="md:ml-10 w-full md:w-[80%] flex justify-between items-center">
              <div className="w-60">
                <GlobalFilter
                  preFilteredRows={tab == "Category" ? dataTable : null}
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
          {tab == "Category" ? (
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

      {/* Modal Add */}
      <Modal
        isOpen={isShowAdd}
        closeModal={closeModalAdd}
        title="Create Category"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Category name
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            />
          </div>

          <div className="w-full mb-10">
            <label className="font-bold text-base"> Category icon </label>
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
              <span className="text-base capitalize w-full "> Create </span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Edit */}
      <Modal
        isOpen={isShowEdit}
        closeModal={closeModalEdit}
        title="Edit Category"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Category name
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              value={isForm?.title}
              onChange={(e) =>
                setIsForm({ ...isForm, title: e?.target?.value })
              }
            />
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Creation Date </label>
            <span className="text-gray-500 text-base font-semibold">
              {isForm?.creationDate}
            </span>
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Content Count </label>
            <span className="text-gray-500 text-base font-semibold">
              {isForm?.contentCount}
            </span>
          </div>

          <div className="w-full flex flex-col mb-10 gap-5">
            <div className="w-full">
              <label className="font-bold text-base"> Category icon </label>
              <UploaderBox files={fileSelected} setFiles={setFileSelected} />
            </div>
            {isForm?.categoryIcon?.length > 0 ? (
              <span> {isForm?.categoryIcon} </span>
            ) : (
              <span className="italic font-bold text-sm text-center">
                No icon found
              </span>
            )}
          </div>

          <div className="w-full mx-auto flex flex-row gap-3">
            <Button
              variant="danger"
              className="w-1/2 flex justify-center items-center"
              onClick={closeModalEdit}
            >
              <span className="text-base capitalize w-full">
                Delete Category
              </span>
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

export default Index;
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
