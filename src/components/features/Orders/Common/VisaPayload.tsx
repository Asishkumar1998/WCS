// Users constants
const CustomerId = 9682;
const UserId = 7437;

function buildVisaPayload() {
  return {
    customerId: CustomerId,
    orderOriginId: 611,
    orderType: 1102,
    initiatedBy: UserId,
    isUSOrigin: true,
    dockets: [
      {
        docs: [
          {
            orderOriginId: 611,
            barcode: "",
            description: "",
            countryId: 2,
            docCategoryId: 526,
            isPostScan: true,
            originCountryId: 190,
            visa: [
              {
                typeOfPassport: 971,
                passportValidity: "2026-07-17T18:30:00.000Z",
                typeOfVisa: 991,
                NumberOfEntries: 1,
                applicantGivenName: "Raghvendra",
                lastName: "Roy",
                state: 1,
                dateOfDeparture: "2025-12-18T18:30:00.000Z",
                originCountryOfPassPort: 190,
                dateOfBirth: "1997-02-17T18:30:00.000Z",
                gender: "Male",
                placeOfBirth: "Fiji",
                passportNumber: "123456789",
                passportIssuanceDate: "2025-12-16T18:30:00.000Z",
                isExpedited: true,
                expeditedDate: "2025-12-22T18:30:00.000Z",
                customerReference: "Customer Reference",
                additionalComments: "Additional Comments",
              },
            ],
          },
        ],
      },
    ],
  };
}
