import { getBarcode, getRegionAddress } from "@/services/cartServices";

const fetchBarcodeForDoc = async (docId: number): Promise<string> => {
  try {
    const response = await getBarcode(docId);
    return response.barcode || "";
  } catch (error) {
    console.error(`Error fetching barcode for docId ${docId}:`, error);
    return "";
  }
};

export const buildPrintCoverPayload = async (
  order: any,
  countryMapById: Record<number, any>,
  stopMapById: Record<number, any>,
  docTypeMapById: Record<number, any>,
  userData: any
) => {
  const docs = order?.dockets?.flatMap((d: any) => d.docs ?? []) ?? [];

  let region: any = undefined;
  if (order.regionId != 0) {
    const regionResponse = await getRegionAddress(order.regionNote);
    region = regionResponse?.[0];
  }

  if (!docs.length) {
    throw new Error("No documents found for this order");
  }

  const firstDoc = docs[0];

  const docsWithBarcodes = await Promise.all(
    docs.map(async (doc: any) => {
      const barcode = await fetchBarcodeForDoc(doc.docId);
      return {
        ...doc,
        barcode: barcode,
      };
    })
  );

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
      address: order.billAddress || "",
      country:
        countryMapById[firstDoc.countryId]?.countryShortName ??
        countryMapById[firstDoc.countryId]?.countryName,
      phone: firstDoc.contactNo,
    },

    region: region,

    shppingInstructions: {
      regionId: order.regionId,
      labelByMail: order.labelByMail,
      useUserCourier: order.useUserCourier,
      pickupOrDropOff: order.pickupOrDropOff,
      payLaterOptions: order.payLaterOptions,
    },

    documents: docsWithBarcodes.map((doc: any) => ({
      docId: doc.docId,
      orderId: order.orderId,
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

      internalReference: order.orderType == 1102 ? doc.visa[0].customerReference : doc.internalReference,
      invoiceReference: doc.invoiceReference,
      instructions: doc.instructions,

      stops:
        doc.docStops?.map((ds: any) => {
          const stop = stopMapById[ds.stopId];

          return {
            stopName: stop?.stopName ?? `Stop ${ds.stopId}`,
            processDays: ds.processDays,
          };
        }) ?? [],
    })),
  };
};
