const getAuthValue = (key: "userId" | "customerId"): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const authRaw = sessionStorage.getItem("auth");
    if (!authRaw) return null;

    const auth = JSON.parse(authRaw);
    return auth?.[key]?.toString() ?? null;
  } catch {
    return null;
  }
};

const mapAdditionalServices = (services: string[]) => ({
  isRush: services.includes("Rush"),
  isScan: services.includes("Pre-Scan"),
  isPostScan: services.includes("Post-Scan"),
});

const buildBulkDoc = ({
  country,
  document,
  additionalServices,
  uploadedAttachments,
  customerReference,
  additionalComments,
  numberOfPages,
  trackingNo,
  courierType,
  originState,
  nusaccRequired,
  numberOfProducts,
}: any) => {
  const YES = 651;
  const NO = 652;

  const hasAttachments =
    Array.isArray(uploadedAttachments) && uploadedAttachments.length > 0;

  return {
    countryId: country.countryId,
    originCountryId: 190,
    docCategoryId: document.docCategoryId,
    docTypeId: document.docTypeId,

    ...mapAdditionalServices(additionalServices),

    isDispatch: false,
    isNotarized: NO,
    isCopy: false,
    isSoSDone: NO,
    isDoSDone: NO,

    noOfPages: numberOfPages === "" ? undefined : numberOfPages,
    noOfPhotoCopyPages: undefined,
    noOfProducts: numberOfProducts ?? 0,

    isSoftCopyGiven: hasAttachments ? YES : NO,
    isGeneralSoftCopy: hasAttachments ? YES : NO,
    isPhotocopyInclude: YES,

    attachments: uploadedAttachments ?? [],

    CIAmount: "0",
    additionalDOX: "",
    COCount: 0,
    CICount: 1,

    internalReference: customerReference ?? "",
    instructions: additionalComments ?? "",

    originState: originState ?? undefined,
    nusaccRequired: nusaccRequired ?? undefined,
    incomingTracking: trackingNo ?? undefined,
    incomingTrackingType: courierType ?? undefined,
  };
};

const toDocAttachmentGroups = (uploadedAttachments: any) => {
  if (!Array.isArray(uploadedAttachments)) return [[]];
  if (uploadedAttachments.length === 0) return [[]];
  return uploadedAttachments.map((attachment) => [attachment]);
};

const buildBulkMultiDocSingleCountryPayload = ({
  country,
  documents,
  additionalServices,
  generalAdditionalQuestions,
  additionalComments,
}: {
  country: any;
  documents: any[];
  additionalServices: string[];
  generalAdditionalQuestions: { questionId: number; answer: any }[];
  additionalComments?: string;
}) => {
  const userId = getAuthValue("userId");
  const customerId = getAuthValue("customerId");

  const originState = generalAdditionalQuestions?.find(
    (q) => q.questionId === 2,
  )?.answer;
  const nusaccRequired =
    generalAdditionalQuestions?.find((q) => q.questionId === 8)?.answer ===
    "Yes";

  const numberOfProducts =
    country?.countryId === 130
      ? Number(
          generalAdditionalQuestions?.find((q) => q.questionId === 12)?.answer,
        ) || null
      : null;

  const docs = documents.flatMap((entry) => {
    const attachmentGroups = toDocAttachmentGroups(entry.uploadedAttachments);

    return attachmentGroups.map((attachments) =>
      buildBulkDoc({
        country,
        document: entry,
        additionalServices,
        uploadedAttachments: attachments,
        customerReference: entry.reference,
        additionalComments,
        numberOfPages: entry.uploadData?.numPages ?? "",
        trackingNo: entry.uploadData?.trackingNumberNested,
        courierType: entry.uploadData?.courierNested,
        originState: entry.docCategoryId === 522 ? originState : undefined,
        nusaccRequired:
          entry.docCategoryId === 522 ? nusaccRequired : undefined,
        numberOfProducts:
          entry.docCategoryId === 522 ? numberOfProducts : undefined,
      }),
    );
  });

  return {
    customerId,
    orderOriginId: 611,
    orderType: 1104,
    initiatedBy: userId,
    dockets: [{ docs }],
  };
};

export default buildBulkMultiDocSingleCountryPayload;
