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

function buildTranslationPayload({
  originalLangId,
  translatedLangId,
  attachments,
  coverLetter,
  shippingLabel,
  additionalComments,
}: {
  originalLangId: any;
  translatedLangId: any;
  attachments: any;
  coverLetter: any;
  shippingLabel: any;
  additionalComments?: string;
}) {
  const userId = getAuthValue("userId");
  const customerId = getAuthValue("customerId");
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
            instructions: additionalComments || null,
          },
        ],
      },
    ],
  };
}

export default buildTranslationPayload;
