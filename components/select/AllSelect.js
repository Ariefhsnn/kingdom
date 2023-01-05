import React, { useEffect, useState } from "react";

import Select from "react-select";

export default function AllSelect(props) {
  const {
    value,
    setValue,
    options,
    placeholder,
    setData,
    isMulti,
    instanceId,
    defaultValue,
  } = props;
  const [selected, setSelected] = useState(null);

  const onChange = (e) => {
      setValue(e);
      setSelected(e);
  };

  return (
    <Select
      components={{ DropdownIndicator: null }}
      value={selected}
      onChange={onChange}
      isMulti={isMulti}
      options={options}
      styles={{ padding: 20 }}
      instanceId={instanceId || "id"}
    />
  );
}
