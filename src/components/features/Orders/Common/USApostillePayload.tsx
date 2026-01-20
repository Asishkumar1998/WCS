const getAuthValue = (
  key: "userId" | "customerId"
): string | null => {
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
            noOfPages: numberOfPages,
            noOfPhotoCopyPages: numberOfPages,
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
            originState: originState ?? undefined,
            nusaccRequired: nusaccRequired ?? undefined,
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
}: {
  basePayload: any;
  countryId: any;
  docCategoryId: any;
  additionalServices: any;
  uploadedDoc: any;
  docTypeId: any;
  numberOfProducts: any;
  numberOfPages: any;
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
    noOfPages: numberOfPages,
    noOfPhotoCopyPages: numberOfPages,
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
  };

  const updatedDockets = basePayload.dockets.map((docket: any) => ({
    ...docket,
    docs: [...docket.docs],
  }));

  const existingDocket = updatedDockets.find(
    (docket: any) =>
      docket.docs?.length > 0 && docket.docs[0].countryId === selectedCountryId
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
