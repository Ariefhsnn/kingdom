import React, { useCallback, useRef, useState } from "react";
import { SearchIcon, XIcon } from "@heroicons/react/solid";

export const GlobalFilter = ({ filter, setFilter, placeholder }) => {
  const [value, setValue] = useState("");
  let inputRef = useRef();

  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFilter(value);
    // setValue("");
  }

  const handleDeleteSearch = useCallback(() => {
    inputRef.current.value = "";
    setValue(inputRef.current.value);
    setFilter(inputRef.current.value);
  }, []);

  // console.log(value, 'value')

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex my-auto items-center relative w-full mr-6 text-gray-500 focus-within:text-purple-300"
      >
        <SearchIcon className="absolute cursor-pointer left-2 top-2 w-5 h-5" />
        <input
          className="block w-full text-sm focus:outline-none dark:text-gray-300 leading-5 focus:ring-4 ring-purple-100 dark:border-gray-600 focus:shadow-outline-purple dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700 border border-gray-200 py-2 rounded-md pl-8 pr-4 text-gray-700"
          placeholder={placeholder || "Search..."}
          type="text"
          value={value || ""}
          onChange={handleChange}
          ref={inputRef}
          id="search"
        />
        {filter && (
          <XIcon
            onClick={handleDeleteSearch}
            className="absolute cursor-pointer right-[4.5rem] top-2 w-5 h-5"
          />
        )}
      </form>
    </div>
  );
};
