import React, { useEffect, useState } from "react";

import Select from "react-select";

export default function DefaultSelect(props) {
  const {
    value,
    setValue,
    options,
    placeholder,
    isValueOnly,
    setData,
    isMulti,
    instanceId,
  } = props;
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if(options.length > 0){
      const defaultValues = () => {
        let res = options?.filter(function (opt, i) {
          return opt?.value === value;
        });
        setSelected(res);
      };
      defaultValues();
    }    
  }, [value]);

  const onChange = (e) => {
    if (setData) {
      setData(e);

      setValue(e?.value || e);
      setSelected(e?.value);
    } else {
      setSelected(e?.value);
      setValue(e?.value || e);
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
      defaultValue={value || selected}
      instanceId={instanceId || "id"}
    />
  );
}
