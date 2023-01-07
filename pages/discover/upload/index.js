import React, { useEffect, useMemo, useState } from "react";
import { dateToString, toastify } from "../../../utils/useFunction";

import { AiOutlineEdit } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import Button from "../../../components/button";
import AllSelect from "../../../components/select/AllSelect";
import { GlobalFilter } from "../../../components/table/components/GlobalFilter";
import Layouts from "../../../components/Layouts";
import { MdDeleteOutline } from "react-icons/md";
import Modal from "../../../components/modal/Modal";
import Navbar from "../../../components/navbar";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import Table from "../../../components/table";
import UploaderBox from "../../../components/button/UploaderBox";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";
import { useRouter } from "next/router";
import { upperCaseToCapitalize } from "../../../utils/useFunction";

export default function Index(props) {
  let { token, userId } = props;
  const [sidebar, setSidebar] = useState(false);
  const router = useRouter();

  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [isSearch, setIsSearch] = useState("");
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [fileSelected, setFileSelected] = useState([]);
  const [val, setVal] = useState([]);
  const [radioValue, setRadioValue] = useState("");
  const [isForm, setIsForm] = useState({});
  const [discoverType, setDiscoverType] = useState(null);
  const [menus, setMenus] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [oldData, setOldData] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [options, setOptions] = useState([]);
  const [tabValue, setTabValue] = useState(null);
  const [type, setType] = useState(null);
  const [loadingExport, setLoadingExport] = useState(false);
  
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  const openModalAdd = () => {
    setIsShowAdd(true);
  };

  const closeModalAdd = () => {
    setIsShowAdd(false);
    setFileSelected([]);
    setIsForm({});
    setVal([]);
  };

  const openModalEdit = (items) => {
    setIsForm(items);
    setIsShowEdit(true);
    setRadioValue(items?.discover_id);
    setPreview(items?.photos[0]?.file_url);
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setIsForm({});
    setRadioValue("");
    setFileSelected([]);
  };

  const getDiscover = async () => {
    setLoading(true);
    let temp = [];
    try {
      axios
        .get("v1/discover")
        .then(function (response) {
          setDiscoverType(response?.data?.data);
          setLoading(false);
          response?.data?.data.forEach((e) => {
            temp.push({ ...e, label: e?.name, value: e?.name });
          });
          setOptions(temp);
        })
        .catch((err) => {
          toastify(err?.response?.data?.message, "error");
          setDataTable([]);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getDiscoverContent = async () => {
    setLoading(true);

    if (isSearch) {
      config = {
        ...config,
        params: { q: isSearch },
      };
    }

    await axios
      .get("https://kingdom-api-dev.gbempower.asia/v1/discover-content", config)
      .then(function (response) {
        setDataTable(response?.data?.data);
        setOldData(response?.data?.data);
      })
      .catch((err) => {
        toastify(err?.message, "error");
        setDataTable([]);
      });
    setLoading(false);
  };

  useEffect(() => {
    getDiscover();
    getDiscoverContent();
  }, [token]);

  useEffect(() => {
    getDiscover();
    getDiscoverContent();
  }, [isSearch]);

  useEffect(() => {
    console.log(isSearch, "isSearch");
  }, [isSearch]);

  const filters = useMemo(() => {
    if(tabValue){
      let filterByName = oldData.filter((data) => data.discover.name == tabValue.name);
      if(filterByName.length > 0)
      console.log(filterByName, 'filterByName')
      return filterByName;
    }else{
      return oldData;
    }    
  }, [tabValue, isSearch, dataTable]);

  useEffect(() => {
    if (options.length > 0) {
      // setTabValue(options[0]);   
      // setType(options[0].content_type)
    } 
  }, [options]);

  useEffect(() => {
    let MenuData = [];
    if (discoverType) {
      discoverType.forEach((element) => {
        MenuData.push({
          name: element?.content_type,
          id: element?.id,
          type: element.content_type,
        });
      });
    }
    setMenus(MenuData);
  }, [discoverType]);

  useEffect(() => {
    if (radioValue) {
      let filterData = menus.filter((e) => e?.id == radioValue);
      setContentType(filterData);
    }
  }, [radioValue]);

  const onExport = async () => {
    let date = new Date();
    await setLoadingExport(true);
    await axios({
      url: "v1/export/discover-content",
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
        link.setAttribute("download", `Discover-Content-${date}.csv`);
        document.body.appendChild(link);
        link.click();
        setLoadingExport(false);
      })
      .catch((err) => {
        toastify(err?.message, "error");
        setLoadingExport(false);
      });
  };

  const Columns = [
    {
      Header: "Title",
      Footer: "Title",
      accessor: "title",
      Cell: ({ row, value }) => {
        return (
          <span
            className={`${
              !value ? "text-sm font-normal italic text-gray-500" : ""
            }`}
          >
            {" "}
            {!value ? "empty" : value}{" "}
          </span>
        );
      },
    },
    // {
    //   Header: "Link",
    //   Footer: "Link",
    //   accessor: "media_url",
    //   Cell: ({ value }) => {
    //     return (
    //       <span>
    //         {value?.length > 50 ? value?.substring(50, 0) + "..." : value}
    //         {/* {value} */}
    //       </span>
    //     );
    //   },
    // },
    {
      Header: "Creation date",
      Footer: "Creation date",
      accessor: "created_at",
      Cell: ({ value }) => {
        return <span> {dateToString(value)} </span>;
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

  const videoForm = (isEdit) => {
    return (
      <div className="w-full flex flex-col mb-5">
        <label className="font-bold text-base"> Video Link </label>
        <input
          type="text"
          className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
          value={isForm?.video_link || ""}
          onChange={(e) =>
            setIsForm({ ...isForm, video_link: e?.target?.value })
          }
        />
      </div>
    );
  };

  const imageForm = (isEdit) => {
    return (
      <div className="w-full flex flex-col mb-5">
        <label className="font-bold text-base"> Upload image </label>
        {isEdit ? (
          <UploaderBox
            files={fileSelected}
            setFiles={setFileSelected}
            preview={preview}
          />
        ) : (
          <UploaderBox files={fileSelected} setFiles={setFileSelected} />
        )}
        {isForm?.media_url?.length > 0 ? (
          <div className="w-full bg-gray-50 py-2 px-5 rounded-md items-center flex justify-between mt-5">
            <img src={isForm?.media_url} className="h-[60px] w-[60px]" />
            <div>
              <MdDeleteOutline className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const otherForm = (isEdit) => {
    return (
      <div className="w-full flex flex-col mb-5">
        <label className="font-bold text-base">Upload cover image</label>
        <UploaderBox files={fileSelected} setFiles={setFileSelected} />
        {isForm?.images?.length > 0 ? (
          <span> {isForm?.images} </span>
        ) : (
          <span className="my-3 text-center font-bold italic text-sm">
            {isEdit ? "No image found" : null}
          </span>
        )}
        <div className="w-full">
          <label className="font-bold text-base">
            {radioValue == "business" ? "Description" : "Content"}
          </label>
          <textarea
            className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
            rows="4"
            value={isForm?.content}
            onChange={(e) =>
              setIsForm({ ...isForm, content: e?.target?.value })
            }
          />
        </div>
      </div>
    );
  };

  const onUpload = async () => {
    await setLoading(true);
    let items = new FormData();
    if (type == "IMAGE") {
      items.append("photos", fileSelected[0]);
      items.append("description", "desc");
    } else if (type == "VIDEO") {
      items.append("video_link", isForm?.video_link);
      items.append("description", "desc");
    } else {
      items.append("photos", fileSelected[0]);
      items.append("description", isForm?.content);
    }
    items.append("title", isForm?.title);
    items.append("discover_id", Number(tabValue.id));

    await axios
      .post(
        "https://kingdom-api-dev.gbempower.asia/v1/discover-content",
        items,
        config
      )
      .then((res) => {
        toastify(res?.data?.message, "success");
        getDiscoverContent();
        closeModalAdd();
      })
      .catch((err) => {
        toastify(err?.message, "error");
      });
  };

  const onUpdate = async () => {
    await setLoading(true);
    let items = new FormData();
    if (contentType[0]?.type == "IMAGE") {
      if(fileSelected.length > 0) items.append("new_photos", fileSelected[0]);    
      items.append("description", "desc");
    } else if (contentType[0]?.type == "VIDEO") {
      items.append("video_link", isForm?.video_link);
      items.append("description", "desc");
    } else {
      items.append("new_photos", fileSelected[0]);
      items.append("description", isForm?.content);
    }
    items.append("title", isForm?.title);
    items.append("discover_id", Number(radioValue));

    await axios
      .put(
        `https://kingdom-api-dev.gbempower.asia/v1/discover-content/${isForm?.id}`,
        items,
        config
      )
      .then((res) => {
        toastify(res?.data?.message, "success");
        getDiscoverContent();
        closeModalAdd();
      })
      .catch((err) => {
        toastify(err?.message, "error");
      });
  };

  const onDelete = async () => {
    await setLoadingDelete(true);

    await axios
      .delete(`v1/discover-content/${isForm?.id}`, config)
      .then((res) => {
        toastify(res?.data?.message, "success");
        getDiscover();
        getDiscoverContent();
        setLoadingDelete(false);
        closeModalEdit();
      })
      .catch((err) => {
        toastify(err?.message, "error");

        setLoadingDelete(false);
      });
  };

  useEffect(() => {
    if(tabValue != null) setType(tabValue.content_type)
  }, [tabValue])

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
            Discover / Content
          </span>
          <span className="text-lg font-semibold"> Create </span>
          <div className="w-full md:w-40 my-5">
            <Button
              variant="outlineGreen"
              onClick={openModalAdd}
              className="flex justify-center"
              disabled={!type}
            >
              <span className="flex justify-center"> New Content</span>
            </Button>
          </div>
          <span className="text-lg font-semibold">
            Content ({dataTable?.length})
          </span>

          <div className="flex flex-col md:flex-row w-full gap-2">
            <div className="w-full md:w-[30%] ">
              <AllSelect
                value={tabValue}
                setValue={setTabValue}
                options={options}
                isMulti={false}
                instanceId="filterContentType"
              />
            </div>
            <div className="md:ml-10 w-full md:w-[60%] flex justify-between items-center flex-col md:flex-row">
              <div className="w-full md:w-60">
                <GlobalFilter
                  preFilteredRows={dataTable}
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
                    <span className="text-base w-full ">
                      Export as .csv
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
              items={filters}
              setIsSelected={setIsSelected}
              totalPages={pageCount}
              total={dataTable.length}
              setPages={pageCount}
            />
          </div>
        </main>
      </Layouts>

      {/* Modal Create */}
      <Modal
        isOpen={isShowAdd}
        closeModal={closeModalAdd}
        title="Upload Content"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Title
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              onChange={(e) =>
                setIsForm({ ...isForm, title: e?.target?.value })
              }
            />
          </div>

           <div className="w-full mb-5 flex flex-col ">
              <label htmlFor="contentType" className="font-bold text-base ">
                Content Type
              </label>
              <span >{upperCaseToCapitalize(type)}</span>
            </div>
            {/* <div className="flex flex-col gap-2"> 
              {menus && menus.length > 0 ? (
                <>
                  {menus.map((e) => (
                    <React.Fragment key={e?.id}>
                      <div className="flex gap-2 items-center" key={e?.id}>
                        <input
                          type="radio"
                          value={e?.id}
                          key={e?.id}
                          id={e?.id}
                          name="contentType"
                          className="text-gray-500 w-4 h-4"
                          checked={radioValue == e?.id}
                          onChange={(e) => setRadioValue(e?.target?.value)}
                        />
                        <label
                          htmlFor={e?.id}
                          className="font-semibold cursor-pointer"
                        >
                          {e?.name}
                        </label>
                      </div>
                    </React.Fragment>
                  ))}
                </>
              ) : null}
            </div>
          </div> */}

          {type && (
            <div className="w-full">
              {type == "IMAGE"
                ? imageForm(false)
                : type == "VIDEO"
                ? videoForm()
                : type == "ARTICLE" ||
                  type == "NEWS"
                ? otherForm(false)
                : null}
            </div>
          )}

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
              onClick={onUpload}
              disabled={loading}
            >
              {loading ? (
                <div className="flex flex-row items-center gap-2 w-full justify-center">
                  <BiLoaderAlt className="h-5 w-5 animate-spin-slow" />
                  <span className="text-white font-semibold text-sm">
                    {" "}
                    Proccessing{" "}
                  </span>
                </div>
              ) : (
                <span className="text-base capitalize w-full "> Upload </span>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isShowEdit}
        closeModal={closeModalEdit}
        title="Edit Content"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Title
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

          {/* <div className="w-full mb-5 flex flex-col ">
            <label htmlFor="contentType" className="font-bold text-base ">
              Content Type
            </label>
            <div className="flex flex-col gap-2">
              {menus && menus.length > 0 ? (
                <>
                  {menus.map((e) => (
                    <React.Fragment key={e?.id}>
                      <div className="flex gap-2 items-center" key={e?.id}>
                        <input
                          type="radio"
                          value={e?.id}
                          key={e?.id}
                          id={e?.id}
                          name="contentType"
                          className="text-gray-500 w-4 h-4"
                          checked={radioValue == e?.id}
                          onChange={(e) => setRadioValue(e?.target?.value)}
                        />
                        <label
                          htmlFor={e?.id}
                          className="font-semibold cursor-pointer"
                        >
                          {e?.name}
                        </label>
                      </div>
                    </React.Fragment>
                  ))}
                </>
              ) : null}
            </div>
          </div> */}

          {contentType && (
            <div className="w-full">
              {type == "IMAGE"
                ? imageForm(true)
                : type == "VIDEO"
                ? videoForm(true)
                : type == "ARTICLE" ||
                  type == "NEWS"
                ? otherForm(true)
                : null}
            </div>
          )}

          <div className="w-full mb-5 flex flex-col ">
            <label className="font-bold text-base"> Creation Date </label>
            <span className="text-gray-500 text-base font-semibold">
              {dateToString(isForm?.created_at)}
            </span>
          </div>

          <div className="w-full mx-auto flex flex-row gap-3">
            <Button
              variant="danger"
              className="w-1/2 flex justify-center items-center"
              onClick={onDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <div className="flex flex-row items-center gap-2 w-full justify-center">
                  <BiLoaderAlt className="h-5 w-5 animate-spin-slow" />
                  <span className=" font-semibold text-sm"> Proccessing </span>
                </div>
              ) : (
                <span className="text-base capitalize w-full">Delete</span>
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
                  <span className=" font-semibold text-sm"> Proccessing </span>
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
}

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
