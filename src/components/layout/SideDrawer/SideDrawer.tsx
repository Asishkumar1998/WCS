"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Collapse,
  useMediaQuery,
  Theme,
  tooltipClasses,
  ListItemButton,
  Badge,
} from "@mui/material";
import {
  Home,
  Assignment,
  AddBox,
  Person,
  Info,
  Logout,
  Menu,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
  LibraryAdd,
  ShoppingCart,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import logo from "../../../../public/WCS-Logo-PNG.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { toggleDrawer } from "@/app/store/features/uiSlice";
import { styled } from "@mui/material/styles";
import { logoutUser } from "@/app/utils/authSerivce";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderDetails, getOrderIdOfCart } from "@/services/cartServices";
import { getAuth } from "@/app/utils/auth";
import { CART_UPDATED_EVENT } from "@/lib/cartBadgeEvents";

const drawerWidth = 240;
const collapsedWidth = 60;

const navItems = [
  {
    text: "Home Page",
    icon: <Home />,
    href: "/",
  },
  {
    text: "My Orders",
    icon: <Assignment />,
    href: "/orders/all",
  },
  {
    text: "New Order",
    icon: <AddBox />,
    children: [
      { text: "U.S Authentication", href: "/orders/new/us-authentication" },
      {
        text: "Global Authentication",
        href: "/orders/new/global-authentication",
      },
      { text: "Translation Service", href: "/orders/new/translation-service" },
      { text: "Visa Service", href: "/orders/new/visa-service" },
      { text: "Notary Service", href: "/orders/new/notary-service" },
      { text: "Dispatch Service", href: "/orders/new/dispatch-service" },
    ],
  },
  {
    text: "Bulk Ordering",
    icon: <LibraryAdd />,
    href: "/orders/bulk-ordering",
  },
  {
    text: "FAQ",
    icon: <Info />,
    href: "/faq",
  },
  {
    text: "Cart",
    icon: <ShoppingCart />,
    href: "/cart?service=us-authentication",
  },
  {
    text: "Profile",
    icon: <Person />,
    href: "/profile",
  },
];

// Styled submenu tooltip (for collapsed parent items)
const SubmenuTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[4],
    borderRadius: 6,
    padding: 0,
    minWidth: 180,
  },
}));

const SubmenuList = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  "& a": {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    textDecoration: "none",
    color: theme.palette.text.primary,
    fontSize: "14px",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const SideDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.ui.drawerOpen);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    "New Order": true,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [docCount, setDocCount] = useState<number | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const pathSegments = pathname.split("/").filter(Boolean);
  let service = "us-authentication";

  if (pathSegments[0] === "orders") {
    if (pathSegments[1] === "new" && pathSegments[2]) {
      service = pathSegments[2];
    } else if (pathSegments[1] === "bulk-ordering") {
      service = "bulk-ordering";
    }
  }

  const serviceCart = searchParams.get("service");
  const cartQueryService =
    serviceCart && CART_SERVICE_MAP[serviceCart] ? serviceCart : null;
  const currentCartServiceCandidate =
    pathname.startsWith("/cart") && cartQueryService ? cartQueryService : service;
  const currentCartService = CART_SERVICE_MAP[currentCartServiceCandidate]
    ? currentCartServiceCandidate
    : "us-authentication";

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
    }
  }, []);

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

  const handleExpand = (itemText: string) => {
    if (!open) return;
    setExpanded((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  const renderNavItem = ({ text, icon, href, children }: any) => {
    const hasChildren = Array.isArray(children);
    const resolvedHref =
      text === "Cart" ? `/cart?service=${currentCartService}` : href;
    const resolvedIcon =
      text === "Cart" ? (
        <Badge
          badgeContent={docCount}
          color="error"
          invisible={!docCount}
          max={99}
        >
          {icon}
        </Badge>
      ) : (
        icon
      );

    const isActive =
      resolvedHref && pathname === resolvedHref.split("?")[0]
        ? true
        : hasChildren
        ? children.some((c: any) => pathname.startsWith(c.href))
        : false;

    if (!hasChildren) {
      return (
        <Link
          href={resolvedHref || "#"}
          key={text}
          passHref
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Tooltip title={!open ? text : ""} placement="right">
            <ListItem
              sx={{
                backgroundColor: isActive ? "#2c4a6e" : "transparent",
                "&:hover": { backgroundColor: "#2c4a6e" },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
                {resolvedIcon}
              </ListItemIcon>
              {open && <ListItemText primary={text} />}
            </ListItem>
          </Tooltip>
        </Link>
      );
    }

    const firstChildHref = children[0]?.href || "#";

    return (
      <div key={text}>
        <SubmenuTooltip
          title={
            !open ? (
              <SubmenuList>
                {children.map((c: any) => (
                  <Link href={c.href} key={c.text} passHref>
                    {c.text}
                  </Link>
                ))}
              </SubmenuList>
            ) : (
              ""
            )
          }
          placement="right-start"
          disableInteractive
        >
          <ListItem
            onClick={() =>
              open
                ? handleExpand(text)
                : (window.location.href = firstChildHref)
            }
            sx={{
              backgroundColor: isActive ? "#2c4a6e" : "transparent",
              "&:hover": { backgroundColor: "#2c4a6e" },
              cursor: "pointer",
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
              {icon}
            </ListItemIcon>
            {open && <ListItemText primary={text} />}
            {open && (expanded[text] ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
        </SubmenuTooltip>

        {open && (
          <Collapse in={expanded[text]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {children.map((child) => {
                const childActive = pathname.startsWith(child.href);
                return (
                  <Link
                    href={child.href}
                    key={child.text}
                    passHref
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItem
                      sx={{
                        pl: 6,
                        backgroundColor: childActive
                          ? "#345a82"
                          : "transparent",
                        "&:hover": { backgroundColor: "#345a82" },
                      }}
                    >
                      <ListItemText primary={child.text} />
                    </ListItem>
                  </Link>
                );
              })}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <div>
      <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          mt:"35px",
          width: open ? drawerWidth : collapsedWidth,
          transition: "width 0.3s ease",
          overflowX: "hidden",
          whiteSpace: "nowrap",
          backgroundColor: "primary.main",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      {/* Top Section */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Link href={"/"}>
            <div
              style={{
                position: "relative",
                width: open ? 110 : 50,
                height: open ? 90 : 40,
              }}
            >
              <Image
                src={logo}
                alt="Logo"
                fill
                style={{
                  objectFit: "contain",
                }}
                priority
              />
            </div>
          </Link>
        </div>

        <Divider sx={{ borderColor: "#2c3e50" }} />

        <List>{navItems.map(renderNavItem)}</List>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid #2c3e50",
          padding: open ? "0 8px" : "8px 0",
        }}
      >
        {open ? (
          <ListItem
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ListItemButton
              style={{
                textDecoration: "none",
                color: "inherit",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => logoutUser()}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>

            <IconButton
              onClick={() => dispatch(toggleDrawer())}
              sx={{ color: "#fff" }}
            >
              <ChevronLeft />
            </IconButton>
          </ListItem>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Tooltip title="Sign Out" placement="right">
              <IconButton
                onClick={() => logoutUser()}
                sx={{ color: "#fff" }}
              >
                <Logout />
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={() => dispatch(toggleDrawer())}
              sx={{ color: "#fff" }}
            >
              <Menu />
            </IconButton>
          </div>
        )}
      </div>
    </Drawer>
    </div>   
  );
};

export default SideDrawer;
