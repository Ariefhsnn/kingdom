import * as Icons from "react-icons/md";

import React, { Children, useEffect } from "react";

import { useState } from "react";

function Icon({ icon, ...props }) {
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

const TaskTab = ({ value, setValue, options, children }) => {
  const handleTabs = (val) => {
    setValue(val);
  };

  return (
    <div className="w-full mx-auto py-2 flex flex-col md:flex-row justify-start">
      <div
        className={`md:border-b-1 flex md:flex-row overflow-x-auto scrollbar-none md:bg-transparent transform transition-all duration-300 scale-100
        `}
      >
        {options?.map((opt, idx) => {
          return (
            <button
              key={idx}
              onClick={(e) => handleTabs(opt?.name)}
              className={`mx-2 flex items-center capitalize
                                    ${
                                      value == opt?.name
                                        ? "border-purple-500 text-primary-500 font-bold mb-3 md:mb-0"
                                        : "text-gray-500 hover:text-gray-700 border-transparent font-bold"
                                    } block text-sm border-b-4 focus:outline-none whitespace-no-wrap`}
            >
              {opt?.name}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export default TaskTab;
