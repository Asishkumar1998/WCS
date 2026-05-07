"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Button,
  Stack,
  IconButton,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter, useParams } from "next/navigation";

import RichTextEditor from "@/components/ui/RichTextEditor/RichTextEditor";
import OneLineUpload from "@/components/features/Orders/Common/OneLineUpload";

import { addNotification } from "@/services/notificationService";
import { getOrderDetails } from "@/services/cartServices";
import { uploadFile } from "@/services/formsService";
import { getAuth } from "@/app/utils/auth";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";
import { getCountries } from "@/services/userService";

export default function NewConversationPage() {
  const router = useRouter();
  const { id } = useParams();

  const [orderDetails, setOrderDetails] = useState<any>();
  const [subject, setSubject] = useState("");
  const [attachment, setAttachment] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [loaderMessage, setLoaderMessage] = useState<string>("");
  const { showSnackbar } = useSnackbar();

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);
  const editorRef = useRef<any>(null);

  /* ---------------------------------- */
  /* Fetch order info to prefill subject */
  /* ---------------------------------- */
  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      setLoader(true);
      setLoaderMessage("Fetching order details...");

      const orderData = await getOrderDetails({ orderId: id });
      setOrderDetails(orderData[0]);

      const docket = orderData?.[0]?.dockets?.[0];
      const doc = docket?.docs?.[0];
      const countryName = await getCountries();
        const country = countryName.find((c: any) => c.countryId === doc?.countryId);

      const defaultSubject = `Order#: ${id}, Doc#: ${doc?.docId}, ${
        country?.countryShortName ?? country?.countryName ?? ""
      }`;
      setSubject(defaultSubject);
    } finally {
      setLoader(false);
      setLoaderMessage("");
    }
  };

  /* -------------------- */
  /* Upload Attachment */
  /* -------------------- */
  async function uploadAndStore(file: any) {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file_0", file);
      const data = await uploadFile(formData);

      showSnackbar("Document uploaded successfully.", "success");

      setAttachment((prev) => [...prev, ...(Array.isArray(data) ? data : [data]),]);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to upload document", "error");
    }
  }

  /* -------------------- */
  /* Send New Message */
  /* -------------------- */
  const handleSend = async () => {
    const content = editorRef.current?.getContent();
    if (!content || !subject) return;

    try {
      setLoader(true);

      /* Create ROOT notification */
      await addNotification({
        parentId: 0,
        subject,
        messageBody: content,
        attachments: attachment,
        customerId: String(customerId),
        initiatedBy: 1,
        readStatus: "unread",
        emailUserId: userId,
        orderId: String(id),
        origin: 611,
      });

      /* Redirect to conversation list */
      router.push(`/orders/${id}/conversation`);
    } catch (err) {
      console.error("Failed to send new conversation", err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <OverlayLoader open={loader} message={loaderMessage} />
      <Grid container spacing={2} sx={{ mt: "64px", p: 3 }}>
        {/* Compose Area */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: 2,
              height: "85vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <IconButton onClick={() => router.back()}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                New Message
              </Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Subject */}
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            {/* Editor */}
            <Box sx={{ flex: 1 }}>
              <RichTextEditor ref={editorRef} />
            </Box>

            {/* Footer */}
            <Stack direction="row" justifyContent="space-between" mt={2}>
              <OneLineUpload onFileSelect={(file) => uploadAndStore(file)} />
              <Button variant="contained" onClick={handleSend}>
                Send
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Order Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Order Info
            </Typography>
            <Typography variant="body2">Order ID: {id}</Typography>
            {orderDetails && (
              <>
                <Typography variant="body2">
                  Docket: {orderDetails?.dockets?.[0]?.docketId}
                </Typography>
                <Typography variant="body2">
                  Document: {orderDetails?.dockets?.[0]?.docs?.[0]?.docId}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
