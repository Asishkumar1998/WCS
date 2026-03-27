"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import DateInput from "@/components/ui/Input/DateInput";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import {
  addVisaDocument,
  getLookup,
  getStates,
  postTranslationOrder,
  uploadVisaFile,
} from "@/services/formsService";
import dayjs, { Dayjs } from "dayjs";
import buildVisaPayload from "../Common/VisaPayload";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import validateVisaForm from "../Common/validateVisaForm";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderIdOfCart } from "@/services/cartServices";
import { deleteOrder } from "@/services/deleteService";
import { FileUploadBox } from "../Common/TranslationFileUpload";
import { getAuth } from "@/app/utils/auth";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";

const entries = ["Single Entry", "Double Entry", "Multiple Entry"];

type Lookup = {
  lookupId: number;
  lookupType: string;
  lookupCode: string;
  lookupName: string;
};

type Form = {
  applicantGivenName: string;
  lastName: string;
  passportNumber: string;
  typeOfPassport: number;
  typeOfVisa: number;
  passportValidity: Dayjs | null;
  NumberOfEntries: number | null;
  state: number;
  dateOfDeparture: Dayjs | null;
  originCountryOfPassPort: string;
  dateOfBirth: Dayjs | null;
  gender: string;
  placeOfBirth: string;
  passportIssuanceDate: Dayjs | null;
  isExpedited: boolean;
  expeditedDate: Dayjs | null;
  customerReference: string;
  additonalComments: string;
};

const initialForm: Form = {
  applicantGivenName: "",
  lastName: "",
  passportNumber: "",
  typeOfPassport: 0,
  typeOfVisa: 0,
  passportValidity: null,
  NumberOfEntries: null,
  state: 0,
  dateOfDeparture: null,
  originCountryOfPassPort: "",
  dateOfBirth: null,
  gender: "",
  placeOfBirth: "",
  passportIssuanceDate: null,
  isExpedited: false,
  expeditedDate: null,
  customerReference: "",
  additonalComments: "",
};

type StateType = {
  stateName: string;
  stateId: number;
};

export default function VisaServiceForm() {
  const [destinationCountry, setDestinationCountry] = useState<any>(null);
  const [visaType, setVisaType] = useState<Lookup[]>([]);
  const [passportType, setPassportType] = useState<Lookup[]>([]);
  const [selectedVisaType, setSelectedVisaType] = useState<{
    value: string;
    id: any;
  }>({ value: "", id: null });
  const [selectedPassportType, setSelectedPassportType] = useState<{
    value: string;
    id: any;
  }>({ value: "", id: null });
  const [selectedState, setSelectedState] = useState<{
    value: string;
    id: any;
  }>({ value: "", id: null });
  const [originCountry, setOriginCountry] = useState<any>(null);
  const [entryType, setEntryType] = useState("");
  const [form, setForm] = useState<Form>(initialForm);
  const [states, setStates] = useState<StateType[]>([]);
  const { showSnackbar } = useSnackbar();
  const [existingOrderId, setExistingOrderId] = useState<number | null>(null);
  const [showCartConflict, setShowCartConflict] = useState(false);
  const [uploadedDocumentId, setUploadedDocumentId] = useState();
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  const init = async () => {
    try {
      setLoader(true);
      setMessage("Checking for existing order");

      const visaResponse = await getLookup({ lookupType: "TypeOfVisa" });
      setVisaType(visaResponse);

      const passportResponse = await getLookup({
        lookupType: "TypesOfPassport",
      });
      setPassportType(passportResponse);

      const response = await getStates();
      setStates(Object.values(response));

      const basePayload = CART_SERVICE_MAP["visa-service"];
      if (!basePayload) {
        return <div>Invalid service selected.</div>;
      }
      const payload = {
        userId: userId,
        ...basePayload,
      };
      const orderId = await getOrderIdOfCart(payload);
      if (orderId) {
        setExistingOrderId(orderId);
        setShowCartConflict(true);
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    init();
  }, [userId]);

  const clearFieldErrors = (...keys: string[]) => {
    setFieldErrors((prev) => {
      if (keys.length === 0) return {};
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const visaTypeOptions = visaType.map((l) => l.lookupName);
  const passportTypeOptions = passportType.map((l) => l.lookupName);
  const stateOptions = states.map((l) => l?.stateName);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      originCountryOfPassPort: originCountry?.countryId,
    }));
  }, [originCountry]);

  const handleVisaTypeChange = (selectedValue: string) => {
    clearFieldErrors("typeOfVisa");
    const visaTypeId =
      visaType.find((s) => s.lookupName === selectedValue)?.lookupId ?? 0;
    setSelectedVisaType({
      value: selectedValue,
      id: visaTypeId,
    });
    setForm((prev) => ({ ...prev, typeOfVisa: visaTypeId }));
  };

  const handlePassportTypeChange = (selectedValue: string) => {
    clearFieldErrors("typeOfPassport");
    const passportTypeId =
      passportType.find((s) => s.lookupName === selectedValue)?.lookupId ?? 0;
    setSelectedPassportType({
      value: selectedValue,
      id: passportTypeId,
    });
    setForm((prev) => ({ ...prev, typeOfPassport: passportTypeId }));
  };

  const handleStateChange = (selectedValue: string) => {
    clearFieldErrors("state");
    const stateId =
      states.find((s) => s.stateName === selectedValue)?.stateId ?? 0;
    setSelectedState({
      value: selectedValue,
      id: stateId,
    });
    setForm((prev) => ({ ...prev, state: stateId }));
  };

  const handleEntryChange = (selectedValue: string) => {
    clearFieldErrors("NumberOfEntries");
    let value = 1;
    if (selectedValue === "Single Entry") value = 1;
    else if (selectedValue === "Double Entry") value = 2;
    else if (selectedValue === "Multiple Entry") value = 3;

    setForm((prev) => ({
      ...prev,
      NumberOfEntries: value,
    }));
    setEntryType(selectedValue);
  };

  const isAtLeastSixMonths = (
    issueDate: Dayjs | null,
    validityDate: Dayjs | null,
  ) => {
    if (!issueDate || !validityDate) return true;
    return validityDate.diff(issueDate, "month") >= 6;
  };

  async function uploadAndStore(file: any) {
    if (!file) return;
    clearFieldErrors("uploadDocument");

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);

        const data = await uploadVisaFile(formData);
        setFileName(file.name)
        setUploadedDocumentId(data.data[0].documentId);
        showSnackbar("Document uploaded successfully", "success");
      } catch (err) {
        console.log(err);
       showSnackbar("Error while uploading document.File size should be below 50MB", "error");
      }
    }
  }

  useEffect(() => {
    if (
      form.passportIssuanceDate &&
      form.passportValidity &&
      !isAtLeastSixMonths(form.passportIssuanceDate, form.passportValidity)
    ) {
      showSnackbar(
        "Passport validity must be at least 6 months from date of issue",
        "error",
      );
    }
  }, [form.passportIssuanceDate, form.passportValidity]);

  const submitOrder = async () => {
    const { isValid, error, fieldErrors: validationFieldErrors } =
      validateVisaForm(form);

    const errors: Record<string, string> = {};

    if (!destinationCountry) {
      errors.destinationCountry = "Destination Country is required";
    }

    if (!isValid) {
      Object.assign(errors, validationFieldErrors);
    }

    if (!uploadedDocumentId) {
      errors.uploadDocument = "Add Documents is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showSnackbar(Object.values(errors)[0] || error, "error");
      return;
    }

    setFieldErrors({});
    setLoader(true);
    setMessage("Processing Checkout...");
    try {
      const payload = buildVisaPayload({
        customerId: customerId,
        userId: userId,
        country: destinationCountry?.countryId,
        form,
      });
      const response = await postTranslationOrder(payload);

      const documentUploadPayload = [
        {
          docId: response[0].dockets[0].docs[0].docId,
          documentId: uploadedDocumentId,
          orderId: response[0].orderId,
          uploadedBy: userId,
        },
      ];
      await addVisaDocument(documentUploadPayload);
      showSnackbar("Document submitted successfully", "success");
      window.location.href = "/cart?service=visa-service";
    } catch (error) {
      showSnackbar("Failed to add document to cart", "error");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Dialog open={showCartConflict} disableEscapeKeyDown onClose={() => {}}>
        <DialogTitle>Order Already in Cart</DialogTitle>

        <DialogContent>
          <Typography>
            You already have an order in your cart. Please choose one of the
            options below to continue.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              window.location.href = "/cart?service=visa-service";
            }}
          >
            Go to Cart
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await deleteOrder(existingOrderId!);
              setShowCartConflict(false);
              setExistingOrderId(null);
            }}
          >
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
      <OverlayLoader open={loader} message={message} />
      <FormLayout title="Visa Service" onProceed={submitOrder}>
        {/* Destination Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Destination Country for Visa"
            value={destinationCountry}
            required
            error={Boolean(fieldErrors.destinationCountry)}
            helperText={fieldErrors.destinationCountry || ""}
            onChange={(value) => {
              setDestinationCountry(value);
              clearFieldErrors("destinationCountry");
            }}
          />
        </Grid>

        {/* Visa Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Type of Visa"
            options={visaTypeOptions}
            required
            value={selectedVisaType.value}
            error={Boolean(fieldErrors.typeOfVisa)}
            helperText={fieldErrors.typeOfVisa || ""}
            onChange={handleVisaTypeChange}
          />
        </Grid>

        {/* Passport Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Type of Passport"
            options={passportTypeOptions}
            required
            value={selectedPassportType.value}
            error={Boolean(fieldErrors.typeOfPassport)}
            helperText={fieldErrors.typeOfPassport || ""}
            onChange={handlePassportTypeChange}
          />
        </Grid>

        {/* Origin Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Origin Country of Passport"
            value={originCountry}
            required
            error={Boolean(fieldErrors.originCountryOfPassPort)}
            helperText={fieldErrors.originCountryOfPassPort || ""}
            onChange={(value) => {
              setOriginCountry(value);
              clearFieldErrors("originCountryOfPassPort");
            }}
            pinnedCountryIds={[190]}
          />
        </Grid>

        {/* Applicant Name */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 6 }}>
              <InputField
                label="Given Name"
                value={form.applicantGivenName}
                required
                error={Boolean(fieldErrors.applicantGivenName)}
                helperText={fieldErrors.applicantGivenName || ""}
                onChange={(e) => {
                  clearFieldErrors("applicantGivenName");
                  setForm((prev) => ({
                    ...prev,
                    applicantGivenName: e.target.value,
                  }));
                }}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 6 }}>
              <InputField
                label="Surname"
                value={form.lastName}
                required
                error={Boolean(fieldErrors.lastName)}
                helperText={fieldErrors.lastName || ""}
                onChange={(e) => {
                  clearFieldErrors("lastName");
                  setForm((prev) => ({ ...prev, lastName: e.target.value }));
                }}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
            </Grid>
            {/* <Grid size={{ xs: 6, sm: 3 }}>
            <InputField label="Last Name *" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InputField label="Suffix" />
          </Grid> */}
          </Grid>
        </Grid>

        {/* Passport Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Passport Number"
            value={form.passportNumber}
            required
            error={Boolean(fieldErrors.passportNumber)}
            helperText={fieldErrors.passportNumber || ""}
            onChange={(e) => {
              clearFieldErrors("passportNumber");
              setForm((prev) => ({ ...prev, passportNumber: e.target.value }));
            }}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          />
        </Grid>

        {/* Dates */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <DateInput
            label="Date of Issue"
            maxDate={dayjs()}
            value={form.passportIssuanceDate}
            required
            error={Boolean(fieldErrors.passportIssuanceDate)}
            helperText={fieldErrors.passportIssuanceDate || ""}
            onChange={(value) => {
              clearFieldErrors("passportIssuanceDate", "passportValidity");
              setForm((prev) => ({ ...prev, passportIssuanceDate: value }));
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DateInput
            label="Passport Validity (good until)"
            minDate={dayjs()}
            value={form.passportValidity}
            required
            error={Boolean(fieldErrors.passportValidity)}
            helperText={fieldErrors.passportValidity || ""}
            onChange={(value) => {
              clearFieldErrors("passportValidity");
              setForm((prev) => ({ ...prev, passportValidity: value }));
            }}
          />
        </Grid>

        {/* State of Residence */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Applicant State of Residence"
            options={stateOptions}
            value={selectedState.value}
            required
            error={Boolean(fieldErrors.state)}
            helperText={fieldErrors.state || ""}
            onChange={handleStateChange}
          />
        </Grid>

        {/* Entry Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Number of Entry/IES"
            options={entries}
            value={entryType}
            required
            error={Boolean(fieldErrors.NumberOfEntries)}
            helperText={fieldErrors.NumberOfEntries || ""}
            onChange={handleEntryChange}
          />
        </Grid>

        {/* Departure + Expedited */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <DateInput
            label="Date of Departure from U.S"
            minDate={form.passportIssuanceDate ?? undefined}
            maxDate={form.passportValidity ?? undefined}
            value={form.dateOfDeparture}
            required
            error={Boolean(fieldErrors.dateOfDeparture)}
            helperText={fieldErrors.dateOfDeparture || ""}
            onChange={(value) => {
              clearFieldErrors("dateOfDeparture");
              setForm((prev) => ({
                ...prev,
                dateOfDeparture: value,
              }));
            }}
          />
        </Grid>

        {/* Upload Docs */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FileUploadBox
            label="Add Documents"
            required
            error={Boolean(fieldErrors.uploadDocument)}
            helperText={fieldErrors.uploadDocument || ""}
            onSelectFile={(file) => uploadAndStore(file)}
            fileName={fileName || ""}
          />
        </Grid>

        {/* Comments */}
        <Grid size={{ xs: 12, md: 6 }}>
          <InputField
            label="Additional Comments"
            multiline
            rows={5.45}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                additonalComments: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container alignItems="center" spacing={1}>
            {/* Checkbox */}
            <Grid>
              <FormControlLabel
                label=""
                control={
                  <Checkbox
                    checked={form.isExpedited}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setForm((prev) => ({
                        ...prev,
                        isExpedited: checked,
                        expeditedDate: checked ? prev.expeditedDate : null,
                      }));
                    }}
                  />
                }
                sx={{
                  m: 0,
                }}
              />
            </Grid>

            {/* Date Field */}
            <Grid flex={1}>
              <DateInput
                label="Expedited Service (Date Needed By)"
                disabled={!form.isExpedited}
                minDate={form.passportIssuanceDate ?? undefined}
                maxDate={form.passportValidity ?? undefined}
                value={form.expeditedDate}
                error={Boolean(fieldErrors.expeditedDate)}
                helperText={fieldErrors.expeditedDate || ""}
                onChange={(value) => {
                  clearFieldErrors("expeditedDate");
                  setForm((prev) => ({
                    ...prev,
                    expeditedDate: value,
                  }));
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Reference */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Customer Reference"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                customerReference: e.target.value,
              }))
            }
          />
        </Grid>
      </FormLayout>
    </>
  );
}
