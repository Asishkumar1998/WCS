// Users constants
const userId = localStorage.getItem("userId");
const customerId = localStorage.getItem("customerId");

function buildTranslationPayload({
  originalLangId,
  translatedLangId,
  attachments,
  coverLetter,
  shippingLabel,
}: {
  originalLangId: any;
  translatedLangId: any;
  attachments: any;
  coverLetter: any;
  shippingLabel: any;
}) {
  return {
    customerId: customerId,
    orderOriginId: 611,
    orderType: 1103,
    initiatedBy: userId,
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

export default buildTranslationPayload;
