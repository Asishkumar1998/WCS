import { Dayjs } from "dayjs";

type ValidationResult = {
  isValid: boolean;
  error: string;
  fieldErrors: Record<string, string>;
};

const validateVisaForm = (form: any): ValidationResult => {
  const requiredChecks: { key: string; label: string }[] = [
    { key: "typeOfVisa", label: "Type of Visa" },
    { key: "typeOfPassport", label: "Type of Passport" },
    { key: "originCountryOfPassPort", label: "Origin Country of Passport" },
    { key: "applicantGivenName", label: "Given Name" },
    { key: "lastName", label: "Surname" },
    { key: "passportNumber", label: "Passport Number" },
    { key: "passportIssuanceDate", label: "Date of Issue" },
    { key: "passportValidity", label: "Passport Validity" },
    { key: "state", label: "Applicant State of Residence" },
    { key: "NumberOfEntries", label: "Number of Entry/IES" },
    { key: "dateOfDeparture", label: "Date of Departure" },
  ];

  const fieldErrors: Record<string, string> = {};
  let firstError = "";

  const addError = (key: string, message: string) => {
    if (!firstError) firstError = message;
    fieldErrors[key] = message;
  };

  requiredChecks.forEach((field) => {
    const value = form[field.key];
    const isEmpty =
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "number" && value === 0);

    if (isEmpty) {
      addError(field.key, `${field.label} is required`);
    }
  });

  const issueDate: Dayjs | null = form.passportIssuanceDate;
  const validityDate: Dayjs | null = form.passportValidity;

  if (
    issueDate &&
    validityDate &&
    validityDate.diff(issueDate, "month") < 6
  ) {
    addError(
      "passportValidity",
      "Passport validity must be at least 6 months from the date of issue",
    );
  }

  if (
    form.dateOfDeparture &&
    issueDate &&
    validityDate &&
    (form.dateOfDeparture.isBefore(issueDate) ||
      form.dateOfDeparture.isAfter(validityDate))
  ) {
    addError(
      "dateOfDeparture",
      "Date of Departure must be between Passport Issue Date and Passport Validity Date",
    );
  }

  if (
    form.expeditedDate &&
    issueDate &&
    validityDate &&
    (form.expeditedDate.isBefore(issueDate) ||
      form.expeditedDate.isAfter(validityDate))
  ) {
    addError(
      "expeditedDate",
      "Expedited Service Date must be between Passport Issue Date and Passport Validity Date",
    );
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    error: firstError,
    fieldErrors,
  };
};

export default validateVisaForm;
