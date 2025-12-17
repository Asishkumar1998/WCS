"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  CardContent,
  Card,
  CardHeader,
} from "@mui/material";
// import Grid from "@mui/material/Grid2";

import { Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSearchParams } from "next/navigation";
import { getBarcode, getOrder, SplitOrder } from "@/services/cartServices";
import { countries } from "@/dataset/countries";

const DOC_TYPE_OPTIONS = [
  { label: "Federal Government", id: 521 },
  { label: "General", id: 522 },
  { label: "Shipping/Commercial", id: 523 },
  { label: "International", id: 525 },
  { label: "Visa", id: 526 },
  { label: "Translation", id: 527 },
  { label: "Notary", id: 528 },
  { label: "Dispatch", id: 529 },
];

interface ConfirmedDocument {
  docId: number;
  docCountryName: string;
  docCategoryName: string;
  docTypeName: string;
  orderId: number;
  modifiedAt: string;
  barcode: string;
  name: string;
  email: string;
  contactNo: string;
  internalReference: string;
}

const OrderConfirmation = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") as string;

  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [barcodeMap, setBarcodeMap] = useState<Record<number, string>>({});

  const getData = async () => {
    const orderIds = await SplitOrder(orderId);
    const orders = await Promise.all(
      orderIds.map(async (id: number) => {
        const response = await getOrder(id);
        return response[0];
      })
    );
    setAllOrders(orders);
  };

  useEffect(() => {
    getData();
  }, [orderId]);

  const documents = useMemo(() => {
    return allOrders.flatMap(
      (order) =>
        order.dockets?.flatMap(
          (docket: any) =>
            docket.docs?.map((doc: any) => ({
              ...doc,
              orderId: order.orderId,
              modifiedAt: order.modifiedAt,
            })) || []
        ) || []
    );
  }, [allOrders]);

  useEffect(() => {
    if (!documents.length) return;

    const docsWithoutBarcode = documents.filter(
      (doc) => !doc.barcode || doc.barcode.trim() === ""
    );

    if (!docsWithoutBarcode.length) return;

    const fetchBarcodes = async () => {
      const results = await Promise.all(
        docsWithoutBarcode.map(async (doc) => {
          const res = await getBarcode(doc.docId);
          return { docId: doc.docId, barcode: res.barcode };
        })
      );

      setBarcodeMap((prev) => {
        const updated = { ...prev };
        results.forEach(({ docId, barcode }) => {
          updated[docId] = barcode;
        });
        return updated;
      });
    };

    fetchBarcodes();
  }, [documents]);

  const handleDownloadAll = () => {};
  const handlePrintAll = () => {};
  const handleDownloadSingle = (docId: number) => {};

  return (
    <Box sx={{ mt: "125px", px: 3 }}>
      {/* ===== Header ===== */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
      >
        <Box display="flex" alignItems="center" gap={2}>
          <CheckCircleIcon sx={{ fontSize: 30, color: "#04BD6F" }} />
          <Box>
            <Typography sx={{ color: "#04BD6F", fontWeight: 600 }}>
              Order Placed Successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Download and keep your Order Copy with you.
            </Typography>
          </Box>
        </Box>

        <Box>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            startIcon={<DownloadIcon />}
            onClick={handleDownloadAll}
          >
            Download All Order Forms
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrintAll}
          >
            Print All Order Forms
          </Button>
        </Box>
      </Box>

      {/* ===== Documents ===== */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {documents.map((doc) => {
          const resolvedBarcode =
            doc.barcode && doc.barcode.trim() !== ""
              ? doc.barcode
              : barcodeMap[doc.docId];
          return (
            <Box key={doc.docId} width={{ xs: "100%", md: "48%" }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                {/* ===== Header ===== */}
                <CardHeader
                  title={
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      Doc ID: {doc.docId}
                    </Typography>
                  }
                  action={
                    <Box
                      display="flex"
                      alignItems="center"
                      height="100%"
                      pr={1}
                    >
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadSingle(doc.docId)}
                        sx={{
                          color: "#fff",
                          textTransform: "none",
                          fontSize: "0.8rem",
                        }}
                      >
                        Download Order Form
                      </Button>
                    </Box>
                  }
                  sx={{
                    backgroundColor: "#C3002F",
                    py: 1,
                  }}
                />

                {/* ===== Body ===== */}
                <CardContent sx={{ p: 2 }}>
                  {/* Top Section */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    flexWrap="wrap"
                  >
                    {/* Left */}
                    <Box width={{ xs: "100%", md: "52%" }}>
                      <Typography fontWeight={600}>
                        {countries?.find(
                          (c: any) => c.countryId === doc.countryId
                        )?.countryShortName || doc.countryId}{" "}
                      </Typography>
                      <Typography color="text.secondary">
                        {DOC_TYPE_OPTIONS?.find(
                          (d: any) => d.id === doc.docCategoryId
                        )?.label || doc.docCategoryId}{" "}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Typography variant="body2">{doc.docTypeName}</Typography>
                      <Typography variant="body2">
                        Order No: {doc.orderId}
                      </Typography>
                      <Typography variant="body2">
                        Date: {new Date(doc.modifiedAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    {/* Right (Barcode) */}
                    <Box
                      width={{ xs: "100%", md: "45%" }}
                      display="flex"
                      justifyContent="flex-end"
                      mt={{ xs: 2, md: 0 }}
                    >
                      {resolvedBarcode && (
                        <Box
                          sx={{
                            maxWidth: 220,
                            border: "1px solid #eee",
                            borderRadius: "6px",
                            p: 1,
                          }}
                        >
                          <img
                            src={`data:image/jpeg;base64,${resolvedBarcode}`}
                            alt={String(doc.orderId)}
                            style={{ width: "100%" }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Bottom Section */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={2}
                    flexWrap="wrap"
                  >
                    <Box width={{ xs: "100%", md: "48%" }}>
                      <Typography variant="body2">Name: {doc.name}</Typography>
                      <Typography variant="body2">
                        Email: {doc.email}
                      </Typography>
                    </Box>

                    <Box width={{ xs: "100%", md: "48%" }}>
                      <Typography variant="body2">
                        Contact: {doc.contactNo}
                      </Typography>
                      <Typography variant="body2">
                        Reference: {doc.internalReference || "-"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default OrderConfirmation;
