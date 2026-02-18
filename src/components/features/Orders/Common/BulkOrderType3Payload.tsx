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

const mapAdditionalServices = (services: string[]) => ({
  isRush: services.includes("Rush"),
  isScan: services.includes("Pre-Scan"),
  isPostScan: services.includes("Post-Scan"),
});

const toDocAttachmentGroups = (uploadedAttachments: any) => {
  if (!Array.isArray(uploadedAttachments)) return [[]];
  if (uploadedAttachments.length === 0) return [[]];
  return uploadedAttachments.map((attachment) => [attachment]);
};

const buildBulkDoc = ({
  country,
  document,
  additionalServices,
  uploadedAttachments,
  customerReference,
  additionalComments,
  numberOfPages,
  trackingNo,
  courierType,
}: any) => {
  const YES = 651;
  const NO = 652;

  const hasAttachments =
    Array.isArray(uploadedAttachments) && uploadedAttachments.length > 0;

  return {
    countryId: country.countryId,
    originCountryId: 190,
    docCategoryId: document.docCategoryId,
    docTypeId: document.docTypeId,

    ...mapAdditionalServices(additionalServices),

    isDispatch: false,
    isNotarized: NO,
    isCopy: false,
    isSoSDone: NO,
    isDoSDone: NO,

    noOfPages: numberOfPages === "" ? undefined : numberOfPages,
    noOfPhotoCopyPages: undefined,
    noOfProducts: 0,

    isSoftCopyGiven: hasAttachments ? YES : NO,
    isGeneralSoftCopy: hasAttachments ? YES : NO,
    isPhotocopyInclude: YES,

    attachments: uploadedAttachments ?? [],

    CIAmount: "0",
    additionalDOX: "",
    COCount: 0,
    CICount: 1,

    internalReference: customerReference ?? "",
    instructions: additionalComments ?? "",

    incomingTracking: trackingNo ?? undefined,
    incomingTrackingType: courierType ?? undefined,
  };
};

const buildBulkMultiDocMultiCountryPayload = ({
  countries,
  countryDocuments,
  additionalComments,
}: {
  countries: any[];
  countryDocuments: Record<
    string,
    {
      document: any;
      additionalServices: string[];
      uploadedAttachments: any[];
      uploadData: any;
      reference?: string;
    }[]
  >;
  additionalComments?: string;
}) => {
  const userId = getAuthValue("userId");
  const customerId = getAuthValue("customerId");

  const hagueCountries = countries.filter((c) => c.countryTypeId === 501);
  const nonHagueCountries = countries.filter((c) => c.countryTypeId === 502);

  const dockets: any[] = [];

  const buildDocsForCountry = (country: any) => {
    const entries = countryDocuments[country.countryShortName] ?? [];

    return entries.flatMap((entry) => {
      const attachmentGroups = toDocAttachmentGroups(entry.uploadedAttachments);

      return attachmentGroups.map((attachments) =>
        buildBulkDoc({
          country,
          document: entry.document,
          additionalServices: entry.additionalServices,
          uploadedAttachments: attachments,
          customerReference: entry.reference,
          additionalComments,
          numberOfPages: entry.uploadData?.numPages ?? "",
          trackingNo: entry.uploadData?.trackingNumberNested,
          courierType: entry.uploadData?.courierNested,
        }),
      );
    });
  };

  if (hagueCountries.length > 0) {
    const docs = hagueCountries.flatMap((country) =>
      buildDocsForCountry(country),
    );

    if (docs.length > 0) {
      dockets.push({ docs });
    }
  }

  nonHagueCountries.forEach((country) => {
    const docs = buildDocsForCountry(country);

    if (docs.length > 0) {
      dockets.push({ docs });
    }
  });

  return {
    customerId,
    orderOriginId: 611,
    orderType: 1104,
    initiatedBy: userId,
    dockets,
  };
};

export default buildBulkMultiDocMultiCountryPayload;
