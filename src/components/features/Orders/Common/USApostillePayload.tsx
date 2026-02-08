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

function buildUSApostillePayload({
  countryId,
  docCategoryId,
  additionalServices,
  uploadedDoc,
  docTypeId,
  originState,
  nusaccRequired,
  numberOfProducts,
  numberOfPages,
  customerReference,
  additionalComments,
  trackingNo,
  courierType,
}: {
  countryId: any;
  docCategoryId: any;
  additionalServices: any;
  uploadedDoc: any;
  docTypeId: any;
  originState: any;
  nusaccRequired: any;
  numberOfProducts: any;
  numberOfPages: any;
  customerReference: any;
  additionalComments: any;
  trackingNo: any;
  courierType: any;
}) {
  const userId = getAuthValue("userId");
  const customerId = getAuthValue("customerId");
  return {
    customerId: customerId,
    orderOriginId: 611,
    orderType: 1101,
    initiatedBy: userId,
    dockets: [
      {
        docs: [
          {
            countryId: countryId,
            originCountryId: 190,
            docCategoryId: docCategoryId,
            isRush: additionalServices.includes("Rush"),
            isScan: additionalServices.includes("Pre-Scan"),
            isDispatch: false,
            isNotarized: 652,
            isPostScan: additionalServices.includes("Post-Scan"),
            isCopy: false,
            isSoSDone: 652,
            isDoSDone: 652,
            noOfPages: numberOfPages === "" ? undefined : numberOfPages,
            noOfPhotoCopyPages:
              numberOfPages === "" ? undefined : numberOfPages,
            noOfProducts: numberOfProducts,
            isSoftCopyGiven: uploadedDoc ? 651 : 652,
            attachments: uploadedDoc ?? [],
            isGeneralSoftCopy: uploadedDoc ? 651 : 652,
            isPhotocopyInclude: 651,
            CIAmount: "0",
            additionalDOX: "",
            COCount: 0,
            CICount: 1,
            docTypeId: docTypeId,
            originState: originState ?? undefined,
            nusaccRequired: nusaccRequired ?? undefined,
            instructions: additionalComments || "",
            internalReference: customerReference || "",
            incomingTracking: trackingNo ?? undefined,
            incomingTrackingType: courierType ?? undefined,
          },
        ],
      },
    ],
  };
}

type buildUSApostillePayloadFromExistingOrder = {
  basePayload: any;
  countryId: any;
  docCategoryId: any;
  additionalServices: any;
  uploadedDoc: any;
  docTypeId: any;
  numberOfProducts: any;
  numberOfPages: any;
  customerReference: any;
  additionalComments: any;
};

const buildUSApostillePayloadFromExistingOrder = ({
  basePayload,
  countryId,
  docCategoryId,
  additionalServices,
  uploadedDoc,
  docTypeId,
  numberOfProducts,
  numberOfPages,
  customerReference,
  additionalComments,
  trackingNo,
  courierType,
}: {
  basePayload: any;
  countryId: any;
  docCategoryId: any;
  additionalServices: any;
  uploadedDoc: any;
  docTypeId: any;
  numberOfProducts: any;
  numberOfPages: any;
  customerReference: any;
  additionalComments: any;
  trackingNo: any;
  courierType: any;
}) => {
  if (!basePayload) return basePayload;
  const selectedCountryId = countryId;

  const newDoc = {
    countryId: countryId,
    originCountryId: 190,
    docCategoryId: docCategoryId,
    isRush: additionalServices.includes("Rush"),
    isScan: additionalServices.includes("Pre-Scan"),
    isDispatch: false,
    isNotarized: 652,
    isPostScan: additionalServices.includes("Post-Scan"),
    isCopy: false,
    isSoSDone: 652,
    isDoSDone: 652,
    noOfPages: numberOfPages === "" ? undefined : numberOfPages,
    noOfPhotoCopyPages: numberOfPages === "" ? undefined : numberOfPages,
    noOfProducts: numberOfProducts,
    isSoftCopyGiven: 651,
    attachments: uploadedDoc,
    isGeneralSoftCopy: 651,
    isPhotocopyInclude: 651,
    CIAmount: "0",
    additionalDOX: "",
    COCount: 0,
    CICount: 1,
    docTypeId: docTypeId,
    instructions: additionalComments || "",
    internalReference: customerReference || "",
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

export { buildUSApostillePayload, buildUSApostillePayloadFromExistingOrder };
