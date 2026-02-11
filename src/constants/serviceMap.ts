export const CART_SERVICE_MAP: any = {
  "us-authentication": {
    isUSOrigin: 1,
    orderType: 1101,
  },
  "global-authentication": {
    isUSOrigin: 0,
    orderType: 1101,
  },
  "visa-service": {
    isUSOrigin: 1,
    orderType: 1102,
  },
  "translation-service": {
    isUSOrigin: 1,
    orderType: 1103,
  },
  "notary-service": {
    isUSOrigin: 1,
    orderType: 1101,
    docCategoryId: 528,
  },
  "dispatch-service": {
    isUSOrigin: 1,
    orderType: 1101,
    docCategoryId: 529,
  },
  "bulk-ordering": {
    isUSOrigin: 1,
    orderType: 1104,
  }
};