import React, { useEffect, useMemo, useState } from "react";
import { dateToString, toastify } from "../../../utils/useFunction";

import { AiOutlineEdit } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import Button from "../../../components/button";
import { GlobalFilter } from "../../../components/table/components/GlobalFilter";
import Layouts from "../../../components/Layouts";
import Link from "next/link";
import { MdDeleteOutline } from "react-icons/md";
import Modal from "../../../components/modal/Modal";
import Navbar from "../../../components/navbar";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import Table from "../../../components/table";
import TaskTab from "../../../components/button/TaskTab";
import UploaderBox from "../../../components/button/UploaderBox";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";
import items from "../../../utils/json/discoverUploads.json";

export default function Index(props) {
  let { token, userId } = props;
  const [sidebar, setSidebar] = useState(false);

  const [videoData, setVideoData] = useState([]);

  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [tab, setTab] = useState(null);
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
  const [initialType, setInitialType] = useState(null);
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
    setRadioValue(items?.type);
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setIsForm({});
    setRadioValue("");
    setFileSelected([]);
  };

  const getDiscover = async () => {
    setLoading(true);
    try {
      axios
        .get("v1/discover")
        .then(function (response) {
          setDiscoverType(response?.data?.data);
        })
        .catch((err) => {
          toastify(err?.response?.data?.message, "error");
          setDataTable([]);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getDiscoverContent = async () => {
    if (tab) {
      config = {
        ...config,
        params: {
          content_type: tab.toUpperCase(),
        },
      };
    }

    try {
      axios
        .get(
          "https://kingdom-api-dev.gbempower.asia/v1/discover-content",
          config
        )
        .then(function (response) {
          setDataTable(response?.data?.data);
          setOldData(response?.data?.data);
          setInitialType(response?.data?.data[0]?.discover?.content_type);
        })
        .catch((err) => {
          toastify(err?.response?.data?.message, "error");
          setDataTable([]);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   getDiscover();
  //   getDiscoverContent();
  // }, []);

  useEffect(() => {
    getDiscover();
    getDiscoverContent();
  }, [tab]);

  useEffect(() => {
    let MenuData = [];
    if (discoverType) {
      discoverType.forEach((element) => {
        MenuData.push({
          name: element?.content_type,
          id: element?.id,
          type: element.content_type,
        });
        console.log("discover", element?.content_type);
      });
    }
    setMenus(MenuData);
  }, [discoverType]);

  useEffect(() => {
    if (initialType) {
      setTab(initialType);
    }
    console.log(initialType, "init");
  }, [initialType]);

  useEffect(() => {
    if (radioValue) {
      let filterData = menus.filter((e) => e?.id == radioValue);
      setContentType(filterData);
    }
  }, [radioValue]);

  // useEffect(() => {
  //   if (imgData?.length > 0) imgData.forEach((e) => (e["type"] = "image"));
  //   if (videoData?.length > 0) videoData.forEach((e) => (e["type"] = "video"));
  //   if (boData?.length > 0) boData.forEach((e) => (e["type"] = "business"));
  //   if (newsData?.length > 0) newsData.forEach((e) => (e["type"] = "news"));
  // }, [imgData, videoData, boData, newsData]);

  // useEffect(() => {
  //   if (items?.length > 0) {
  //     setImgData(items.filter((e) => e?.type == "image"));
  //     setVideoData(items.filter((e) => e?.type == "video"));
  //     setBoData(items.filter((e) => e?.type == "business"));
  //     setNewsData(items.filter((e) => e?.type == "news"));
  //   } else {
  //     setImgData([]);
  //     setBoData([]);
  //     setVideoData([]);
  //     setNewsData([]);
  //   }
  // }, [items]);

  // useEffect(() => {
  //   if (
  //     imgData.length > 0 ||
  //     videoData?.length > 0 ||
  //     boData?.length > 0 ||
  //     newsData?.length > 0
  //   ) {
  //     tab == "Image"
  //       ? setTotal(imgData?.length)
  //       : tab == "Video"
  //       ? setTotal(videoData.length)
  //       : tab == "Business opportunities"
  //       ? setTotal(boData.length)
  //       : setTotal(newsData.length);
  //   }
  // }, [tab, imgData, boData, newsData, videoData]);

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

  useEffect(() => {
    console.log(12, fileSelected);
  }, [fileSelected]);

  useEffect(() => {
    console.log(val);
  }, [val]);

  const videoForm = () => {
    return (
      <div className="w-full flex flex-col mb-5">
        <label className="font-bold text-base"> Video Link </label>
        <input
          type="text"
          className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
          value={isForm?.link || ""}
          onChange={(e) => setIsForm({ ...isForm, link: e?.target?.value })}
        />
      </div>
    );
  };

  const imageForm = (isEdit) => {
    return (
      <div className="w-full flex flex-col mb-5">
        <label className="font-bold text-base"> Upload image </label>
        <UploaderBox files={fileSelected} setFiles={setFileSelected} />
        {isForm?.media_url?.length > 0 ? (
          <div className="w-full bg-gray-50 py-2 px-5 rounded-md items-center flex justify-between mt-5">
            <img src={isForm?.media_url} className="h-[60px] w-[60px]" />
            <div>
              <MdDeleteOutline className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        ) : (
          <span className="my-3 text-center font-bold italic text-sm">
            {isEdit ? "No image found" : null}
          </span>
        )}
      </div>
    );
  };

  const otherForm = (isEdit) => {
    return (
      <div className="w-full flex flex-col mb-5">
        <label className="font-bold text-base">
          Upload cover image {radioValue == "business" ? "(optional)" : ""}
        </label>
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
    if (contentType[0]?.type == "IMAGE") {
      items.append("photos", fileSelected[0], `${fileSelected[0].path}`);
    } else if (contentType[0]?.type == "VIDEO") {
      items.append("video_link", isForm?.link);
    }
    items.append("title", isForm?.title);
    items.append("discover_id", Number(radioValue));
    items.append("description", "desc");

    try {
      const res = await axios.post(
        "https://kingdom-api-dev.gbempower.asia/v1/discover-content",
        items,
        config
      );
      let { status, data } = res;
      if (status == 200 || status == 201) {
        await toast("Data succesfully added!");
        await getDiscoverContent();
        await closeModalAdd();
      }
    } catch (error) {
      console.log(error?.response);
    }
  };

  const onDelete = async () => {
    await setLoading(true);
    try {
      const res = await axios.delete(
        `v1/discover-content/${isForm?.id}`,
        config
      );
      let { data, status } = res;
      if (status == 204 || status == 200) {
        await toastify(data?.message, "success");
        await getDiscover();
        await getDiscoverContent();
        await setLoading(false);
        await closeModalEdit();
      } else {
        throw data;
      }
    } catch (error) {
      // let { data, status } = await error?.response;
      // toastify(data?.message, "error");
    }
  };

  const filteredItem = useMemo(() => {
    if (dataTable?.length > 0) {
      setDataTable(oldData);
      if (isSearch?.length >= 3) {
        return dataTable.filter(
          (e) => e?.title.toLowerCase().indexOf(isSearch.toLowerCase()) !== -1
        );
      } else {
        setDataTable(oldData);
        return dataTable;
      }
    } else {
      return [];
    }
  }, [isSearch, dataTable]);

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
            Discover / Upload
          </span>
          <span className="text-lg font-semibold"> Create </span>
          <div className="w-40 my-5">
            <Button
              variant="outlineGreen"
              onClick={openModalAdd}
              className="flex justify-center"
            >
              <span className="flex justify-center"> Upload Content</span>
            </Button>
          </div>
          <span className="text-lg font-semibold">
            Content ({dataTable?.length})
          </span>
          <TaskTab options={menus} value={tab} setValue={setTab}>
            <div className="md:ml-10 w-full md:w-[50%] flex justify-between items-center">
              <div className="w-60">
                <GlobalFilter
                  preFilteredRows={dataTable}
                  filter={isSearch}
                  setFilter={setIsSearch}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
            </div>
          </TaskTab>
          {tab == "Image" ? (
            <div className="w-full">
              <Table
                loading={loading}
                setLoading={setLoading}
                Columns={Columns}
                items={filteredItem}
                // setIsSelected={setIsSelected}
                // totalPages={pageCount}
                // total={total}
                // setPages={pageCount}
              />
            </div>
          ) : tab == "Video" ? (
            <div className="w-full">
              <Table
                loading={loading}
                setLoading={setLoading}
                Columns={Columns}
                items={filteredItem}
                setIsSelected={setIsSelected}
                totalPages={pageCount}
                total={total}
                setPages={pageCount}
              />
            </div>
          ) : tab == "Business opportunities" ? (
            <div className="w-full">
              <Table
                loading={loading}
                setLoading={setLoading}
                Columns={Columns}
                items={filteredItem}
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
                items={filteredItem}
                setIsSelected={setIsSelected}
                totalPages={pageCount}
                total={total}
                setPages={pageCount}
              />
            </div>
          )}
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
              Content title
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
                      {/* <div className="flex gap-2 items-center">
                        <input
                          type="radio"
                          value="video"
                          id="video"
                          name="contentType"
                          className="text-gray-500 w-4 h-4 "
                          checked={radioValue === "video"}
                          onChange={(e) => setRadioValue(e?.target?.value)}
                        />
                        <label
                          htmlFor="video"
                          className="font-semibold cursor-pointer"
                        >
                          Video
                        </label>
                      </div> */}
                    </React.Fragment>
                  ))}
                </>
              ) : null}
            </div>
          </div>

          {contentType && (
            <div className="w-full">
              {contentType[0]?.type == "IMAGE"
                ? imageForm(false)
                : contentType[0]?.type == "VIDEO"
                ? videoForm()
                : contentType[0]?.type == "BUSSINES" ||
                  contentType[0]?.type == "NEWS"
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
        title="Edit content"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="tabName" className="font-bold text-base">
              Content title
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

          <div className="w-full mb-5 flex flex-col ">
            <label htmlFor="contentType" className="font-bold text-base ">
              Content Type
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="image"
                  id="image"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "image"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label htmlFor="image" className="font-semibold cursor-pointer">
                  Image
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="video"
                  id="video"
                  name="contentType"
                  className="text-gray-500 w-4 h-4 "
                  checked={radioValue === "video"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label htmlFor="video" className="font-semibold cursor-pointer">
                  Video
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="business"
                  id="BusinessOpportunities"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "business"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="BusinessOpportunities"
                  className="font-semibold cursor-pointer"
                >
                  Business opportunities
                </label>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  value="news"
                  id="latestNews"
                  name="contentType"
                  className="text-gray-500 w-4 h-4"
                  checked={radioValue === "news"}
                  onChange={(e) => setRadioValue(e?.target?.value)}
                />
                <label
                  htmlFor="latestNews"
                  className="font-semibold cursor-pointer"
                >
                  Latest news
                </label>
              </div>
            </div>
          </div>

          <div className="w-full mb-5 flex flex-col ">
            <label className="font-bold text-base"> Creation Date </label>
            <span className="text-gray-500 text-base font-semibold">
              {dateToString(isForm?.created_at)}
            </span>
          </div>

          <div className="w-full">
            {radioValue == "image"
              ? imageForm(true)
              : radioValue == "video"
              ? videoForm()
              : otherForm(true)}
          </div>

          <div className="w-full mx-auto flex flex-row gap-3">
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
            >
              <span className="text-base capitalize w-full "> Save </span>
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
