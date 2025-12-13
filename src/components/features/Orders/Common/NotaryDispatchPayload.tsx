const YES = 651;
const NO = 652;

function buildNotaryPayload({
  country,
  additionalComments,
  reference,
  additionalServices,
  attachment,
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
            countryId: country?.countryId,            // from CountrySelect
            originCountryId: 190,                     // fixed (from your sample)
            docCategoryId: 522,                       // fixed
            docTypeId: 0,                             // fixed
            isRush: additionalServices.includes("Rush") ? YES : NO,
            isScan: additionalServices.includes("Pre Scan") ? YES : NO,
            isPostScan: additionalServices.includes("Post Scan") ? YES : NO,
            isDispatch: false,                        // fixed
            isNotarized: YES,                         // fixed

            isSoSDone: NO,                            // fixed
            isDoSDone: NO,                            // fixed

            noOfProducts: null,                       // fixed
            isSoftCopyGiven: attachment ? YES : NO,   // based on file upload
            isGeneralSoftCopy: attachment ? YES : NO, // based on file upload

            instructions: additionalComments || "",
            internalReference: reference || "",

            CIAmount: "0",
            additionalDOX: "",
            COCount: 0,
            CICount: 1,

            attachments: attachment
              ? [
                  {
                    documentId: attachment.documentId,
                    documentName: attachment.documentName,
                    fileName: attachment.fileName,
                    encoding: attachment.encoding,
                    mimeType: attachment.mimeType,
                    extension: attachment.extension,
                    size: attachment.size,
                    uploadedBy: attachment.uploadedBy,
                    uploadedAt: attachment.uploadedAt,
                    sourceUrl: attachment.sourceUrl,
                    blobName: attachment.blobName,
                  },
                ]
              : [],
          },
        ],
      },
    ],
  };
}
