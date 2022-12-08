import React, { useEffect, useState } from "react";
import { dateToString, toastify } from "../../utils/useFunction";

import { AiOutlineEdit } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
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
import axios from "axios";
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
  const [meta, setMeta] = useState(null);
  const [loadingExport, setLoadingExport] = useState(false);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

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
    console.log(items);
    setIsShowEdit(true);
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setIsForm({});
  };

  const Columns = [
    {
      Header: "Title",
      Footer: "Title",
      accessor: "name",
    },
    {
      Header: "Content Count",
      Footer: "Content Count",
      accessor: "contentCount",
      Cell: ({ value }) => {
        return <span>{value ? value : "-"}</span>;
      },
    },
    {
      Header: "Creation date",
      Footer: "Creation date",
      accessor: "created_at",
      Cell: ({ value }) => {
        return <span>{value ? dateToString(value) : "-"}</span>;
      },
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

  const getDirectory = async () => {
    if (isSearch) {
      config = {
        ...config,
        params: {
          q: isSearch,
        },
      };
    }
    setLoading(true);
    await axios
      .get("v1/directory-category", config)
      .then((res) => {
        setDataTable(res?.data?.data);
        setMeta(res?.data?.meta);
      })
      .catch((err) => toastify(err?.message, "error"));
  };

  useEffect(() => {
    getDirectory();
  }, []);

  useEffect(() => {
    getDirectory();
  }, [isSearch]);

  const onCreate = async () => {
    setLoading(true);
    let items = new FormData();
    items.append("name", isForm?.name);
    items.append("icon", fileSelected[0]);
    await axios
      .post("v1/directory-category", items, config)
      .then((res) => {
        getDirectory();
        toastify(res?.data?.message, "success");
        setLoading(false);
        closeModalAdd();
      })
      .catch((err) => toastify(err?.message, "error"));
  };

  const onDelete = async (id) => {
    setLoading(true);

    await axios
      .delete(`v1/directory-category/${id}`, config)
      .then((res) => {
        getDirectory();
        toastify(res?.data?.message, "success");
        setLoading(false);
        closeModalEdit();
      })
      .catch((err) => toastify(err?.message, "error"));
  };

  const onUpdate = async () => {
    setLoading(true);
    let items = new FormData();
    items.append("name", isForm?.name);
    if (fileSelected.length > 0) {
      items.append("icon", fileSelected[0]);
    }
    await axios
      .put(`v1/directory-category/${isForm?.id}`, items, config)
      .then((res) => {
        getDirectory();
        toastify(res?.data?.message, "success");
        setLoading(false);
        closeModalEdit();
      });
  };

  const onExport = async () => {
    let date = new Date();
    await setLoadingExport(true);
    await axios({
      url: "v1/export/directory-category",
      method: "POST",
      data: {},
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Directory-${date}.csv`);
        document.body.appendChild(link);
        link.click();
        setLoadingExport(false);
      })
      .catch((err) => {
        toastify(err?.message, "error");
        setLoadingExport(false);
      });
  };

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
          <div className="w-full md:w-40 my-5">
            <Button
              variant="outlineGreen"
              onClick={openModalAdd}
              className="flex justify-center"
            >
              <span className="flex justify-center"> New Category</span>
            </Button>
          </div>
          <span className="text-lg font-semibold">
            Category ({meta?.total})
          </span>
          <TaskTab options={Menus} value={tab} setValue={setTab}>
            <div className="md:ml-10 w-full md:w-[80%] flex justify-between items-center flex-col md:flex-row gap-2">
              <div className="w-full md:w-60">
                <GlobalFilter
                  preFilteredRows={tab == "Category" ? dataTable : null}
                  filter={isSearch}
                  setFilter={setIsSearch}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
              <div className="w-full md:w-40">
                <Button
                  variant="outlineBlue"
                  className="flex justify-center"
                  onClick={onExport}
                  disabled={loadingExport}
                >
                  {loadingExport ? (
                    <div className="flex flex-row items-center gap-2 w-full justify-center">
                      <BiLoaderAlt className="h-5 w-5 animate-spin-slow" />
                      <span className="font-semibold text-sm">Proccessing</span>
                    </div>
                  ) : (
                    <span className="text-base capitalize w-full ">
                      {" "}
                      export as .csv{" "}
                    </span>
                  )}
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
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
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
              onClick={onCreate}
              disabled={loading}
            >
              {loading ? (
                <div className="flex flex-row items-center gap-2 w-full justify-center">
                  <BiLoaderAlt className="h-5 w-5 animate-spin-slow" />
                  <span className="text-white font-semibold text-sm">
                    Proccessing
                  </span>
                </div>
              ) : (
                <span className="text-base capitalize w-full "> Create </span>
              )}
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
              value={isForm?.name || ""}
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
            />
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Creation Date </label>
            <span className="text-gray-500 text-base font-semibold">
              {dateToString(isForm?.created_at)}
            </span>
          </div>

          {/* <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Content Count </label>
            <span className="text-gray-500 text-base font-semibold">
              {isForm?.contentCount}
            </span>
          </div> */}

          <div className="w-full flex flex-col mb-10 gap-5">
            <div className="w-full">
              <label className="font-bold text-base"> Category icon </label>
              <UploaderBox
                files={fileSelected}
                setFiles={setFileSelected}
                preview={isForm?.icon}
              />
            </div>
          </div>

          <div className="w-full mx-auto flex flex-row gap-3">
            <Button
              variant="danger"
              className="w-1/2 flex justify-center items-center"
              onClick={() => onDelete(isForm?.id)}
              disabled={loading}
            >
              {loading ? (
                <div className="flex flex-row items-center gap-2 w-full justify-center">
                  <BiLoaderAlt className="h-5 w-5 animate-spin-slow" />
                  <span className="font-semibold text-sm"> Proccessing </span>
                </div>
              ) : (
                <span className="text-base capitalize w-full">
                  Delete Category
                </span>
              )}
            </Button>
            <Button
              variant="primary"
              className="w-1/2 flex justify-center items-center"
              onClick={onUpdate}
              disabled={loading}
            >
              {loading ? (
                <div className="flex flex-row items-center gap-2 w-full justify-center">
                  <BiLoaderAlt className="h-5 w-5 animate-spin-slow" />
                  <span className="text-white font-semibold text-sm">
                    Proccessing
                  </span>
                </div>
              ) : (
                <span className="text-base capitalize w-full "> Save </span>
              )}
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
