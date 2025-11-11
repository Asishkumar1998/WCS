// src/components/forms/FormLayout.tsx
"use client";

import React, { useEffect } from "react";
import {
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchFormsSharedData } from "@/app/store/features/formsSlice";
import FormStepper from "@/components/ui/Stepper/FormStepper";
import { Country } from "@/types";
import { DocType } from "../Dropdown/DocumentDropdown";

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
  country?: Country;
  document?: DocType | null;
}

const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  children,
  country,
  document,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const sharedFormData = useSelector((state: RootState) => state.formsData);

  useEffect(() => {
    if (
      !sharedFormData.countries.length ||
      !sharedFormData.documentTypes.length
    ) {
      dispatch(fetchFormsSharedData());
    }
  }, [dispatch, sharedFormData]);

  return (
    <Paper sx={{ height: "100%", border: "1px solid #e0e0e0", py: 1.5, px: 3 }}>
      <Typography
        color="primary.main"
        variant="h5"
        sx={{ mb: 1, fontWeight: 600 }}
      >
        {title}
      </Typography>

      <Divider sx={{ mb: 2.5 }} />

      <Grid container spacing={2}>
        {children}

        {/* Buttons */}
        <Grid
          size={{ xs: 12 }}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
            mb: 3,
          }}
        >
          <Button variant="outlined" color="primary">
            Add to cart
          </Button>
          <Button variant="contained" color="primary">
            Proceed to cart
          </Button>
        </Grid>
      </Grid>

      {country?.countryId === 144 && document ? (
        <FormControl
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "1px solid #C7C9CD",
              },
              "&:hover fieldset": {
                border: "1px solid #C7C9CD",
              },
              "&.Mui-focused fieldset": {
                border: "1px solid #C7C9CD",
              },
            },
          }}
        >
          <InputLabel shrink>Order Timeline</InputLabel>
          <OutlinedInput
            notched
            label={"Order Timeline"}
            inputComponent={() => (
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  borderRadius: "8px",
                  width: "100%",
                }}
              >
                <FormStepper
                  steps={[
                    { label: "New" },
                    { label: "DOS" },
                    { label: "DC EMB" },
                    { label: "Customer" },
                  ]}
                  activeStep={0}
                />
              </Box>
            )}
          />
        </FormControl>
      ) : country?.countryId === 2 && document ? (
        <FormControl
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "1px solid #C7C9CD",
              },
              "&:hover fieldset": {
                border: "1px solid #C7C9CD",
              },
              "&.Mui-focused fieldset": {
                border: "1px solid #C7C9CD",
              },
            },
          }}
        >
          <InputLabel shrink>Order Timeline</InputLabel>
          <OutlinedInput
            notched
            label={"Order Timeline"}
            inputComponent={() => (
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  borderRadius: "8px",
                  width: "100%",
                }}
              >
                <FormStepper
                  steps={[
                    { label: "New" },
                    { label: "SOS" },
                    { label: "Customer" },
                  ]}
                  activeStep={0}
                />
              </Box>
            )}
          />
        </FormControl>
      ) : null}
    </Paper>
  );
};

export default FormLayout;
