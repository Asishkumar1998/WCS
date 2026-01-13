import ADDITIONAL_QUESTION_COUNTRY_MAP from "@/dataset/additionalQuesWithCountryMap";

type ValidationResult = {
  isValid: boolean;
  error: string;
};

type Params = {
  country: any;
  document: any;
  uploadedDoc: any;
  additionalQuestions: { questionId: number; answer: any }[];
};

const OPTIONAL_QUESTION_IDS = [1, 8];

const validateUSApostilleForm = ({
  country,
  document,
  uploadedDoc,
  additionalQuestions,
}: Params): ValidationResult => {
  if (!country) {
    return { isValid: false, error: "Country is required" };
  }

  if (!document) {
    return { isValid: false, error: "Document is required" };
  }

  // 🔥 CORE FIX
  const requiredQuestionIds =
    ADDITIONAL_QUESTION_COUNTRY_MAP[country.countryId] || [];

  for (const qId of requiredQuestionIds) {
    if (OPTIONAL_QUESTION_IDS.includes(qId)) continue;

    const answered = additionalQuestions.find(
      (q) =>
        q.questionId === qId &&
        q.answer !== undefined &&
        q.answer !== null &&
        q.answer !== ""
    );

    if (!answered) {
      return {
        isValid: false,
        error: "Please answer all required additional questions",
      };
    }
  }
  
  if (!uploadedDoc) {
    return { isValid: false, error: "Please upload the document" };
  }


  return { isValid: true, error: "" };
};

export default validateUSApostilleForm;
