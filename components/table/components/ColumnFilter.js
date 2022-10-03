import React from "react";

export const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter, preFilteredRows } = column;
  const count = preFilteredRows.length;
  return (
    <input
      className="block w-full text-xs focus:outline-none dark:text-gray-300 leading-5 focus:ring-2 ring-green-500 dark:border-gray-600 focus:shadow-outline-purple dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700 border border-gray-200 py-0 my-1 rounded-sm px-4 text-gray-700"
      placeholder={`Search for ${count} records`}
      type="text"
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
    />
  );
};
