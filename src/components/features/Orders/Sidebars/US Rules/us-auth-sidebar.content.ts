// /config/us-auth-sidebar.content.ts

export interface SidebarContent {
    title: string;
    paragraphs: string[];
    sampleDoc: string;
    flag?: string;
}

const COUNTRIES_REQUIRING_NOTARIZATION = new Set([
    "algeria",
    "egypt",
    "iraq",
    "qatar",
]);

const embassyBaseParagraph = (countryName: string) =>
    `Documents for ${countryName} will go through Embassy Legalization which is the alternative method for authenticating a document that is utilized for countries that are Non-Hague Convention countries. These countries do not recognize the Apostille as a means to authenticating documents per the 1961 Hague Convention.`;

const notarizationParagraph = (countryName: string) =>
    `For ${countryName} documents, please make sure to prepare your documents correctly prior to sending it to WCS: Document should be signed, dated and notarized from the U.S address mentioned on the document.`;


export const SIDEBAR_CONTENT = {
    APOSTILLE_GENERAL: {
        title: "Apostille Services for Hague Countries (General Document)",
        paragraphs: [
            "Apostille is French for “certification” and represents the authentication of an official gold seal or signature on a document. If you are sending your documents to a country that is part of the 1961 Hague Convention, an Apostille certificate is used as proof of authenticity among the member nations.",
            "By default, the document will be apostilled by MD Secretary of State (notarization is included as part of the process).",
        ],
        sampleDoc: "/us-auth/samples/apostille-general.jpg",
    },

    APOSTILLE_FEDERAL: {
        title: "Apostille Services for Hague Countries (Federal Government Document)",
        paragraphs: [
            "Apostille is French for “certification” and represents the authentication of an official gold seal or signature on a document.",
            "Documents will be apostilled by US Department of State (USDOS).",
            "Federally issued documents should not be notarized.",
        ],
        sampleDoc: "/us-auth/samples/apostille-federal.jpg",
    },

    EMBASSY_GENERAL: {
        title: "Embassy Legalization",
        paragraphs: [
            "International documents that have originated in one country but are intended for use in another country require embassy legalization to be recognized by the legal system of the foreign country.",
            "Embassy legalization is the alternative method for authenticating a document that is utilized for countries that are Non-Hague Convention countries. These countries do not recognize the Apostille as a means to authenticate documents per the 1961 Hague Convention.",
        ],
        sampleDoc: "/us-auth/samples/embassy-legalization.jpg",
    },

    EMBASSY_COUNTRY: (countryName: string): SidebarContent => {
        const slug = countryName.toLowerCase().replace(/\s+/g, "-");

        return {
            title: `Embassy Legalization - ${countryName}`,
            paragraphs: [
                embassyBaseParagraph(countryName),
                ...(COUNTRIES_REQUIRING_NOTARIZATION.has(slug)
                    ? [notarizationParagraph(countryName)]
                    : []),
            ],
            flag: `/us-auth/flags/${slug}.jpg`,
            sampleDoc: `/us-auth/samples/${slug}.jpg`,
        };
    },
};

