"use client";
import React, { useRef } from "react";
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
import { useRouter } from "next/navigation";

export default function ConversationPage() {
  const editorRef = useRef<any>(null);
  const router = useRouter();

  const messages = [
    {
      id: 1,
      sender: "Tarun Thakur (Processor)",
      role: "processor",
      text: "Hi Raghvendra, this is a conversation testing. Please respond.",
      time: "Oct 1, 2025, 11:30 AM",
    },
    {
      id: 2,
      sender: "Raghvendra Roy (Customer)",
      role: "customer",
      text: "Hello Processor, successfully received the message.",
      attachment: "SampleDocument1.txt",
      time: "Oct 1, 2025, 11:32 AM",
    },
  ];

  const handleSend = () => {
    const content = editorRef.current?.getContent();
    console.log("Send:", content);
  };

  const handleBack = () => {
    // 👇 You can use router.back() if using Next.js router
    router.back();
    console.log("Go back to orders page");
  };

  return (
    <Grid container spacing={2} sx={{ mt: "64px", p: 3 }}>
      {/* Left: Conversation */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper
          sx={{
            p: 2,
            height: "85vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with Back button */}
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <IconButton
              onClick={handleBack}
              sx={{ color: "primary.main" }}
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="bold">
              Order #250249 • Conversation
            </Typography>
          </Stack>

          <Divider />

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              my: 2,
              pr: 1,
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "customer" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: "70%",
                    borderRadius: 2,
                    bgcolor:
                      msg.role === "customer" ? "primary.light" : "error.light",
                    color: "#fff",
                  }}
                  elevation={3}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {msg.sender}
                  </Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>
                    {msg.text}
                  </Typography>
                  {msg.attachment && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      📎 {msg.attachment}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "right", mt: 1 }}
                  >
                    {msg.time}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Rich Text Editor */}
          <Box sx={{ flexShrink: 0 }}>
            <RichTextEditor ref={editorRef} />
            <Stack direction="row" justifyContent="flex-end" mt={2}>
              <Button variant="contained" onClick={handleSend}>
                Send
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Grid>

      {/* Right: Order Info */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Order Info
          </Typography>
          <Typography variant="body2">Order ID: 250249</Typography>
          <Typography variant="body2">Created: Oct 1, 2025</Typography>
          <Typography variant="body2" mb={2}>
            Status: In Process
          </Typography>

          <Divider />

          <Typography variant="h6" fontWeight="bold" mt={2}>
            Participants
          </Typography>
          <Stack spacing={1} mt={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ bgcolor: "error.main" }}>T</Avatar>
              <Typography variant="body2">Tarun Thakur (Processor)</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ bgcolor: "primary.main" }}>R</Avatar>
              <Typography variant="body2">Raghvendra Roy (Customer)</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
