const getSafeStorageValue = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

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
  const userId = getSafeStorageValue("userId");
  const customerId = getSafeStorageValue("customerId");
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
