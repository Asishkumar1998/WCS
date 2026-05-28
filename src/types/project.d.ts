export interface NewsItem {
  title: {
    rendered: string;
  };
  content: object;
  link: string;
  modified: string;
}

export interface UpdateItem {
  updateId: number;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  isActive: boolean;
  updateStatus: number;
  title: string;
  description: string;
  attachment: any[];
  publishedDate: string;
  url?: string;
}

export interface Country {
  countryId: number;
  countryName: string;
  countryShortName: string;
  genC2ACode: string;
  genC3ACode: string;
  countryTypeId: number;
  isEmbassyOOS: number;
  nusaccRequired: number;
  processDays: number;
  active: number;
  SosException: number;
  isShipping: number;
  copies: number;
  shippingCopies: number;
  physicalRequired: number;
  shippingException: number;
  isEMBShipping: number;
  regionId: number;
}

interface Notification {
  notificationId: number;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  subject: string;
  messageBody: string;
  readStatus: string;
  parentId: number;
  customerId: number;
  initiatedBy: number;
  orderId: number;
  docketId: number;
  docId: number;
  invoiceId: number;
  paymentId: number;
  emailToCustomer: number;
  putOnHold: number;
  rootId: number;
  attachments: any[];
  origin: number;
  emailUserId: number;
  docState: number;
  orderDate: string;
  countryId: number;
  countryName: string;
  cName: string;
}

interface AdditionalQuestionsComponent {
  country: Country;
  states: {
    stateId: number;
    stateName: string;
    stateShortName: string;
    active: boolean;
  }[];
  setAdditionalPreferences: any;
}
