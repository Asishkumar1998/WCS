"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  Tooltip,
} from "@mui/material";
import { ShoppingCart, Person, Search, Info } from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import NotificationPopup from "@/components/features/NotificationPopup/NotificationPopup";
import { logoutUser } from "@/app/utils/authSerivce";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderDetails, getOrderIdOfCart } from "@/services/cartServices";
import { getAuth } from "@/app/utils/auth";
import { getWelcomeMessage } from "@/services/dashboardService";
import WelcomeMessage from "@/components/features/Dashboard/WelcomeMessage";
import { CART_UPDATED_EVENT } from "@/lib/cartBadgeEvents";

const drawerWidth = 240;
const collapsedWidth = 60;

export default function Navbar() {
  const open = useSelector((state: RootState) => state.ui.drawerOpen);
  const activeWidth = open ? drawerWidth : collapsedWidth;
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [docCount, setDocCount] = useState<number | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<any>(null);
  const [isWelcomeMessageOpen, setIsWelcomeMessageOpen] = useState(false);

  const pathName = usePathname();
  
  const fetchWelcomeMessage = async (userId: Number) => {
    try {
      if (userId) {
        const data = await getWelcomeMessage(Number(userId));
        console.log("Welcome Message:", data);
        if(data!==null){
          setWelcomeMessage(data);
        }
        if(data===null || data.showWelcomeMessage>0){
          setIsWelcomeMessageOpen(true);
          setWelcomeMessage(null);
        }
      }
  }
    catch (error) {
      console.error("Error fetching welcome message:", error);
    }}


  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
    }
  }, []);

    useEffect(() => {
      if (userId && pathName === "/") {
        fetchWelcomeMessage( Number(userId));
        if(welcomeMessage!==null && welcomeMessage.showWelcomeMessage>0){          
          setIsWelcomeMessageOpen(true);
        } else {
          setIsWelcomeMessageOpen(false);
          setWelcomeMessage(null);
        }
      }
    }, [userId]);
  const pathSegments = pathName.split("/").filter(Boolean);
  let service = "us-authentication";

  if (pathSegments[0] === "orders") {
    if (pathSegments[1] === "new" && pathSegments[2]) {
      service = pathSegments[2];
    } else if (pathSegments[1] === "bulk-ordering") {
      service = "bulk-ordering";
    }
  }

  const searchParams = useSearchParams();
  const serviceCart = searchParams.get("service") as string;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const navigateToChangePassword = () => {
    router.replace("/changePassword");
    handleClose();
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/orders/${query.trim()}`);
    }
  };

  const getCartOrder = useCallback(async () => {
    try {
      if (!userId) {
        setDocCount(null);
        return;
      }

      const basePayload = serviceCart
        ? CART_SERVICE_MAP[serviceCart]
        : CART_SERVICE_MAP[service];

      if (!basePayload) {
        setDocCount(null);
        return;
      }
      const payload = {
        userId: userId,
        ...basePayload,
      };
      const orderId = await getOrderIdOfCart(payload);
      if (orderId == null) {
        setDocCount(null);
        return;
      }

      const response = await getOrderDetails({ orderId: orderId });
      const orderData = response?.[0];
      if (!orderData || !Array.isArray(orderData.dockets)) {
        setDocCount(null);
        return;
      }

      const docsCount = orderData.dockets.reduce((count: number, docket: any) => {
        if (!Array.isArray(docket.docs)) {
          return count;
        }
        return count + docket.docs.length;
      }, 0);
      setDocCount(docsCount || null);
    } catch (error) {
      console.error("Error in getCartOrder:", error);
      setDocCount(null);
    }
  }, [service, serviceCart, userId]);

  useEffect(() => {
    setDocCount(null);
    void getCartOrder();
  }, [getCartOrder]);

  useEffect(() => {
    const handleCartUpdated = () => {
      void getCartOrder();
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    };
  }, [getCartOrder]);

  return (
    <>
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
            <Tooltip title="Notifications" arrow>
              <span>
                <NotificationPopup />
              </span>
            </Tooltip>
            <Tooltip title="FAQs" arrow>
              <IconButton
                onClick={() => router.replace(`/faq`)}
                color="inherit"
              >
                <Info />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Cart" arrow>
              <IconButton
                onClick={() => router.replace(`/cart?service=${service}`)}
                color="inherit"
              >
                <Badge
                  badgeContent={docCount}
                  color="error"
                  invisible={!docCount}
                  max={99}
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account Settings" arrow>
              <IconButton color="inherit" onClick={handleMenu}>
                <Person />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={navigateToChangePassword}>
                Change Password
              </MenuItem>
              <MenuItem onClick={() => logoutUser()}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
      { isWelcomeMessageOpen && <WelcomeMessage />}
    </>
    
  );
}
