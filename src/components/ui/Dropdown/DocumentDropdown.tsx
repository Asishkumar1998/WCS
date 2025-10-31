"use client";

import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { Country } from "@/types";

export interface DocType {
  docTypeId: number;
  docTypeName: string;
  docCategoryId: number;
  personalDoc: number;
  physicalRequired: number;
  createdBy: any;
  createdAt: number;
  modifiedBy: any;
  modifiedAt: number;
  ordSequence: any;
  attachmentRequired: any;
}

interface BaseDropdownProps {
  label: string;
  country: Country;
  multiple?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  disabled?: boolean; // ✅ new prop
}

interface SingleDropdownProps extends BaseDropdownProps {
  multiple?: false;
  value: DocType | null;
  onChange: (value: DocType | null) => void;
}

interface MultiDropdownProps extends BaseDropdownProps {
  multiple: true;
  value: DocType[];
  onChange: (value: DocType[]) => void;
}

type DropdownProps = SingleDropdownProps | MultiDropdownProps;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const DocumentDropdown: React.FC<DropdownProps> = ({
  label,
  country,
  value,
  onChange,
  multiple = false,
  open,
  onOpen,
  onClose,
  disabled = false, // default false
}) => {
  const { documentTypes } = useSelector((state: RootState) => state.formsData);
  const [filteredDocs, setFilteredDocs] = useState<DocType[]>([]);

  const handleChange = (_: any, newValue: any) => {
    // Close dropdown asynchronously to prevent MUI focus conflicts
    if (open && onClose) {
      setTimeout(() => onClose(), 0);
    }

    if (disabled) return; // prevent changes when disabled

    multiple
      ? (onChange as (v: DocType[]) => void)(newValue as DocType[])
      : (onChange as (v: DocType | null) => void)(newValue as DocType);
  };

  useEffect(() => {
    if (!country) {
      setFilteredDocs(documentTypes);
    } else if (country.isShipping === 0) {
      setFilteredDocs(documentTypes.filter((doc) => doc.docCategoryId !== 523));
    } else {
      setFilteredDocs(documentTypes);
    }
  }, [documentTypes, country]);

  return (
    <FormControl fullWidth>
      <Autocomplete
        multiple={multiple}
        options={filteredDocs}
        getOptionLabel={(option) => option.docTypeName}
        value={value as any}
        onChange={handleChange}
        open={open}
        onOpen={disabled ? undefined : onOpen}
        onClose={disabled ? undefined : onClose}
        disabled={disabled} // disables the input and prevents opening
        renderOption={(props, option, { selected }) =>
          multiple ? (
            <li {...props} key={option.docTypeId}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                disabled={disabled} // disables checkbox selection
              />
              <ListItemText primary={option.docTypeName} />
            </li>
          ) : (
            <li {...props} key={option.docTypeId}>
              {option.docTypeName}
            </li>
          )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            disabled={disabled}
          />
        )}
        disableClearable={!multiple}
        disableCloseOnSelect={multiple}
        openOnFocus
        ListboxProps={{ style: { maxHeight: 320 } }}
      />
    </FormControl>
  );
};

export default DocumentDropdown;
