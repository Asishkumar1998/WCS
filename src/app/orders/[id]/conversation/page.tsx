"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useRouter } from "next/navigation";
import { getCustomerNotification } from "@/services/notificationService";
import Loader from "@/components/ui/Loader/Loader";

interface Notification {
  notificationId: number;
  subject: string;
  createdAt: string;
  parentId: number;
  rootId: number;
  readStatus: string;
}

const MyConversations = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await getCustomerNotification(Number(id));
      const roots = res
        .filter((n: Notification) => n.parentId === 0 && n.rootId === 0)
        .sort(
          (a: Notification, b: Notification) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setConversations(roots);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}

      <Box maxWidth="lg" mx="auto" mt={10} px={2}>
        {/* Header */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Conversations
              </Typography>
              <Typography color="text.secondary">Order #{id}</Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/orders/all")}
              >
                Orders
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCommentIcon />}
                onClick={() => router.push(`/orders/${id}/conversation/new`)}
              >
                New Message
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Conversation List */}
        <Paper elevation={0} sx={{ borderRadius: 3 }}>
          {conversations.map((item, index) => (
            <React.Fragment key={item.notificationId}>
              <Box
                onClick={() =>
                  router.push(
                    `/orders/${id}/conversation/${item.notificationId}`
                  )
                }
                sx={{
                  px: 3,
                  py: 2,
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <ReplyIcon
                      color={
                        item.readStatus === "unread" ? "primary" : "inherit"
                      }
                    />
                    <Typography
                      fontWeight={item.readStatus === "unread" ? 600 : 500}
                      color={
                        item.readStatus === "unread"
                          ? "text.primary"
                          : "text.secondary"
                      }
                    >
                      {item.subject}
                    </Typography>
                  </Stack>

                  <Stack alignItems="flex-end">
                    <Typography variant="body2" color="text.secondary">
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                    <Chip size="small" label="Conversation" sx={{ mt: 0.5 }} />
                  </Stack>
                </Stack>
              </Box>

              {index !== conversations.length - 1 && <Divider />}
            </React.Fragment>
          ))}

          {!loading && conversations.length === 0 && (
            <Box py={6} textAlign="center">
              <Typography variant="h6" gutterBottom>
                No conversations yet
              </Typography>
              <Typography color="text.secondary" mb={2}>
                Start a new message to contact support.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCommentIcon />}
                onClick={() => router.push(`/orders/${id}/conversation/new`)}
              >
                Write Message
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default MyConversations;
