import { MdEdit, MdOutlineDelete } from "react-icons/md";
import React, { useEffect, useMemo, useState } from "react";

import { AiOutlineEdit } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import Button from "../../components/button";
import DefaultSelect from "../../components/select";
import { GlobalFilter } from "../../components/table/components/GlobalFilter";
import Group from "../../utils/json/groups.json";
import Layouts from "../../components/Layouts";
import Modal from "../../components/modal/Modal";
import Navbar from "../../components/navbar";
import Table from "../../components/table";
import TaskTab from "../../components/button/TaskTab";
import UploaderBox from "../../components/button/UploaderBox";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { toast } from "react-hot-toast";

export default function Index(props) {
  let { token } = props;
  const [sidebar, setSidebar] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [oldData, setOldData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [tab, setTab] = useState("Active");
  const [isSearch, setIsSearch] = useState(null);
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [fileSelected, setFileSelected] = useState([]);
  const [isForm, setIsForm] = useState({});
  const [opt, setOpt] = useState([]);
  const [val, setVal] = useState([]);

  const Menus = [
    {
      name: "Active",
    },
    {
      name: "Inactive",
    },
  ];

  const openToast = () => {
    toast.success("heeloo");
  };

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
    // console.log("items", items);
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setIsForm({});
  };

  const getGroup = async () => {
    try {
      axios
        .get("http://157.230.35.148:9005/v1/group")
        .then(function (response) {
          console.log(response?.data?.data)
          setDataTable(response?.data?.data);
          setOldData(response?.data?.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroup();
  }, []);

  useEffect(() => {
    console.log(1, isForm)
  }, [isForm])

  useEffect(() => {    
      setDataTable(oldData);
      let filteredUser = dataTable.filter(
        (e) => e?.name.toLowerCase().indexOf(isSearch.toLowerCase()) !== -1
      );
      setDataTable(filteredUser);
    
  }, [isSearch]);

  const filteredItem = useMemo(() => {
    setDataTable(oldData);
    if (isSearch?.length >= 3) {
      return dataTable.filter(
        (e) => e?.name.toLowerCase().indexOf(isSearch.toLowerCase()) !== -1
      );
    } else {
      setDataTable(oldData);
      return dataTable;
    }
  }, [isSearch]);

  const dateToString = (date) => {
    return new Date(date).toDateString();
  };

  const onDelete = async() => {
    await setLoading(true);
    try{
      const res = await axios.delete(`http://157.230.35.148:9005/v1/group/${isForm?.id}`);
      let {data, status} = res
      if(status == 204 || status == 200){
        await toast.success('Deleted successfully');
        await getGroup()
        await setLoading(false)
        await closeModalEdit();
      }else{
        throw data;
      }
    }catch(error){
      let {data, status} = error?.response;
      toast.error(data)
    }
  }

  const onCreate = async () => {
    setLoading(true);
    let items = new FormData()
    items.append('name', isForm?.name);
    items.append('description', isForm?.description)
    items.append("photos", fileSelected[0], `${fileSelected[0].path}`);
    
    try {
      const res = await axios.post(
        "http://157.230.35.148:9005/v1/group",
        items
      );
      let { data, status } = res;
      console.log(res);
      if (status == 200 || status == 201) {
        console.log(data);
        await toast("Created successfully");
        await getGroup();
        await setLoading(false);
        await closeModalAdd();
      }
    } catch (error) {
      let { data } = error?.response;
      console.log(data);
    }
  };

  const onUpdate = async () => {
    await setLoading(true);
    let items = new FormData()
    items.append('name', isForm?.name);
    items.append('description', isForm?.description)
    items.append("new_photos", fileSelected[0], `${fileSelected[0].path}`);

    // console.log(fileSelected[0].path)
    
    try {
      const res = await axios.put(
        `http://157.230.35.148:9005/v1/group/${isForm?.id}`,
        items
      );
      let { data, status } = res;
      console.log(res);
      if (status == 200 || status == 201) {
        console.log(data);
        await toast("Updated successfully");
        await getGroup();
        await setLoading(false);
        await closeModalAdd();
      }
    } catch (error) {
      let { data } = error?.response;
      console.log(data);
    }
  };

  useEffect(() => {
    if (dataTable?.length > 0) {
      setTotal(dataTable?.length);
      // setPageCount(2);
    }
  }, [dataTable]);

  const Columns = [
    {
      Header: "Group name",
      Footer: "Group name",
      accessor: "name",
    },
    {
      Header: "Group ID",
      Footer: "Group ID",
      accessor: "id",
    },
    {
      Header: "Members",
      Footer: "Members",
      accessor: "members",
      Cell: ({value}) => {
        return <span> {value?.length} </span>
      }
    },
    {
      Header: "Creation date",
      Footer: "Creation date",
      accessor: "created_at",
      Cell: ({ value }) => {
        return <span> {dateToString(value)}</span>;
      },
    },
    // {
    //   Header: "Terminate",
    //   Footer: "Terminate",
    //   accessor: "Terminate",
    // },
    {
      Header: "Action",
      Footer: "Action",
      accessor: "",
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

  const onSelectUser = (e) => {
    setVal([{ ...val, name: e?.groupName, id: e?.id }]);
  };

  return (
    <>
      <Navbar sidebar={sidebar} setSidebar={setSidebar} />
      <Layouts
        title="Community"
        description="community"
        sidebar={sidebar}
        setSidebar={setSidebar}
      >
        <main className="container w-full flex flex-col text-primary-500 px-5 md:px-0">
          <span className="tracking-wider text-2xl font-bold mb-10">
            Community / Group
          </span>
          <span className="text-lg font-semibold"> Create </span>
          <div className="w-40 my-5">
            <Button
              variant="outlineGreen"
              onClick={openModalAdd}
              className="flex justify-center"
            >
              <span className="flex justify-center"> Create Group</span>
            </Button>
          </div>
          <span className="text-lg font-semibold">
            {" "}
            Groups ({dataTable?.length})
          </span>
          <TaskTab options={Menus} value={tab} setValue={setTab}>
            <div className="md:ml-10 w-full md:w-[80%] flex justify-between items-center">
              <div className="w-60">
                <GlobalFilter
                  preFilteredRows={tab == "Active" ? dataTable : null}
                  filter={isSearch}
                  setFilter={setIsSearch}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
              <div className="w-40">
                <Button
                  variant="outlineBlue"
                  className="flex justify-center"
                  onClick={openToast}
                >
                  Export as .xlsx
                </Button>
              </div>
            </div>
          </TaskTab>
          {tab == "Active" ? (
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
          ) : null}
        </main>
      </Layouts>

      {/* Create group */}
      <Modal
        isOpen={isShowAdd}
        closeModal={closeModalAdd}
        title="Create Group"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="groupName" className="font-bold text-base">
              Group name
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
            />
          </div>
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="groupDescription" className="font-bold text-base">
              Group description
            </label>
            <textarea
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              rows="4"
              onChange={(e) =>
                setIsForm({ ...isForm, description: e?.target?.value })
              }
            />
          </div>

          <div className="w-full mb-5">
            <label className="font-bold text-base"> Group icon </label>
            <UploaderBox files={fileSelected} setFiles={setFileSelected} />
          </div>

          <div className="w-full mb-5">
            <label className="font-bold text-base">Admin</label>
            <DefaultSelect
              value={val}
              onChange={(e) => onSelectUser(e)}
              isMulti={false}
              options={opt}
            />
            {val?.length > 0 ? (
              <div className="flex flex-col">
                {val?.map((element) => (
                  <div className="bg-gray-50 rounded p-2 mt-2" key={element?.name}>
                    <span className="text-gray-500" >
                      {element?.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
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
                    {" "}
                    Proccessing{" "}
                  </span>
                </div>
              ) : (
                <span className="text-base capitalize w-full "> Create </span>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit group */}
      <Modal
        isOpen={isShowEdit}
        closeModal={closeModalEdit}
        title="Edit Group"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="groupName" className="font-bold text-base">
              Group name
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              value={isForm?.name || ''}
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
            />
          </div>
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="groupDescription" className="font-bold text-base">
              Group description
            </label>
            <textarea
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              rows="4"
              value={isForm?.description || ''}
              onChange={(e) =>
                setIsForm({ ...isForm, description: e?.target?.value })
              }
            />
          </div>

          <div className="w-full mb-5">
            <label className="font-bold text-base"> Group icon </label>
            <UploaderBox files={fileSelected} setFiles={setFileSelected} />
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Creation Date </label>
            <span className="text-gray-500 text-base font-semibold">
              {" "}
              {dateToString(isForm?.created_at)}{" "}
            </span>
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Members </label>
            {isForm?.members?.length > 0 ? isForm?.members?.map((e) => (
              <div className="bg-gray-100 py-2 px-4 rounded-md text-gray-500 text-base font-semibold flex flex-row justify-between" key={e?.id}>
               <span> {e?.first_name} </span>
               <button>
               <MdOutlineDelete className="h-5 w-5 hover:text-red-500" />
               </button>
            </div>
            )):(
              <>
            <span className="text-gray-500 italic w-full text-center text-sm font-bold"> No members found </span>
              </>
            )}
            
          </div>

          <div className="w-full mb-5">
            <label className="font-bold text-base">Admin</label>
            <DefaultSelect
              value={val}
              onChange={(e) => onSelectUser(e)}
              isMulti={false}
              options={opt}
            />
            {val?.length > 0 ? (
              <div className="flex flex-col">
                {val?.map((element) => (
                  <div className="bg-gray-50 rounded p-2 mt-2" key={element?.name}>
                    <span className="text-gray-500" >
                      {element?.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="w-full mb-10 flex flex-col gap-2">
            <label className="font-bold text-base">Admin</label>
            {isForm?.gallery?.length > 0 ? (
              <span> {isForm?.gallery} </span>
            ) : (
              <span className="italic text-gray-500 font-bold text-sm text-center">
                {" "}
                No photos found{" "}
              </span>
            )}
          </div>

          <div className="w-full mx-auto flex flex-row gap-3">
            <Button
              variant="danger"
              className="w-1/2 flex justify-center items-center"
              onClick={onDelete}
            >
              <span className="text-base capitalize w-full">
                {" "}
                Delete Gorup{" "}
              </span>
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
}

export async function getServerSideProps(context) {
  const token = getCookie("token", context.req);

  if (!token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { token },
  };
}