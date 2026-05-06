"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  InputBase,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  fetchUserNotifications,
  markNotificationRead,
  removeNotification,
} from "@/app/store/features/userSlice";
import type { Notification } from "@/types";
import { useRouter } from "next/navigation";

export default function NotificationPopup() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(
    (state: RootState) => state.userData,
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState(0);
  const [searchText, setSearchText] = useState("");

  const router = useRouter();
  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  useEffect(() => {
    dispatch(fetchUserNotifications() as any);
  }, []);

  // 🔹 Filtered notifications by tab
  // const filteredNotifications = useMemo(() => {
  //   switch (tab) {
  //     case 1:
  //       return notifications.filter((n) => n.readStatus === "unread");
  //     case 2:
  //       return notifications.filter((n) => n.readStatus === "read");
  //     default:
  //       return notifications;
  //   }
  // }, [tab, notifications]);
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by tab
    if (tab === 1) {
      filtered = filtered.filter((n) => n.readStatus === "unread");
    } else if (tab === 2) {
      filtered = filtered.filter((n) => n.readStatus === "read");
    }

    // Filter by search
    if (searchText.trim()) {
      const search = searchText.toLowerCase();

      filtered = filtered.filter((n) => {
        return (
          n.messageBody?.toLowerCase().includes(search) ||
          n.countryName?.toLowerCase().includes(search) ||
          String(n.orderId)?.includes(search) ||
          String(n.docId)?.includes(search) ||
          (n.initiatedBy === 0 ? "wcs" : n.cName?.toLowerCase()).includes(
            search,
          )
        );
      });
    }

    return filtered;
  }, [tab, notifications, searchText]);

  // 🔸 Count unread for badge
  const unreadCount = notifications.filter(
    (n) => n.readStatus === "unread",
  ).length;

  // 🔹 Mark as Read
  const handleMarkAsRead = (notificationId: number, orderId: number) => {
    dispatch(markNotificationRead(notificationId));
    router.push(`/orders/${orderId}/conversation`);
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
          <Box display="flex" alignItems="center" gap={0.5}>
            {/* Refresh Button */}
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={() => dispatch(fetchUserNotifications() as any)}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Close Button */}
            <Tooltip title="Close">
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider />
        {loading && (
          <Box px={2} py={1} bgcolor="#f5f5f5" borderBottom="1px solid #e0e0e0">
            <Typography variant="body2" color="primary" fontWeight={500}>
              Fetching notifications...
            </Typography>
          </Box>
        )}

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
        <Box px={2} py={1} borderBottom="1px solid #e0e0e0">
          <InputBase
            placeholder="Search notifications..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            fullWidth
            sx={{
              border: "1px solid #dcdcdc",
              borderRadius: 1,
              px: 1.5,
              py: 0.5,
              fontSize: 14,
              backgroundColor: "#fafafa",
            }}
          />
        </Box>

        {/* List */}
        <List
          dense
          disablePadding
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            overflowX: "hidden",

            "&::-webkit-scrollbar": {
              width: "6px",
            },

            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              // borderRadius: "10px",
            },

            "&::-webkit-scrollbar-thumb": {
              background: "#bdbdbd",
              borderRadius: "10px",
              height:"30px"
            },

            "&::-webkit-scrollbar-thumb:hover": {
              background: "#9e9e9e",
            },
          }}
        >
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
                  onClick={() =>
                    router.push(`/orders/${n.orderId}/conversation`)
                  }
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
                    cursor: "pointer",
                  }}
                >
                  {/* Left side */}
                  <Tooltip
                    title={n.orderId}
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
                      // alignItems="column"
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
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          // width="100%"
                          gap={1}
                          // flexWrap="wrap"
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap
                            // title={n.messageBody}
                          >
                            {/* {n.messageBody} */}
                            {n.initiatedBy === 0 ? "WCS" : n.cName}
                          </Typography>
                          <Typography variant="caption" fontWeight={700} noWrap>
                            W{n.orderId}
                          </Typography>
                          <Typography variant="caption" fontWeight={700} noWrap>
                            {n.docId}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {n.countryName}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {formattedDate}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={n.messageBody}
                        >
                          {n.messageBody}
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
                          onClick={() =>
                            handleMarkAsRead(n.notificationId, n.orderId)
                          }
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
