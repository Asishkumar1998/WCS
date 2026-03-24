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

const normaliseAttachments = (raw: any): any[] => {
  if (raw == null) return [];
  if (raw?.data && Array.isArray(raw.data)) return raw.data; // { data: [...] }
  if (Array.isArray(raw)) return raw;                        // already flat array
  return [raw];                                              // single object
};

const buildBulkDoc = ({
  country,
  document,
  additionalServices,
  uploadedAttachments,
  customerReference,
  additionalComments,
  instructions,
  numberOfPages,
  trackingNo,
  courierType,
  originState,
  nusaccRequired,
  numberOfProducts,
  nestedSelection,
}: any) => {
  const YES = 651;
  const NO = 652;

  const attachmentList = normaliseAttachments(uploadedAttachments);
  const hasAttachments = attachmentList.length > 0;
  const shouldProcessAttached =
    nestedSelection != null
      ? nestedSelection === "proceedWithAttached"
      : hasAttachments;
  const attachments = shouldProcessAttached ? attachmentList : [];

  const parsedPages =
    numberOfPages !== "" && numberOfPages != null
      ? Number(numberOfPages)
      : undefined;

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

    noOfPages: parsedPages,
    noOfPhotoCopyPages: undefined,
    noOfProducts: numberOfProducts ?? 0,

    isSoftCopyGiven: shouldProcessAttached ? YES : NO,
    isGeneralSoftCopy: shouldProcessAttached ? YES : NO,
    isPhotocopyInclude: YES,

    attachments,

    CIAmount: "0",
    additionalDOX: "",
    COCount: 0,
    CICount: 1,

    internalReference: customerReference ?? "",
    instructions: instructions ?? additionalComments ?? "",

    originState: originState != null ? originState : undefined,
    nusaccRequired: nusaccRequired != null ? nusaccRequired : undefined,
    incomingTracking:
      trackingNo != null && trackingNo !== "" ? trackingNo : undefined,
    incomingTrackingType:
      courierType != null && courierType !== "" ? courierType : undefined,
  };
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
    const slotCount = entry.uploadData?.length ?? 1;

    return Array.from({ length: slotCount }, (_, slotIndex) => {
      const slotUpload = entry.uploadedAttachments?.[slotIndex] ?? null;

      return buildBulkDoc({
        country,
        document: entry,
        additionalServices,
        uploadedAttachments: slotUpload,
        customerReference: entry.reference?.[slotIndex],
        additionalComments,
        instructions: entry.instructions?.[slotIndex],
        numberOfPages: entry.uploadData?.[slotIndex]?.numPages ?? "",
        trackingNo: entry.uploadData?.[slotIndex]?.trackingNumberNested,
        courierType: entry.uploadData?.[slotIndex]?.courierNested,
        nestedSelection: entry.uploadData?.[slotIndex]?.nestedSelection ?? null,
        originState: entry.docCategoryId === 522 ? originState : undefined,
        nusaccRequired:
          entry.docCategoryId === 522 ? nusaccRequired : undefined,
        numberOfProducts:
          entry.docCategoryId === 522 ? numberOfProducts : undefined,
      });
    });
  });

  const payload = {
    customerId,
    orderOriginId: 611,
    orderType: 1104,
    initiatedBy: userId,
    dockets: [{ docs }],
  };

  // console.log(
  //   "[BulkPayload] →",
  //   JSON.parse(
  //     JSON.stringify(payload, (_, v) =>
  //       v === undefined ? "__UNDEFINED__" : v,
  //     ),
  //   ),
  // );

  return payload;
};

export default buildBulkMultiDocSingleCountryPayload;