// Users constants
const CUSTOMERID = 9682;
const USERID = 7437;

function buildTranslationPayload({
    originalLangId,
    translatedLangId,
    attachments,
    coverLetter,
    shippingLabel
}: {
    originalLangId: any,
    translatedLangId: any,
    attachments: any,
    coverLetter: any,
    shippingLabel: any
}) {
  return {
    customerId: CUSTOMERID,
    orderOriginId: 611,
    orderType: 1103,
    initiatedBy: USERID,
    isUSOrigin: true,
    dockets: [
      {
        docs: [
          {
            orderOriginId: 611,
            docCategoryId: 527,
            countryId: 190,
            originCountryId: 190,
            isPostScan: true,
            translation: [
              {
                originalLangId: originalLangId,
                translatedLangId: translatedLangId,
              },
            ],
            attachments,
            coverLetter,
            shippingLabel,
          },
        ],
      },
    ],
  };
}
