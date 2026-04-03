const YES = 651;
const NO = 652;

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

function buildNotaryPayload({
  country,
  additionalComments,
  customerReference,
  additionalServices,
  attachment,
  numberOfPages,
  isNotary,
  trackingNo,
  courierType,
  nestedSelection,
}: {
  country: any;
  additionalComments: any;
  customerReference: any;
  additionalServices: any;
  attachment: any;
  numberOfPages: any;
  isNotary: boolean;
  trackingNo: any;
  courierType: any;
  nestedSelection?: "proceedWithAttached" | "originalMailedNested" | null;
}) {
  const userId = getAuthValue("userId");
  const customerId = getAuthValue("customerId");
  const hasAttachments = Array.isArray(attachment) && attachment.length > 0;
  const shouldProcessAttached =
    nestedSelection != null
      ? nestedSelection === "proceedWithAttached"
      : hasAttachments;
  const attachments = shouldProcessAttached ? (attachment ?? []) : [];

  return {
    customerId: customerId,
    orderOriginId: 611,
    orderType: 1101,
    initiatedBy: userId,

    dockets: [
      {
        docs: [
          {
            countryId: country?.countryId,
            originCountryId: 190,
            docCategoryId: isNotary ? 528 : 529,
            docTypeId: 0,
            isRush: additionalServices.includes("Rush") ? true : false,
            isScan: additionalServices.includes("Pre-Scan") ? true : false,
            isPostScan: additionalServices.includes("Post-Scan") ? true : false,
            isDispatch: isNotary ? false : true,
            isNotarized: isNotary ? YES : NO,

            isSoSDone: NO,
            isDoSDone: NO,

            noOfProducts: null,
            isSoftCopyGiven: shouldProcessAttached ? YES : NO,
            isGeneralSoftCopy: shouldProcessAttached ? YES : NO,

            instructions: additionalComments || "",
            internalReference: customerReference || "",

            CIAmount: "0",
            additionalDOX: "",
            COCount: 0,
            CICount: 1,

            attachments,

            noOfPages: numberOfPages === "" ? undefined : numberOfPages,

            incomingTracking: trackingNo ?? undefined,
            incomingTrackingType: courierType ?? undefined,
          },
        ],
      },
    ],
  };
}

type buildNotaryDispatchPayloadFromExistingOrder = {
  basePayload: any;
  country: any;
  additionalServices: string[];
  additionalComments: string;
  attachment: any;
  customerReference: string;
  numberOfPages: any;
  isNotary: boolean;
  trackingNo: any;
  courierType: any;
  nestedSelection?: "proceedWithAttached" | "originalMailedNested" | null;
};

const buildNotaryDispatchPayloadFromExistingOrder = ({
  basePayload,
  country,
  additionalServices,
  additionalComments,
  attachment,
  customerReference,
  numberOfPages,
  isNotary,
  trackingNo,
  courierType,
  nestedSelection,
}: buildNotaryDispatchPayloadFromExistingOrder) => {
  if (!basePayload || !country) return basePayload;

  const selectedCountryId = country.countryId;
  const hasAttachments = Array.isArray(attachment) && attachment.length > 0;
  const shouldProcessAttached =
    nestedSelection != null
      ? nestedSelection === "proceedWithAttached"
      : hasAttachments;
  const attachments = shouldProcessAttached ? (attachment ?? []) : [];

  const newDoc = {
    docCategoryId: isNotary ? 528 : 529,
    countryId: selectedCountryId,
    originCountryId: 190,
    isScan: additionalServices.includes("Pre-Scan"),
    isPostScan: additionalServices.includes("Post-Scan"),
    isRush: additionalServices.includes("Rush"),
    isDispatch: isNotary ? false : true,
    isNotarized: isNotary ? YES : NO,
    instructions: additionalComments || "",
    attachments,
    internalReference: customerReference || "",
    CIAmount: "0",
    CICount: 1,
    COCount: 0,
    additionalDOX: "",
    docTypeId: 0,
    isCopy: false,
    isDoSDone: NO,
    isSoSDone: NO,
    isSoftCopyGiven: shouldProcessAttached ? YES : NO,
    isGeneralSoftCopy: shouldProcessAttached ? YES : NO,
    noOfProducts: null,
    noOfPages: numberOfPages === "" ? undefined : numberOfPages,
    incomingTracking: trackingNo ?? undefined,
    incomingTrackingType: courierType ?? undefined,
  };

  const updatedDockets = basePayload.dockets.map((docket: any) => ({
    ...docket,
    docs: [...docket.docs],
  }));

  const existingDocket = updatedDockets.find(
    (docket: any) =>
      docket.docs?.length > 0 && docket.docs[0].countryId === selectedCountryId,
  );

  if (existingDocket) {
    existingDocket.docs.push(newDoc);
  } else {
    updatedDockets.push({
      orderId: basePayload.orderId,
      docs: [newDoc],
    });
  }

  return {
    ...basePayload,
    dockets: updatedDockets,
  };
};

export { buildNotaryPayload, buildNotaryDispatchPayloadFromExistingOrder };
