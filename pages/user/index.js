import React, { useEffect, useMemo, useState } from "react";
import { dateToString, toastify } from "../../utils/useFunction";

import { AiOutlineEdit } from "react-icons/ai";
import Button from "../../components/button";
import DefaultSelect from "../../components/select";
import { GlobalFilter } from "../../components/table/components/GlobalFilter";
import Layouts from "../../components/Layouts";
import Modal from "../../components/modal/Modal";
import Navbar from "../../components/navbar";
import Table from "../../components/table";
import axios from "axios";
import { getCookie } from "../../utils/cookie";

const Index = (props) => {
  let { token, userId } = props;
  const [sidebar, setSidebar] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [oldData, setOldData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState("");
  const [tab, setTab] = useState("Tab");
  const [isSearch, setIsSearch] = useState("");

  const [val, setVal] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [isForm, setIsForm] = useState(null);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  // =====> MODAL CONFIG <=====
  const openModalEdit = (items) => {
    console.log(items, "data");
    setIsForm(items);
    setIsShow(true);
    setVal(items?.member_type);
  };

  const closeModalEdit = () => {
    setIsShow(false);
    setVal(null);
    setIsForm(null);
  };

  // =====> API'S CONSUMING <=====
  const getUser = async () => {
    if (isSearch) {
      config = {
        ...config,
        params: {
          q: isSearch,
        },
      };
    }
    await axios
      .get("v1/user", config)
      .then((response) => {
        setDataTable(response?.data?.data);
        setOldData(response?.data?.data);
        setTotal(response?.data?.data?.length);
      })
      .catch((err) => toastify(err?.message, "error"));
  };

  const onUpdate = async () => {
    await setLoading(true);
    let items = { id: isForm?.id, member_type: val };

    await axios
      .put(`v1/user/member-type/update`, items, config)
      .then((res) => {
        toastify(res?.data?.message, "success");
        getUser();
        setLoading(false);
        closeModalEdit();
      })
      .catch((err) => toastify(err?.message, "error"));
  };

  const onDelete = async () => {
    await setLoading(true);
    await axios
      .delete(`v1/user/${isForm?.id}`, config)
      .then((res) => {
        toastify(res?.data?.message, "success");
        getUser();
        setLoading(false);
        closeModalEdit();
      })
      .catch((err) => {
        toastify(err?.message, "error");
      });
  };

  const onExport = async () => {
    let date = new Date();
    await setLoadingExport(true);
    await axios({
      url: "v1/export/user",
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
        link.setAttribute("download", `User-${date}.csv`);
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
    getUser();
  }, []);

  useEffect(() => {
    getUser();
  }, [isSearch]);

  // =====> FILTERING <=====
  const filteredItem = useMemo(() => {
    setDataTable(oldData);
    if (isSearch?.length >= 3) {
      return dataTable.filter(
        (e) => e?.username.toLowerCase().indexOf(isSearch.toLowerCase()) !== -1
      );
    } else {
      setDataTable(oldData);
      return dataTable;
    }
  }, [isSearch, dataTable]);

  const options = [
    { id: 1, value: "STANDARD", label: "Standard" },
    { id: 2, value: "BUSINESS", label: "Business" },
  ];

  // =====> TABLE <=====
  const Columns = [
    {
      Header: "User name",
      Footer: "User name",
      accessor: "username",
    },
    {
      Header: "User ID",
      Footer: "User ID",
      accessor: "id",
    },
    {
      Header: "Join date",
      Footer: "Join date",
      accessor: "created_at",
      Cell: ({ value }) => {
        return <span> {dateToString(value)} </span>;
      },
    },
    {
      Header: "Member type",
      Footer: "Member type",
      accessor: "member_type",
      Cell: ({ value }) => {
        return <p className="capitalize">{value ? value : "-"}</p>;
      },
    },
    {
      Header: "Action",
      Footer: "Action",
      accessor: "",
      Cell: ({ row }) => {
        return (
          <button onClick={() => openModalEdit(row?.original)}>
            <AiOutlineEdit className="h-8 w-8 text-sky-400" />
          </button>
        );
      },
    },
  ];

  return (
    <>
      <Navbar sidebar={sidebar} setSidebar={setSidebar} />
      <Layouts
        title="User Management"
        description="User Management"
        sidebar={sidebar}
        setSidebar={setSidebar}
      >
        <main className="container w-full flex flex-col text-primary-500 px-5 md:px-0">
          <span className="tracking-wider text-2xl font-bold mb-10">
            User Management
          </span>
          <span className="text-lg font-semibold"> Users ({total}) </span>

          <div className="w-full md:w-[90%] flex justify-between items-center mt-5">
            <div className="w-60">
              <GlobalFilter
                preFilteredRows={dataTable}
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
                onClick={onExport}
              >
                Export as .csv
              </Button>
            </div>
          </div>

          {tab == "Tab" ? (
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

      <Modal
        isOpen={isShow}
        closeModal={closeModalEdit}
        title="Edit User's Role"
        sizes="small"
      >
        <div className="px-10 pb-10 text-gray-700">
          <div className="w-full flex flex-col mb-5">
            <label htmlFor="role"> User Role </label>
            <DefaultSelect
              value={val}
              setValue={setVal}
              isMulti={false}
              options={options}
              isValueOnly={true}
            />
          </div>
          <div className="w-full mx-auto flex flex-row gap-3">
            <Button
              variant="danger"
              className="w-1/2 flex justify-center items-center"
              onClick={onDelete}
            >
              <span className="text-base capitalize w-full"> Delete User </span>
            </Button>
            <Button
              variant="primary"
              className="w-1/2 flex justify-center items-center"
              onClick={onUpdate}
              disabled={val != null ? false : true}
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
