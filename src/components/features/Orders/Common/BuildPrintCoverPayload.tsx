import { PrintCoverPayload } from "@/app/utils/generatePDF";


export const buildPrintCoverPayload = (
  order: any,
  countryMapById: Record<number, any>,
  stopMapById: Record<number, any>,
  docTypeMapById: Record<number, any>,
  userData: any,
) => {
  // ✅ Flatten docs from dockets
  const docs =
    order?.dockets?.flatMap((d: any) => d.docs ?? []) ?? [];

  if (!docs.length) {
    throw new Error("No documents found for this order");
  }

  const firstDoc = docs[0];

  return {
    fileName: `Order_${order.orderId}_Cover.pdf`,
    orderId: order.orderId,

    userDetails: {
      customerId: userData.customerId,
      customerName: userData.customerName,
      userName: userData.userName,
      email: userData.email,
      contactNo: userData.contactNo,
    },

    returnAddress: {
      name: firstDoc.customerName,
      address: order.shipAddress || "",
      country:
        countryMapById[firstDoc.countryId]?.countryShortName ??
        countryMapById[firstDoc.countryId]?.countryName,
      phone: firstDoc.contactNo,
    },

    documents: docs.map((doc: any) => ({
      docId: doc.docId,
      barcode: doc.barcode || "-",
      docCategoryName: docTypeMapById[doc.docCategoryId]?.lookupName,

      countryName:
        countryMapById[doc.countryId]?.countryShortName ??
        countryMapById[doc.countryId]?.countryName,

      originCountryName:
        countryMapById[doc.originCountryId]?.countryShortName ??
        countryMapById[doc.originCountryId]?.countryName,

      isRush: doc.isRush,
      isScan: doc.isScan,
      isPostScan: doc.isPostScan,

      stops: doc.docStops?.map((ds: any) => {
        const stop = stopMapById[ds.stopId];

        return {
          stopName: stop?.stopName ?? `Stop ${ds.stopId}`,
          processDays: ds.processDays,
        };
      }) ?? [],
    })),
  };
};

