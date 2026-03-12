// /config/us-auth-sidebar.content.ts

export interface SidebarContent {
    title: string;
    paragraphs: string[];
    sampleDoc: string;
    flag?: string;
}

const COUNTRY_IMAGE_FILE_NAMES: Record<string, string> = {
    algeria: "Algeria.jpg",
    cambodia: "Cambodia.jpg",
    egypt: "Egypt.jpg",
    ethiopia: "Ethiopia.jpg",
    ghana: "Ghana.jpg",
    haiti: "Haiti.jpg",
    iraq: "Iraq.jpg",
    jordan: "Jordan.jpg",
    kenya: "Kenya.jpg",
    kurdistan: "Kurdistan.jpg",
    kuwait: "Kuwait.jpg",
    lebanon: "Lebanon.jpg",
    libya: "Libya.jpg",
    myanmar: "Myanmar.jpg",
    nepal: "Nepal.jpg",
    nigeria: "Nigeria.jpg",
    qatar: "Qatar.jpg",
    taiwan: "Taiwan.jpg",
    thailand: "Thailand.jpg",
    turkmenistan: "Turkmenistan.jpg",
    "united-arab-emirates": "united-arab-emirates.jpg",
    vietnam: "Vietnam.jpg",
    yemen: "Yemen.jpg",
};

const getCountryImagePath = (slug: string, folder: "flags" | "samples") => {
    const fileName = COUNTRY_IMAGE_FILE_NAMES[slug] ?? `${slug}.jpg`;
    return `/us-auth/${folder}/${fileName}`;
};

const COUNTRIES_REQUIRING_NOTARIZATION = new Set([
    "algeria",
    "egypt",
    "iraq",
    "qatar",
    "yemen",
    "kurdistan",
]);

const embassyBaseParagraph = (countryName: string) =>
    `Documents for ${countryName} will go through Embassy Legalization which is the alternative method for authenticating a document that is utilized for countries that are Non-Hague Convention countries. These countries do not recognize the Apostille as a means to authenticating documents per the 1961 Hague Convention.`;

const notarizationParagraph = (countryName: string) =>
    `For ${countryName} documents, please make sure to prepare your documents correctly prior to sending it to WCS: <mark style="background-color: yellow;">Document should be signed, dated and notarized from the U.S address mentioned on the document.</mark>`;


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
            "Apostille is French for “certification” and represents the authentication of an official gold seal or signature on a document. If you are sending your documents to a country that is part of the 1961 Hague Convention, an Apostille certificate is used as proof of authenticity among the member nations.",
            "Documents will be apostilled by US Department of State (USDOS).",
            "<em>Federally issued documents should not be notarized.</em>",
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

        if (countryName === "Iraq") {
            return SIDEBAR_CONTENT.IRAQ_DOC;
        }
        if (countryName === "Taiwan") {
            return SIDEBAR_CONTENT.TAIWAN_DOC;
        }
        if (countryName === "Lebanon") {
            return SIDEBAR_CONTENT.LEBANON_DOC;
        }

        return {
            title: `Embassy Legalization - ${countryName}`,
            paragraphs: [
                embassyBaseParagraph(countryName),
                ...(COUNTRIES_REQUIRING_NOTARIZATION.has(slug)
                    ? [notarizationParagraph(countryName)]
                    : []),
            ],
            flag: getCountryImagePath(slug, "flags"),
            sampleDoc: getCountryImagePath(slug, "samples"),
        };
    },

    IRAQ_DOC: {
        title: "Embassy Legalization - Iraq",
        paragraphs: [
            "The Embassy of Iraq requires that the document include the party and address of the party in Iraq.",
            "For documents with multiple pages, they must be numbered in the following format: 1 of 3; 2 of 3; 3 of 3, in order for the embassy to accept this as one document.",
            "Product origin must be in the U.S.",
            "The embassy requires all supporting documents to legalize/process shipping documents: Bill of Lading, Inspection Certificate, and Insurance Policy (copies only).",
            "If a commercial invoice also needs to be legalized, it must be legalized together with its certificate of origin, with one legalization stamp.",
        ],
        flag: getCountryImagePath("iraq", "flags"),
        sampleDoc: getCountryImagePath("iraq", "samples"),
    },
    TAIWAN_DOC: {
        title: "Embassy Legalization - Taiwan",
        paragraphs: [
            "The Embassy of Taiwan (Taipei Economic and Cultural Representative Office-TECRO) requires 2 documents for legalization of documents:",
            "1. A Permission Letter signed by a representative of the Company authorizing WCS to submit the documents for legalization",
            "NOTE:  The signature on this letter must be notarized",
            "2. A copy of the Personal Identification of a person who signs the Permission Letter  Once provided to the Embassy, these documents do not have to be renewed for two (2) years",
            "NOTE:  The Permission Letter and Personal Identification must be from the state of origin of the document",
        ],
        flag: getCountryImagePath("taiwan", "flags"),
        sampleDoc: getCountryImagePath("taiwan", "samples"),
    },
    LEBANON_DOC: {
        title: "Embassy Legalization - Lebanon",
        paragraphs: [
            "Consulate requires a Power of Attorney signed by a person in the submitting organization",
            "Key Distinction:  The POA must be an internal document authorizing the individual to act for the Company in the submission of the document for legalization.",
            "And, the person authorized under the POA must submit his/her personal identification (copy of driver’s license)",
        ],
        flag: getCountryImagePath("lebanon", "flags"),
        sampleDoc: getCountryImagePath("lebanon", "samples"),
    },

};
