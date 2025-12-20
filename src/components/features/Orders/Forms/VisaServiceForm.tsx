"use client";

import React, { useEffect, useState } from "react";
import { Grid, SelectChangeEvent } from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FileUploadField from "@/components/ui/Input/FileInput";
import FormLayout from "@/components/ui/Forms/FormLayout";
import DateInput from "@/components/ui/Input/DateInput";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import ValidatedFileUpload from "../Common/ValidatedFileUpload";
import DocumentUpload from "../Common/DocumentUpload";
import {
  getLookup,
  getStates,
  postTranslationOrder,
} from "@/services/formsService";
import dayjs, { Dayjs } from "dayjs";
import buildVisaPayload from "../Common/VisaPayload";

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
  NumberOfEntries: number;
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
  NumberOfEntries: 1,
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

  const init = async () => {
    const visaResponse = await getLookup({ lookupType: "TypeOfVisa" });
    setVisaType(visaResponse);

    const passportResponse = await getLookup({ lookupType: "TypesOfPassport" });
    setPassportType(passportResponse);

    const response = await getStates();
    setStates(Object.values(response));
  };

  const visaTypeOptions = visaType.map((l) => l.lookupName);
  const passportTypeOptions = passportType.map((l) => l.lookupName);
  const stateOptions = states.map((l) => l?.stateName);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      originCountryOfPassPort: originCountry?.countryId,
    }));
  }, [originCountry]);

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

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
  };

  const submitOrder = async () => {
    const payload = buildVisaPayload({
      customerId: 9682,
      userId: 7437,
      country: destinationCountry?.countryId,
      form,
    });
    await postTranslationOrder(payload);
    window.location.href = "/cart?service=visa-service";
  };

  return (
    <FormLayout title="Visa Service" onProceed={submitOrder}>
      {/* Destination Country */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <CountrySelect
          label="Destination Country for Visa *"
          value={destinationCountry}
          onChange={setDestinationCountry}
        />
      </Grid>

      {/* Visa Type */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Type of Visa *"
          options={visaTypeOptions}
          value={selectedVisaType.value}
          onChange={handleVisaTypeChange}
        />
      </Grid>

      {/* Passport Type */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Type of Passport *"
          options={passportTypeOptions}
          value={selectedPassportType.value}
          onChange={handlePassportTypeChange}
        />
      </Grid>

      {/* Origin Country */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <CountrySelect
          label="Origin Country of Passport *"
          value={originCountry}
          onChange={setOriginCountry}
        />
      </Grid>

      {/* Applicant Name */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 6 }}>
            <InputField
              label="Given Name *"
              value={form.applicantGivenName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  applicantGivenName: e.target.value,
                }))
              }
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6 }}>
            <InputField
              label="Surname *"
              value={form.lastName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lastName: e.target.value }))
              }
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
          label="Passport Number *"
          value={form.passportNumber}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, passportNumber: e.target.value }))
          }
        />
      </Grid>

      {/* Dates */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <DateInput
          label="Date of Issue *"
          maxDate={dayjs()}
          value={form.passportIssuanceDate}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, passportIssuanceDate: value }))
          }
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <DateInput
          label="Passport Validity (good until) *"
          minDate={dayjs()}
          value={form.passportValidity}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, passportValidity: value }))
          }
        />
      </Grid>

      {/* State of Residence */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Applicant State of Residence *"
          options={stateOptions}
          value={selectedState.value}
          onChange={handleStateChange}
        />
      </Grid>

      {/* Entry Type */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Number of Entry/IES *"
          options={entries}
          value={entryType}
          onChange={handleEntryChange}
        />
      </Grid>

      {/* Departure + Expedited */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <DateInput
          label="Date of Departure from U.S *"
          minDate={form.passportIssuanceDate ?? undefined}
          maxDate={form.passportValidity ?? undefined}
          value={form.dateOfDeparture}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              dateOfDeparture: value,
            }))
          }
        />
      </Grid>

      {/* Upload Docs */}
      <Grid size={{ xs: 12, md: 6 }}>
        <DocumentUpload country={""} />
      </Grid>

      {/* Comments */}
      <Grid size={{ xs: 12, md: 6 }}>
        <InputField
          label="Additional Comments"
          multiline
          rows={9}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, additonalComments: e.target.value }))
          }
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <DateInput
          label="Expedited Service (Date Needed By)"
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

      {/* Reference */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <InputField
          label="Customer Reference"
          onChange={(e) =>
            setForm((prev) => ({ ...prev, customerReference: e.target.value }))
          }
        />
      </Grid>
    </FormLayout>
  );
}
