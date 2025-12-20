// Users constants
// const CustomerId = 9682;
// const UserId = 7437;

function buildVisaPayload({
  customerId,
  userId,
  country,
  form,
}: {
  customerId: any;
  userId: any;
  country: any;
  form: any;
}) {
  return {
    customerId: customerId,
    orderOriginId: 611,
    orderType: 1102,
    initiatedBy: userId,
    isUSOrigin: true,
    dockets: [
      {
        docs: [
          {
            orderOriginId: 611,
            barcode: "",
            description: "",
            countryId: country,
            docCategoryId: 526,
            isPostScan: true,
            originCountryId: form.originCountryOfPassPort,
            visa: [
              {
                typeOfPassport: form.typeOfPassport,
                passportValidity: form.passportValidity,
                typeOfVisa: form.typeOfVisa,
                NumberOfEntries: form.NumberOfEntries,
                applicantGivenName: form.applicantGivenName,
                lastName: form.lastName,
                state: form.state,
                dateOfDeparture: form.dateOfDeparture,
                originCountryOfPassPort: form.originCountryOfPassPort,
                dateOfBirth: "1997-02-17T18:30:00.000Z",
                gender: "Male",
                placeOfBirth: form.placeOfBirth,
                passportNumber: form.passportNumber,
                passportIssuanceDate: form.passportIssuanceDate,
                isExpedited: true,
                expeditedDate: form.expeditedDate,
                customerReference: form.customerReference,
                additionalComments: form.additionalComments,
              },
            ],
          },
        ],
      },
    ],
  };
}

export default buildVisaPayload;