import React, { useEffect, useState } from "react";

import { AiOutlineEdit } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import Button from "../../../components/button";
import DefaultSelect from "../../../components/select";
import { GlobalFilter } from "../../../components/table/components/GlobalFilter";
import Layouts from "../../../components/Layouts";
import Modal from "../../../components/modal/Modal";
import Navbar from "../../../components/navbar";
import Table from "../../../components/table";
import TaskTab from "../../../components/button/TaskTab";
import UploaderBox from "../../../components/button/UploaderBox";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";
import { toastify } from "../../../utils/useFunction";

const Index = (props) => {
  let { token, userId } = props;
  const [sidebar, setSidebar] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [tab, setTab] = useState("church");
  const [isSearch, setIsSearch] = useState("");
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [fileSelected, setFileSelected] = useState([]);
  const [tabValue, setTabValue] = useState([]);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isForm, setIsForm] = useState({});
  const [churchesData, setChurchesData] = useState([]);
  const [radioValue, setRadioValue] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingExport, setLoadingExport] = useState(false);
  const [options, setOptions] = useState([]);
  const [categoryData, setCategoryData] = useState(null);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const Menus = [
    {
      name: "church",
    },
    {
      name: "associate",
    },
    {
      name: "chamber",
    },
  ];

  const openModalAdd = () => {
    setIsShowAdd(true);
  };

  const closeModalAdd = () => {
    setIsShowAdd(false);
    setFileSelected([]);
    setTabValue([]);
    setRadioValue("");
  };

  const openModalEdit = (items) => {
    let time = `${new Date(Number(items?.opening_hours)).getHours()}:${
      new Date(Number(items?.opening_hours)).getMinutes() > 9
        ? new Date(Number(items?.opening_hours)).getMinutes()
        : 0 + new Date(Number(items?.opening_hours)).getMinutes()
    }`;
    setIsForm(items);
    setIsShowEdit(true);
    setRadioValue(items?.category);
    setSelectedTime(time);
    console.log(time);
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setRadioValue("");
  };

  const getDirectoryCategory = async () => {
    let category;
    let categories = [];
    await axios
      .get("v1/directory-category", config)
      .then((res) => res.data)
      .then((data) => {
        category = data.data;
      })
      .catch((err) => console.log(err, "error"));

    await category.forEach((element) => {
      categories.push({
        ...element,
        label: element?.name,
        value: element?.name,
      });
    });

    setOptions(categories);
    if (categories.length > 0) setTabValue(categories[0].value);
  };

  useEffect(() => {
    getDirectoryCategory();
  }, []);

  const getDirectory = async () => {
    if (tab) {
      config = {
        ...config,
        params: {
          category: tabValue,
        },
      };
    }

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
        .get("v1/directory", config)
        .then(function (response) {
          setDataTable(response?.data?.data);
          // setOldData(response?.data?.data);
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
    getDirectory();
  }, [isSearch]);

  useEffect(() => {
    getDirectory();
  }, [tabValue]);

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

  const onCreate = async () => {
    let date = new Date(selectedTime).getTime();
    let items = new FormData();
    items.append("name", isForm?.name);
    items.append("directory_category_id", categoryData?.id);
    items.append("description", isForm?.description);
    items.append("location", isForm?.location);
    items.append("website_url", isForm?.website_url);
    items.append("phone", isForm?.phone);
    items.append("email", isForm?.email);
    items.append("opening_hours", date);
    if (fileSelected?.length > 0) {
      items.append("photos", fileSelected[0], `${fileSelected[0]?.name}`);
    }

    try {
      let res = await axios.post(`v1/directory`, items);
      let { data, status } = res;
      if (status == 200 || status == 201) {
        toastify(data?.message, "success");
        await getDirectory();
        await closeModalAdd();
      }
    } catch (error) {
      let { data } = await error?.response;
      toastify(data?.message, "error");
    }
  };

  const onUpdate = async () => {
    let date = new Date(selectedTime).getTime();
    let items = new FormData();
    items.append("name", isForm?.name);
    items.append("directory_category_id", radioValue);
    items.append("description", isForm?.description);
    items.append("location", isForm?.location);
    items.append("website_url", isForm?.website_url);
    items.append("phone", isForm?.phone);
    items.append("email", isForm?.email);
    items.append("opening_hours", date);

    try {
      let res = await axios.put(`v1/directory/${isForm?.id}`, items, config);
      let { data, status } = res;
      console.log(status);
      if (status == 200 || status == 201) {
        await toastify(data?.message, "success");
        await getDirectory();
        await closeModalEdit();
      }
    } catch (error) {
      let { data } = await error?.response;
      toastify(data?.message, "error");
    }
  };

  const onDelete = async () => {
    await setLoading(true);
    try {
      const res = await axios.delete(`v1/directory/${isForm?.id}`, config);
      let { data, status } = res;
      if (status == 204 || status == 200) {
        await toastify(data?.message, "success");
        await getDirectory();
        await setLoading(false);
        await closeModalEdit();
      } else {
        throw data;
      }
    } catch (error) {
      let { data, status } = await error?.response;
      toastify(data?.message, "error");
    }
  };

  const onExport = async () => {
    let date = new Date();
    await setLoadingExport(true);
    await axios({
      url: "v1/export/directory",
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
        link.setAttribute("download", `Directory-Content-${date}.csv`);
        document.body.appendChild(link);
        link.click();
        setLoadingExport(false);
      })
      .catch((err) => {
        toastify(err?.message, "error");
        setLoadingExport(false);
      });
  };

  useEffect(() => {
    console.log(categoryData, "category");
  }, [categoryData]);

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
            {" "}
            Category ({dataTable?.length}){" "}
          </span>
          <div className="w-full flex flex-col md:flex-row gap-2">
            <div className="w-full md:w-[30%] ">
              <DefaultSelect
                value={tabValue}
                setValue={setTabValue}
                options={options}
                isMulti={false}
                isValueOnly={true}
                instanceId="filterContentType"
              />
            </div>
            <div className="md:ml-10 w-full md:w-[70%] flex justify-between items-center flex-col md:flex-row gap-2">
              <div className="w-full md:w-60">
                <GlobalFilter
                  preFilteredRows={tab == "Churches" ? dataTable : null}
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
                      export as .csv
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
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
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
            />
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label htmlFor="contentType" className="font-bold text-base ">
              Content Type
            </label>
            <div className="flex flex-col gap-2">
              <DefaultSelect
                value={radioValue}
                setValue={setRadioValue}
                options={options}
                isMulti={false}
                setData={setCategoryData}
                instanceId="AddContentType"
              />
            </div>
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Description
            </label>
            <textarea
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              rows="4"
              onChange={(e) =>
                setIsForm({ ...isForm, description: e?.target?.value })
              }
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Location
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              onChange={(e) =>
                setIsForm({ ...isForm, location: e?.target?.value })
              }
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Website
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              onChange={(e) =>
                setIsForm({ ...isForm, website_url: e?.target?.value })
              }
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Phone
            </label>
            <input
              type="number"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              onChange={(e) =>
                setIsForm({ ...isForm, phone: e?.target?.value })
              }
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Email
            </label>
            <input
              type="email"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              onChange={(e) =>
                setIsForm({ ...isForm, email: e?.target?.value })
              }
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Opening hours
            </label>

            <input
              type="time"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              onChange={(e) => setSelectedTime(e?.target?.valueAsDate)}
            />
            {/* <textarea
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              rows="4"
              onChange={(e) => setIsForm({ ...isForm, opening_hours: new Date(e?.target?.value).getTime() })}
            /> */}
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
              onClick={onCreate}
              disabled={loading}
            >
              {loading ? (
                <div className="flex flex-row items-center gap-2 w-full justify-center">
                  <BiLoaderAlt className="h-5 w-5 animate-spin-slow" />
                  <span className="font-semibold text-sm">Proccessing</span>
                </div>
              ) : (
                <span className="text-base capitalize w-full ">Upload</span>
              )}
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
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
            />
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label htmlFor="contentType" className="font-bold text-base ">
              Content Type
            </label>
            <div className="flex flex-col gap-2">
              <DefaultSelect
                value={radioValue}
                setValue={setRadioValue}
                options={options}
                isMulti={false}
                isValueOnly={false}
                instanceId="EditContentType"
              />
            </div>
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Description
            </label>
            <textarea
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              rows="4"
              value={isForm?.description || ""}
              onChange={(e) =>
                setIsForm({ ...isForm, description: e?.target?.value })
              }
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
              onChange={(e) =>
                setIsForm({ ...isForm, location: e?.target?.value })
              }
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Website
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              value={isForm?.website_url || ""}
              onChange={(e) =>
                setIsForm({ ...isForm, website_url: e?.target?.value })
              }
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Phone
            </label>
            <input
              type="number"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              value={isForm?.phone || ""}
              onChange={(e) =>
                setIsForm({ ...isForm, phone: e?.target?.value })
              }
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Email
            </label>
            <input
              type="email"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              value={isForm?.email || ""}
              onChange={(e) =>
                setIsForm({ ...isForm, email: e?.target?.value })
              }
            />
          </div>

          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Opening hours
            </label>
            <input
              type="time"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              onChange={(e) => setSelectedTime(e?.target?.value)}
              value={selectedTime || ""}
            />
          </div>

          <div className="w-full mb-10">
            <label className="font-bold text-base"> Gallery </label>
            <UploaderBox files={fileSelected} setFiles={setFileSelected} />
          </div>

          <div className="w-2/3 mx-auto flex flex-row gap-3">
            <Button
              variant="danger"
              className="w-1/2 flex justify-center items-center"
              onClick={onDelete}
            >
              <span className="text-base capitalize w-full">Delete</span>
            </Button>
            <Button
              variant="primary"
              className="w-1/2 flex justify-center items-center"
              onClick={onUpdate}
            >
              <span className="text-base capitalize w-full "> Save </span>
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
