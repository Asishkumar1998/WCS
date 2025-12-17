const YES = 651;
const NO = 652;

function buildNotaryPayload({
  country,
  additionalComments,
  customerReference,
  additionalServices,
  attachment,
  numberOfPages,
  isNotary,
}: {
  country: any;
  additionalComments: any;
  customerReference: any;
  additionalServices: any;
  attachment: any;
  numberOfPages: any;
  isNotary: boolean;
}) {
  return {
    customerId: "9682",
    orderOriginId: 611,
    orderType: 1101,
    initiatedBy: "7437",

    dockets: [
      {
        docs: [
          {
            countryId: country?.countryId, // from CountrySelect
            originCountryId: 190, // fixed (from your sample)
            docCategoryId: isNotary ? 528 : 529, // fixed
            docTypeId: 0, // fixed
            isRush: additionalServices.includes("Rush") ? true : false,
            isScan: additionalServices.includes("Pre Scan") ? true : false,
            isPostScan: additionalServices.includes("Post Scan") ? true : false,
            isDispatch: isNotary ? false : true, // fixed
            isNotarized: isNotary ? YES : NO, // fixed

            isSoSDone: NO, // fixed
            isDoSDone: NO, // fixed

            noOfProducts: null, // fixed
            isSoftCopyGiven: attachment ? YES : NO, // based on file upload
            isGeneralSoftCopy: attachment ? YES : NO, // based on file upload

            instructions: additionalComments || "",
            internalReference: customerReference || "",

            CIAmount: "0",
            additionalDOX: "",
            COCount: 0,
            CICount: 1,

            attachments: attachment,

            noOfPages: numberOfPages,
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
}: buildNotaryDispatchPayloadFromExistingOrder) => {
  if (!basePayload || !country) return basePayload;

  const selectedCountryId = country.countryId;

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
    attachments: attachment,
    internalReference: customerReference || "",
    CIAmount: "0",
    CICount: 1,
    COCount: 0,
    additionalDOX: "",
    docTypeId: 0,
    isCopy: false,
    isDoSDone: NO,
    isSoSDone: NO,
    isSoftCopyGiven: attachment ? YES : NO,
    noOfProducts: null,
    noOfPages: numberOfPages,
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

export { buildNotaryPayload, buildNotaryDispatchPayloadFromExistingOrder };