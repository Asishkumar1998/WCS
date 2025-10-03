"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  Badge,
  Tabs,
  Tab,
  Popover,
  Button,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import CircleIcon from "@mui/icons-material/Circle";

interface Notification {
  id: string;
  title: string;
  message: string;
  country: string;
  date: string;
  unread: boolean;
}

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "Order Review",
    message:
      "Based on our review of the order placed by you, additional fees...",
    country: "Albania",
    date: "2025-08-19T12:27:00",
    unread: true,
  },
  {
    id: "2",
    title: "Payment Cancelled",
    message: "Your payment request has been cancelled...",
    country: "UAE",
    date: "2025-07-30T21:23:00",
    unread: false,
  },
];

export default function NotificationPopup() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState(0);

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* Notification Bell */}
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge
          badgeContent={dummyNotifications.filter((n) => n.unread).length}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={1.5}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, newVal) => setTab(newVal)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="All" />
          <Tab label="Unread" />
          <Tab label="History" />
        </Tabs>
        <Divider />

        {/* List */}
        <List dense disablePadding sx={{ maxHeight: 400, overflowY: "auto" }}>
          {dummyNotifications.map((n) => (
            <ListItem
              key={n.id}
              alignItems="flex-start"
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                flexDirection: "row",
                gap: 1,
                bgcolor: n.unread ? "rgba(25, 118, 210, 0.08)" : "transparent",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              {/* Avatar */}
              <Avatar sx={{ bgcolor: "primary.main", fontSize: 14 }}>
                {n.country[0]}
              </Avatar>

              {/* Text & Timestamp */}
              <Box flex={1} minWidth={0}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {n.title}
                  </Typography>
                  {n.unread && (
                    <CircleIcon color="primary" sx={{ fontSize: 8 }} />
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ display: "block" }}
                >
                  {n.message}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {new Date(n.date).toLocaleString()}
                </Typography>
              </Box>

              {/* Actions */}
              <Tooltip title={n.unread ? "Mark as read" : "Dismiss"}>
                <IconButton size="small">
                  {n.unread ? (
                    <DoneIcon fontSize="small" />
                  ) : (
                    <CloseIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Divider />
        <Box p={1.5} textAlign="center">
          <Button variant="text" size="small">
            View All Notifications
          </Button>
        </Box>
      </Popover>
    </>
  );
}
