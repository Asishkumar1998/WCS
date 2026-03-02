import ADDITIONAL_QUESTION_COUNTRY_MAP from "@/dataset/additionalQuesWithCountryMap";

type ValidationResult = {
  isValid: boolean;
  error: string;
  fieldErrors: Record<string, string>;
};

type Params = {
  countries?: any;
  country?: any;
  document?: any;
  additionalQuestions?: { questionId: number; answer: any }[];
  uploadDocValues?: any;
};

const OPTIONAL_QUESTION_IDS = [1, 8];

const validateUSApostilleForm = ({
  countries,
  country,
  document,
  additionalQuestions,
  uploadDocValues,
}: Params): ValidationResult => {
  const fieldErrors: Record<string, string> = {};
  let firstError = "";

  const addError = (key: string, message: string) => {
    if (!firstError) firstError = message;
    fieldErrors[key] = message;
  };

  if (country !== undefined && !country) {
    addError("country", "Country is required");
  }

  if (document !== undefined && !document) {
    addError("document", "Document is required");
  }

  if (countries !== undefined && (!countries || countries.length === 0)) {
    addError("countries", "Please select at least one country");
  }

  if (uploadDocValues !== undefined) {
    const nestedSelection = uploadDocValues?.nestedSelection;
    const hasSingleFile =
      uploadDocValues?.uploadedFile !== null &&
      uploadDocValues?.uploadedFile !== undefined;
    const hasMultiFile =
      Array.isArray(uploadDocValues?.uploadedFiles) &&
      uploadDocValues.uploadedFiles.length > 0;

    if (nestedSelection === null || nestedSelection === undefined) {
      addError("uploadOption", "Please Select Document Upload options");
    }

    if (
      nestedSelection === "proceedWithAttached" &&
      !hasSingleFile &&
      !hasMultiFile
    ) {
      addError("uploadDocument", "Please Upload Document");
    }
  }

  if (
    country &&
    additionalQuestions !== undefined &&
    document?.docCategoryId === 522
  ) {
    const requiredQuestionIds =
      ADDITIONAL_QUESTION_COUNTRY_MAP[country.countryId] || [];

    for (const qId of requiredQuestionIds) {
      if (OPTIONAL_QUESTION_IDS.includes(qId)) continue;

      const answered = additionalQuestions?.find(
        (q) =>
          q.questionId === qId &&
          q.answer !== undefined &&
          q.answer !== null &&
          q.answer !== "",
      );

      if (!answered) {
        addError(
          "additionalQuestions",
          "Please answer all required additional questions",
        );
        break;
      }
    }
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    error: firstError,
    fieldErrors,
  };
};

export default validateUSApostilleForm;
