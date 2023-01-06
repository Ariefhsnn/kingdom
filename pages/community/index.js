import { MdEdit, MdOutlineDelete } from "react-icons/md";
import React, { useEffect, useMemo, useState } from "react";
import { dateToString, toastify } from "../../utils/useFunction";

import { AiOutlineEdit } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import Button from "../../components/button";
import DefaultSelect from "../../components/select";
import { GlobalFilter } from "../../components/table/components/GlobalFilter";
import Layouts from "../../components/Layouts";
import Modal from "../../components/modal/Modal";
import Navbar from "../../components/navbar";
import Table from "../../components/table";
import TaskTab from "../../components/button/TaskTab";
import UploaderBox from "../../components/button/UploaderBox";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useRouter } from "next/router";

export default function Index(props) {
  let { token } = props;
  const router = useRouter();
  const { pathname, query } = router;

  const [sidebar, setSidebar] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userOpt, setUserOpt] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
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
  const [meta, setMeta] = useState(null);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [removed, setRemoved] = useState(null);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [editOpt, setEditOpt] = useState('');
 
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  const Menus = [
    {
      name: "Active",
    },
    {
      name: "Inactive",
    },
  ];

  const openModalAdd = () => {
    setIsShowAdd(true);
  };

  const closeModalAdd = () => {
    setIsShowAdd(false);
    setFileSelected([]);
    setSelectedUser([]);
    setVal([]);
  };

  const openModalEdit = (items) => {
    setIsForm(items);
    setIsShowEdit(true);
    setSelectedUser(items?.admins);
    let filter = userOpt.filter((e) => {
      return !items?.admins?.some((element) => {
          return e.id == element.id;
      });
  });
    setEditOpt(filter);    
  };

  const closeModalEdit = () => {
    setIsShowEdit(false);
    setIsForm({});
    setSelectedUser(null);
    setRemoved(null);
    setEditOpt(userOpt);
  };

  // const getUser = async () => {
  //   await axios
  //     .get("v1/user", config)
  //     .then((response) => {
  //       setUserData(response?.data?.data);
  //     })
  //     .catch((err) => toastify(err?.message, "error"));
  // };

  useEffect(() => {
    if (!isForm?.name || !isForm?.description || fileSelected.length == 0) {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  }, [isForm, fileSelected]);

  const getGroup = async () => {
    setLoading(true);
    if (tab && isSearch) {
      config = {
        ...config,
        params: {
          is_active: tab == "Active" ? 1 : 0,
          q: isSearch,
        },
      };
    } else if (tab) {
      config = {
        ...config,
        params: {
          is_active: tab == "Active" ? 1 : 0,
        },
      };
    }

    axios
      .get("v1/group", config)
      .then(function (response) {
        setDataTable(response?.data?.data);
        setOldData(response?.data?.data);
        setMeta(response?.data?.meta);
        setLoading(false);
      })
      .catch((err) => {
        setDataTable([]);
        setOldData([]);
        setLoading(false);
        if (err?.status !== 404) {
          toastify(err?.message, "error");
        }
      });
  };

  const getUserByType = async () => {
    let configs = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios
      .post(
        "v1/user/get-by-membertype",
        {
          member_type: "BUSINESS",
        },

        configs
      )
      .then((res) => setUserData(res?.data?.data))
      .catch((err) => console.log(err, "err"));
  };

  useEffect(() => {
    getGroup();

    getUserByType();
  }, []);

  useEffect(() => {
    getGroup();
  }, [tab]);

  useEffect(() => {}, [isForm]);

  const onDelete = async () => {
    await setLoadingDelete(true);

    await axios
      .delete(`v1/group/${isForm?.id}`, config)
      .then((res) => {
        toastify(res?.data?.message, "success");
        getGroup();
        setLoadingDelete(false);
        closeModalEdit();
      })
      .catch((err) => {
        toastify(err?.message, "error");
        setLoadingDelete(false);
      });
  };

  const onCreate = async () => {
    setLoading(true);
    let userItems = [];
    let imgObj = {
      type: fileSelected[0]?.type,
      size: fileSelected[0]?.size,
      path: fileSelected[0]?.path,
    };
    let items = new FormData();
    if (selectedUser?.length > 0) {
      selectedUser.forEach((e) =>
        userItems.push({ user_id: e?.user_id, is_admin: 1 })
      );
      items.append("admins", JSON.stringify(userItems));
    }
    items.append("name", isForm?.name);
    items.append("description", isForm?.description);
    items.append("icon", fileSelected[0]);
    items.append("photos", fileSelected[0]);

    await axios
      .post("v1/group", items, config)
      .then((res) => {
        toastify(res?.data?.message, "success");
        getGroup();
        setLoading(false);
        closeModalAdd();
      })
      .catch((err) => {
        toastify(err?.message, "error");
        setLoading(false);
      });
  };

  const onUpdate = async () => {
    await setLoading(true);

    const deletedAdmins = removed === null ? [] : removed;

    let items = new FormData();
    let userItems = [];
    await selectedUser.forEach((e) =>
    {
      console.log(e, 'isi data');
      userItems.push({ user_id: e?.id || e?.user_id, is_admin: 1 })
    }
    );
    console.log(userItems, 'data user')
    await items.append("name", isForm?.name);
    await items.append("description", isForm?.description);
    await items.append("new_admins", JSON.stringify(userItems));
    await items.append("deleted_admins", JSON.stringify(deletedAdmins));
    if (fileSelected.length > 0) {
      // await items.append("new_photos", fileSelected[0]);
      await items.append("new_icon", fileSelected[0]);
    }

    await axios
      .put(`v1/group/${isForm?.id}`, items, config)
      .then((res) => {
        toastify(res?.data?.message, "success");
        getGroup();
        setLoading(false);
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

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = yyyy + "" + mm + "" + dd;

    await setLoadingExport(true);
    await axios({
      url: "v1/export/group",
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
        link.setAttribute("download", `export-group-${formattedToday}.csv`);
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
    if (dataTable?.length > 0) {
      setTotal(dataTable?.length);
      // setPageCount(2);
    }
  }, [dataTable]);

  const Columns = [
    {
      Header: "Name",
      Footer: "Group name",
      accessor: "name",
    },
    {
      Header: "ID",
      Footer: "Group ID",
      accessor: "id",
    },
    {
      Header: "Total Member",
      Footer: "Members",
      accessor: "members",
      Cell: ({ value }) => {
        return <span> {value?.length} </span>;
      },
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


  const onSelectUser = (e, isEdit) => {
    let user = isEdit ? editOpt.filter((element) => element.id == e) : userOpt.filter((element) => element.id == e);
    let filter = isEdit ? editOpt.filter((element) => element?.id != e) : userOpt.filter((element) => element?.id != e);
    isEdit ? setEditOpt(filter) : setUserOpt(filter);
    
    console.log(user, "user");
    if (selectedUser?.length > 0) {
      setSelectedUser([
        ...selectedUser,
        {
          name: user[0]?.first_name,
          label: user[0]?.first_name + " " + user[0]?.last_name,
          first_name: user[0]?.first_name,
          last_name: user[0]?.last_name,
          user_id: user[0]?.id,
          is_admin: 1,
        },
      ]);
    } else {
      setSelectedUser([
        {
          name: user[0]?.first_name,
          label: user[0]?.first_name + " " + user[0]?.last_name,
          first_name: user[0]?.first_name,
          last_name: user[0]?.last_name,
          user_id: user[0]?.id,
          is_admin: 1,
        },
      ]);
    }
  };

  useEffect(() => {
    let data = [];
    if (userData.length > 0) {
      userData.forEach((e) => {
        data.push({
          ...e,
          value: e?.id,
          label: e?.first_name + " " + e?.last_name,
        });
      });
      setUserOpt(data);
    }
  }, [userData]);

  const onRemoveAdmin = (val, isEdit) => {
    if (!isEdit) {
      let filteredSelectedUser = selectedUser.filter(
        (e) => e?.user_id != val?.user_id
      );
      setUserOpt([...userOpt, val]);
      setSelectedUser(filteredSelectedUser);
    } else {
      let filteredSelectedUser = selectedUser.filter((e) => e?.id != val?.id);
      let removedUser = selectedUser.filter((e) => e?.id == val?.id);
      setEditOpt([...editOpt, {...val, label: val?.first_name + ' ' + val?.last_name }]);

      setSelectedUser(filteredSelectedUser);
      if (removed != null) {
        setRemoved([...removed, removedUser[0]?.id]);
      } else {
        setRemoved([removedUser[0]?.id]);
      }
    }
  };

  useEffect(() => {
    // let qr = {
    //   page: Number(query?.page) || 1,
    //   limit: Number(query?.limit) || 10,
    // };
    getGroup();
    // if (isSearch) {
    //   let qr = { q: isSearch || query?.q };
    //   router.replace({ pathname, query: qr });
    // }f
  }, [isSearch]);

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
          <div className="w-full md:w-40 my-5">
            <Button
              variant="outlineGreen"
              onClick={openModalAdd}
              className="flex justify-center"
            >
              <span className="flex justify-center"> Create Group</span>
            </Button>
          </div>
          <span className="text-lg font-semibold">
            Groups ({dataTable?.length})
          </span>
          <TaskTab options={Menus} value={tab} setValue={setTab}>
            <div className="md:ml-10 w-full md:w-[80%] flex flex-col md:flex-row justify-between items-center gap-2">
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
                      <span className=" font-semibold text-sm">
                        Proccessing
                      </span>
                    </div>
                  ) : (
                    <span className="text-base w-full ">Export as .csv</span>
                  )}
                </Button>
              </div>
            </div>
          </TaskTab>
          <div className="w-full">
            <Table
              loading={loading}
              setLoading={setLoading}
              Columns={Columns}
              items={dataTable}
              setIsSelected={setIsSelected}
              totalPages={pageCount}
              total={dataTable.length}
              setPages={meta?.page}
            />
          </div>
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
              Name
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
            />
          </div>
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="groupDescription" className="font-bold text-base">
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

          <div className="w-full mb-5">
            <label className="font-bold text-base"> Icon </label>
            <UploaderBox files={fileSelected} setFiles={setFileSelected} />
          </div>

          {selectedUser?.length > 0 ? (
            <div className="w-full flex flex-col gap-2 max-h-40 overflow-auto mb-3">
              {selectedUser?.map((e, idx) => (
                <div
                  className="bg-gray-50 py-2 px-4 rounded-md text-gray-500 text-sm flex items-center justify-between"
                  key={idx}
                >
                  <span className="font-bold"> {e.label} </span>
                  <Button onClick={() => onRemoveAdmin(e, false)}>
                    <MdOutlineDelete className="w-5 h-5 text-gray-500 hover:text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <span className="italic font-bold text-sm text-gray-500">
              No admin selected
            </span>
          )}

          <div className="w-full mb-5">
            <label className="font-bold text-base">Admin</label>
            <DefaultSelect
              value={val}
              setValue={(e) => onSelectUser(e)}
              isMulti={false}
              options={userOpt}
            />
            {val?.length > 0 ? (
              <div className="flex flex-col">
                {val?.map((element, idx) => (
                  <div className="bg-gray-50 rounded p-2 mt-2" key={idx}>
                    <span className="text-gray-500">{element?.name}</span>
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
              disabled={disabledBtn || loading}
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
              Name
            </label>
            <input
              type="text"
              className="bg-gray-50 rounded w-full outline-none border-none focus:shadow-md focus:px-4 p-2 duration-500 text-gray-500"
              value={isForm?.name || ""}
              onChange={(e) => setIsForm({ ...isForm, name: e?.target?.value })}
            />
          </div>
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="groupDescription" className="font-bold text-base">
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

          <div className="w-full mb-5">
            <label className="font-bold text-base"> Group icon </label>
            <UploaderBox
              files={fileSelected}
              setFiles={setFileSelected}
              preview={isForm?.icon}
            />
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Creation Date </label>
            <span className="text-gray-500 text-base font-semibold">
              {dateToString(isForm?.created_at)}
            </span>
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <span className="font-bold text-base">Total Member</span>
            <p className="">{isForm?.members?.length} </p>
          </div>

          <div className="w-full mb-5 flex flex-col gap-1">
            <label className="font-bold text-base"> Admins </label>
            {selectedUser?.length > 0 ? (
              selectedUser?.map((e, idx) => (
                <div
                  className="bg-gray-100 py-2 px-4 rounded-md text-gray-500 text-base font-semibold flex flex-row justify-between"
                  key={idx}
                >
                  <span> {console.log(e, 'list user')} {e?.first_name + " " + e?.last_name || e?.label} </span>
                  <button onClick={() => onRemoveAdmin(e, true)}>
                    <MdOutlineDelete className="h-5 w-5 hover:text-red-500" />
                  </button>
                </div>
              ))
            ) : (
              <>
                <span className="text-gray-500 italic w-full text-center text-sm font-bold">
                  No Admin Selected
                </span>
              </>
            )}
            <DefaultSelect
              value={val}
              setValue={(e) => onSelectUser(e, true)}
              isMulti={false}
              options={editOpt}
            />
          </div>

          {/* <div className="w-full mb-5">
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
          </div> */}

          {/* <div className="w-full mb-10 flex flex-col gap-2">
            <label className="font-bold text-base">Admin</label>
            {isForm?.gallery?.length > 0 ? (
              <span> {isForm?.gallery} </span>
            ) : (
              <span className="italic text-gray-500 font-bold text-sm text-center">
                
                No photos found
              </span>
            )}
          </div> */}

          <div className="w-full mx-auto flex flex-row gap-3">
            <Button
              variant="danger"
              className="w-1/2 flex justify-center items-center"
              onClick={onDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <div className="flex  flex-row items-center gap-2 w-full justify-center">
                  <BiLoaderAlt className="h-5 w-5 animate-spin-slow" />
                  <span className=" font-semibold text-sm">Proccessing</span>
                </div>
              ) : (
                <span className="text-base capitalize w-full">
                  Delete
                </span>
              )}
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
