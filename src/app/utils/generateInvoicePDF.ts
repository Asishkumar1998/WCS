"use client";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export type PdfAction = "print" | "open" | "download";

/* ---------------- Helpers ---------------- */

const $ = (n: number = 0) => `$${n.toFixed(2)}`;

const formatDate = (d?: string) =>
    d
        ? new Date(d).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        })
        : "";

/* ---------------- Main ---------------- */

export const generateExactInvoicePDF = (
    sageInvoiceData: any,
    sageInvoiceReferenceNumber: any,
) => {
    // const sageInvoiceData = data;

    const salesInvoiceData = [];
    let total = 0;
    let creditApplied = 0;
    let totalAmount = 0;

    const billTo = sageInvoiceData.billToAddress.address;
    billTo.name = sageInvoiceData.billToAddress.name;

    let shipTo = null;
    if (sageInvoiceData.invoiceData.shipToAddress) {
        shipTo = sageInvoiceData.invoiceData.shipToAddress.address;
        shipTo.name = sageInvoiceData.invoiceData.shipToAddress.name;
    }

    totalAmount = sageInvoiceData.invoiceData.amount;

    for (let i = 0; i < sageInvoiceData.salesInvoiceSalesLine.length; i++) {
        const salesInvoiceContent = [];
        const salesInvoiceObj = sageInvoiceData.salesInvoiceSalesLine[i];
        if (!salesInvoiceObj) continue;

        salesInvoiceContent.push(
            {
                text: salesInvoiceObj.quantity.toFixed(2),
                alignment: "right",
                fontSize: 9,
                border: [true, false, true, false],
            },
            {
                text: salesInvoiceObj.itemCode,
                fontSize: 9,
                border: [true, false, true, false],
            },
            {
                text: salesInvoiceObj.description,
                fontSize: 9,
                border: [true, false, true, false],
            },
            {
                text: "$" + salesInvoiceObj.unitPrice.toFixed(2),
                alignment: "right",
                fontSize: 9,
                border: [true, false, true, false],
            },
            {
                text: "$" + salesInvoiceObj.amount.toFixed(2),
                alignment: "right",
                fontSize: 9,
                border: [true, false, true, false],
            }
        );
        salesInvoiceData.push(salesInvoiceContent);

        total += salesInvoiceObj.amount;

        creditApplied =
            Number(total || 0) -
            Number(sageInvoiceData.invoiceData.amountDue || 0);

        totalAmount =
            Number(sageInvoiceData.invoiceData.amount || 0) -
            Number(creditApplied || 0);

    }

    let shippingMethod = "";
    let shipDate = "";
    let returnTrackNumber = "";

    const shippingMethodDetails = sageInvoiceData.invoiceData.shippingDetails.map((detail: any) => detail.shippingMethod);
    const shipDateDetails = sageInvoiceData.invoiceData.shippingDetails.map((detail: any) => formatDate(detail.shipDate));
    const returnTrackNumberDetails = sageInvoiceData.invoiceData.shippingDetails.map((detail: any) => detail.returnTrackNumber);

    if (shipDateDetails) {
        shippingMethod = shippingMethodDetails.join(",");
    }
    if (shipDateDetails) {
        shipDate = shipDateDetails.join(",");
    }
    if (shipDateDetails) {
        returnTrackNumber = returnTrackNumberDetails.join(",");
    }

    let removeSpace = 0;

    if (returnTrackNumber) {
        removeSpace = Math.floor(returnTrackNumber.length / 40);
    }

    for (
        let i = 0;
        i < 19 - (sageInvoiceData.salesInvoiceSalesLine.length + removeSpace);
        i++
    ) {
        salesInvoiceData.push([
            { text: "", border: [true, false, true, false] },
            { text: "", border: [true, false, true, false] },
            { text: "", border: [true, false, true, false] },
            { text: "", border: [true, false, true, false] },
            { text: "", border: [true, false, true, false] },
        ]);
    }

    const pdfContents: Array<any> = [];
    const pdfConfig = {
        content: pdfContents,
        pageMargins: [20, 20, 20, 20] as [number, number, number, number],
    };

    console.log({
        total,
        creditApplied,
        totalAmount,
    });

    const content = [
        {
            columns: [
                {
                    stack: [
                        {
                            fontSize: 16,
                            bold: true,
                            text: "Washington Consular Services, Inc",
                            color: "black",
                        },
                        {
                            margin: [0, 5, 0, 0],
                            text: "20 Courthouse Square \n Suite 219 \n Rockville, MD 20850 \n USA",
                            fontSize: 9,
                        },
                        {
                            margin: [0, 5, 0, 0],
                            text: "Phone: 301-605-1500",
                            fontSize: 9,
                        },
                        {
                            text: "Fax: 301-605-1500",
                            fontSize: 9,
                        },
                        {
                            text: "Remittance Advice to: accounts@wcss.com",
                            fontSize: 9,
                        },
                    ],
                },
                {
                    stack: [
                        {
                            alignment: "right",
                            fontSize: 36,
                            bold: true,
                            text: "INVOICE",
                            color: "#808080",
                        },
                        {
                            margin: [0, 5, 0, 0],
                            alignment: "right",
                            fontSize: 9,
                            text: [
                                "Invoice Number: ",
                                {
                                    bold: true,
                                    text: sageInvoiceReferenceNumber,
                                    fontSize: 9,
                                },
                            ],
                        },
                        {
                            alignment: "right",
                            fontSize: 9,
                            text:
                                "Invoice Date: " +
                                formatDate(sageInvoiceData.invoiceData.date),
                        },
                        {
                            alignment: "right",
                            fontSize: 9,
                            text:
                                "Due Date: " +
                                formatDate(sageInvoiceData.invoiceData.dateDue),
                            color: "red",
                        },
                    ],
                },
            ],
        },
        {
            alignment: "justify",
            columns: [
                {
                    margin: [0, 10, 10, 0],
                    table: {
                        heights: [10, 50],
                        widths: ["*"],
                        body: [
                            [
                                {
                                    text: "Bill to:",
                                    fillColor: "#dddddd",
                                    bold: true,
                                    fontSize: 10,
                                },
                            ],
                            [
                                {
                                    text:
                                        billTo.name +
                                        "\n" +
                                        billTo.address1 +
                                        "\n" +
                                        billTo.address2 +
                                        "\n" +
                                        billTo.city +
                                        (billTo.city == "" ? "" : ", ") +
                                        billTo.state +
                                        " " +
                                        billTo.zip +
                                        "\n" +
                                        billTo.country,
                                    fontSize: 10,
                                },
                            ],
                        ],
                    },
                },
                {
                    margin: [10, 10, 0, 0],
                    table: {
                        heights: [10, 50],
                        widths: ["*"],
                        body: [
                            [
                                {
                                    text: "Ship to:",
                                    fillColor: "#dddddd",
                                    bold: true,
                                    fontSize: 10,
                                },
                            ],
                            [
                                {
                                    text:
                                        shipTo.name +
                                        "\n" +
                                        shipTo.address1 +
                                        "\n" +
                                        shipTo.address2 +
                                        "\n" +
                                        shipTo.city +
                                        (shipTo.city == "" ? "" : ", ") +
                                        shipTo.state +
                                        " " +
                                        shipTo.zip +
                                        "\n" +
                                        shipTo.country,
                                    fontSize: 10,
                                },
                            ],
                        ],
                    },
                },
            ],
        },
        {
            margin: [0, 10, 0, 0],
            table: {
                widths: ["28.57%", "42.86%", "28.57%"],
                body: [
                    [
                        {
                            text: "Customer ID",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                        {
                            text: "Customer PO",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                        {
                            text: "Payment Terms",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                    ],
                    [
                        {
                            text: sageInvoiceData.customer.sageCustomerId,
                            alignment: "center",
                            fontSize: 10,
                        },
                        {
                            text: sageInvoiceData.invoiceData.customerPurchaseOrderNumber,
                            fontSize: 10,
                            alignment: "center",
                        },
                        {
                            text: sageInvoiceData.invoiceData.termsDescription,
                            fontSize: 10,
                            alignment: "center",
                        },
                    ],
                ],
            },
        },
        {
            table: {
                widths: ["28.57%", "42.86%", "28.57%"],
                body: [
                    [
                        {
                            border: [true, false, true, true],
                            text: "Shipping Method",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                        {
                            border: [true, false, true, true],
                            text: "Return Tracking Number",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                        {
                            border: [true, false, true, true],
                            text: "Ship Date",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                    ],
                    [
                        {
                            text: shippingMethod,
                            alignment: "center",
                            fontSize: 10,
                        },
                        {
                            text: returnTrackNumber,
                            alignment: "center",
                            fontSize: 10,
                        },
                        {
                            text: shipDate,
                            fontSize: 10,
                            alignment: "center",
                        },
                    ],
                ],
            },
        },
        {
            margin: [0, 10, 0, 0],
            table: {
                heights: 10,
                widths: [50, 90, 230, "*", "*"],
                body: [
                    [
                        {
                            text: "Quantity",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                        {
                            text: "Item",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                        {
                            text: "Description",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                        {
                            text: "Unit Price",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                        {
                            text: "Amount",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 10,
                            alignment: "center",
                        },
                    ],
                    ...salesInvoiceData,
                ],
            },
        },
        {
            table: {
                // heights: ["*", "*", "*", "*", 15, 15],
                widths: ["*", "*", "*", "*", 70],
                body: [
                    [
                        {
                            text: "Remit Via Check",
                            fillColor: "#eeeeee",
                            bold: true,
                            alignment: "center",
                            fontSize: 9,
                        },
                        {
                            text: "Remit Via ACH / Wire",
                            fillColor: "#dddddd",
                            bold: true,
                            fontSize: 9,
                            alignment: "center",
                        },
                        {
                            text: "Remit Via Credit Card",
                            fillColor: "#eeeeee",
                            bold: true,
                            fontSize: 9,
                            alignment: "center",
                        },
                        {
                            text: "Subtotal",
                            fontSize: 9,
                        },
                        {
                            text: "$" + total.toFixed(2),
                            fontSize: 9,
                            alignment: "right",
                        },
                    ],
                    [
                        {
                            fontSize: 8,
                            rowSpan: 4,
                            text: "Washington Consular Services \n 20 Courthouse Square, Suite #219, \n Rockville, MD 20850\n Telephone: 301-605-1500",
                        },
                        {
                            fontSize: 8,
                            rowSpan: 4,
                            text: "Truist Bank\n 467 N Frederick Ave,\nGaithersburg, MD 20877\nAccount #0005154475410 \n ABA Routing #055003308\nSwift Code: BRBTUS33",
                        },
                        {
                            fontSize: 8,
                            rowSpan: 4,
                            text: "E-mail wcs@wcss.com to request payment link",
                        },
                        {
                            fontSize: 8,
                            text: "Total Invoice Amount (Tax 0%)",
                        },
                        {
                            fontSize: 8,
                            text:
                                "$" +
                                (
                                    total + sageInvoiceData.invoiceData.salesTaxAmount
                                ).toFixed(2),
                            alignment: "right",
                        },
                    ],
                    [
                        "",
                        "",
                        "",
                        {
                            fontSize: 9,
                            text: "Payment/Credit Applied",
                        },
                        {
                            fontSize: 9,
                            text: "$" + creditApplied.toFixed(2),
                            alignment: "right",
                        },
                    ],
                    [
                        "",
                        "",
                        "",
                        {
                            fontSize: 9,
                            text: "Due Amount",
                        },
                        {
                            fontSize: 9,
                            text: "$" + sageInvoiceData.invoiceData.amountDue.toFixed(2),
                            alignment: "right",
                        },
                    ],
                    [
                        "",
                        "",
                        "",
                        {
                            rowSpan: 2,
                            fontSize: 9,
                            text: "Check/Credit Memo No:",
                        },
                        {
                            rowSpan: 2,
                            fontSize: 9,
                            text: "",
                            alignment: "right",
                        },
                    ],
                    [
                        {
                            rowSpan: 2,
                            fontSize: 9,
                            colSpan: 3,
                            text: "Failing to pay this invoice by its due date is subject to a penalty late fee in the amount of 3.5% per month. Contact us immediately to wcs@wcss.com if there are discrepancies or if you have questions regarding all balances listed above.",
                        },
                        "",
                        "",
                        "",
                        "",
                    ],
                    [
                        "",
                        "",
                        "",
                        {
                            fontSize: 9,
                            text: "TOTAL",
                            fillColor: "#dddddd",
                            bold: true,
                        },
                        {
                            fontSize: 9,
                            text: "$" + totalAmount.toFixed(2),
                            fillColor: "#dddddd",
                            bold: true,
                            alignment: "right",
                        },
                    ],
                ],
            },
            layout: {
                paddingTop: () => 2,
                paddingBottom: () => 2,
            },
            dontBreakRows: true,
        },
    ];

    pdfContents.push(content);
    const pdf = pdfMake.createPdf(pdfConfig);
    pdf.print();
};
