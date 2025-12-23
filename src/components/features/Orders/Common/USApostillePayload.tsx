// Users constants
const CUSTOMERID = 9682;
const USERID = 7437;

function buildUSApostillePayload({
  countryId,
  docCategoryId,
  additionalServices,
  uploadedDoc,
  docTypeId,
  originState,
  nusaccRequired
}: {
  countryId: any;
  docCategoryId: any;
  additionalServices: any;
  uploadedDoc: any;
  docTypeId: any;
  originState: any;
  nusaccRequired: any;
}) {
  return {
    customerId: CUSTOMERID,
    orderOriginId: 611,
    orderType: 1101,
    initiatedBy: USERID,
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
            noOfProducts: null,
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
};

const buildUSApostillePayloadFromExistingOrder = ({
  basePayload,
  countryId,
  docCategoryId,
  additionalServices,
  uploadedDoc,
  docTypeId,
}: {
  basePayload: any;
  countryId: any;
  docCategoryId: any;
  additionalServices: any;
  uploadedDoc: any;
  docTypeId: any;
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
    noOfProducts: null,
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
