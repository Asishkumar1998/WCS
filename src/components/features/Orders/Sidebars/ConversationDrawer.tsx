"use client";

import React, { useState } from "react";
import { Drawer, Box, Typography, Button, Paper } from "@mui/material";
import Link from "next/link";
import InputField from "@/components/ui/Input/Input";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  sender: "user" | "processor";
  name: string;
  text: string;
  time: string;
  attachment?: string;
}

const sampleMessages: Message[] = [
  {
    id: 1,
    sender: "processor",
    name: "Tarun Thakur",
    text: "Hi Raghvendra, this is a conversation testing. Please respond.",
    time: "Oct 1, 2025, 11:30 AM",
  },
  {
    id: 2,
    sender: "user",
    name: "Raghvendra Roy",
    text: "Hello Processor, successfully received the message.",
    time: "Oct 1, 2025, 11:32 AM",
    attachment: "Sample Document 1.txt",
  },
];

export default function ConversationDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMsg, setNewMsg] = useState("");

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      name: "Raghvendra Roy",
      text: newMsg,
      time: new Date().toLocaleString(),
    };
    setMessages([...messages, newMessage]);
    setNewMsg("");
  };

  const router = useRouter();

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          width: 400,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Order #250249 • Conversation
          </Typography>
          <Button
            size="small"
            color="inherit"
            onClick={() => router.push(`/orders/${123}/conversation`)}
          >
            Full View ↗
          </Button>
        </Box>

        {/* Messages Scroll Area */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "grey.50" }}>
          {/* Incoming */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                bgcolor: "grey.200",
                borderRadius: 2,
                maxWidth: "80%",
              }}
            >
              <Typography variant="body2">
                Hi Raghvendra, this is a conversation testing. Please respond.
              </Typography>
            </Paper>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Tarun Thakur • Oct 1, 2025, 11:30 AM
            </Typography>
          </Box>
          {/* Outgoing */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                bgcolor: "primary.light",
                color: "white",
                borderRadius: 2,
                maxWidth: "80%",
              }}
            >
              <Typography variant="body2">
                Hello Processor, successfully received the message.
                <Link href="#">📎 Sample Document 1.txt</Link>
              </Typography>
            </Paper>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, textAlign: "right" }}
            >
              You • Oct 1, 2025, 11:32 AM
            </Typography>
          </Box>
          {/* More messages (repeat pattern) */}
          ...
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "grey.50",
            display: "flex",
            alignItems: "center",
          }}
        >
          <InputField
            fullWidth
            placeholder="Type a reply..."
            size="small"
            variant="outlined"
            sx={{
              bgcolor: "white",
              borderRadius: "8px",
              "& fieldset": { borderColor: "grey.300" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 1, px: 3, borderRadius: "8px", textTransform: "none" }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
