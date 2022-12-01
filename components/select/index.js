import React, { useEffect, useState } from "react";

import Select from "react-select";

export default function DefaultSelect(props) {
  const { value, setValue, options, placeholder, isValueOnly, isMulti } = props;
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const defaultValues = () => {
      let res = options?.filter(function (opt, i) {
        return opt?.value === value;
      });
      setSelected(res);
    };
    defaultValues();
  }, [value]);

  const onChange = (e) => {
    if (isValueOnly) {
      setSelected(e);
      setValue(e?.value || e);
    } else {
      setSelected(e);
      setValue(e);
    }
  };

  return (
    <Select
      components={{ DropdownIndicator: null }}
      value={selected}
      onChange={onChange}
      isMulti={isMulti}
      options={options}
      styles={{ padding: 20 }}
      defaultValue={value}
    />
  );
}
