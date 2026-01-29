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
  const [checkingCart, setCheckingCart] = useState(true);
  const [uploadedDocumentId, setUploadedDocumentId] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");

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
      setCheckingCart(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    init();
  }, [userId]);

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
    const visaTypeId =
      visaType.find((s) => s.lookupName === selectedValue)?.lookupId ?? 0;
    setSelectedVisaType({
      value: selectedValue,
      id: visaTypeId,
    });
    setForm((prev) => ({ ...prev, typeOfVisa: visaTypeId }));
  };

  const handlePassportTypeChange = (selectedValue: string) => {
    const passportTypeId =
      passportType.find((s) => s.lookupName === selectedValue)?.lookupId ?? 0;
    setSelectedPassportType({
      value: selectedValue,
      id: passportTypeId,
    });
    setForm((prev) => ({ ...prev, typeOfPassport: passportTypeId }));
  };

  const handleStateChange = (selectedValue: string) => {
    const stateId =
      states.find((s) => s.stateName === selectedValue)?.stateId ?? 0;
    setSelectedState({
      value: selectedValue,
      id: stateId,
    });
    setForm((prev) => ({ ...prev, state: stateId }));
  };

  const handleEntryChange = (selectedValue: string) => {
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
        showSnackbar("Error while uploading document", "error");
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
    const { isValid, error } = validateVisaForm(form);

    if (!destinationCountry) {
      showSnackbar("Destination Country is required", "error");
      return;
    }
    if (!isValid) {
      showSnackbar(error, "error");
      return;
    }

    if(!uploadedDocumentId){
      showSnackbar("Add Documents is required", "error");
      return
    }

    if (
      !form.passportIssuanceDate ||
      !form.passportValidity ||
      form.passportValidity.diff(form.passportIssuanceDate, "month") < 6
    ) {
      showSnackbar(
        "Passport validity must be at least 6 months from date of issue",
        "error",
      );
      return;
    }

    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  if (checkingCart) {
    return null;
  }

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
      <OverlayLoader open={isSubmitting} message="Processing Checkout..." />
      <FormLayout title="Visa Service" onProceed={submitOrder}>
        {/* Destination Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Destination Country for Visa"
            value={destinationCountry}
            required
            onChange={setDestinationCountry}
          />
        </Grid>

        {/* Visa Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Type of Visa"
            options={visaTypeOptions}
            required
            value={selectedVisaType.value}
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
            onChange={handlePassportTypeChange}
          />
        </Grid>

        {/* Origin Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            label="Origin Country of Passport"
            value={originCountry}
            required
            onChange={setOriginCountry}
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
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    applicantGivenName: e.target.value,
                  }))
                }
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
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
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
            onChange={(e) =>
              setForm((prev) => ({ ...prev, passportNumber: e.target.value }))
            }
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
            onChange={(value) =>
              setForm((prev) => ({ ...prev, passportIssuanceDate: value }))
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DateInput
            label="Passport Validity (good until)"
            minDate={dayjs()}
            value={form.passportValidity}
            required
            onChange={(value) =>
              setForm((prev) => ({ ...prev, passportValidity: value }))
            }
          />
        </Grid>

        {/* State of Residence */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Applicant State of Residence"
            options={stateOptions}
            value={selectedState.value}
            required
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
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                dateOfDeparture: value,
              }))
            }
          />
        </Grid>

        {/* Upload Docs */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FileUploadBox
            label="Add Documents"
            required
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
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    expeditedDate: value,
                  }))
                }
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
