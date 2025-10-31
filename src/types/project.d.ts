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
