import React from "react";
import Select from "react-select";

export default function DefaultSelect(props) {
  const { value, onChange, options, placeholder, isMulti } = props;
  return (
    <Select
      components={{ DropdownIndicator: null }}
      value={value}
      onChange={onChange}
      isMulti={isMulti}
      options={options}
      styles={{ padding: 20 }}
    />
  );
}
