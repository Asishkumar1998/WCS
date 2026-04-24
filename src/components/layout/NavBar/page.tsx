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
  Divider,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Search,
  Info
} from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import NotificationPopup from "@/components/features/NotificationPopup/NotificationPopup";
import { logoutUser } from "@/app/utils/authSerivce";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderDetails, getOrderIdOfCart } from "@/services/cartServices";
import { getAuth } from "@/app/utils/auth";
import {
  getAccesibleCustomers,
  getWelcomeMessage,
} from "@/services/dashboardService";
import WelcomeMessage from "@/components/features/Dashboard/WelcomeMessage";
import { CART_UPDATED_EVENT } from "@/lib/cartBadgeEvents";
import { getUser } from "@/services/userService";
import Modal from "@/components/ui/Modal/Modal";
import Button from "@/components/ui/Button/Button";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";

const drawerWidth = 240;
const collapsedWidth = 60;
type HeaderLink =
  | { caption: string; accessibleCustomer: any; action: () => void }
  | { caption: "-" };
export default function Navbar() {
  const open = useSelector((state: RootState) => state.ui.drawerOpen);
  const activeWidth = open ? drawerWidth : collapsedWidth;
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [docCount, setDocCount] = useState<number | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<any>(null);
  const [isWelcomeMessageOpen, setIsWelcomeMessageOpen] = useState(false);
  const [accessibleCustomers, setAccessibleCustomers] = useState<any[]>([]);
  const [multipleCustomers, setMultipleCustomers] = useState(false);
  const [headerLinks, setHeaderLinks] = useState<HeaderLink[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [currentCompany, setCurrentCompany] = useState<any | null>(null);
  const [openSwitchCompanyModal, setOpenSwitchCompanyModal] = useState(false);
  const { showSnackbar } = useSnackbar();

  const pathName = usePathname();

  const fetchAccessibleCustomers = async () => {
    try {
      const customers = await getAccesibleCustomers();

      const userData = await getUser(userId!);

      setUser(userData[0]);
      setAccessibleCustomers(customers);
    } catch (error) {
      showSnackbar("Failed to fetch accessible customers", "error");
      console.error("Error fetching accessible customers:", error);
    }
  };

  const determineHeaderLinks = () => {
    if (user && accessibleCustomers.length > 1) {
      setMultipleCustomers(true);

      const customerLinks: HeaderLink[] = accessibleCustomers.map(
        (customer: any) => ({
          caption: customer.customerName,
          accessibleCustomer: customer,
          action: () => switchCustomer(customer),
        }),
      );

      const newHeaderLinks: HeaderLink[] = [...customerLinks, { caption: "-" }];

      setHeaderLinks(newHeaderLinks);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAccessibleCustomers();
    }
  }, [userId]);

  useEffect(() => {
    if (user && user.profileId===54 && accessibleCustomers.length > 1) {
      determineHeaderLinks();
      const auth = getAuth();
      const matchedCustomer = accessibleCustomers.find(
        (customer) => customer.customerId === Number(auth?.customerId),
      );
      if (matchedCustomer) {
        setCurrentCompany(matchedCustomer);
      }
    }
  }, [user, accessibleCustomers]);

  const isCurrentCustomer = (accessibleCustomer: any): boolean => {
    const auth = getAuth();
    
    const selectedCustomerId = auth?.customerId || null;
    return Number(selectedCustomerId) === accessibleCustomer?.customerId;
  };

  const switchCustomer = (customer: any) => {
    
    setSelectedCompany(customer);
    setOpenSwitchCompanyModal(true);
  };

  const handleSwitchCompany = (customer: any) => {
    if(customer && customer.customerId === currentCompany?.customerId){
      showSnackbar(`You are already viewing company: ${customer.customerName}`, "warning");
      return;
    }
    const raw = sessionStorage.getItem("auth");
    if (!raw) return;

    const auth = JSON.parse(raw);
    auth.customerId = customer.customerId;
    sessionStorage.setItem("auth", JSON.stringify(auth));
    setOpenSwitchCompanyModal(false);
    window.location.href = "/"; 
    setCurrentCompany(customer);
    showSnackbar(`Switched to company: ${customer.customerName}`, "success");
  };

  const fetchWelcomeMessage = async (userId: number) => {
    try {
      if (userId) {
        const data = await getWelcomeMessage(Number(userId));
        if (data !== null) {
          setWelcomeMessage(data);
        }
        if (data === null || data.showWelcomeMessage > 0) {
          setIsWelcomeMessageOpen(true);
          setWelcomeMessage(null);
        }
      }
    } catch (error) {
      console.error("Error fetching welcome message:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  useEffect(() => {
    if (userId && pathName === "/") {
      fetchWelcomeMessage(Number(userId));
      if (welcomeMessage !== null && welcomeMessage.showWelcomeMessage > 0) {
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
  const cartQueryService =
    serviceCart && CART_SERVICE_MAP[serviceCart] ? serviceCart : null;
  const currentCartServiceCandidate =
    pathName.startsWith("/cart") && cartQueryService
      ? cartQueryService
      : service;
  const currentCartService = CART_SERVICE_MAP[currentCartServiceCandidate]
    ? currentCartServiceCandidate
    : "us-authentication";

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

      const basePayload = CART_SERVICE_MAP[currentCartService];

      if (!basePayload) {
        setDocCount(null);
        return;
      }
      const payload = {
        userId: userId,
        customerId: customerId,
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

      const docsCount = orderData.dockets.reduce(
        (count: number, docket: any) => {
          if (!Array.isArray(docket.docs)) {
            return count;
          }
          return count + docket.docs.length;
        },
        0,
      );
      setDocCount(docsCount || null);
    } catch (error) {
      console.error("Error in getCartOrder:", error);
      setDocCount(null);
    }
  }, [currentCartService, userId]);

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
          top: "35px",
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
            {multipleCustomers && currentCompany && (
              <Box
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  padding: "7px 10px",
                  // borderRadius: "5px",
                  display: "flex",
                  height: "64px",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: 8, sm: 8, md: 15 },
                }}
              >
               <Tooltip title={currentCompany?.customerName} placement="bottom" arrow >
                  <Typography variant="body1" sx={{
                    maxWidth: "250px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "inline-block",
                    color: "white",
                    border: "2px solid white",
                    borderRadius: "5px",
                    padding: "3px 15px",
                    // fontWeight: "bold",
                  }}>
                    Company:{" "}<b>{currentCompany?.customerName}</b>
                  </Typography>
               </Tooltip>
              </Box>
            )}
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
                  onClick={() =>
                    router.replace(`/cart?service=${currentCartService}`)
                  }
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
                {multipleCustomers &&
                  headerLinks.map((link: any, index) =>
                    link.caption === "-" ? (
                      <Divider key={index} />
                    ) : (
                      <MenuItem
                        key={index}
                        onClick={"action" in link ? link.action : undefined}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: isCurrentCustomer(link.accessibleCustomer)
                            ? "primary.main"
                            : "gray",
                          fontWeight: isCurrentCustomer(link.accessibleCustomer)
                            ? "bold"
                            : "bold",
                          "&:hover":  "pointer",
                        }}
                      >
                        <Tooltip title={link.caption} placement="left" arrow>
                            <span
                              style={{
                                maxWidth: "180px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "inline-block",
                              }}
                            >
                              {link.caption}
                            </span>
                        </Tooltip>
                      </MenuItem>
                    ),
                  )}

                <MenuItem onClick={navigateToChangePassword}>
                  Change Password
                </MenuItem>
                <MenuItem onClick={() => logoutUser()}>Logout</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {isWelcomeMessageOpen && <WelcomeMessage />}
      <Modal 
      open={openSwitchCompanyModal} 
      onClose={() => setOpenSwitchCompanyModal(false)} 
      title="Switch Company" type="warning"
      >
      
        <Box
          
        >
          <Typography variant="body1" gutterBottom >
            Are you sure you want to switch to <b style={{color: "primary.main"}}>{selectedCompany?.customerName}</b>?
          </Typography>

          <Box sx={{
              display: "flex",
              justifyContent: "flex-end",}}>
            <Button variant="contained" sx={{position: "absolute", zIndex: 1, right: "100px",bottom: "28px" }} onClick={()=>handleSwitchCompany(selectedCompany)} >
              Switch Company
            </Button></Box> 
            
          
        </Box>
      </Modal>
       
    </>
  );
}
