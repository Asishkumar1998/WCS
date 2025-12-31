"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Avatar,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RichTextEditor from "@/components/ui/RichTextEditor/RichTextEditor";
import { useRouter, useParams } from "next/navigation";
import {
  addNotification,
  addNotificationHistory,
  getCustomerNotification,
  updateNotification,
} from "@/services/notificationService";
import { getOrderDetails } from "@/services/cartServices";
import OneLineUpload from "@/components/features/Orders/Common/OneLineUpload";
import { uploadFile } from "@/services/formsService";
import Loader from "@/components/ui/Loader/Loader";
import { getAuth } from "@/app/utils/auth";

export default function ConversationPage() {
  const [orderDetails, setOrderDetails] = useState<any>();
  const [messages, setMessages] = useState<any[]>([]);
  const [attachment, setAttachment] = useState<any>();
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const { id, conversationDetails } = useParams();

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  // const id = Number(params.id);
  const rootId = Number(conversationDetails);

  const rootConversation = messages.find((m) => m.notificationId === rootId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchConversation();
  }, []);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const data = await getCustomerNotification(Number(id));
      const orderData = await getOrderDetails({ orderId: id });
      setOrderDetails(orderData[0]);

      const threadMessages = data
        .filter((n: any) => n.notificationId === rootId || n.rootId === rootId)
        .sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      setMessages(threadMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const content = editorRef.current?.getContent();
    if (!content) return;

    try {
      setLoading(true);

      updateNotification(rootId, {
        readStatus: "replied",
        modifiedAt: new Date().toISOString(),
      });

      addNotification({
        parentId: rootId,
        subject: rootConversation.subject,
        messageBody: content,
        attachments: attachment,
        customerId: String(customerId),
        initiatedBy: 1,
        readStatus: "unread",
        emailUserId: userId,
        orderId: String(id),
        origin: 611,
      });

      const docketId = orderDetails?.dockets[0].docketId;
      const docId = orderDetails?.dockets[0].docs[0].docId;
      const countryId = orderDetails?.dockets[0].docs[0].countryId;

      addNotificationHistory({
        notificationId: rootId,
        notificationSubject: rootConversation.subject,
        notificationBody: rootConversation.messageBody,
        parentId: 0,
        customerId,
        id,
        docketId,
        docId,
        countryId,
        notificationBy: userId,
        rootId: 0,
        origin: 611,
        initiatedBy: 1,
        dismissedBy: String(userId),
      });

      await fetchConversation();

      editorRef.current?.clear();
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setLoading(false);
    }
  };

  async function uploadAndStore(file: any) {
    if (!file) return;

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);
        const data = await uploadFile(formData);
        setAttachment(data);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <>
      {loading && <Loader />}
      <Grid container spacing={3} sx={{ mt: 8, px: 3 }}>
        {/* Conversation Panel */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              height: "85vh",
              display: "flex",
              flexDirection: "column",
              p: 2,
            }}
          >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <IconButton onClick={() => router.back()}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                Order #{id} • Conversation
              </Typography>
            </Stack>
            <Divider />

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                mt: 2,
                mb: 1,
                pr: 1,
              }}
            >
              {messages.map((msg) => {
                const isCustomer = msg.initiatedBy === 1;
                return (
                  <Box
                    key={msg.notificationId}
                    sx={{
                      display: "flex",
                      justifyContent: isCustomer ? "flex-end" : "flex-start",
                      mb: 1.5,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: "70%",
                        borderRadius: 3,
                        bgcolor: isCustomer ? "primary.light" : "grey.300",
                        color: isCustomer ? "#fff" : "#000",
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        {isCustomer ? "You" : "Processor"}
                      </Typography>
                      <Typography
                        variant="body2"
                        dangerouslySetInnerHTML={{ __html: msg.messageBody }}
                        sx={{ mb: 1 }}
                      />
                      {msg.attachments?.map((a: any) => (
                        <Typography
                          key={a.attachmentId}
                          variant="body2"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => window.open(a.fileUrl)}
                        >
                          📎 {a.fileName}
                        </Typography>
                      ))}
                      <Typography
                        variant="caption"
                        sx={{ display: "block", textAlign: "right", mt: 1 }}
                      >
                        {new Date(msg.createdAt).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Box>
                );
              })}
              <div ref={messagesEndRef} />
            </Box>

            {/* Reply Editor */}
            <Box sx={{ mt: 1 }}>
              <RichTextEditor ref={editorRef} />
              <Stack direction="row" justifyContent="space-between" mt={2}>
                <OneLineUpload onFileSelect={(file) => uploadAndStore(file)} />
                <Button variant="contained" onClick={handleSend}>
                  Send
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Order Info Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Order Info
            </Typography>
            <Typography variant="body2" mb={0.5}>
              <strong>Order ID:</strong> {id}
            </Typography>
            <Typography variant="body2">
              <strong>Conversation ID:</strong> {rootId}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
