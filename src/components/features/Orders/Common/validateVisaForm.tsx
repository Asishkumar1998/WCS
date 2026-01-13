import { Dayjs } from "dayjs";

type ValidationResult = {
  isValid: boolean;
  error: string;
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

  for (const field of requiredChecks) {
    if (!form[field.key]) {
      return {
        isValid: false,
        error: `${field.label} is required`,
      };
    }
  }

  // Passport validity ≥ 6 months from issue date
  const issueDate: Dayjs = form.passportIssuanceDate;
  const validityDate: Dayjs = form.passportValidity;

  if (validityDate.diff(issueDate, "month") < 6) {
    return {
      isValid: false,
      error:
        "Passport validity must be at least 6 months from the date of issue",
    };
  }

  // Date of Departure & Expedited date bounds (safety)
  if (
    form.dateOfDeparture.isBefore(issueDate) ||
    form.dateOfDeparture.isAfter(validityDate)
  ) {
    return {
      isValid: false,
      error:
        "Date of Departure must be between Passport Issue Date and Passport Validity Date",
    };
  }

  if (
    form.expeditedDate &&
    (form.expeditedDate.isBefore(issueDate) ||
      form.expeditedDate.isAfter(validityDate))
  ) {
    return {
      isValid: false,
      error:
        "Expedited Service Date must be between Passport Issue Date and Passport Validity Date",
    };
  }

  return { isValid: true, error: "" };
};

export default validateVisaForm;