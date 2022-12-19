import React, { useEffect, useState } from "react";
import { dateToString, toastify } from "../../utils/useFunction";

import { AiOutlineEdit } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import Button from "../../components/button";
import { GlobalFilter } from "../../components/table/components/GlobalFilter";
import Layouts from "../../components/Layouts";
import Modal from "../../components/modal/Modal";
import Navbar from "../../components/navbar";
import Table from "../../components/table";
import TaskTab from "../../components/button/TaskTab";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import items from "../../utils/json/tabs.json";

const Index = (props) => {
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
  const [loadingExport, setLoadingExport] = useState(false);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

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
    setRadioValue(items?.content_type);
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setIsForm({});
    setRadioValue("");
  };

  const getDiscover = async () => {
    if (isSearch) {
      config = {
        ...config,
        params: {
          q: isSearch,
        },
      };
    }
    try {
      axios
        .get("v1/discover", config)
        .then(function (response) {
          setDataTable(response?.data?.data);
        })
        .catch((err) => {
          toastify(err?.response?.data?.message, "error");
          setDataTable([]);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDiscover();
  }, []);

  useEffect(() => {
    getDiscover();
  }, [isSearch]);

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
      accessor: "name",
    },
    {
      Header: "Content Type",
      Footer: "Content Type",
      accessor: "content_type",
    },
    {
      Header: "Content Count",
      Footer: "Content Count",
      accessor: "contents",
      Cell: ({ value }) => {
        return <span> {value?.length} </span>;
      },
    },
    {
      Header: "Creation date",
      Footer: "Creation date",
      accessor: "created_at",
      Cell: ({ value }) => {
        return <span>{dateToString(value)}</span>;
      },
    },
    // {
    //   Header: "Delete",
    //   Footer: "Delete",
    //   accessor: "delete",
    // },
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

  const onDelete = async () => {
    try {
      const res = await axios.delete(`v1/discover/${isForm?.id}`);
      let { data, status } = res;
      if (status == 200 || status == 204) {
        toastify(data?.message, "success");
        await getDiscover();
        await closeModalEdit();
      }
    } catch (error) {
      let { data } = await error?.response;
      toastify(data?.message, "error");
    }
  };

  const onCreate = async () => {
    setLoading(true);
    let items = new FormData();
    items.append("name", isForm?.name);
    items.append("content_type", radioValue.toUpperCase());

    await axios
      .post(`v1/discover`, items)
      .then((res) => {
        toastify(res?.data?.message, "success");
        getDiscover();
        setLoading(false);
        closeModalAdd();
      })
      .catch((err) => {
        toastify(err?.message, "error");
        setLoading(false);
      });
  };

  const onUpdate = async () => {
    setLoading(true);
    let items = new FormData();
    items.append("name", isForm?.name);
    items.append("content_type", radioValue.toUpperCase());

    await axios
      .put(`v1/discover/${isForm?.id}`, items)
      .then((res) => {
        toastify(res?.data?.message, "success");
        setLoading(false);
        getDiscover();
        closeModalEdit();
      })
      .catch((err) => {
        toastify(err?.message, "error");
        setLoading(false);
      });
  };

  const onExport = async () => {
    let today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = yyyy + '' + mm + '' + dd

    await setLoadingExport(true);
    await axios({
      url: "v1/export/discover",
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
        link.setAttribute("download", `export-discover-${formattedToday}.csv`);
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
          <div className="w-full md:w-40 my-5">
            <Button
              variant="outlineGreen"
              onClick={openModalAdd}
              className="flex justify-center"
            >
              <span className="flex justify-center"> New Tab</span>
            </Button>
          </div>
          <span className="text-lg font-semibold">
            Tabs ({dataTable?.length})
          </span>
          <TaskTab options={Menus} value={tab} setValue={setTab}>
            <div className="md:ml-10 w-full md:w-[80%] flex justify-between items-center flex-col md:flex-row gap-2">
              <div className="w-full md:w-60">
                <GlobalFilter
                  preFilteredRows={tab == "Tab" ? dataTable : null}
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
                    <span className="text-base w-full ">Export as .csv</span>
                  )}
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
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
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
                  value="Image"
                  id="Image"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label htmlFor="Image" className="font-semibold cursor-pointer">
                  Images
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Video"
                  id="Video"
                  name="contentType"
                  className="text-gray-500 w-4 h-4 "
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label htmlFor="Video" className="font-semibold cursor-pointer">
                  Videos
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="Article"
                  id="Article"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="Article"
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
              value={isForm?.name || ""}
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
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
                  value="IMAGE"
                  id="IMAGE"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "IMAGE"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label htmlFor="IMAGE" className="font-semibold cursor-pointer">
                  Images
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="VIDEO"
                  id="VIDEO"
                  name="contentType"
                  className="text-gray-500 w-4 h-4 "
                  checked={radioValue === "VIDEO"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label htmlFor="VIDEO" className="font-semibold cursor-pointer">
                  Videos
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="ARTICLE"
                  id="ARTICLE"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "ARTICLE"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="ARTICLE"
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
              {dateToString(isForm?.created_at)}
            </span>
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Content Count </label>
            <span className="text-gray-500 text-base font-semibold">
              {isForm?.contents?.length}
            </span>
          </div>

          <div className="w-full mx-auto flex flex-row gap-3">
            <Button
              variant="danger"
              className="w-1/2 flex justify-center items-center"
              onClick={onDelete}
            >
              <span className="text-base capitalize w-full"> Delete tab </span>
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
