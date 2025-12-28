export const Services = [
  "Apostille",
  "Embassy Legalization",
  "Notary",
  "Dispatch",
];

export const AdditionalServices = ["Pre-Scan", "Post-Scan", "Rush"];

export const DashboardServices = [
  {
    icon: "/usembassy-dashboard-logo.png",
    title: "U.S. Apostilles & Legalizations",
    description: "Fast and reliable apostille services for US documents",
    href: "/orders/new/us-authentication",
  },
  {
    icon: "/globalembassy-dashboard-logo.png",
    title: "Global Authentication (Canada, Europe, UK & Others)",
    description: "International document authentication for worldwide use",
    href: "/orders/new/global-authentication",
  },
  {
    icon: "/translation-dashboard-logo.png",
    title: "Translation Service",
    description: "Certified translation services in multiple languages",
    href: "/orders/new/translation-service",
  },
  {
    icon: "/visaservice-dashboard-logo.png",
    title: "Visa Service",
    description: "Expert visa application assistance and processing",
    href: "/orders/new/visa-service",
  },
  {
    icon: "/notary-dashboard-logo.png",
    title: "Notary Service",
    description: "Official notarization of your documents.",
    href: "/orders/new/notary-service",
  },
  {
    icon: "/dispatch-dashboard-logo.png",
    title: "Dispatch Service",
    description: "Secure courier delivery with tracking.",
    href: "/orders/new/dispatch-service",
  },
];

export const ADDITIONAL_QUESTIONS: any = {
  1: {
    text: "Have you signed and notarized the document from the U.S address mentioned on the document?",
    subText: "",
  },
  2: {
    text: "Please select the state of origin of the document",
    subText: "",
  },
  3: {
    text: "Would you like to include photocopies or WCS will make required photocopies?",
    subText: "",
  },
  4: {
    text: "Have you notarized and certified the document from your in-state Secretary of State?",
    subText:
      "For <countryName>, all general documents must be notarized and certified by the Secretary of State in the state of origin\nFor <countryName>, all personal documents must be notarized and certified by the Secretary of State in the state of origin",
  },
  5: {
    text: "Have you obtained certification from the U.S. Department of State?",
    subText: "",
  },
  6: {
    text: "Does your document originate from the following states?",
    subText:
      "Delaware, Florida, Georgia, Maryland, North Carolina, South Carolina, Virginia, Washington DC, West Virginia, Washington",
  },
  7: {
    text: "Do you have Corporate or Personal Document?",
    subText: "",
  },
  8: {
    text: "Optional Arab Chamber Stamp",
    subText: "",
  },
  9: {
    text: "Does your document originate from the following states?",
    subText:
      "Delaware, Florida, Georgia, Louisiana, Maine, Maryland, Massachusetts, Mississippi, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Alabama, Connecticut, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia, Michigan, Washington DC, Puerto Rico",
  },
  10: {
    text: "Does your document originate from the other states?",
    subText: "",
  },
  11: {
    text: "Does your document originate from the following states?",
    subText:
      "Maryland, Virginia, North Carolina, South Carolina, Georgia, Louisiana, Mississippi, Arkansas, Oklahoma, Texas, Alabama, Washington DC, Tennessee, Florida, Wyoming, Puerto Rico",
  },
  12: {
    text: "How many products are listed on your document? The Nigerian Embassy charges $100 per product.",
    subText: "",
  },
  13: {
    text: "Does your document originate from the following states?",
    subText:
      "Washington DC, Maryland, Virginia, North Carolina, South Carolina, North Dakota, Nebraska, West Virginia, Arkansas, Kentucky, Delaware, South Dakota, Puerto Rico",
  },
  14: {
    text: "Is your document Letter of Authority or Power of Attorney?",
    subText: "",
  },
  15: {
    text: "Special Document Upload headings:",
    subText:
      "Upload un-notarized document (document will be notarized by WCS and certified by MD Secretary of State)\nPlease mail original, notarized document (document will be certified by local Secretary of State where document is notarized)",
  },
};
