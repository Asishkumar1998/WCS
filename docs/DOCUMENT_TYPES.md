# Document Types

This document lists all supported document types in the WCS platform, organized by category.

## Categories

| Category ID | Category Name       |
|-------------|---------------------|
| 521         | Federal Government  |
| 522         | General             |
| 523         | Shipping/Commercial |
| 524         | Not Sure            |

---

## Federal Government Documents (Category 521)

| ID  | Document Name                                             | Physical Required |
|-----|-----------------------------------------------------------|:-----------------:|
| 6   | Personal Docs (Birth/Death/Marriage/Divorce Certificate)  | ✅                |
| 15  | U.S. Environmental Protection Agency (EPA)                | ✅                |
| 16  | FBI Background Checks                                     | ✅                |
| 28  | U.S. Dept. of Agriculture (USDA)                          | ✅                |
| 29  | U.S. Dept. of Homeland Security (DHS)                     | ✅                |
| 30  | U.S. FDA Hard Copy Paper Originals (CFG, CPP, CFS, COE)   | ✅                |
| 31  | U.S. Patent & Trademark Office (USPTO)                    | ✅                |
| 35  | Others                                                    | ✅                |
| 77  | U.S. FDA Electronic Originals (eCPP, eCFG, eCFS, eCOE)   | ✅                |

---

## General Documents (Category 522)

| ID  | Document Name                                             | Physical Required |
|-----|-----------------------------------------------------------|:-----------------:|
| 1   | Accreditation letters                                     | ✅                |
| 2   | Affidavits                                                | ✅                |
| 3   | Attorney Bar Certificate                                  | ✅                |
| 4   | Authorization letters to obtain academic records          | ✅                |
| 9   | Company bylaws                                            | ✅                |
| 10  | Corporate Formation Documents                             | ✅                |
| 12  | Distributorship Agreements                                | ✅                |
| 14  | Education records (Diplomas, Degrees, etc.)               | ✅                |
| 17  | Good standing certificates                                | ✅                |
| 19  | Minutes of board meetings                                 | ✅                |
| 20  | Official transcripts                                      | ✅                |
| 21  | Miscellaneous                                             | ✅                |
| 24  | Powers of Attorney                                        | ✅                |
| 25  | Practice licenses for nurses and physicians               | ✅                |
| 26  | Statements of study major                                 | ✅                |
| 27  | Teaching certification                                    | ✅                |
| 37  | Add New Partner                                           | ✅                |
| 38  | Adoption Certificate                                      | ✅                |
| 39  | Arbitration Documents                                     | ✅                |
| 40  | Attestation of Conversion to Islam                        | ✅                |
| 41  | Bill of Guarrantee                                        | ✅                |
| 42  | Bill of Trust Deposit                                     | ✅                |
| 43  | Birth Certficate                                          | ✅                |
| 44  | Board Resolutions                                         | ✅                |
| 45  | Certificate of Chamber Commerce Member                    | ✅                |
| 46  | Commercial License/Renewal                                | ✅                |
| 47  | Company Budget                                            | ✅                |
| 48  | Contracts or Agreements                                   | ✅                |
| 49  | Death Certificate                                         | ✅                |
| 50  | Divorce Certificate                                       | ✅                |
| 51  | End User Certificate                                      | ✅                |
| 52  | Endowment Attestation                                     | ✅                |
| 53  | Health Certificate                                        | ✅                |
| 54  | Incorporation                                             | ✅                |
| 55  | Legal Age Attestation                                     | ✅                |
| 56  | Legal documents                                           | ✅                |
| 57  | Lien or Mortgage Contract                                 | ✅                |
| 58  | Limitation of Inheritance Attestation                     | ✅                |
| 59  | Marital Legalizations                                     | ✅                |
| 60  | Marriage Certificate                                      | ✅                |
| 61  | Marriage License (No objection Attestation)               | ✅                |
| 62  | Medical Reports                                           | ✅                |
| 63  | Modify Capital Shares                                     | ✅                |
| 64  | Real-Estate Lease Contract                                | ✅                |
| 65  | Real-Estate Sale Contract                                 | ✅                |
| 66  | Register Company Branch                                   | ✅                |
| 67  | Renewal Commercial Activities                             | ✅                |
| 68  | Report of Will Unfolding                                  | ✅                |
| 69  | Trademark/Brand Registration                              | ✅                |
| 70  | Will Attestation                                          | ✅                |
| 71  | Writs                                                     | ✅                |
| 73  | Power of Attorney-Individual                              | ✅                |
| 74  | Letter of Authority                                       | ✅                |
| 76  | Non-US                                                    | ✅                |

---

## Shipping/Commercial Documents (Category 523)

| ID  | Document Name              | Physical Required |
|-----|----------------------------|:-----------------:|
| 5   | Bills of Lading            | ✅                |
| 7   | Health Certificate         | ✅                |
| 8   | Sanitary Certificate       | ✅                |
| 22  | Packing List               | ✅                |
| 33  | Halal Certificate          | ✅                |
| 34  | Certificate of Analysis    | ✅                |
| 36  | Others                     | ✅                |
| 75  | Non-US                     | ✅                |

---

## Other (Category 524)

| ID  | Document Name | Physical Required |
|-----|---------------|:-----------------:|
| 32  | Not Sure      | ❌                |

---

## Field Reference

| Field              | Description                                                        |
|--------------------|--------------------------------------------------------------------|
| `docTypeId`        | Unique identifier for the document type                            |
| `docTypeName`      | Human-readable name of the document type                           |
| `docCategoryId`    | Category the document belongs to (see Categories table above)      |
| `personalDoc`      | Personal document sub-type ID (0 = not a personal doc)             |
| `physicalRequired` | Whether the original physical document must be submitted (1 = yes) |
| `ordSequence`      | Display ordering sequence (used for federal government docs)       |
| `attachmentRequired` | Whether a file attachment is required                            |

> **Source:** `src/dataset/document_types.ts`
