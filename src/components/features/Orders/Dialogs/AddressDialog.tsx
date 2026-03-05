"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { addAddress, updateAddress } from "@/services/dashboardService";
import { getCountries } from "@/services/formsService";

type Address = {
  addressId?: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode?: string;
  zipcode?: string;
  number1?: string;
  countryId?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  customerId: number;
  address: Address | null;
  onSuccess: () => void;
};

export default function AddressDialog({
  open,
  onClose,
  customerId,
  address,
  onSuccess,
}: Props) {
  const isEdit = Boolean(address?.addressId);

  const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipcode: "",
    number1: "",
    countryId: "",
  });

  const [errors, setErrors] = useState({
    addressLine1: "",
    city: "",
    state: "",
    zipcode: "",
    number1: "",
    countryId: "",
  });

  const [countries, setCountries] = useState<any[]>([]);
  // const [countryError, setCountryError] = useState("");

  useEffect(() => {
    if (!open) return;

    const loadCountries = async () => {
      try {
        const response = await getCountries({ active: 1 });
        setCountries(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    };

    loadCountries();
  }, [open]);

  /** Populate form on EDIT */
  useEffect(() => {
    if (!open) return;
    if (address) {
      setForm({
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        city: address.city || "",
        state: address.state || "",
        zipcode: address.zipCode || address.zipcode || "",
        number1: address.number1 || "",
        countryId: address.countryId ? String(address.countryId) : "",
      });

      setErrors({
        addressLine1: "",
        city: "",
        state: "",
        zipcode: "",
        number1: "",
        countryId: "",
      });
    } else {
      setForm({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipcode: "",
        number1: "",
        countryId: "",
      });

      setErrors({
        addressLine1: "",
        city: "",
        state: "",
        zipcode: "",
        number1: "",
        countryId: "",
      });
    }
  }, [address, open]);

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({
        ...prev,
        [key]: "", // Clear error on change
      }));
    };

  // const handleSave = async () => {
  //   if (!form.countryId) {
  //     setCountryError("Country is required");
  //     return;
  //   }

  //   const payload = {
  //     addressId: address?.addressId,
  //     addressLine1: form.addressLine1,
  //     addressLine2: form.addressLine2,
  //     city: form.city,
  //     state: form.state,
  //     zipcode: form.zipcode,
  //     number1: form.number1,
  //     countryId: Number(form.countryId),
  //     referenceId: customerId,
  //   };

  //   try {
  //     if (isEdit && address?.addressId) {
  //       await updateAddress(address.addressId, payload);
  //     } else {
  //       await addAddress(payload);
  //     }

  //     onSuccess();
  //     onClose();
  //   } catch (err) {
  //     console.error("Address save failed", err);
  //   }
  // };

  const handleSave = async () => {
    const newErrors: any = {};

    if (!form.addressLine1)
      newErrors.addressLine1 = "Address Line 1 is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.zipcode) newErrors.zipcode = "Zip Code is required";
    if (!form.number1) newErrors.number1 = "Phone Number is required";
    if (!form.countryId) newErrors.countryId = "Country is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      addressId: address?.addressId,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2,
      city: form.city,
      state: form.state,
      zipcode: form.zipcode,
      number1: form.number1,
      countryId: Number(form.countryId),
      referenceId: customerId,
    };

    try {
      if (isEdit && address?.addressId) {
        await updateAddress(address.addressId, payload);
      } else {
        await addAddress(payload);
      }

      setForm({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipcode: "",
        number1: "",
        countryId: "",
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Address save failed", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* HEADER */}
      <DialogTitle
        sx={{
          bgcolor: "error.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEdit ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* BODY */}
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Address Line 1"
              value={form.addressLine1}
              onChange={handleChange("addressLine1")}
              error={Boolean(errors.addressLine1)}
              helperText={errors.addressLine1}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Address Line 2"
              value={form.addressLine2}
              onChange={handleChange("addressLine2")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="City"
              value={form.city}
              onChange={handleChange("city")}
              error={Boolean(errors.city)}
              helperText={errors.city}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="State"
              value={form.state}
              onChange={handleChange("state")}
              error={Boolean(errors.state)}
              helperText={errors.state}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Zip Code"
              value={form.zipcode}
              onChange={handleChange("zipcode")}
              error={Boolean(errors.zipcode)}
              helperText={errors.zipcode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Country"
              value={form.countryId}
              // error={Boolean(countryError)}
              // helperText={countryError}
              // onChange={(e) => {
              //   setForm((prev) => ({ ...prev, countryId: e.target.value }));
              //   setCountryError("");
              // }}
              error={Boolean(errors.countryId)}
              helperText={errors.countryId}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, countryId: e.target.value }));
                setErrors((prev) => ({ ...prev, countryId: "" }));
              }}
            >
              {countries.map((country: any) => (
                <MenuItem
                  key={country.countryId}
                  value={String(country.countryId)}
                >
                  {country.countryShortName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={form.number1}
              onChange={handleChange("number1")}
              error={Boolean(errors.number1)}
              helperText={errors.number1}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
