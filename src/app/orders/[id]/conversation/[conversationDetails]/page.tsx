"use client";
import React, { use, useEffect, useRef, useState } from "react";
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
  downloadAttachment,
  getCustomerNotification,
  updateNotification,
} from "@/services/notificationService";
import { getOrderDetails } from "@/services/cartServices";
import OneLineUpload from "@/components/features/Orders/Common/OneLineUpload";
import { uploadFile } from "@/services/formsService";
import Loader from "@/components/ui/Loader/Loader";
import { getAuth } from "@/app/utils/auth";
import DOMPurify from 'dompurify';

export default function ConversationPage() {
  const [orderDetails, setOrderDetails] = useState<any>();
  const [messages, setMessages] = useState<any[]>([]);
  const [attachment, setAttachment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const { id, conversationDetails } = useParams();

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [clearFile, setClearFile] = useState(false); 
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

      await updateNotification(rootId, {
        readStatus: "replied",
        modifiedAt: new Date().toISOString(),
      });

      await addNotification({
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

      await addNotificationHistory({
        notificationId: rootId,
        notificationSubject: rootConversation.subject,
        notificationBody: rootConversation.messageBody,
        parentId: 0,
        customerId,
        orderId: String(id),
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
      setAttachment([]);
      setClearFile(true);
      setTimeout(() => {
        setClearFile(false);
      }, 0);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setLoading(false);
    }
  };
  async function uploadAndStore(file: File) {
    if (!file) return;

    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("file_0", file);
        const data = await uploadFile(formData);
        setAttachment((prev) => [...prev, ...data]);
        // setFiles((prev) => [...prev, file]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleDownloadAttachment = async (
    attachmentId: number,
    fileName: string,
  ) => {
    try {
      setLoading(true);
      const blob = await downloadAttachment(attachmentId);
   const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    } finally{
      setLoading(false);
    }
  };

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
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#bdbdbd",
                  borderRadius: "10px",
                  height: "60px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#9e9e9e",
                },
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
                        padding: "5px 10px",
                        width: "70%",
                        borderRadius: 3,
                        bgcolor: isCustomer ? "primary.light" : "grey.300",
                        color: isCustomer ? "#fff" : "#000",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          marginBottom: "0px",
                        }}
                      >
                        {isCustomer ? "You" : "Processor"}
                      </Typography>
                      <Typography
                        variant="body2"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.messageBody) }}
                        sx={{ padding: "0px", margin: "0px" }}
                      />
                      { msg.attachments?.length>0 &&
                      <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" ,marginTop:"8px"}}
                          >
                            {/* {msg.messageBody.includes("Attachments:") && msg.attachments?.length > 0 && "Attachments:"} */}
                            {msg.attachments?.length > 1 ? "Attachments: " : "Attachment: " }
                          </Typography>
              }
                      {msg.attachments?.map((a: any) => (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                          key={a.attachmentId}
                        >
                          <Typography
                            key={a.attachmentId}
                            variant="body2"
                            sx={{
                              // textDecoration: "none",
                              cursor: "pointer",
                              color: "primary.main",
                              fontWeight: "bold",
                              "&:hover": { textDecoration: "underline" },
                            }}
                            // onClick={() => window.open(a.fileUrl)}
                            onClick={() =>
                              handleDownloadAttachment(
                                a.attachmentId,
                                a.fileName,
                              )
                            }
                          >
                            {a.fileName}
                          </Typography>
                        </Box>
                      ))}
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "right",
                          marginTop: "0px",
                        }}
                      >
                        {new Date(msg.createdAt + "Z").toLocaleString()}
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
                <OneLineUpload
                  onFileSelect={(file) => uploadAndStore(file)}
                  onRemoveFile={(index) => {
                    setAttachment((prev) => prev.filter((_, i) => i !== index));
                  }}
                  clearFile={clearFile}
                />
                {/* <MultiDocumentUpload onChange={(data) => {uploadAndStore(data.uploadedFiles);}}/> */}
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
