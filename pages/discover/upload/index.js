import React, { useEffect, useState } from "react";

import { AiOutlineEdit } from "react-icons/ai";
import Button from "../../../components/button";
import { GlobalFilter } from "../../../components/table/components/GlobalFilter";
import Layouts from "../../../components/Layouts";
import Link from "next/link";
import Modal from "../../../components/modal/Modal";
import Navbar from "../../../components/navbar";
import Table from "../../../components/table";
import TaskTab from "../../../components/button/TaskTab";
import UploaderBox from "../../../components/button/UploaderBox";
import items from "../../../utils/json/discoverUploads.json";

const index = () => {
  const [sidebar, setSidebar] = useState(false);
  const [imgData, setImgData] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [boData, setBoData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [tab, setTab] = useState("Image");
  const [isSearch, setIsSearch] = useState("");
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [fileSelected, setFileSelected] = useState([]);
  const [val, setVal] = useState([]);
  const [radioValue, setRadioValue] = useState("");
  const [isForm, setIsForm] = useState({});

  const Menus = [
    {
      name: "Image",
    },
    {
      name: "Video",
    },
    {
      name: "Business opportunities",
    },
    {
      name: "Latest news",
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
    setRadioValue(items?.type);
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setIsForm({});
    setRadioValue("");
    setFileSelected([]);
  };

  useEffect(() => {
    if (items?.length > 0) {
      setImgData(items.filter((e) => e?.type == "image"));
      setVideoData(items.filter((e) => e?.type == "video"));
      setBoData(items.filter((e) => e?.type == "business"));
      setNewsData(items.filter((e) => e?.type == "news"));
    } else {
      setImgData([]);
      setBoData([]);
      setVideoData([]);
      setNewsData([]);
    }
  }, [items]);

  useEffect(() => {
    if (items.length > 0) {
      let filterImg = items.filter((e) => e.type == "image").length;
      let filterVideo = items.filter((e) => e.type == "video").length;
      let filterBo = items.filter((e) => e.type == "business").length;
      let filterNews = items.filter((e) => e.type == "news").length;
      tab == "Image"
        ? setTotal(filterImg)
        : tab == "Video"
        ? setTotal(filterVideo)
        : tab == "Business opportunities"
        ? setTotal(filterBo)
        : setTotal(filterNews);
    }
  }, [tab, items]);

  const Columns = [
    {
      Header: "Title",
      Footer: "Title",
      accessor: "title",
    },
    {
      Header: "Link",
      Footer: "Link",
      accessor: "link",
      Cell: ({ value }) => {
        return (
          <span>
            {value.length > 50 ? value.substring(50, 0) + "..." : value}
          </span>
        );
      },
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
        {isForm?.images?.length > 0 ? (
          <span> {isForm?.images} </span>
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
            value={isForm?.description}
            onChange={(e) =>
              setIsForm({ ...isForm, description: e?.target?.value })
            }
          />
        </div>
      </div>
    );
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
            Content ({items?.length})
          </span>
          <TaskTab options={Menus} value={tab} setValue={setTab}>
            <div className="md:ml-10 w-full md:w-[50%] flex justify-between items-center">
              <div className="w-60">
                <GlobalFilter
                  preFilteredRows={tab == "Tab" ? dataTable : null}
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
                items={imgData}
                setIsSelected={setIsSelected}
                totalPages={pageCount}
                total={total}
                setPages={pageCount}
              />
            </div>
          ) : tab == "Video" ? (
            <div className="w-full">
              <Table
                loading={loading}
                setLoading={setLoading}
                Columns={Columns}
                items={videoData}
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
                items={boData}
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
                items={newsData}
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

          <div className="w-full">
            {radioValue == "image"
              ? imageForm(false)
              : radioValue == "video"
              ? videoForm()
              : radioValue == "business" || radioValue == "news"
              ? otherForm(false)
              : null}
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
              {isForm?.creationDate}
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
              onClick={closeModalEdit}
            >
              <span className="text-base capitalize w-full">
                Delete content
              </span>
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
};

export default index;
