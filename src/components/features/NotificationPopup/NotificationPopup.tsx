"use client";

import React, { useState, useMemo } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  markNotificationRead,
  removeNotification,
} from "@/app/store/features/userSlice";
import type { Notification } from "@/types";

export default function NotificationPopup() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.userData);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState(0);

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  // 🔹 Filtered notifications by tab
  const filteredNotifications = useMemo(() => {
    switch (tab) {
      case 1:
        return notifications.filter((n) => n.readStatus === "unread");
      case 2:
        return notifications.filter((n) => n.readStatus === "read");
      default:
        return notifications;
    }
  }, [tab, notifications]);

  // 🔸 Count unread for badge
  const unreadCount = notifications.filter(
    (n) => n.readStatus === "unread"
  ).length;

  // 🔹 Mark as Read
  const handleMarkAsRead = (notificationId: number) => {
    dispatch(markNotificationRead(notificationId));
  };

  // 🔹 Dismiss notification
  const handleDismiss = (notificationId: number) => {
    dispatch(removeNotification(notificationId));
  };

  return (
    <>
      {/* Notification Bell */}
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
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
            width: { xs: "90vw", sm: 400 },
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
          <Tab label="Read" />
        </Tabs>
        <Divider />

        {/* List */}
        <List dense disablePadding sx={{ maxHeight: 400, overflowY: "auto" }}>
          {filteredNotifications.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 3 }}
            >
              {tab === 1
                ? "No unread notifications 🎉"
                : "No notifications yet"}
            </Typography>
          ) : (
            filteredNotifications.map((n: Notification) => {
              const formattedDate = new Date(n.createdAt).toLocaleString(
                undefined,
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                }
              );

              return (
                <ListItem
                  key={n.notificationId}
                  sx={{
                    px: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    bgcolor:
                      n.readStatus === "unread"
                        ? "rgba(25, 118, 210, 0.08)"
                        : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {/* Left side */}
                  <Tooltip
                    title={n.messageBody}
                    arrow
                    placement="top-start"
                    componentsProps={{
                      tooltip: {
                        sx: { fontSize: "0.875rem", padding: 1 },
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      flex={1}
                      minWidth={0}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          fontSize: 14,
                          width: 30,
                          height: 30,
                        }}
                      >
                        {n.countryName?.[0] || "N"}
                      </Avatar>

                      <Box
                        display="flex"
                        flexDirection="column"
                        flex={1}
                        minWidth={0}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          noWrap
                          title={n.messageBody}
                        >
                          {n.messageBody}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {n.countryName} • {formattedDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>

                  {/* Right side icons */}
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {n.readStatus === "unread" && (
                      <Tooltip title="Mark as read">
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(n.notificationId)}
                        >
                          <DoneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Dismiss notification">
                      <IconButton
                        size="small"
                        onClick={() => handleDismiss(n.notificationId)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              );
            })
          )}
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
