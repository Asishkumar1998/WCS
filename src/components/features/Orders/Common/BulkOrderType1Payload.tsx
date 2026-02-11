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

const mapAdditionalServices = (services: {
  preScan?: boolean;
  postScan?: boolean;
  rush?: boolean;
}) => ({
  isRush: !!services?.rush,
  isScan: !!services?.preScan,
  isPostScan: !!services?.postScan,
});

const buildBulkCountryDoc = ({
  country,
  document,
  services,
  uploadedDoc,
  customerReference,
  additionalComments,
  numberOfPages,
  trackingNo,
  courierType,
}: any) => {
  const YES = 651;
  const NO = 652;

  return {
    countryId: country.countryId,
    originCountryId: 190,
    docCategoryId: document.docCategoryId,
    docTypeId: document.docTypeId,

    ...mapAdditionalServices(services),

    isDispatch: false,
    isNotarized: NO,
    isCopy: false,
    isSoSDone: NO,
    isDoSDone: NO,

    noOfPages: numberOfPages === "" ? undefined : numberOfPages,
    noOfPhotoCopyPages: undefined,
    noOfProducts: 0,

    isSoftCopyGiven: uploadedDoc ? YES : NO,
    isGeneralSoftCopy: uploadedDoc ? YES : NO,
    isPhotocopyInclude: YES,

    attachments: uploadedDoc ?? [],

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

const buildBulkSingleDocMultiCountryPayload = ({
  countries,
  document,
  serviceMapping,
  uploadedDoc,
  customerReference,
  additionalComments,
  numberOfPages,
  trackingNo,
  courierType,
}: {
  countries: any[];
  document: any;
  serviceMapping: any;
  uploadedDoc: any;
  customerReference?: string;
  additionalComments?: string;
  numberOfPages?: any;
  trackingNo?: any;
  courierType?: any;
}) => {
  const userId = getAuthValue("userId");
  const customerId = getAuthValue("customerId");

  const hagueCountries = countries.filter((c) => c.countryTypeId === 501);
  const nonHagueCountries = countries.filter((c) => c.countryTypeId === 502);

  const dockets: any[] = [];

  /** 1️⃣ Hague → single docket */
  if (hagueCountries.length > 0) {
    dockets.push({
      docs: hagueCountries.map((country) =>
        buildBulkCountryDoc({
          country,
          document,
          services: serviceMapping[country.countryShortName],
          uploadedDoc,
          customerReference,
          additionalComments,
          numberOfPages,
          trackingNo,
          courierType,
        }),
      ),
    });
  }

  /** 2️⃣ Non-Hague → one docket per country */
  nonHagueCountries.forEach((country) => {
    dockets.push({
      docs: [
        buildBulkCountryDoc({
          country,
          document,
          services: serviceMapping[country.countryShortName],
          uploadedDoc,
          additionalComments,
          customerReference,
          numberOfPages,
          trackingNo,
          courierType,
        }),
      ],
    });
  });

  return {
    customerId,
    orderOriginId: 611,
    orderType: 1104,
    initiatedBy: userId,

    dockets,
  };
};

export default buildBulkSingleDocMultiCountryPayload;
