"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Search,
  Notifications,
  Info,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import NotificationPopup from "@/components/features/NotificationPopup/NotificationPopup";

const drawerWidth = 240;
const collapsedWidth = 60;

export default function Navbar() {
  const open = useSelector((state: RootState) => state.ui.drawerOpen);
  const activeWidth = open ? drawerWidth : collapsedWidth;
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [query, setQuery] = useState("");

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const navigateToProfile = () => {
    router.replace("profile");
    handleClose();
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/orders/${query.trim()}`);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#b5001a",
        width: { sm: `calc(100% - ${activeWidth}px)` },
        ml: { sm: `${activeWidth}px` },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Section - Text */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            display: { xs: "none", sm: "none", md: "block" },
          }}
        >
          Welcome to WCS Express
        </Typography>

        {/* Right Section - Search + Icons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 1,
              px: 1,
              width: { xs: "130px", sm: "200px", md: "250px" },
            }}
          >
            <Search sx={{ color: "gray", fontSize: 20 }} />
            <InputBase
              placeholder="Search Order ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ ml: 1, flex: 1, color: "black" }}
            />
          </Box>

          {/* Icons */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NotificationPopup />
            <IconButton color="inherit">
              <Info />
            </IconButton>
            <IconButton onClick={() => router.push("cart")} color="inherit">
              <Badge badgeContent={0} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleMenu}>
              <Person />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Signout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
