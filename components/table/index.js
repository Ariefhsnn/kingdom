import { MdChevronLeft, MdChevronRight } from "react-icons/md";
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useTable,
} from "react-table";

import Button from "../button";
import { ColumnFilter } from "./components/ColumnFilter";
import { GlobalFilter } from "./components/GlobalFilter";
import { useRouter } from "next/router";

const Table = ({ items, Columns, loading, setLoading, totalPages, total }) => {
  let router = useRouter();
  let { pathname, query } = router;
  const [activePage, setActivePage] = useState(1);
  const defaultColumn = useMemo(
    () => ({
      Filter: ColumnFilter,
    }),
    []
  );

  const dataTable = useMemo(() => items, [items]);

  const columnsTable = useMemo(
    () =>
      loading
        ? Columns.map((column) => ({
            ...column,
            Cell: () => {
              return (
                <div className="px-1 py-3 animate-pulse flex items-center justify-center">
                  <div className="h-2 w-20 bg-gray-200 rounded"></div>
                </div>
              );
            },
          }))
        : Columns,
    [Columns, loading]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    prepareRow,
    visibleColumns,
    // Filter
    setGlobalFilter,
    preGlobalFilteredRows,
    // Page
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = useTable(
    {
      columns: columnsTable,
      data: dataTable,
      defaultColumn,
      initialState: { pageIndex: 0, pageCount: totalPages },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  // Custom Pagination
  const filterPages = useCallback((visiblePages, totalPages) => {
    // console.log(visiblePages, "filter pages", totalPages)
    return visiblePages.filter((page) => page <= totalPages);
  }, []);

  const getVisiblePages = useCallback(
    (page, total) => {
      // console.log(page, "visible", total)
      if (total < 7) {
        return filterPages([1, 2, 3, 4, 5, 6], total);
      } else {
        if (page % 5 >= 0 && page > 4 && page + 2 < total) {
          return [1, page - 1, page, page + 1, total];
        } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
          return [1, total - 3, total - 2, total - 1, total];
        } else {
          return [1, 2, 3, 4, 5, total];
        }
      }
    },
    [filterPages]
  );

  const [visiblePages, setVisiblePages] = useState(
    getVisiblePages(query?.page - 1, totalPages)
  );

  const changePage = useCallback(
    (p) => {
      setLoading(true);

      if (p === Number(router?.page) + 1) {
        return;
      }
      const vps = getVisiblePages(p, totalPages);
      setVisiblePages(filterPages(vps, totalPages));
      if (p)
        router.replace({
          pathname,
          query: {
            ...query,
            page: p,
          },
        });
      // console.log(p, 'arg p')
    },
    [totalPages]
  );

  const doublePrev = useCallback(() => {
    changePage(1);
  }, [totalPages]);

  const doubleNext = useCallback(() => {
    changePage(totalPages);
  }, [totalPages]);

  useEffect(() => {
    changePage();
  }, [changePage]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);

  useEffect(() => {
    if (query?.page) {
      setActivePage(Number(query?.page));
    } else {
      setActivePage(1);
    }
  }, [query]);

  useEffect(() => {
    if (query?.limit) {
      setPageSize(Number(query?.limit));
    } else {
      setPageSize(10);
    }
  }, [query]);

  // useEffect(() => {
  //     if (total <= query?.limit) router?.replace({
  //         pathname,
  //         query: {
  //             ...query,
  //             page: 1
  //         }
  //     })
  // }, [total])

  return (
    <div className="grid grid-cols-1">
      <div className="col-span-1 overflow-x-auto rounded-lg text-primary-500">
        <table
          {...getTableProps()}
          className="w-[95%] overflow-hidden rounded-xl"
        >
          <thead className="text-left divide-y dark:divide-gray-700 text-sm font-semibold tracking-wide text-gray-500  border-b border-gray-50 rounded-lg ">
            {headerGroups.map((headerGroup, idx) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-4 py-6"
                    key={i}
                  >
                    {column.render("Header")}
                    {/* {column.canFilter ? <div>{column.render('Filter')}</div> : null} */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody
            {...getTableBodyProps()}
            className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs"
          >
            {page.map((row, idx) => {
              prepareRow(row);
              // console.log(row, 'data')
              return (
                <tr {...row.getRowProps()} key={idx}>
                  {row.cells.map((cell, i) => {
                    // console.log(cell.row.values, "cek")
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="px-4 py-4 font-semibold text-base"
                        key={i}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th
                // className='border-t'
                colSpan={visibleColumns.length}
              >
                <div className="py-4 px-4 my-4 w-full flex flex-row justify-between items-center leading-relaxed">
                  <div className="flex flex-row items-center text-xs">
                    {page.length >= 1 ? (
                      <>
                        <select
                          className="focus:outline-none bg-transparent text-gray-500"
                          value={query?.limit}
                          onChange={
                            // (e) => setLimit(Number(e.target.value))
                            (e) =>
                              router.replace({
                                pathname,
                                query: {
                                  ...query,
                                  limit: e.target.value,
                                },
                              })
                          }
                        >
                          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(
                            (limit) => (
                              <option key={limit} value={limit}>
                                Show {limit}
                              </option>
                            )
                          )}
                        </select>
                      </>
                    ) : (
                      <div className="mr-10 text-sm">
                        Search : data tidak ditemukan...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs font-bold">
                      Page {activePage} - {totalPages} of{" "}
                      {`${total} ${total > 1 ? "items" : "item"}`}
                    </span>
                    <div className="">
                      <Button
                        variant="outline-none"
                        className={"p-2"}
                        onClick={() => {
                          if (activePage === 1) return;
                          changePage(activePage - 1);
                        }}
                        disabled={activePage === 1}
                      >
                        <MdChevronLeft className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex text-gray-500 text-xs">
                      {visiblePages.map((p, index, array) => {
                        return (
                          <button
                            key={p}
                            className={`focus:outline-none p-1 flex justify-center items-center text-center w-7 rounded border-1 mx-1 ${
                              activePage === p
                                ? "border-green-300  bg-green-100 text-green-300 font-bold"
                                : "border-gray-300 bg-white"
                            }`}
                            onClick={() => changePage(p)}
                          >
                            {array[index - 1] + 2 < p ? `${p}` : p}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-end items-center">
                      <div className="">
                        <Button
                          variant="outline-none"
                          className={"p-2"}
                          onClick={() => {
                            if (activePage === totalPages) return;
                            changePage(activePage + 1);
                          }}
                          disabled={activePage === totalPages}
                        >
                          <MdChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Table;
