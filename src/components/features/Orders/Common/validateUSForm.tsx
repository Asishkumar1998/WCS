import ADDITIONAL_QUESTION_COUNTRY_MAP from "@/dataset/additionalQuesWithCountryMap";

type ValidationResult = {
  isValid: boolean;
  error: string;
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
  /* ---------------- Country ---------------- */
  if (country !== undefined) {
    if (!country) {
      return { isValid: false, error: "Country is required" };
    }
  }

  /* ---------------- Document ---------------- */
  if (document !== undefined) {
    if (!document) {
      return { isValid: false, error: "Document is required" };
    }
  }

  /* ---------------- Countries ---------------- */
  if (countries !== undefined) {
    if (!countries || countries.length === 0) {
      return { isValid: false, error: "Please select at least one country" };
    }
  }

  /* ---------------- Upload Values ---------------- */
  if (uploadDocValues !== undefined) {
    if (uploadDocValues?.nestedSelection === null) {
      return {
        isValid: false,
        error: "Please Select Document Upload options",
      };
    }

    if (
      uploadDocValues?.nestedSelection === "proceedWithAttached" &&
      uploadDocValues?.uploadedFile === null
    ) {
      return {
        isValid: false,
        error: "Please Upload Document",
      };
    }
  }

  /* ---------------- Additional Questions ---------------- */
  if (country && additionalQuestions !== undefined) {
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
        return {
          isValid: false,
          error: "Please answer all required additional questions",
        };
      }
    }
  }

  return { isValid: true, error: "" };
};

export default validateUSApostilleForm;
